"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface DashboardCenterProps {
  selectedCourseId: number | null;
  selectedSectionId: number | null;
  selectedCourseCode?: string | null;
  selectedCourseName?: string | null;
  sections?: {
    sectionId: number;
    sectionNumber: number;
  }[];
  onSectionChange?: (sectionId: number) => void;
}

const DashboardCenter: React.FC<DashboardCenterProps> = ({
  selectedCourseId,
  selectedSectionId,
  selectedCourseCode,
  selectedCourseName,
  sections,
  onSectionChange,
}) => {
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!selectedCourseId || !selectedSectionId) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/inst/courses/${selectedCourseId}/section/${selectedSectionId}/analytics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedCourseId, selectedSectionId]);

  if (!selectedCourseId) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Select a course to view analytics</p>
      </div>
    );
  }

  const router = useRouter();
//   return (
//     <div className="p-6">
//       {/* Course + Section Filter Box */}
//       <div className="bg-white p-8 rounded-lg shadow mb-6 flex items-center justify-between">
//         {/* Course Code + Name */}
//         <h2 className="text-2xl font-bold">
//           {selectedCourseCode && selectedCourseName
//             ? `${selectedCourseCode} - ${selectedCourseName}`
//             : `Course #${selectedCourseId}`}
//         </h2>

//         {/* Section Filter */}
//         {sections && sections.length > 0 && (
//           <div className="flex items-center ml-6">
//             <h2 className="text-lg font-semibold mr-2">Filter by section:</h2>
//             <select
//               className="border rounded p-2"
//               value={selectedSectionId ?? ""}
//               onChange={(e) => onSectionChange?.(Number(e.target.value))}
//             >
//               {sections.map((section) => (
//                 <option key={section.sectionId} value={section.sectionId}>
//                   Section {section.sectionNumber}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       {/* Loading/Error */}
//       {loading && <p>Loading analytics...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Row 1: Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {/* Average Score Card */}
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <h3 className="text-lg font-semibold mb-2">Class Average Score</h3>
//           <p className="text-3xl font-bold text-blue-600">
//             {analytics?.averageScore ?? "—"}%
//           </p>
//         </div>

//         {/* Most Struggled Quiz Card */}
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <h3 className="text-lg font-semibold mb-2">Most Struggled Quiz</h3>
//           {analytics?.mostStruggledQuiz ? (
//             <p className="text-2xl font-bold text-red-600">
//               {analytics.mostStruggledQuiz.title} (
//               {analytics.mostStruggledQuiz.averageScore}%)
//             </p>
//           ) : (
//             <p className="text-gray-500">—</p>
//           )}
//         </div>
//       </div>
//       {/* Row 2: Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {/* Bar Chart: Quiz Averages */}
//         <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
//           <h3 className="text-lg font-semibold mb-4">Quiz Average Scores</h3>
//           <Bar
//             data={{
//               labels: analytics?.quizAverages?.map((q: any) => q.title) ?? [],
//               datasets: [
//                 {
//                   label: "Average Score",
//                   data:
//                     analytics?.quizAverages?.map((q: any) => q.averageScore) ??
//                     [],
//                   backgroundColor: "rgba(54, 162, 235, 0.6)",
//                 },
//               ],
//             }}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { display: false },
//                 title: { display: false },
//               },
//             }}
//           />
//         </div>

//         {/* Donut Chart: Engagement Stats */}
//         <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
//           <h3 className="text-lg font-semibold mb-4">Engagement</h3>
//           <div style={{ width: "280px", height: "280px" }}>
//             <Doughnut
//               data={{
//                 labels: ["Completed", "Grading Pending"],
//                 datasets: [
//                   {
//                     data: [
//                       analytics?.engagementStats?.completed ?? 0,
//                       analytics?.engagementStats?.gradingPending ?? 0,
//                     ],
//                     backgroundColor: ["#4CAF50", "#FFA726", "#BDBDBD"],
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: { position: "bottom" },
//                 },
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* 
// <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//   <div className="bg-white p-4 rounded-lg shadow">
//     <h3 className="font-semibold">Average Score</h3>
//     <p className="text-lg">{analytics?.averageScore ?? "—"}%</p>
//   </div>
//   <div className="bg-white p-4 rounded-lg shadow">
//     <h3 className="font-semibold">Most Struggled Quiz</h3>
//     <p>{analytics?.mostStruggledQuiz ?? "—"}</p>
//   </div>
//   <div className="bg-white p-4 rounded-lg shadow">
//     <h3 className="font-semibold">Understanding Level</h3>
//     <div className="w-full bg-gray-200 h-3 rounded">
//       <div
//         className="bg-green-500 h-3 rounded"
//         style={{ width: `${analytics?.understandingLevel ?? 0}%` }}
//       ></div>
//     </div>
//   </div>
//   <div className="bg-white p-4 rounded-lg shadow">
//     <h3 className="font-semibold">Top Performer</h3>
//     <p>{analytics?.topPerformer ?? "—"}</p>
//   </div>
// </div> */}

