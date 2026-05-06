// components/layout/InstructorLeaderboard.tsx
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
    if (!courseId || !sectionId) return;

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
      .catch((err) => {
        console.error("Error fetching instructor leaderboard:", err);
        setLoading(false);
      });
  }, [courseId, sectionId]);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div>
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Rank</th>
            <th className="p-3">Student</th>
            <th className="p-3">Email</th>
            <th className="p-3">Average Score</th>
            <th className="p-3">XP</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry) => {
              // Row styling for top 3
              let rowStyle = "";
              if (entry.rank === 1) rowStyle = "bg-yellow-300 text-yellow-900 font-extrabold";
              else if (entry.rank === 2) rowStyle = "bg-gray-300 text-gray-900 font-bold";
              else if (entry.rank === 3) rowStyle = "bg-amber-400 text-amber-900 font-semibold";

              return (
                <tr key={entry.rank} className={`${rowStyle} hover:bg-gray-50`}>
                  <td className="p-3">
                    {entry.rank === 1 && "🥇"}
                    {entry.rank === 2 && "🥈"}
                    {entry.rank === 3 && "🥉"}
                    {entry.rank}
                  </td>
                  <td className="p-3">{entry.studentName}</td>
                    <td className="p-3">{entry.studentEmail}</td> 
                <td className="p-3">
                    <div className="bg-gray-200 rounded h-3 w-40">
                      <div
                        className="bg-green-500 h-3 rounded"
                        style={{ width: `${entry.avgScore}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{entry.avgScore}%</span>
                  </td>
                  <td className="p-3">Xp</td>
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
  );
}
