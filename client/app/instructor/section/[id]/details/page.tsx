// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import PendingQuizzesList from "@/components/layout/PendingQuizzesList";
// import InstructorSidebar from "@/components/layout/InstructorSidebar";

// export default function SectionDetailsPage() {
//   const params = useParams();
//   const sectionId = params.id as string;

//   const [sectionDetails, setSectionDetails] = useState<any>(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/inst/section/${sectionId}/details`, {
//       headers: {
//         "Authorization": `Bearer ${localStorage.getItem("token")}`,
//       },
//     })
//       .then(res => res.json())
//       .then(data => setSectionDetails(data))
//       .catch(err => console.error(err));
//   }, [sectionId]);

//   if (!sectionDetails) return <p>Loading section details...</p>;

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-67 bg-white border-r p-5">
//   <InstructorSidebar />
// </aside>


//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="p-8 border-b bg-white">
//           <h1 className="text-2xl font-bold text-center">
//             {sectionDetails.courseName} ({sectionDetails.courseCode}) – Section {sectionDetails.sectionNumber}
//           </h1>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-6">
//           <div className="flex gap-4 mb-6 justify-center">
//             <button className="px-4 py-2 bg-gray-300 rounded" disabled>
//               Students & Scores (Week 7)
//             </button>
//             <button className="px-4 py-2 bg-blue-600 text-white rounded">
//               Pending Quizzes
//             </button>
//           </div>

//           <PendingQuizzesList
//             sectionId={sectionDetails.sectionId}
//             courseId={sectionDetails.courseId}
//           />
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PendingQuizzesList from "@/components/layout/PendingQuizzesList";
import InstructorSidebar from "@/components/layout/InstructorSidebar";
import InstructorLeaderboard from "@/components/layout/InstructorLeaderboard"; 

export default function SectionDetailsPage() {
  const params = useParams();
  const sectionId = params.id as string;

  const [sectionDetails, setSectionDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "leaderboard">("pending");

  useEffect(() => {
    fetch(`http://localhost:5000/api/inst/section/${sectionId}/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSectionDetails(data))
      .catch((err) => console.error(err));
  }, [sectionId]);

  if (!sectionDetails) return <p>Loading section details...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-67 bg-white border-r p-5">
        <InstructorSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-8 border-b bg-white">
          <h1 className="text-2xl font-bold text-center">
            {sectionDetails.courseName} ({sectionDetails.courseCode}) – Section{" "}
            {sectionDetails.sectionNumber}
          </h1>
        </header>

        {/* Tabs */}
        <main className="flex-1 p-6">
         <div className="flex gap-6 mb-6 justify-center border-b border-gray-300">
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`pb-2 px-4 text-lg font-semibold transition-colors ${
                activeTab === "leaderboard"
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-2 px-4 text-lg font-semibold transition-colors ${
                activeTab === "pending"
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Pending Quizzes
            </button>
          </div>


          {/* Conditional Rendering */}
          {activeTab === "pending" ? (
            <PendingQuizzesList
              sectionId={sectionDetails.sectionId}
              courseId={sectionDetails.courseId}
            />
          ) : (
            <InstructorLeaderboard
              sectionId={sectionDetails.sectionId}
              courseId={sectionDetails.courseId}
            />
          )}
        </main>
      </div>
    </div>
  );
}

