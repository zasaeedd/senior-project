"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  text: string;
  type: string; // "mcq" | "written"
  points: number;
}

interface Attempt {
  id: number;
  score: number;
  points: number;
  totalPoints: number;
  duration: number;
  submitted_at: string;
  start_time: string;
  end_time: string;
  isGraded: boolean;
}

interface Quiz {
  id: number;
  title: string;
  duration: number;
  deadline: Date;
  maxAttempts: number;
  attempts: Attempt[];
  questions: Question[];
}

interface Course {
  id: number;
  crs_code: string;
  crs_name: string;
  quizzes: Quiz[];
}

interface QuizzesProps {
  courseId?: string;
}

interface QuizProgress {
  id: number;
  title: string;
  status: "completed" | "in-progress" | "not-started";
}

interface CourseProgress {
  courseId: number;
  totalQuizzes: number;
  completedQuizzes: number;
  quizzes: QuizProgress[];
}

export default function Quizzes({ courseId }: QuizzesProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  // const [attemptNumber, setAttemptNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/info/students/courses/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      console.log("Course API response:", data);
      setCourse(data);
      if (data.student?.id) {
        setStudentId(data.student.id);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;

    const fetchProgress = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/info/students/courses/${courseId}/progress`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      console.log("Progress API response:", data);
      setProgress(data);
    };

    fetchProgress();
  }, [courseId]);

  // const handleStartQuiz = (quiz: Quiz) => {
  //   setSelectedQuiz(quiz);
  // };

  const handleStartQuiz = (quiz: Quiz) => {
    if (quiz.attempts.length >= quiz.maxAttempts) {
      alert("Maximum attempts reached");
      return;
    }
    setSelectedQuiz(quiz);
  };

  const completionRate =
    progress && progress.totalQuizzes > 0
      ? progress.completedQuizzes / progress.totalQuizzes
      : 0;

  let barColor = "bg-red-600";
  let message = "🔥 There is still a chance to get the marks!";
  let messageColor = "text-red-600";

  if (completionRate >= 0.25 && completionRate < 0.5) {
    barColor = "bg-orange-500";
    message = "🥉 We don’t want the bronze medal now, do we?";
    messageColor = "text-orange-500";
  } else if (completionRate >= 0.5 && completionRate < 0.75) {
    barColor = "bg-yellow-500";
    message = "💪 Halfway there — keep pushing!";
    messageColor = "text-yellow-500";
  } else if (completionRate >= 0.75) {
    barColor = "bg-green-600";
    message = "🏆 Excellent work — you’re smashing it!";
    messageColor = "text-green-600";
  }

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>No course found.</p>;
  console.log("Course object:", course);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur border-r">
        <div className="sticky top-6 px-3">
          <Sidebar />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header area */}
        <div className="bg-white/70 backdrop-blur border-b px-8 py-5">
          <h2 className="text-2xl font-bold">
            {course.crs_code} — {course.crs_name}
          </h2>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto w-full p-8 space-y-8">
            {/* Progress section */}
            {progress && progress.totalQuizzes > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border text-center">
                <p className="font-bold text-lg">
                  Progress: {progress.completedQuizzes} /{" "}
                  {progress.totalQuizzes} quizzes completed
                </p>

                <div className="w-full bg-gray-200 rounded-full h-4 mt-4 overflow-hidden">
                  <div
                    className={`${barColor} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${completionRate * 100}%` }}
                  />
                </div>

                <p className={`mt-3 text-xl font-bold ${messageColor}`}>
                  {message}
                </p>
              </div>
            )}

            {/* Quizzes section */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-8 bg-slate-50 text-slate-600 text-sm font-semibold px-6 py-4 border-b">
                <div>Quiz</div>
                <div>Deadline</div>
                <div>Duration</div>
                <div>Leaderboard</div>
                <div>Status</div>
                <div>Attempts</div>
                <div>Result</div>
                <div>Action</div>
              </div>

              {/* Rows */}
              <div className="divide-y">
                {course?.quizzes && course.quizzes.length > 0 ? (
                  course.quizzes.map((quiz) => {
                    const deadlinePassed = new Date(quiz.deadline) < new Date();
                    const hasAttempts = quiz.attempts.length > 0;

                    const status = deadlinePassed
                      ? "Expired"
                      : hasAttempts
                        ? "Completed"
                        : "Not Started";

                    const statusColor =
                      status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : status === "Expired"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700";

                    return (
                      <div
                        key={quiz.id}
                        className="grid grid-cols-8 px-6 py-4 items-center hover:bg-slate-50 transition"
                      >
                        <div className="font-medium">{quiz.title}</div>

                        <div className="text-sm text-slate-500">
                          {new Date(quiz.deadline).toLocaleDateString()}
                        </div>

                        <div className="text-sm text-slate-500">
                          {quiz.duration} min
                        </div>

                        {/* Leaderboard  */}
                        <div>
                          <button
                            disabled={deadlinePassed}
                            onClick={() =>
                              !deadlinePassed &&
                              router.push(
                                `/student/courses/${course.id}/quizzes/${quiz.id}/leaderboard`,
                              )
                            }
                            className={`text-xs px-3 py-1.5 rounded-lg transition ${
                              deadlinePassed
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                            }`}
                          >
                            View
                          </button>
                        </div>

                        {/* Status */}
                        <div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${statusColor}`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* Attempts */}
                        <div className="text-sm text-slate-500">
                          {quiz.attempts.length} / {quiz.maxAttempts}
                        </div>

                        {/* Result */}
                        <div className="text-sm">
                          {quiz.attempts.length > 0 ? (
                            (() => {
                              const latest =
                                quiz.attempts[quiz.attempts.length - 1];

                              const earned = latest.score;
                              const possible = latest.points;

                              const hasWritten =
                                quiz.questions?.some(
                                  (q) => q.type.toLowerCase() === "written",
                                ) ?? false;

                              const isPending = hasWritten && !latest.isGraded;

                              if (isPending) {
                                return (
                                  <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                    Pending grading
                                  </span>
                                );
                              }

                              const isPercentage = earned > possible;

                              let percentage = isPercentage
                                ? earned
                                : (earned / possible) * 100;

                              let color =
                                percentage < 40
                                  ? "text-red-600"
                                  : percentage < 60
                                    ? "text-orange-500"
                                    : percentage < 80
                                      ? "text-yellow-500"
                                      : "text-green-600";

                              return (
                                <span className={`font-semibold ${color}`}>
                                  {earned}/{possible} ({percentage.toFixed(0)}%)
                                </span>
                              );
                            })()
                          ) : (
                            <span className="text-gray-400">No attempts</span>
                          )}
                        </div>

                        {/* Action */}
                        <div>
                          {!deadlinePassed ? (
                            <button
                              onClick={() => handleStartQuiz(quiz)}
                              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Start
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    No quizzes posted yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedQuiz && (
          <QuizStartModal
            quiz={selectedQuiz}
            // attemptNumber={attemptNumber}
            onClose={() => setSelectedQuiz(null)}
            onConfirm={async () => {
              console.log("Starting attempt for quiz:", selectedQuiz?.id);
              const token = localStorage.getItem("token");
              const studentId = localStorage.getItem("studentId");

              const res = await fetch(
                `http://localhost:5000/api/quiz/students/courses/${course.id}/quizzes/${selectedQuiz.id}/attempts/start`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    studentID: Number(studentId),
                    quizID: Number(selectedQuiz.id),
                  }),
                },
              );

              const data = await res.json();

              if (!res.ok) {
                alert(data.message); // "Maximum attempts reached"
                setSelectedQuiz(null); // closes modal
                return;
              }

              const attemptId = data.attemptId;
              const duration = data.duration;
              // const attemptNumber = data.attemptNumber;
              // setAttemptNumber(data.attemptNumber);
              console.log("Start attempt response:", data);
              setSelectedQuiz(null); // close modal
              router.push(
                `/student/courses/${course.id}/quizzes/${selectedQuiz.id}?attemptId=${attemptId}&duration=${duration}`,
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

function QuizStartModal({
  quiz,
  // attemptNumber,
  onClose,
  onConfirm,
}: {
  quiz: Quiz;
  // attemptNumber: number | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">
          Ready to start a new attempt?
        </h2>
        <p>
          <strong>Quiz:</strong> {quiz.title}
        </p>
        <p>
          <strong>Duration:</strong> {quiz.duration} mins
        </p>
        <p>
          <strong>Attempts:</strong> {quiz.attempts.length}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onConfirm}
          >
            Start Attempt #{quiz.attempts.length + 1}
          </button>
        </div>
      </div>
    </div>
  );
}
