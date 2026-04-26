// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// interface Attempt {
//   score: number;
//   duration: number;
// }

// interface Quiz {
//   id: number;
//   title: string;
//   duration: number;
//   attempts: Attempt[];
// }

// export default function QuizzesPage() {
//   const { courseId } = useParams(); // dynamic route param
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!courseId) return;

//     const fetchQuizzes = async () => {
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         `http://localhost:5000/api/info/students/courses/${courseId}/quizzes`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await res.json();
//       setQuizzes(data);
//       setLoading(false);
//     };

//     fetchQuizzes();
//   }, [courseId]);

//   if (loading) return <p>Loading quizzes...</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Quizzes</h2>
//       <table className="w-full bg-white rounded-lg shadow">
//         <thead>
//           <tr className="border-b">
//             <th className="p-3 text-left">Quiz</th>
//             <th className="p-3 text-left">Duration</th>
//             <th className="p-3 text-left">Performance</th>
//             <th className="p-3 text-left">Leaderboard</th>
//           </tr>
//         </thead>
//         <tbody>
//           {quizzes.map((quiz) => (
//             <tr key={quiz.id} className="border-b">
//               <td className="p-3">{quiz.title}</td>
//               <td className="p-3">{quiz.duration} mins</td>
//               <td className="p-3">
//                 {quiz.attempts.length
//                   ? `${quiz.attempts[0].score}%`
//                   : "Not attempted"}
//               </td>
//               <td className="p-3">
//                 <button className="px-3 py-1 bg-slate-700 text-white rounded">
//                   View Leaderboard
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// components/ui/quizzes.tsx

// "use client";

// import { useEffect, useState } from "react";
// import Sidebar from "@/components/layout/Sidebar";
// import { useRouter } from "next/navigation";

// interface Attempt {
//   score: number;
//   duration: number;
// }

// interface Quiz {
//   id: number;
//   title: string;
//   duration: number;
//   attempts: Attempt[];
// }

// interface Course {
//   id: number;
//   crs_code: string;
//   crs_name: string;
//   quizzes: Quiz[];
// }

// interface QuizzesProps {
//   courseId?: string;
// }

// export default function Quizzes({ courseId }: QuizzesProps) {
//   const router = useRouter();
//   const [course, setCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

//   useEffect(() => {
//     if (!courseId) return;

//     const fetchCourse = async () => {
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         `http://localhost:5000/api/info/students/courses/${courseId}`,
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       const data = await res.json();
//       console.log("Course API response:", data);
//       setCourse(data);
//       setLoading(false);
//     };

//     fetchCourse();
//   }, [courseId]);

//   if (loading) return <p>Loading course...</p>;
//   if (!course) return <p>No course found.</p>;

//   return (
//     <div className="flex h-screen">
//       <Sidebar />

//       <div className="flex-1 p-6">
//         {/* Course header */}
//         <div className="border-b-2 border-gray-300 pb-4 mb-6">
//           <h2 className="text-2xl font-bold">
//             {course.crs_code} — {course.crs_name}
//           </h2>
//         </div>

//         {/* Quizzes table */}
//         <table className="w-full border-collapse bg-white shadow rounded">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-3">Quiz</th>
//               <th className="p-3">Duration</th>
//               <th className="p-3">Performance</th>
//               <th className="p-3">Leaderboard</th>
//               <th className="p-3">View Result</th>
//               <th className="p-3">Start Quiz</th>
//             </tr>
//           </thead>
//           <tbody>
//             {course.quizzes.map((quiz) => (
//               <tr key={quiz.id} className="hover:bg-gray-50">
//                 <td className="p-3">{quiz.title}</td>
//                 <td className="p-3">{quiz.duration} mins</td>
//                 <td className="p-3">
//                   {quiz.attempts.length
//                     ? `${quiz.attempts[0].score}%`
//                     : "Not attempted"}
//                 </td>
//                 <td className="p-3">
//                   <button className="text-blue-600 hover:underline">
//                     View Leaderboard
//                   </button>
//                 </td>
// <td className="p-3">
//   {quiz.attempts.length > 0 ? (
//     (() => {
//       const latestAttempt = quiz.attempts[quiz.attempts.length - 1];
//       const score = latestAttempt.score;

//       // pick color based on score
//       let colorClass = "text-green-600"; // default
//       if (score < 40) colorClass = "text-red-600";
//       else if (score < 60) colorClass = "text-orange-500";
//       else if (score < 80) colorClass = "text-yellow-500";
//       else colorClass = "text-green-600";

//       return (
//         <span className={`font-semibold ${colorClass}`}>
//           {score}%
//         </span>
//       );
//     })()
//   ) : (
//     <span className="text-gray-400">No attempts yet</span>
//   )}
// </td>
//                 <td className="p-3">

//                 <button
//                   className="text-blue-600 hover:underline"
//                   onClick={() => setSelectedQuiz(quiz)}
//                 >
//                   Start
//                 </button>
//               </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//              {/* Place the modal here */}
//       {selectedQuiz && (
//         <QuizStartModal
//           quiz={selectedQuiz}
//           onClose={() => setSelectedQuiz(null)}
//           onConfirm={() => {
//             setSelectedQuiz(null);
//             router.push(`/student/courses/${course.id}/quizzes/${selectedQuiz.id}`);
//           }}
//         />
//       )}

//     </div>
//   );
// }

