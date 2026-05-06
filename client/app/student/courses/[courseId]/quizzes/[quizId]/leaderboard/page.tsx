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

// "use client";

// import { use, useEffect, useState } from "react";
// import Sidebar from "@/components/layout/Sidebar";

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
//     const storedId = localStorage.getItem("studentId");
//     setCurrentStudentId(storedId);

//     fetch(
//       `http://localhost:5000/api/quiz/students/courses/${courseId}/quizzes/${quizId}/leaderboard`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         setLeaderboard(data.leaderboard);
//         setCurrentStudentId(data.currentStudentId?.toString());
//       });
//   }, [quizId, courseId]);

//   return (
//     <div className="flex h-screen">
//       <Sidebar />

//       <div className="flex-1 p-6">
//         {/* Course header */}
//         <div className="border-b-2 border-gray-300 pb-4 mb-6">
//           <h2 className="text-2xl font-bold">Quiz Leaderboard</h2>
//           <p className="text-gray-600">Course ID: {courseId}</p>
//         </div>

//         {/* Leaderboard table */}
//         <table className="w-full border-collapse bg-white shadow rounded">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-3">Rank</th>
//               <th className="p-3">Student</th>
//               <th className="p-3">Score</th>
//               <th className="p-3">Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaderboard.length > 0 ? (
//               leaderboard.map((entry) => {
//                 // Background colors for top 3
//                 let rankBg = "";
//                 if (entry.rank === 1) rankBg = "bg-yellow-100";
//                 else if (entry.rank === 2) rankBg = "bg-gray-100";
//                 else if (entry.rank === 3) rankBg = "bg-orange-100";

//                 // Font size and weight based on rank
//                 let rankText = "";
//                 if (entry.rank === 1) rankText = "text-xl font-extrabold";
//                 else if (entry.rank === 2) rankText = "text-lg font-bold";
//                 else if (entry.rank === 3) rankText = "text-base font-semibold";
//                 else rankText = "text-sm font-normal";

//                 // Highlight current student
//                 const highlight =
//                   entry.studentId?.toString() === currentStudentId
//                     ? "border border-yellow-400"
//                     : "";

//                 return (
//                   <tr key={entry.rank} className={`${rankBg} ${highlight}`}>
//                     <td className={`p-3 ${rankText}`}>
//                       {entry.rank === 1 && "🥇"}
//                       {entry.rank === 2 && "🥈"}
//                       {entry.rank === 3 && "🥉"}
//                       {entry.rank}
//                     </td>
//                     <td className={`p-3 ${rankText}`}>{entry.studentName}</td>
//                     <td className={`p-3 ${rankText}`}>
//                       <div className="bg-gray-200 rounded h-3 w-40">
//                         <div
//                           className="bg-green-500 h-3 rounded"
//                           style={{ width: `${entry.percentage}%` }}
//                         ></div>
//                       </div>
//                       <span className="ml-2 text-sm">
//                         {entry.score}/{entry.totalPoints} ({entry.percentage}%)
//                       </span>
//                     </td>
//                     <td className={`p-3 ${rankText}`}>{entry.duration}</td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan={4} className="p-3 text-center text-gray-500">
//                   No leaderboard entries yet
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

//--------------------------------------------------------------------------------------

// before make over

// "use client";

// import { use, useEffect, useState } from "react";
// import Sidebar from "@/components/layout/Sidebar";
// import Image from "next/image";

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
//   xp: number; // NEW field
// };

// export default function QuizLeaderboard({ params }: LeaderboardPageProps) {
//   const { courseId, quizId } = use(params);

//   const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
//   const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

//   useEffect(() => {
//     if (!quizId || !courseId) return;

//     const token = localStorage.getItem("token");
//     const storedId = localStorage.getItem("studentId");
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
//     <div className="flex h-screen">
//       <Sidebar />

//       <div className="flex-1 p-6">
//         {/* Course header */}
//         <div className="border-b-2 border-gray-300 pb-4 mb-6">
//           <h2 className="text-2xl font-bold">Quiz Leaderboard</h2>
//           <p className="text-gray-600">Course ID: {courseId}</p>
//         </div>

//         {/* Leaderboard table */}
//         <table className="w-full border-collapse bg-white shadow rounded">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-3">Rank</th>
//               <th className="p-3">Student</th>
//               <th className="p-3">Score</th>
//               <th className="p-3">Time</th>
//               <th className="p-3">
//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/assets/coin.png"
//                     alt="Coin"
//                     width={40}
//                     height={30}
//                   />
//                   <span>XP</span>
//                 </div>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaderboard.length > 0 ? (
//               leaderboard.map((entry) => {
//                 // Background colors for top 3
//                 let rankBg = "";
//                 if (entry.rank === 1) rankBg = "bg-yellow-100";
//                 else if (entry.rank === 2) rankBg = "bg-gray-100";
//                 else if (entry.rank === 3) rankBg = "bg-orange-100";

