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

// interface Attempt {
//   id: number;
//   studentID: number;
//   score: number | null;
//   submitted_at: string | null;
//   isGraded: boolean;
// }

// interface Quiz {
//   id: number;
//   title: string;
//   requiresManualGrading: boolean;
//   attempts: Attempt[];
// }

// interface EngagementStats {
//   completed: number;
//   gradingPending: number;
//   notSubmitted: number;
// }

// interface AnalyticsResponse {
//   averageScore: number;
//   mostStruggledQuiz: { id: number; title: string; averageScore: number } | null;
//   quizAverages: { id: number; title: string; averageScore: number }[];
//   engagementStats: EngagementStats;
// }

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
  return (
    <div className="p-6">
      {/* Course + Section Filter Box */}
      <div className="bg-white p-8 rounded-lg shadow mb-6 flex items-center justify-between">
        {/* Course Code + Name */}
        <h2 className="text-2xl font-bold">
          {selectedCourseCode && selectedCourseName
            ? `${selectedCourseCode} - ${selectedCourseName}`
            : `Course #${selectedCourseId}`}
        </h2>

        {/* Section Filter */}
        {sections && sections.length > 0 && (
          <div className="flex items-center ml-6">
            <h2 className="text-lg font-semibold mr-2">Filter by section:</h2>
            <select
              className="border rounded p-2"
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
      </div>

      {/* Loading/Error */}
      {loading && <p>Loading analytics...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Row 1: Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Average Score Card */}
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Class Average Score</h3>
          <p className="text-3xl font-bold text-blue-600">
            {analytics?.averageScore ?? "—"}%
          </p>
        </div>

        {/* Most Struggled Quiz Card */}
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Most Struggled Quiz</h3>
          {analytics?.mostStruggledQuiz ? (
            <p className="text-2xl font-bold text-red-600">
              {analytics.mostStruggledQuiz.title} (
              {analytics.mostStruggledQuiz.averageScore}%)
            </p>
          ) : (
            <p className="text-gray-500">—</p>
          )}
        </div>
      </div>
      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart: Quiz Averages */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Quiz Average Scores</h3>
          <Bar
            data={{
              labels: analytics?.quizAverages?.map((q: any) => q.title) ?? [],
              datasets: [
                {
                  label: "Average Score (%)",
                  data:
                    analytics?.quizAverages?.map((q: any) => q.averageScore) ??
                    [],
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
            }}
          />
        </div>

        {/* Donut Chart: Engagement Stats */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Engagement</h3>
          <div style={{ width: "280px", height: "280px" }}>
            <Doughnut
              data={{
                labels: ["Completed", "Grading Pending"],
                datasets: [
                  {
                    data: [
                      analytics?.engagementStats?.completed ?? 0,
                      analytics?.engagementStats?.gradingPending ?? 0,
                    ],
                    backgroundColor: ["#4CAF50", "#FFA726", "#BDBDBD"],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* 
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="font-semibold">Average Score</h3>
    <p className="text-lg">{analytics?.averageScore ?? "—"}%</p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="font-semibold">Most Struggled Quiz</h3>
    <p>{analytics?.mostStruggledQuiz ?? "—"}</p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="font-semibold">Understanding Level</h3>
    <div className="w-full bg-gray-200 h-3 rounded">
      <div
        className="bg-green-500 h-3 rounded"
        style={{ width: `${analytics?.understandingLevel ?? 0}%` }}
      ></div>
    </div>
  </div>
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="font-semibold">Top Performer</h3>
    <p>{analytics?.topPerformer ?? "—"}</p>
  </div>
</div> */}

      {/* Details Button */}
      <button
        className="mt-7 px-6 py-2 bg-blue-600 text-white rounded"
        onClick={() =>
          router.push(`/instructor/section/${selectedSectionId}/details`)
        }
      >
        Click for Details
      </button>
    </div>
  );
};

export default DashboardCenter;