//       {/* Details Button */}
//       <button
//         className="mt-7 px-6 py-2 bg-blue-600 text-white rounded"
//         onClick={() =>
//           router.push(`/instructor/section/${selectedSectionId}/details`)
//         }
//       >
//         Click for Details
//       </button>
//     </div>
//   );

return (
  <div className="p-6 space-y-6">

    {/* Top Banner */}
    <div className="bg-blue-600 rounded-3xl p-6 text-white">

      <h2 className="text-3xl font-bold">
        {selectedCourseCode && selectedCourseName
          ? `${selectedCourseCode} - ${selectedCourseName}`
          : `Course #${selectedCourseId}`}
      </h2>

      <p className="text-blue-100 mt-2">
        Monitor analytics and engagement
      </p>

    </div>

    {/* Filter */}
    {sections && sections.length > 0 && (

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">

        <h3 className="font-semibold text-slate-700">
          Filter by section
        </h3>

        <select
          className="
            border
            border-slate-200
            rounded-xl
            px-4
            py-2
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-blue-100
          "
          value={selectedSectionId ?? ""}
          onChange={(e) => onSectionChange?.(Number(e.target.value))}
        >
          {sections.map((section) => (
            <option key={section.sectionId} value={section.sectionId}>
              Section {section.sectionNumber}
            </option>
          ))}
        </select>

      </div>

    )}

    {/* Loading/Error */}
    {loading && <p>Loading analytics...</p>}
    {error && <p className="text-red-500">{error}</p>}

    {/* Stats */}
    <div className="grid grid-cols-2 gap-6">

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          Class Average
        </h3>

        <p className="text-4xl font-bold text-blue-600">
          {analytics?.averageScore ?? "—"}%
        </p>

      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          Most Struggled Quiz
        </h3>

        {analytics?.mostStruggledQuiz ? (
          <p className="text-xl font-bold text-red-500">
            {analytics.mostStruggledQuiz.title}
          </p>
        ) : (
          <p className="text-slate-500">—</p>
        )}

      </div>

    </div>

    {/* Charts */}
    <div className="grid grid-cols-2 gap-6">

      {/* Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <h3 className="text-lg font-semibold mb-5">
          Quiz Average Scores
        </h3>

        <Bar
          data={{
            labels: analytics?.quizAverages?.map((q: any) => q.title) ?? [],
            datasets: [
              {
                label: "Average Score",
                data:
                  analytics?.quizAverages?.map(
                    (q: any) => q.averageScore
                  ) ?? [],
                backgroundColor: [
  "#60a5fa", // soft blue
  "#818cf8", // indigo
  "#38bdf8", // sky
  "#2dd4bf", // teal
  "#fbbf24", // amber
],
borderRadius: 10,
hoverBackgroundColor: [
  "#3b82f6",
  "#6366f1",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                grid: {
                  color: "rgba(148,163,184,0.15)",
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          }}
        />

      </div>

      {/* Doughnut */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <h3 className="text-lg font-semibold mb-5">
          Engagement
        </h3>

        <div className="flex justify-center">

          <div className="w-[260px] h-[260px]">

            <Doughnut
              data={{
                labels: ["Completed", "Pending"],
                datasets: [
                  {
                    data: [
                      analytics?.engagementStats?.completed ?? 0,
                      analytics?.engagementStats?.gradingPending ?? 0,
                    ],
                    backgroundColor: [
  "#60a5fa", // completed
  "#fbbf24", // pending
],
hoverBackgroundColor: [
  "#3b82f6",
  "#f59e0b",
],
borderWidth: 0,
hoverOffset: 8,
                   
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />

          </div>

        </div>

      </div>

    </div>

    {/* Button */}
    <button
      className="
        mt-2
        px-6
        py-3
        bg-blue-600
        hover:bg-blue-700
        text-white
        rounded-xl
        transition
      "
      onClick={() =>
        router.push(`/instructor/section/${selectedSectionId}/details`)
      }
    >
      View Details
    </button>

  </div>
);
};

export default DashboardCenter;
