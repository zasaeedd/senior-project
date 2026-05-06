// This page is for grading the pending written quizzes 


"use client";

import { useEffect, useState } from "react";

interface Question {
  id: number;
  text: string;
  type: string; // "MCQ" | "Written"
  points: number;
}

interface StudentAnswer {
  id: number;
  questionID: number;
  score?: number;
  short_text_ans?: string;
  choice?: { text: string };
}

interface Attempt {
  id: number;
  quiz: { title: string; questions: Question[] };
  studentAnswers: StudentAnswer[];
  student: { user: { firstName: string; lastName: string } };
}

export default function GradeAttemptPage({ attemptId }: { attemptId: number }) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [grades, setGrades] = useState<Record<number, number>>({}); // answerId → score
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/inst/attempt/${attemptId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch attempt");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched attempt:", data);
        setAttempt(data);
        // preload scores if any exist
        const initialScores: Record<number, number> = {};
        data.studentAnswers.forEach((a: StudentAnswer) => {
          if (a.score !== undefined && a.score !== null) {
            initialScores[a.id] = a.score;
          }
        });
        setGrades(initialScores);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [attemptId]);

  const handleScoreChange = (answerId: number, value: string) => {
    setGrades((prev) => ({ ...prev, [answerId]: Number(value) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        grades: Object.entries(grades).map(([answerId, score]) => ({
          answerId: Number(answerId),
          score,
        })),
      };

      const res = await fetch(
        `http://localhost:5000/api/inst/attempt/${attemptId}/grade`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Failed to save grades");
      alert("Grades saved successfully ");
    } catch (err) {
      console.error(err);
      alert("Error saving grades ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading attempt...</p>;
  if (!attempt) return <p>Attempt not found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Grade Attempt – {attempt.quiz.title}
      </h1>
      <p className="mb-6">
        Student: {attempt.student.user.firstName}{" "}
        {attempt.student.user.lastName}
      </p>

      {/* <div className="space-y-6">
      {attempt.quiz.questions.map((q) => {
  const answer = attempt.studentAnswers.find((a) => a.questionID === q.id);
  const currentGrade = grades[answer?.id ?? -1];

  return (
    <div key={q.id} className="border p-4 rounded-lg">
      <h2 className="font-semibold mb-2">
        Q: {q.text}
        {currentGrade !== undefined && (
          <span className="ml-4 text-blue-600">
            Grade: {currentGrade}/{q.points}
          </span>
        )}
      </h2>

      <p className="mb-2">
        Answer: {answer?.short_text_ans || "No answer"}
      </p>

      {q.type.toLowerCase() === "written" && answer && (
        <input
          type="number"
          min={0}
          max={q.points}
          placeholder={`0 - ${q.points}`}
          className="border p-2 rounded w-24"
          value={grades[answer.id] ?? ""}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= 0 && val <= q.points) {
              handleScoreChange(answer.id, e.target.value);
            }
          }}
        />
      )}
    </div>
  );
})}

      </div> */}
<div className="space-y-6">
  {attempt.quiz.questions
    //  Only show written questions
    .filter((q) => q.type.toLowerCase() === "written")
    .map((q) => {
      const answer = attempt.studentAnswers.find((a) => a.questionID === q.id);
      const currentGrade = grades[answer?.id ?? -1];

      return (
        <div key={q.id} className="border p-4 rounded-lg">
          <h2 className="font-semibold mb-2">
            Q: {q.text}
            {currentGrade !== undefined && (
              <span className="ml-4 text-blue-600">
                Grade: {currentGrade}/{q.points}
              </span>
            )}
          </h2>

          <p className="mb-2">
            Answer: {answer?.short_text_ans || "No answer"}
          </p>

          {answer && (
            <input
              type="number"
              min={0}
              max={q.points}
              placeholder={`0 - ${q.points}`}
              className="border p-2 rounded w-24"
              value={grades[answer.id] ?? ""}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0 && val <= q.points) {
                  handleScoreChange(answer.id, e.target.value);
                }
              }}
            />
          )}
        </div>
      );
    })}
</div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Grades"}
      </button>
    </div>
  );
}
