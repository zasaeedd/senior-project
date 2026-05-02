"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Divide } from "lucide-react";
import { useRef } from "react";

function QuizTimer({ durationMinutes, onTimeUp }: { durationMinutes: number; onTimeUp: () => void }) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const finishedRef = useRef(false); 

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerId);
          if (!finishedRef.current) {
            finishedRef.current = true; // mark as finished
            alert("Time is up! Submitting quiz...");
            onTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-red-600 font-bold text-lg mb-4">
      Time left: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}



interface Question {
  id: number;
  text: string;
  type: "mcq" | "written";
  choices: { id: number; text: string }[];
  points: number;
}

interface Quiz {
  id: number;
  title: string;
  duration: number;
  questions: Question[];
}

export default function QuizPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");


  const { courseId, quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "You must submit the quiz before leaving.";
  };
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/quiz/students/courses/${courseId}/quizzes/${quizId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setQuiz(data.quiz);
      setLoading(false);
    };
    fetchQuiz();
  }, [courseId, quizId]);

  const calculateResults = (quiz: Quiz, answers: Record<number, number | string>) => {
  let points = 0;
  let totalPoints = 0;

  quiz.questions.forEach((q) => {
    totalPoints += q.points;

    const studentAnswer = answers[q.id];

    if (q.type === "mcq") {
      // find correct choice
      const correctChoice = q.choices.find((c: any) => c.is_correct);
      if (studentAnswer === correctChoice?.id) {
        points += q.points;
      }
    } else {
      // written answers: you might auto‑grade later, for now just give full points
      if (typeof studentAnswer === "string" && studentAnswer.trim() !== "") {
        points += q.points;
      }
    }
  });

  const score = Math.round((points / totalPoints) * 100);
  return { score, points, totalPoints };
};


  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  const handleAnswer = (questionId: number, optionId: number | string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = async (autoSubmit = false) => {
  if ((handleSubmitQuiz as any).submitted) return;
  (handleSubmitQuiz as any).submitted = true;

  if (!autoSubmit) {
    // validation checks
    for (const q of quiz!.questions) {
      const studentAnswer = answers[q.id];
      if (q.type === "mcq" && !studentAnswer) {
        alert(`Question ${q.text} is unanswered. Please select an option.`);
        (handleSubmitQuiz as any).submitted = false;
        return;
      }
      if (
        q.type === "written" &&
        (!studentAnswer || (typeof studentAnswer === "string" && studentAnswer.trim() === ""))
      ) {
        alert(`Question ${q.text} is unanswered. Please type your answer.`);
        (handleSubmitQuiz as any).submitted = false;
        return;
      }
    }
  }

  const { score } = calculateResults(quiz!, answers);
  const token = localStorage.getItem("token");
  const res = await fetch(
    `http://localhost:5000/api/quiz/students/courses/${courseId}/quizzes/${quizId}/attempts/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ attemptId, quizId, answers }),
    }
  );
  const result = await res.json();

  // alert(`Your score: ${result.score}%`);
  router.push(`/student/courses/${courseId}`);
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 max-w-2xl w-full bg-white rounded-lg shadow-md">
        <div className="p-6 max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-blue-700">{quiz.title}</h2>
            <p className="text-gray-600 mt-3">Duration: {quiz.duration} mins</p>
          </div>

          <div className="mb-8 text-center">

            {/* Timer */}
            <QuizTimer
              durationMinutes={quiz.duration}
              onTimeUp={()=> handleSubmitQuiz(true)}
            />
          </div>

          <div className="space-y-6">
            {quiz.questions.map((q, i) => (
              <div
                key={q.id}
                className="relative p-6 border rounded-lg shadow-sm bg-white"
              >
                <span className="absolute top-3 right-3 text-base font-bold text-gray-800 bg-gray-300 px-3 py-1.5 rounded-full shadow">
                  {q.points} pts
                </span>

                <p className="font-semibold text-lg mb-3">
                  {i + 1}. {q.text}
                </p>

                {q.type === "mcq" ? (
                  <div className="space-y-2">
                    {q.choices.map((choice) => (
                      <label
                        key={choice.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={choice.id}
                          checked={answers[q.id] === choice.id}
                          onChange={() => handleAnswer(q.id, choice.id)}
                          className="accent-green-600"
                        />
                        <span>{choice.text}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    name={`question-${q.id}`}
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-green-300"
                    placeholder="Type your answer here..."
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              // id="submitQuizBtn"
              className="bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-3 rounded-lg font-semibold shadow-md"
              onClick={()=> handleSubmitQuiz()}
                // async () => {
              //   for (const q of quiz.questions) {
              //     const studentAnswer = answers[q.id];

              //     if (q.type === "mcq") {
              //       if (!studentAnswer) {
              //         alert(`Question ${q.text} is unanswered. Please select an option.`);
              //         return; // stop submission
              //       }
              //     } else if (q.type === "written") {
              //       if (typeof studentAnswer !== "string" || studentAnswer.trim() === "") {
              //         alert(`Question ${q.text} is unanswered. Please type your answer.`);
              //         return; // stop submission
              //       }
              //     }
              //   }

              //     if ((handleSubmitQuiz as any).submitted) return;
              //     (handleSubmitQuiz as any).submitted = true
                
              //   const { score, points, totalPoints } = calculateResults(quiz, answers);
              //   const token = localStorage.getItem("token");
              //   const res = await fetch(
              //     `http://localhost:5000/api/quiz/students/courses/${courseId}/quizzes/${quizId}/attempts/submit`,
              //     {
              //       method: "POST",
              //       headers: {
              //         "Content-Type": "application/json",
              //         Authorization: `Bearer ${token}`,
              //       },
              //       body: JSON.stringify({
              //         attemptId, 
              //         quizId,
              //         answers
              //        }),
              //     },
              //   );
              //   const result = await res.json();
              //   alert(`Your score: ${result.score}%`);
              //   router.push(`/student/courses/${courseId}`);
              // }}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
