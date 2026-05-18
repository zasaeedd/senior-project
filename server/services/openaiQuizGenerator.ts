// this file sends extracted text to openai and recieve back a quiz draft in json format
import OpenAI from "openai";

export type GeneratedQuizChoice = {
  text: string;
  is_correct: boolean;
};

export type GeneratedQuizQuestion = {
  text: string;
  type: "mcq" | "written";
  points: number;
  difficulty: string;
  choices?: GeneratedQuizChoice[];
};

export type GeneratedQuizDraft = {
  title: string;
  questions: GeneratedQuizQuestion[];
};

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini"; // currently no opeai model is set

// create openai client
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

// limit text send to open ai (this can limit costs and prevent exceeding limit)
function limitTextLength(text: string, maxLength = 12000) {
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function getErrorStatus(error: unknown) {
  const status = (error as { status?: number; response?: { status?: number } })
    ?.status;
  if (typeof status === "number") {
    return status;
  }

  const responseStatus = (error as { response?: { status?: number } })?.response
    ?.status;
  return typeof responseStatus === "number" ? responseStatus : undefined;
}

function getErrorMessage(error: unknown) {
  return String(
    (error as { message?: string })?.message ||
      (error as { error?: { message?: string } })?.error?.message ||
      error,
  );
}

function classifyOpenAIError(error: unknown) {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error).toLowerCase();

  if (status === 429) {
    if (message.includes("quota") || message.includes("billing")) {
      return "quota" as const;
    }

    return "rate_limit" as const;
  }

  if (status === 402) {
    return "quota" as const;
  }

  return "other" as const;
}

// this func is used to resend requests when they fail after a set time (so it doesnt overwhelm the model)
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// main func to generate quiz using open ai's api
export async function generateQuizDraftFromText(params: {
  text: string;
  title?: string;
  questionCount?: number;
  difficulty?: string;
}): Promise<GeneratedQuizDraft> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const cleanedText = limitTextLength(params.text.trim());
  if (!cleanedText) {
    throw new Error("No extracted text was provided to OpenAI");
  }

  const questionCount = Math.max(1, Math.min(params.questionCount ?? 5, 10));
  const difficulty = params.difficulty || "mixed";

  const maxAttempts = 3; // attempts to requests to the model

  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
        // send a request to open ai's chat model
      const completion = await openai.chat.completions.create({
        model: openaiModel,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'You create quiz drafts from study material. Return only valid JSON with this exact shape: {"title": string, "questions": [{"text": string, "type": "mcq"|"written", "points": number, "difficulty": string, "choices"?: [{"text": string, "is_correct": boolean}]}]}. For MCQ questions, include exactly 4 choices and exactly one choice with is_correct true. For written questions, omit choices. Do not add markdown, code fences, or extra keys.',
          },
          // currently the user prompt is defined here rather than taken from user's UI
          {
            role: "user",
            content: [
              `Create ${questionCount} quiz questions based on the following text.`,
              `Suggested title: ${params.title || "Generated Quiz"}`,
              `Preferred difficulty: ${difficulty}`,
              "Source text:",
              cleanedText,
            ].join("\n\n"),
          },
        ],
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("OpenAI returned an empty response");
      }

      const parsed = JSON.parse(content) as GeneratedQuizDraft;

      if (!parsed.title || !Array.isArray(parsed.questions)) {
        throw new Error("OpenAI returned an invalid quiz draft");
      }

      return parsed;
    } catch (error) {
      lastError = error;
      const status = getErrorStatus(error);
      const category = classifyOpenAIError(error);
      const retryable =
        category === "rate_limit" ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504;

      if (category === "quota") {
        throw new Error(
          "OpenAI quota exceeded. Please check your OpenAI billing and plan details.",
        );
      }

      if (!retryable || attempt === maxAttempts) {
        throw error;
      }

      const delayMs = 1000 * attempt * attempt;
      console.warn(
        `OpenAI request failed with status ${status ?? "unknown"} on attempt ${attempt}/${maxAttempts}. Retrying in ${delayMs}ms...`,
      );
      await sleep(delayMs);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to generate quiz draft");
}
