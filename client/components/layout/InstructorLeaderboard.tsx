// // components/layout/InstructorLeaderboard.tsx
// "use client";

// import { useEffect, useState } from "react";

// type LeaderboardEntry = {
//   rank: number;
//   studentId: number;
//   studentName: string;
//   studentEmail: string;   
//   avgScore: number;
//   attempts: number;
//   avgDuration: string;
// };


// export default function InstructorLeaderboard({
//   courseId,
//   sectionId,
// }: {
//   courseId: string;
//   sectionId: string;
// }) {
//   const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!courseId || !sectionId) return;

//     const token = localStorage.getItem("token");

//     fetch(
//       `http://localhost:5000/api/inst/courses/${courseId}/section/${sectionId}/leaderBoard`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         setLeaderboard(data.leaderboard || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching instructor leaderboard:", err);
//         setLoading(false);
//       });
//   }, [courseId, sectionId]);

//   if (loading) return <p>Loading leaderboard...</p>;

//   return (
//     <div>
//         <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
//       <table className="w-full border-collapse bg-white shadow rounded">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-3">Rank</th>
//             <th className="p-3">Student</th>
//             <th className="p-3">Email</th>
//             <th className="p-3">Average Score</th>
//             <th className="p-3">XP</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaderboard.length > 0 ? (
//             leaderboard.map((entry) => {
//               // Row styling for top 3
//               let rowStyle = "";
//               if (entry.rank === 1) rowStyle = "bg-yellow-300 text-yellow-900 font-extrabold";
//               else if (entry.rank === 2) rowStyle = "bg-gray-300 text-gray-900 font-bold";
//               else if (entry.rank === 3) rowStyle = "bg-amber-400 text-amber-900 font-semibold";

//               return (
//                 <tr key={entry.rank} className={`${rowStyle} hover:bg-gray-50`}>
//                   <td className="p-3">
//                     {entry.rank === 1 && "🥇"}
//                     {entry.rank === 2 && "🥈"}
//                     {entry.rank === 3 && "🥉"}
//                     {entry.rank}
//                   </td>
//                   <td className="p-3">{entry.studentName}</td>
//                     <td className="p-3">{entry.studentEmail}</td> 
//                 <td className="p-3">
//                     <div className="bg-gray-200 rounded h-3 w-40">
//                       <div
//                         className="bg-green-500 h-3 rounded"
//                         style={{ width: `${entry.avgScore}%` }}
//                       ></div>
//                     </div>
//                     <span className="ml-2 text-sm">{entry.avgScore}%</span>
//                   </td>
//                   <td className="p-3">Xp</td>
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan={4} className="p-3 text-center text-gray-500">
//                 No leaderboard entries yet
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";

type LeaderboardEntry = {
  rank: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  avgScore: number;
  attempts: number;
  avgDuration: string;
};

export default function InstructorLeaderboard({
  courseId,
  sectionId,
}: {
  courseId: string;
  sectionId: string;
}) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(
      `http://localhost:5000/api/inst/courses/${courseId}/section/${sectionId}/leaderBoard`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data.leaderboard || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId, sectionId]);

  if (loading)
    return <p className="text-slate-500">Loading leaderboard...</p>;

  if (!leaderboard.length)
    return <p className="text-slate-500">No leaderboard data yet</p>;

  return (
    <div className="space-y-8">

      {/* 🥇 PODIUM */}
      <div className="flex justify-center items-end gap-6">

        {/* 2nd */}
        {leaderboard[1] && (
          <div className="bg-white border rounded-2xl shadow-sm p-5 w-40 h-44 flex flex-col justify-end text-center">
            <div className="text-3xl">🥈</div>
            <div className="font-semibold">
              {leaderboard[1].studentName}
            </div>
            <div className="text-sm text-slate-500">
              {leaderboard[1].avgScore}%
            </div>
          </div>
        )}

        {/* 1st */}
        {leaderboard[0] && (
          <div className="bg-gradient-to-b from-blue-100 to-white border-2 border-blue-200 rounded-2xl shadow-md p-6 w-48 h-52 flex flex-col justify-end text-center scale-105">
            <div className="text-4xl">🥇</div>
            <div className="font-bold text-lg text-slate-800">
              {leaderboard[0].studentName}
            </div>
            <div className="text-sm text-slate-500">
              {leaderboard[0].avgScore}%
            </div>
            <div className="text-blue-600 font-semibold text-sm">
              Top Performer
            </div>
          </div>
        )}

        {/* 3rd */}
        {leaderboard[2] && (
          <div className="bg-white border rounded-2xl shadow-sm p-5 w-40 h-44 flex flex-col justify-end text-center">
            <div className="text-3xl">🥉</div>
            <div className="font-semibold">
              {leaderboard[2].studentName}
            </div>
            <div className="text-sm text-slate-500">
              {leaderboard[2].avgScore}%
            </div>
          </div>
        )}

      </div>

      {/* 📋 LIST */}
      <div className="space-y-4">

        {leaderboard.map((entry) => (
          <div
            key={entry.rank}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition"
          >

            {/* Rank */}
            <div className="w-16 font-bold text-slate-700">
              {entry.rank === 1 && "🥇"}
              {entry.rank === 2 && "🥈"}
              {entry.rank === 3 && "🥉"}
              {entry.rank}
            </div>

            {/* Name */}
            <div className="flex-1 font-medium text-slate-800">
              {entry.studentName}
            </div>

            {/* Email */}
            <div className="flex-1 text-sm text-slate-500">
              {entry.studentEmail}
            </div>

            {/* Score Bar */}
            <div className="w-56">
              <div className="bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${entry.avgScore}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {entry.avgScore}%
              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}