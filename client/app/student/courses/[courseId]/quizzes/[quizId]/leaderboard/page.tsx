// "use client";

// import { use, useEffect, useState } from "react";

// interface LeaderboardPageProps {
//   params: Promise<{ courseId: string; quizId: string }>;
// }
// type LeaderboardEntry = {
//   rank: number;
//   studentId: number;
//   studentName: string;
//   score: number;
//   totalPoints: number;
//   percentage: number;
//   duration: string;
// };


// export default function QuizLeaderboard({ params }: LeaderboardPageProps) {
//   const { courseId, quizId } = use(params);

//   const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
//   const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

//   useEffect(() => {
//     if (!quizId || !courseId) return;

//     const token = localStorage.getItem("token");
//     const storedId = localStorage.getItem("studentId"); //  must be set at login
//     setCurrentStudentId(storedId);

//     fetch(
//       `http://localhost:5000/api/quiz/students/courses/${courseId}/quizzes/${quizId}/leaderboard`,
//       { headers: { Authorization: `Bearer ${token}` } },
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         setLeaderboard(data.leaderboard);
//         setCurrentStudentId(data.currentStudentId?.toString());
//       });
//   }, [quizId, courseId]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Quiz Leaderboard</h1>
//       <table className="w-full border-collapse bg-white shadow rounded">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-3">Rank</th>
//             <th className="p-3">Student</th>
//             <th className="p-3">Score</th>
//             <th className="p-3">Time</th>
//           </tr>
//         </thead>
// <tbody>
//   {leaderboard.map((entry) => {
//     console.log("Comparing:", entry.studentId, currentStudentId);

//     // Background colors for top 3
//     let rankBg = "";
//     if (entry.rank === 1) rankBg = "bg-yellow-100"; // gold
//     else if (entry.rank === 2) rankBg = "bg-gray-100"; // silver
//     else if (entry.rank === 3) rankBg = "bg-orange-100"; // bronze

//     // Font size and weight based on rank
//     let rankText = "";
//     if (entry.rank === 1) rankText = "text-xl font-extrabold";
//     else if (entry.rank === 2) rankText = "text-lg font-bold";
//     else if (entry.rank === 3) rankText = "text-base font-semibold";
//     else rankText = "text-sm font-normal";

//     // Highlight current student separately
//     const highlight =
//       entry.studentId?.toString() === currentStudentId
//         ? "border border-yellow-400"
//         : "";

//     return (
//       <tr key={entry.rank} className={`${rankBg} ${highlight}`}>
//         <td className={`p-3 ${rankText}`}>
//           {entry.rank === 1 && "🥇"}
//           {entry.rank === 2 && "🥈"}
//           {entry.rank === 3 && "🥉"}
//           {entry.rank}
//         </td>
//         <td className={`p-3 ${rankText}`}>{entry.studentName}</td>
//         <td className={`p-3 ${rankText}`}>
//     <div className="bg-gray-200 rounded h-4 w-48"> {/* 48 = 12rem */}
//   <div
//     className="bg-green-500 h-4 rounded"
//     style={{ width: `${entry.percentage}%` }}
//   ></div>
// </div>
// <span className="ml-2 text-sm">
//   {entry.score}/{entry.totalPoints} ({entry.percentage}%)
// </span>

//         </td>
//         <td className={`p-3 ${rankText}`}>{entry.duration}</td>
//       </tr>
//     );
//   })}
// </tbody>
//       </table>
//     </div>
//   );
// }



"use client";

import { use, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

interface LeaderboardPageProps {
  params: Promise<{ courseId: string; quizId: string }>;
}

type LeaderboardEntry = {
  rank: number;
  studentId: number;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  duration: string;
};

export default function QuizLeaderboard({ params }: LeaderboardPageProps) {
  const { courseId, quizId } = use(params);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId || !courseId) return;

    const token = localStorage.getItem("token");
    const storedId = localStorage.getItem("studentId");
    setCurrentStudentId(storedId);

    fetch(
      `http://localhost:5000/api/quiz/students/courses/${courseId}/quizzes/${quizId}/leaderboard`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data.leaderboard);
        setCurrentStudentId(data.currentStudentId?.toString());
      });
  }, [quizId, courseId]);

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Course header */}
        <div className="border-b-2 border-gray-300 pb-4 mb-6">
          <h2 className="text-2xl font-bold">Quiz Leaderboard</h2>
          <p className="text-gray-600">Course ID: {courseId}</p>
        </div>

        {/* Leaderboard table */}
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Rank</th>
              <th className="p-3">Student</th>
              <th className="p-3">Score</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry) => {
                // Background colors for top 3
                let rankBg = "";
                if (entry.rank === 1) rankBg = "bg-yellow-100";
                else if (entry.rank === 2) rankBg = "bg-gray-100";
                else if (entry.rank === 3) rankBg = "bg-orange-100";

                // Font size and weight based on rank
                let rankText = "";
                if (entry.rank === 1) rankText = "text-xl font-extrabold";
                else if (entry.rank === 2) rankText = "text-lg font-bold";
                else if (entry.rank === 3) rankText = "text-base font-semibold";
                else rankText = "text-sm font-normal";

                // Highlight current student
                const highlight =
                  entry.studentId?.toString() === currentStudentId
                    ? "border border-yellow-400"
                    : "";

                return (
                  <tr key={entry.rank} className={`${rankBg} ${highlight}`}>
                    <td className={`p-3 ${rankText}`}>
                      {entry.rank === 1 && "🥇"}
                      {entry.rank === 2 && "🥈"}
                      {entry.rank === 3 && "🥉"}
                      {entry.rank}
                    </td>
                    <td className={`p-3 ${rankText}`}>{entry.studentName}</td>
                    <td className={`p-3 ${rankText}`}>
                      <div className="bg-gray-200 rounded h-3 w-40">
                        <div
                          className="bg-green-500 h-3 rounded"
                          style={{ width: `${entry.percentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">
                        {entry.score}/{entry.totalPoints} ({entry.percentage}%)
                      </span>
                    </td>
                    <td className={`p-3 ${rankText}`}>{entry.duration}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">
                  No leaderboard entries yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