//   function QuizStartModal({ quiz, onClose, onConfirm }: {
//   quiz: Quiz;
//   onClose: () => void;
//   onConfirm: () => void;
// }) {
//   return (
// <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center">
//       <div className="bg-white rounded shadow-lg p-6 w-96">
//         <h2 className="text-xl font-bold mb-4">Ready to start a new attempt?</h2>
//         <p><strong>Quiz:</strong> {quiz.title}</p>
//         <p><strong>Duration:</strong> {quiz.duration} mins</p>
//         <p><strong>Attempts:</strong> {quiz.attempts.length}</p>

//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             className="px-4 py-2 bg-gray-300 rounded"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//             onClick={onConfirm}
//           >
//             Start Attempt #{quiz.attempts.length + 1}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }





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
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Course header */}
        <div className="border-b-2 border-gray-300 pb-4 mb-6">
          <h2 className="text-2xl font-bold">
            
            {course.crs_code} — {course.crs_name}
          </h2>
        </div>

        {progress && progress.totalQuizzes > 0 && (
          <div className="mb-6 text-center">
            <p className="font-bold text-lg">
              Progress: {progress.completedQuizzes} / {progress.totalQuizzes}{" "}
              quizzes completed
            </p>
            <div className="w-full bg-gray-200 rounded h-5 overflow-hidden">
              <div
                className={`${barColor} h-5 rounded transition-all duration-500`}
                style={{ width: `${completionRate * 100}%` }}
              ></div>
            </div>
            <p className={`mt-2 text-2xl font-bold ${messageColor}`}>
              {message}
            </p>
          </div>
        )}

        {/* Quizzes table */}
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Quiz</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Leaderboard</th>
              <th className="p-3">View Result</th>
              <th className="p-3">Status</th>
              <th className="p-3">Max Attempts</th>
              <th className="p-3">Start Quiz</th>
            </tr>
          </thead>
          <tbody>
{course?.quizzes && course.quizzes.length > 0 ? (
  course.quizzes.map((quiz) => {
    const deadlinePassed = new Date(quiz.deadline) < new Date();

    return (
      <tr
        key={quiz.id}
        className={`hover:bg-gray-50 ${deadlinePassed ? "text-gray-400" : ""}`}
      >
        <td className="p-3">{quiz.title}</td>
        <td className="p-3">
          {new Date(quiz.deadline).toLocaleDateString()}{" "}
          {new Date(quiz.deadline).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td className="p-3">{quiz.duration} mins</td>
        <td className="p-3">
          <button
            className={`${
              deadlinePassed
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:underline"
            }`}
            disabled={deadlinePassed}
          >
            View Leaderboard
          </button>
        </td>
        <td className="p-3">
          {quiz.attempts.length > 0 ? (
            (() => {

const latestAttempt = quiz.attempts[quiz.attempts.length - 1];
const earned = latestAttempt.score;   // may be percentage (MCQ) or raw points (written)
const possible = latestAttempt.points;

const hasWritten = quiz.questions?.some(
  (q) => q.type.toLowerCase() === "written"
) ?? false;

const isPending = hasWritten && !latestAttempt.isGraded;

      if (isPending) {
        return (
          <span className="font-semibold text-gray-500">
            Pending manual grading…
          </span>
        );
      }

// Detect if score is percentage (MCQ case)
const isPercentageScore = earned > possible; // e.g. 100 vs 7

let displayEarned = earned;
let percentage = 0;

if (isPercentageScore) {
  // MCQ case: score is percentage, so convert to raw points
  percentage = earned; // already percentage
  displayEarned = Math.round((percentage / 100) * possible);
} else {
  // Written/manual case: score is raw points
  percentage = (earned / possible) * 100;
}

let colorClass = "text-green-600";
if (percentage < 40) colorClass = "text-red-600";
else if (percentage < 60) colorClass = "text-orange-500";
else if (percentage < 80) colorClass = "text-yellow-500";

return (
  <span className={`font-semibold ${colorClass}`}>
    {displayEarned} / {possible} ({percentage.toFixed(0)}%)
  </span>
);



            
            })()
          ) : (
            <span className="text-gray-400 font-bold">No attempts yet</span>
          )}
        </td>
        <td className="p-3">
          {deadlinePassed ? (
            <span className="text-gray-400 font-semibold">Expired</span>
          ) : (
            <>
              {progress?.quizzes.find((q) => q.id === quiz.id)?.status ===
                "completed" && (
                <span className="text-green-600 font-semibold">Completed</span>
              )}
              {progress?.quizzes.find((q) => q.id === quiz.id)?.status ===
                "in-progress" && (
                <span className="text-yellow-600 font-semibold">In Progress</span>
              )}
              {progress?.quizzes.find((q) => q.id === quiz.id)?.status ===
                "not-started" && (
                <span className="text-gray-400 font-semibold">Not Started</span>
              )}
            </>
          )}
        </td>
        <td className="p-3">{quiz.maxAttempts}</td>
        <td className="p-3">
          <button
            className={`${
              deadlinePassed
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:underline"
            }`}
            onClick={() => !deadlinePassed && handleStartQuiz(quiz)}
            disabled={deadlinePassed}
          >
            Start
          </button>
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan={8} className="p-3 text-center text-gray-500">
      No quizzes posted yet
    </td>
  </tr>
)}

          </tbody>
        </table>
      </div>

      {selectedQuiz && (
        <QuizStartModal
          quiz={selectedQuiz}
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
            console.log("Start attempt response:", data);
            setSelectedQuiz(null); // close modal
            router.push(
              `/student/courses/${course.id}/quizzes/${selectedQuiz.id}?attemptId=${attemptId}&duration=${duration}`,
            );
          }}
        />
      )}
    </div>
  );
}

function QuizStartModal({
  quiz,
  onClose,
  onConfirm,
}: {
  quiz: Quiz;
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
