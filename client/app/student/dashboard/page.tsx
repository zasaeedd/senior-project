// import React from "react";
// import Sidebar from "@/components/layout/Sidebar";
// import Header from "@/components/layout/Header";
// import ProfileCard from "@/components/ui/ProfileCard";
// import ViewCourses from "@/components/layout//ViewCourses";
// import { useEffect, useState } from "react";
// import { line} from "react-chartjs-2"; 

// const DashboardPage: React.FC = () => {
//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Left: Sidebar */}
//       <aside className="w-64 bg-white border-r">
//         <Sidebar />
//       </aside>

//       {/* Middle: Main content (flex-1 so it fills remaining width) */}
//       <div className="flex-1 flex flex-col">
//         {/* Header spans full width of main area */}
//         <Header />

//         {/* Main area: two columns inside the main content */}
//         <div className="flex gap-6 p-6">
//           {/* Content column (courses, carousel) */}
//           <main className="flex-1">
//             {/* Announcement / Carousel placeholder */}
//             <section className="mb-6">
//               <div className="w-full bg-white rounded-lg shadow p-6">
//                 <h3 className="text-lg font-semibold mb-2">Announcements</h3>
//                 <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400">
//                   Carousel / announcements placeholder
//                 </div>
//               </div>
//             </section>

//             {/* Courses header with search/filter */}
//             <section className="mb-4 flex items-center justify-between">
//               <h2 className="text-2xl font-bold">📚 Courses</h2>

//               <div className="flex gap-2">
//                 <input
//                   className="border rounded px-3 py-2 w-64"
//                   placeholder="Search courses..."
//                 />
//                 <button className="px-4 py-2 rounded bg-slate-700 text-white">
//                   Filter
//                 </button>
//               </div>
//             </section>

//             <ViewCourses />

//           </main>

//           {/* Right column: profile / badges */}
//           <aside className="w-80">
//             <div className="sticky top-6 space-y-4">
//               <ProfileCard />

//               <div className="bg-white p-4 rounded-lg shadow">
//                 <h4 className="font-semibold mb-2">Badges</h4>
//                 <div className="h-24 flex items-center justify-center text-gray-400">
//                   Placeholder for badges / frames
//                 </div>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;




// const DashboardPage: React.FC = () => {
//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Left: Sidebar */}
//       <aside className="w-64 bg-white border-r">
//         <Sidebar />
//       </aside>

//       {/* Middle: Main content */}
//       <div className="flex-1 flex flex-col">
//         <Header />

//         {/* Main area: two columns */}
//         <div className="flex gap-6 p-6">
//           {/* Content column */}
//           <main className="flex-1">
//             {/* Announcements */}
//             <section className="mb-6">
//               <div className="w-full bg-white rounded-lg shadow p-6">
//                 <h3 className="text-lg font-semibold mb-2">Announcements</h3>
//                 <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400">
//                   Carousel / announcements placeholder
//                 </div>
//               </div>
//             </section>

//             {/* Courses header */}
//             <section className="mb-4 flex items-center justify-between">
//               <h2 className="text-2xl font-bold">📚 Courses</h2>
//               <div className="flex gap-2">
//                 <input
//                   className="border rounded px-3 py-2 w-64"
//                   placeholder="Search courses..."
//                 />
//                 <button className="px-4 py-2 rounded bg-slate-700 text-white">
//                   Filter
//                 </button>
//               </div>
//             </section>

//             {/* Courses grid */}
//             <ViewCourses />
//           </main>

//           {/* Right column */}
//           <aside className="w-80">
//             <div className="sticky top-6 space-y-4">
//               <ProfileCard />
//               <div className="bg-white p-4 rounded-lg shadow">
//                 <h4 className="font-semibold mb-2">Badges</h4>
//                 <div className="h-24 flex items-center justify-center text-gray-400">
//                   Placeholder for badges / frames
//                 </div>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;



"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ProfileCard from "@/components/ui/ProfileCard";
import ViewCourses from "@/components/layout//ViewCourses";
import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement 
} from "chart.js";

// Register chart components
ChartJS.register(
  LineElement,
  BarElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement 
);
 
interface Quiz {
  id: number;
  title: string;
  duration: number;
  deadline: string; // ISO date string
  sectionID: number;
  attempts?: {
    id: number;
    score: number;
    points: number;
    totalPoints: number;
    submitted_at?: string;
  }[];
  maxAttempts?: number;
}

interface Course {
  id: number;
  crs_code: string;
  crs_name: string;
  sectionNumber: number;
  quizzes: Quiz[]; // ✅ not optional
}



interface Performance {
  quizId: number;
  quizTitle: string;
  courseId: number;
  courseName: string;
  score: number;
  submitted_at: string;
}



const DashboardPage: React.FC = () => {

  const [performance, setPerformance] = useState<Performance[]>([]);
const [courses, setCourses] = useState<any[]>([]);
const [coursesWithQuizzes, setCoursesWithQuizzes] = useState<any[]>([]); // for donut chart

  // fetch performance data
  useEffect(() => {
    const fetchPerformance = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/info/students/performance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPerformance(data);
    };
    fetchPerformance();
  }, []);



  useEffect(() => {
  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/info/students/courses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
        console.log("Courses API response:", data); 
    setCourses(data);
  };
  fetchCourses();
}, []);

useEffect(() => {
  const fetchCoursesWithQuizzes = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/info/students/coursesWithQuizzes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCoursesWithQuizzes(data);
  };
  fetchCoursesWithQuizzes();
}, []);

  
// Filter invalid dates
const validPerformance = performance.filter(p => {
  const d = new Date(p.submitted_at ?? Date.now());
  return !isNaN(d.getTime()); // keep only valid dates
});

// Build line chart using validPerformance
const lineData = {
 labels: validPerformance.map(p =>
  new Date(p.submitted_at).toISOString().split("T")[0] // always YYYY-MM-DD in UTC
),
  datasets: [
    {
      label: "Scores Over Time",
      data: validPerformance.map(p => p.score),
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.2)",
      tension: 0.3,
    },
  ],
};

const lineOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const score = context.raw;
          const quizTitle = validPerformance[context.dataIndex]?.quizTitle || "";
          return `${quizTitle}: ${score}`;
        },
      },
    },
  },
};

// Group scores by course
const courseScores: Record<string, number[]> = {};

validPerformance.forEach(p => {
  if (!courseScores[p.courseName]) {
    courseScores[p.courseName] = [];
  }
  courseScores[p.courseName].push(p.score);
});

// Compute averages
const courseNames = Object.keys(courseScores);
const avgScores = courseNames.map(
  name =>
    courseScores[name].reduce((a, b) => a + b, 0) / courseScores[name].length
);

const barData = {
  labels: courseNames,
  datasets: [
    {
      label: "Average Score per Course",
      data: avgScores,
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};


const barOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const score = context.raw;
          const courseName = context.label;
          return `${courseName}: ${score.toFixed(1)} avg`;
        },
      },
    },
  },
};



const now = new Date();

coursesWithQuizzes.forEach((course: Course) => {
  (course.quizzes || []).forEach((q: Quiz) => {
    console.log("Quiz check:", {
      id: q.id,
      title: q.title,
      sectionID: q.sectionID,
      courseSection: course.sectionNumber,
      deadline: q.deadline,
      deadlinePassed: new Date(q.deadline) < now,
      attempts: q.attempts,
      attemptsLength: q.attempts?.length || 0,
    });
  });
});


const notCompletedQuizzes = coursesWithQuizzes.flatMap(course =>
  (course.quizzes || []).filter((q: Quiz) =>
    new Date(q.deadline) < now &&
    (!q.attempts || q.attempts.length === 0)
  )
);

const pendingQuizzes = coursesWithQuizzes.flatMap(course =>
  (course.quizzes || []).filter((q: Quiz) =>
    new Date(q.deadline) >= now &&
    (!q.attempts || q.attempts.length === 0)
  )
);

const completedQuizzes = coursesWithQuizzes.flatMap(course =>
  (course.quizzes || []).filter((q: Quiz) =>
    q.attempts && q.attempts.length > 0 // ✅ no deadline check
  )
);


const totalQuizzes =
  completedQuizzes.length + pendingQuizzes.length + notCompletedQuizzes.length;

const pieChartData = {
  labels: ["Completed", "Pending", "Not Completed"],
  datasets: [
    {
      data: [
        completedQuizzes.length,
        pendingQuizzes.length,
        notCompletedQuizzes.length,
      ],
      backgroundColor: ["#22c55e", "#facc15", "#ef4444"], // green, yellow, red
    },
  ],
};

const pieOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.label || "";
          const value = context.raw;
          // Find the quiz title from your arrays
          let quizTitle = "";
          if (label === "Completed") {
            quizTitle = completedQuizzes[context.dataIndex]?.title || "";
          } else if (label === "Pending") {
            quizTitle = pendingQuizzes[context.dataIndex]?.title || "";
          } else if (label === "Not Completed") {
            quizTitle = notCompletedQuizzes[context.dataIndex]?.title || "";
          }
          return `${label}: ${value} (${quizTitle})`;
        },
      },
    },
  },
};



console.log("Pie chart breakdown:", {
  completed: completedQuizzes,
  pending: pendingQuizzes,
  notCompleted: notCompletedQuizzes,
});




  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left: Sidebar */}
      <aside className="w-64 bg-white border-r">
          <div className="sticky top-6">
        <Sidebar />
        </div>
      </aside>

      {/* Middle: Main content */}
      <div className="flex-1 flex flex-col">
        <Header />

        {/* Main area: two columns */}
        <div className="flex gap-6 p-6">
          {/* Content column */}
          <main className="flex-1">
            {/* Announcements */}
            <section className="mb-6">
              <div className="w-full bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Announcements</h3>
                <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                  Carousel / announcements placeholder
                </div>
              </div>
            </section>

            {/* Courses header */}
            <section className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">📚 Courses</h2>
              <div className="flex gap-2">
                <input
                  className="border rounded px-3 py-2 w-64"
                  placeholder="Search courses..."
                />
                <button className="px-4 py-2 rounded bg-slate-700 text-white">
                  Filter
                </button>
              </div>
            </section>

            {/* Courses grid */}
            <ViewCourses />

              <section className="mt-10 mb-5">
              <h2 className="text-2xl font-bold mb-6">📈 Performance & 📊 Course Averages</h2>
              <div className="flex gap-6">
                {/* Line chart */}
                <div className="flex-1 bg-white rounded-lg shadow p-6">
                  {validPerformance.length > 0 ? (
                    <Line data={lineData} options={lineOptions} />
                  ) : (
                    <p className="text-gray-500">No performance data yet.</p>
                  )}
                </div>

              {/* Bar chart */}
              <div className="flex-1 bg-white rounded-lg shadow p-6">
                {courseNames.length > 0 ? (
                  <Bar data={barData} options={barOptions} />
                ) : (
                  <p className="text-gray-500">No course data yet.</p>
                )}
              </div>
            </div>
          </section>
          <section className="mt-10 mb-5">
            <h2 className="text-3xl font-bold mb-6">🎯 Overall Completion</h2>

            <div className="flex justify-center">
              {/* White box container stretched full width */}
              <div className="w-full bg-white rounded-lg shadow p-6 flex gap-8">
                
                {/* Pie Chart */}
                <div className="w-1/3 flex items-center justify-center">
                  <Doughnut data={pieChartData} options={pieOptions} />
                </div>

                {/* Quiz Lists */}
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-green-600 mb-3">Completed</h3>
                    <ul className="list-disc list-inside text-lg">
                      {completedQuizzes.map(q => (
                        <li key={q.id}>{q.title}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-yellow-600 mb-3">Pending</h3>
                    <ul className="list-disc list-inside text-lg">
                      {pendingQuizzes.map(q => (
                        <li key={q.id}>{q.title}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-red-600 mb-3">Not Completed</h3>
                    <ul className="list-disc list-inside text-lg">
                      {notCompletedQuizzes.map(q => (
                        <li key={q.id}>{q.title}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>





          </main>

          {/* Right column */}
          <aside className="w-80">
            <div className="sticky top-6 space-y-4">
              <ProfileCard />
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold mb-2">Badges</h4>
                <div className="h-24 flex items-center justify-center text-gray-400">
                  Placeholder for badges / frames
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
