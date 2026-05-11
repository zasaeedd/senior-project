// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import InstructorSidebar from "@/components/layout/InstructorSidebar";

// const PendingQuizzesList = ({ sectionId, courseId}: { sectionId: string, courseId: string }) => {
//   const router = useRouter();
//   const [attempts, setAttempts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/inst/attempts/ungraded?sectionId=${sectionId}&courseId=${courseId}`, {
//       headers: {
//         "Authorization": `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     })
//       .then(res => {
//         if (!res.ok) throw new Error("Failed to fetch attempts");
//         return res.json();
//       })
//       .then(data => setAttempts(Array.isArray(data) ? data : []))
//       .catch(err => {
//         console.error(err);
//         setAttempts([]);
//       })
//       .finally(() => setLoading(false));
//   }, [sectionId, courseId]);

//   if (loading) return <p>Loading pending quizzes...</p>;
//   if (attempts.length === 0) return <p>No pending quizzes 🎉</p>;

//   return (
//   <div className="min-h-screen flex bg-gray-100">
  

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <h2 className="text-xl font-bold mb-4">Pending Quizzes</h2>

//         <table className="min-w-full bg-white border rounded shadow">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="p-3 border">Quiz Title</th>
//               <th className="p-3 border">Student</th>
//               <th className="p-3 border">Submitted At</th>
//               <th className="p-3 border">Manual Grading</th>
//               <th className="p-3 border">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attempts.map(attempt => (
//               <tr key={attempt.id} className="hover:bg-gray-50">
//                 <td className="p-3 border">{attempt.quiz.title}</td>
//                 <td className="p-3 border">
//                   {attempt.student.user.firstName} {attempt.student.user.lastName}
//                 </td>
//                 <td className="p-3 border">
//                   {new Date(attempt.submitted_at).toLocaleString()}
//                 </td>
//                 <td className="p-3 border">
//                   {attempt.quiz.requiresManualGrading ? "Yes" : "No"}
//                 </td>
//                 <td className="p-3 border">
//                   <button
//                     className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                     onClick={() => router.push(`/Instructor/attempt/${attempt.id}/grade`)}
//                   >
//                     Grade Attempt
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </main>
//     </div>
//   );
// };

// export default PendingQuizzesList;







//------------------------------- before the UI update -------------------------------

// "use client";

// import React, { useEffect, useState } from "react";
// import GradeAttemptPage from "@/components/ui/GradeAttemptPage"; 
// import InstructorSidebar from "@/components/layout/InstructorSidebar";

// const PendingQuizzesList = ({ sectionId, courseId }: { sectionId: string, courseId: string }) => {
//   const [attempts, setAttempts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAttempt, setSelectedAttempt] = useState<number | null>(null); // NEW

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/inst/attempts/ungraded?sectionId=${sectionId}&courseId=${courseId}`, {
//       headers: {
//         "Authorization": `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     })
//       .then(res => {
//         if (!res.ok) throw new Error("Failed to fetch attempts");
//         return res.json();
//       })
//       .then(data => setAttempts(Array.isArray(data) ? data : []))
//       .catch(err => {
//         console.error(err);
//         setAttempts([]);
//       })
//       .finally(() => setLoading(false));
//   }, [sectionId, courseId]);

//   if (loading) return <p>Loading pending quizzes...</p>;
//   if (attempts.length === 0) return <p>No pending quizzes 🎉</p>;

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <h2 className="text-xl font-bold mb-4">Pending Quizzes</h2>

//         <table className="min-w-full bg-white border rounded shadow">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="p-3 border">Quiz Title</th>
//               <th className="p-3 border">Student</th>
//               <th className="p-3 border">Submitted At</th>
//               <th className="p-3 border">Manual Grading</th>
//               <th className="p-3 border">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attempts.map(attempt => (
//               <tr key={attempt.id} className="hover:bg-gray-50">
//                 <td className="p-3 border">{attempt.quiz.title}</td>
//                 <td className="p-3 border">
//                   {attempt.student.user.firstName} {attempt.student.user.lastName}
//                 </td>
//                 <td className="p-3 border">
//                   {new Date(attempt.submitted_at).toLocaleString()}
//                 </td>
//                 <td className="p-3 border">
//                   {attempt.quiz.requiresManualGrading ? "Yes" : "No"}
//                 </td>
//                 <td className="p-3 border">
//                   <button
//                     className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                     onClick={() => setSelectedAttempt(attempt.id)} // OPEN DRAWER
//                   >
//                     Grade Attempt
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Drawer */}
//        {selectedAttempt && (
//           <div
//             className="fixed inset-0 flex justify-end"
//             onClick={() => setSelectedAttempt(null)} // close when clicking outside
//           >
//             <div
//               className="w-1/2 bg-white p-6 shadow-lg overflow-y-auto"
//               onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//             >
//               <button
//                 onClick={() => setSelectedAttempt(null)}
//                 className="mb-4 text-gray-600 hover:text-black"
//               >
//                 Close ✖
//               </button>
//               <GradeAttemptPage attemptId={selectedAttempt} />
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default PendingQuizzesList;


"use client";

import React, { useEffect, useState } from "react";
import GradeAttemptPage from "@/components/ui/GradeAttemptPage";

const PendingQuizzesList = ({
  sectionId,
  courseId,
}: {
  sectionId: string;
  courseId: string;
}) => {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState<number | null>(null);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/inst/attempts/ungraded?sectionId=${sectionId}&courseId=${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setAttempts(Array.isArray(data) ? data : []))
      .catch(() => setAttempts([]))
      .finally(() => setLoading(false));
  }, [sectionId, courseId]);

  if (loading)
    return <p className="text-slate-500">Loading pending quizzes...</p>;

  if (attempts.length === 0)
    return <p className="text-slate-500">No pending quizzes 🎉</p>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      <h2 className="text-lg font-semibold p-4 border-b">
        Pending Quizzes
      </h2>

      <table className="w-full text-sm">

        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="p-3 text-left">Quiz</th>
            <th className="p-3 text-left">Student</th>
            <th className="p-3 text-left">Submitted</th>
            <th className="p-3 text-left">Manual</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {attempts.map((attempt) => (
            <tr
              key={attempt.id}
              className="border-t hover:bg-slate-50 transition"
            >
              <td className="p-3">{attempt.quiz.title}</td>
              <td className="p-3">
                {attempt.student.user.firstName}{" "}
                {attempt.student.user.lastName}
              </td>
              <td className="p-3 text-slate-500">
                {new Date(attempt.submitted_at).toLocaleString()}
              </td>
              <td className="p-3">
                {attempt.quiz.requiresManualGrading ? "Yes" : "No"}
              </td>
              <td className="p-3">
                <button
                  onClick={() => setSelectedAttempt(attempt.id)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Grade
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* Drawer */}
      {selectedAttempt && (
        <div
          className="fixed inset-0 flex justify-end bg-black/30"
          onClick={() => setSelectedAttempt(null)}
        >
          <div
            className="w-[50%] bg-white p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAttempt(null)}
              className="text-slate-500 hover:text-black mb-4"
            >
              Close ✕
            </button>

            <GradeAttemptPage attemptId={selectedAttempt} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingQuizzesList;