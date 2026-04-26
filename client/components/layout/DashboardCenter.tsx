"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

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
    if(!selectedCourseId || !selectedSectionId) return;

    const fetchAnalytics = async () =>{
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `http://localhost:5000/api/inst/courses/${selectedCourseId}/sections/${selectedSectionId}/analytics`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            );
            if (!res.ok) throw new Error("Failed to fetch analytics");
            const data = await res.json();
            setAnalytics(data);
        }   catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        }   finally {
            setLoading(false);
        }
    };

    fetchAnalytics();
}, [selectedCourseId,selectedSectionId]);


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
{/* Charts Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
  <div className="bg-white p-4 rounded-lg shadow h-64 flex items-center justify-center text-gray-400">
    Bar Chart Placeholder
  </div>
  <div className="bg-white p-4 rounded-lg shadow h-64 flex items-center justify-center text-gray-400">
    Pie Chart Placeholder
  </div>
</div>

{/* Analytics Section */}
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
</div>


      {/* Details Button */}
      <button className="mt-7 px-6 py-2 bg-blue-600 text-white rounded"
      onClick={() => router.push(`/instructor/section/${selectedSectionId}/details`)}
      >
        Click for Details
      </button>
    </div>
  );
};

export default DashboardCenter;