//                 // Font size and weight based on rank
//                 let rankText = "";
//                 if (entry.rank === 1) rankText = "text-xl font-extrabold";
//                 else if (entry.rank === 2) rankText = "text-lg font-bold";
//                 else if (entry.rank === 3) rankText = "text-base font-semibold";
//                 else rankText = "text-sm font-normal";

//                 // Highlight current student
//                 const highlight =
//                   entry.studentId?.toString() === currentStudentId
//                     ? "border border-yellow-400"
//                     : "";

//                 return (
//                   <tr key={entry.rank} className={`${rankBg} ${highlight}`}>
//                     <td className={`p-3 ${rankText}`}>
//                       {entry.rank === 1 && "🥇"}
//                       {entry.rank === 2 && "🥈"}
//                       {entry.rank === 3 && "🥉"}
//                       {entry.rank}
//                     </td>
//                     <td className={`p-3 ${rankText}`}>{entry.studentName}</td>
//                     <td className={`p-3 ${rankText}`}>
//                       <div className="bg-gray-200 rounded h-3 w-40">
//                         <div
//                           className="bg-green-500 h-3 rounded"
//                           style={{ width: `${entry.percentage}%` }}
//                         ></div>
//                       </div>
//                       <span className="ml-2 text-sm">
//                         {entry.score}/{entry.totalPoints} ({entry.percentage}%)
//                       </span>
//                     </td>
//                     <td className={`p-3 ${rankText}`}>{entry.duration}</td>
//                     <td className={`p-3 ${rankText} flex items-center gap-2`}>
//                       <Image
//                         src="/assets/coin.png"
//                         alt="Coin"
//                         width={40}
//                         height={20}
//                       />
//                       {entry.xp}
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan={5} className="p-3 text-center text-gray-500">
//                   No leaderboard entries yet
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { use, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";

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
  xp: number; // NEW field
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
      { headers: { Authorization: `Bearer ${token}` } },
    )
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data.leaderboard);
        setCurrentStudentId(data.currentStudentId?.toString());
      });
  }, [quizId, courseId]);
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar />

      <div className="flex-1 p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-slate-800">
            🏆 Quiz Leaderboard
          </h2>
          <p className="text-slate-500 mt-2">
            Compete, improve, and climb the ranks
          </p>
        </div>

        {/* 🥇 PODIUM */}
        {leaderboard.length > 0 && (
          <div className="flex justify-center items-end gap-6 mb-10">
            {/* 2nd */}
            {leaderboard[1] && (
              <div className="bg-white rounded-2xl shadow-md p-5 text-center w-40 h-44 flex flex-col justify-end border">
                <div className="text-3xl">🥈</div>
                <div className="font-bold">{leaderboard[1].studentName}</div>
                <div className="text-sm text-gray-500">
                  {leaderboard[1].percentage}%
                </div>
              </div>
            )}

            {/* 1st */}
            {leaderboard[0] && (
              <div className="bg-gradient-to-b from-yellow-200 to-yellow-100 rounded-2xl shadow-xl p-6 text-center w-48 h-52 flex flex-col justify-end border-2 border-yellow-300 scale-110">
                <div className="text-4xl">🥇</div>
                <div className="font-extrabold text-lg">
                  {leaderboard[0].studentName}
                </div>
                <div className="text-sm text-gray-600">
                  {leaderboard[0].percentage}%
                </div>
                <div className="text-yellow-700 font-bold">👑 Champion</div>
              </div>
            )}

            {/* 3rd */}
            {leaderboard[2] && (
              <div className="bg-white rounded-2xl shadow-md p-5 text-center w-40 h-44 flex flex-col justify-end border">
                <div className="text-3xl">🥉</div>
                <div className="font-bold">{leaderboard[2].studentName}</div>
                <div className="text-sm text-gray-500">
                  {leaderboard[2].percentage}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">
          {leaderboard.map((entry) => {
            const isMe = entry.studentId?.toString() === currentStudentId;

            return (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-5 rounded-2xl shadow-sm border transition
                ${
                  isMe
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white hover:shadow-md"
                }`}
              >
                {/* Rank */}
                <div className="flex items-center gap-3 w-24">
                  <span className="text-xl font-bold">
                    {entry.rank === 1 && "🥇"}
                    {entry.rank === 2 && "🥈"}
                    {entry.rank === 3 && "🥉"}
                    {entry.rank}
                  </span>
                </div>

                {/* Name */}
                <div className="flex-1 font-semibold flex items-center gap-2">
                  {entry.studentName}
                  {isMe && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      YOU
                    </span>
                  )}
                </div>

                {/* Score Bar */}
                <div className="w-64">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-2"
                      style={{ width: `${entry.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {entry.score}/{entry.totalPoints}
                  </div>
                </div>

                {/* Time */}
                <div className="text-sm text-gray-500 w-24 text-center">
                  ⏱ {entry.duration}
                </div>

                {/* XP */}
                <div className="flex items-center gap-2 font-bold text-yellow-600 w-24 justify-end">
                  🪙 {entry.xp}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
