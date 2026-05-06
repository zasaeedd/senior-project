


"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

// Timer component with Extra Time + Time Freeze support
function QuizTimer({
  freezeUntil,
  onTimeUp,
  timeLeft,
}: {
  freezeUntil: number | null;
  onTimeUp: () => void;
  timeLeft: number;
}) {
  const finishedRef = useRef(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      // tick down directly in parent state
      if (freezeUntil && Date.now() < freezeUntil) {
        return; // paused
      }
      if (timeLeft <= 0) {
        clearInterval(timerId);
        if (!finishedRef.current) {
          finishedRef.current = true;
          alert("Time is up! Submitting quiz...");
          onTimeUp();
        }
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp, freezeUntil]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-red-600 font-bold text-lg mb-4">
      Time left: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}



interface Choice {
  id: number;
  text: string;
  is_correct?: boolean;
}

interface Question {
  id: number;
  text: string;
  type: "mcq" | "written";
  choices: Choice[];
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

  // PowerUps state
  const [studentPowerUps, setStudentPowerUps] = useState<
    { id: number; name: string; quantity: number }[]
  >([]);
  const [freezeUntil, setFreezeUntil] = useState<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/quiz/students/courses/${courseId}/quizzes/${quizId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setQuiz(data.quiz);
      setStudentPowerUps(data.unlockedPowerUps || []);
      setTimeLeft(data.quiz.duration * 60); // initialize timer
      setLoading(false);
    };
    fetchQuiz();
  }, [courseId, quizId]);

  const handleAnswer = (questionId: number, optionId: number | string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = async (autoSubmit = false) => {
    if ((handleSubmitQuiz as any).submitted) return;
    (handleSubmitQuiz as any).submitted = true;

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
    router.push(`/student/courses/${courseId}`);
  };

  // inside QuizPage
useEffect(() => {
  const timerId = setInterval(() => {
    setTimeLeft((prev) => {
      if (freezeUntil && Date.now() < freezeUntil) {
        return prev; // paused
      }
      return prev > 0 ? prev - 1 : 0; // tick down
    });
  }, 1000);

  return () => clearInterval(timerId);
}, [freezeUntil]);

  const usePowerUp = async (powerupId: number) => {
    const currentQuestion = quiz?.questions[currentIndex];
    if (!currentQuestion) return;

    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/quiz/students/courses/${courseId}/quizzes/${quizId}/usePowerUp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ powerupId, questionId: currentQuestion.id }),
      }
    );
    const data = await res.json();
    console.log("PowerUp response:", data);

 if (data.effect.type === "50/50") {
  const removed = data.effect.removedChoices || [];
  if (removed.length === 0) {
    alert("Cannot use 50/50 when only 2 choices remain.");
    return;
  }
  setQuiz((prev) =>
    prev
      ? {
          ...prev,
          questions: prev.questions.map((q) =>
            q.id === currentQuestion.id
              ? {
                  ...q,
                  choices: q.choices.filter((c) => !removed.includes(c.id)),
                }
              : q
          ),
        }
      : prev
  );

    } else if (data.effect.type === "Extra Time") {
      setTimeLeft((prev) => prev + data.effect.addedSeconds);
    } else if (data.effect.type === "Time Freeze") {
      setFreezeUntil(Date.now() + data.effect.freezeSeconds * 1000);
    }

    setStudentPowerUps((prev) =>
      prev.map((p) =>
        p.id === powerupId ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  const currentQuestion = quiz.questions[currentIndex];

  function getPowerUpDescription(name: string) {
    switch (name) {
      case "Extra Time":
        return "Add 1 minute to your timer";
      case "Time Freeze":
        return "Freezes the timer for 30 seconds";
      case "50-50":
        return "Removes two wrong choices";
      case "Skip Question":
        return "Skip this question without penalty";
      case "Hint":
        return "Shows a helpful clue";
      default:
        return "Special ability";
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 max-w-2xl w-full bg-white rounded-lg shadow-md">
      <div className="mb-1 text-center">
      {/* Quiz title stays at the top */}
      <h2 className="text-3xl font-bold text-blue-700">
        {quiz.title}
      </h2>

      {/* Duration centered but pushed lower */}
      <p className="text-gray-600 text-lg mt-6 mb-2">
        Duration: {quiz.duration} mins
      </p>

          {/* Timer centered */}
          <div className="mt-4 flex justify-center">
          <QuizTimer
              freezeUntil={freezeUntil}
              onTimeUp={() => handleSubmitQuiz(true)}
              timeLeft={timeLeft}
          />

          </div>
        </div>


     {/* PowerUps toolbar */}
        <div className="flex gap-3 mb-6 justify-center">
  {studentPowerUps.map((p) => (
    <div key={p.id} className="relative group">
      <button
        disabled={p.quantity === 0}
        onClick={() => usePowerUp(p.id)}
        className="flex flex-col items-center px-3 py-2 rounded-lg disabled:opacity-50 hover:scale-105 transition-transform"
      >
        <img
          src={`/assets/powerups/${(p.name || "")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace("/", "-")}.png`}
          alt={p.name || "PowerUp"}
          className="w-14 h-14 object-contain mb-2"
        />
        <span className="text-sm font-semibold text-gray-700">
          x{p.quantity}
        </span>
      </button>

      {/* Tooltip description */}
      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
        {getPowerUpDescription(p.name)}
      </div>
    </div>
  ))}
</div>



        {/* Current question */}


        {/* <div className="border p-6 rounded-lg shadow-sm bg-white mb-6 relative">
          <span className="absolute top-3 right-3 text-base font-bold text-gray-800 bg-gray-300 px-3 py-1.5 rounded-full shadow">
            {currentQuestion.points} pts
          </span>
          <p className="font-semibold text-lg mb-3">
            {currentIndex + 1}. {currentQuestion.text}
          </p>

          {currentQuestion.type === "mcq" ? (
            <div className="space-y-2">
              {currentQuestion.choices.map((choice) => (
                <label key={choice.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={choice.id}
                    checked={answers[currentQuestion.id] === choice.id}
                    onChange={() => handleAnswer(currentQuestion.id, choice.id)}
                    className="accent-green-600"
                  />
                  <span>{choice.text}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              name={`question-${currentQuestion.id}`}
              value={answers[currentQuestion.id] || ""}
              onChange={(e) =>
                handleAnswer(currentQuestion.id, e.target.value)
              }
              className="w-full border rounded-lg p-2 focus:ring focus:ring-green-300"
              placeholder="Type your answer here..."
            />
          )}
        </div> */}
        {/* Progress Header */}
<div className="mb-4 text-center">
  <div className="text-sm text-gray-500 mb-2">
    Question {currentIndex + 1} of {quiz.questions.length}
  </div>

  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
    <div
      className="h-2 bg-blue-600 transition-all"
      style={{
        width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
      }}
    />
  </div>
</div>

{/* Question Card */}
<div className="border rounded-2xl p-6 bg-white shadow-sm relative transition-all">

  {/* Points badge */}
  <span className="absolute top-4 right-4 text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
    {currentQuestion.points} pts
  </span>

  {/* Question text */}
  <p className="font-semibold text-lg text-slate-800 mb-5 leading-relaxed">
    {currentQuestion.text}
  </p>

  {/* MCQ */}
  {currentQuestion.type === "mcq" ? (
    <div className="space-y-3">
      {currentQuestion.choices.map((choice) => (
        <label
          key={choice.id}
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition
            ${
              answers[currentQuestion.id] === choice.id
                ? "border-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
        >
          <input
            type="radio"
            name={`question-${currentQuestion.id}`}
            value={choice.id}
            checked={answers[currentQuestion.id] === choice.id}
            onChange={() =>
              handleAnswer(currentQuestion.id, choice.id)
            }
            className="accent-blue-600"
          />
          <span className="text-slate-700">{choice.text}</span>
        </label>
      ))}
    </div>
  ) : (
    <textarea
      name={`question-${currentQuestion.id}`}
      value={answers[currentQuestion.id] || ""}
      onChange={(e) =>
        handleAnswer(currentQuestion.id, e.target.value)
      }
      className="w-full border rounded-xl p-3 min-h-[140px] focus:ring-2 focus:ring-blue-300 focus:outline-none"
      placeholder="Type your answer..."
    />
  )}
</div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          {currentIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-3 rounded-lg font-semibold shadow-md"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => handleSubmitQuiz()}
              className="bg-red-600 hover:bg-red-700 transition-colors text-white px-6 py-3 rounded-lg font-semibold shadow-md"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}