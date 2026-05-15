

// "use client";

// import React from "react";
// import Sidebar from "@/components/layout/Sidebar";
// import Header from "@/components/layout/Header";
// import ProfileCard from "@/components/ui/ProfileCard";
// import ViewCourses from "@/components/layout//ViewCourses";
// import { useEffect, useState } from "react";
// import { Line, Bar } from "react-chartjs-2";
// import { Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   BarElement, 
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement 
// } from "chart.js";

// // Register chart components
// ChartJS.register(
//   LineElement,
//   BarElement, 
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement 
// );
 
// interface Quiz {
//   id: number;
//   title: string;
//   duration: number;
//   deadline: string; // ISO date string
//   sectionID: number;
//   attempts?: {
//     id: number;
//     score: number;
//     points: number;
//     totalPoints: number;
//     submitted_at?: string;
//   }[];
//   maxAttempts?: number;
// }

// interface Course {
//   id: number;
//   crs_code: string;
//   crs_name: string;
//   sectionNumber: number;
//   quizzes: Quiz[]; 
// }


// interface Badge {
//   id: number;
//   name: string;
//   description: string;
//   imageUrl: string;
// }

// interface Performance {
//   quizId: number;
//   quizTitle: string;
//   courseId: number;
//   courseName: string;
//   score: number;
//   submitted_at: string;
// }



// const DashboardPage: React.FC = () => {

// const [performance, setPerformance] = useState<Performance[]>([]);
// const [courses, setCourses] = useState<any[]>([]);
// const [coursesWithQuizzes, setCoursesWithQuizzes] = useState<any[]>([]); // for donut chart
// const [studentBadges, setStudentBadges] = useState<Badge[]>([]);


// useEffect(() => {
//   const fetchBadges = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch("http://localhost:5000/api/info/students/badges", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setStudentBadges(data);
//   };
//   fetchBadges();
// }, []);

//   // fetch performance data
//   useEffect(() => {
//     const fetchPerformance = async () => {
//       const token = localStorage.getItem("token");
//       const res = await fetch("http://localhost:5000/api/info/students/performance", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setPerformance(data);
//     };
//     fetchPerformance();
//   }, []);



//   useEffect(() => {
//   const fetchCourses = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch("http://localhost:5000/api/info/students/courses", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//         console.log("Courses API response:", data); 
//     setCourses(data);
//   };
//   fetchCourses();
// }, []);

// useEffect(() => {
//   const fetchCoursesWithQuizzes = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch("http://localhost:5000/api/info/students/coursesWithQuizzes", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setCoursesWithQuizzes(data);
//   };
//   fetchCoursesWithQuizzes();
// }, []);


// // Filter invalid dates
// const validPerformance = performance.filter(p => {
//   const d = new Date(p.submitted_at ?? Date.now());
//   return !isNaN(d.getTime()); // keep only valid dates
// });

// // Build line chart using validPerformance
// const lineData = {
//  labels: validPerformance.map(p =>
//   new Date(p.submitted_at).toISOString().split("T")[0] // always YYYY-MM-DD in UTC
// ),
//   datasets: [
//     {
//       label: "Scores Over Time",
//       data: validPerformance.map(p => p.score),
//       borderColor: "rgba(75,192,192,1)",
//       backgroundColor: "rgba(75,192,192,0.2)",
//       tension: 0.3,
//     },
//   ],
// };

// const lineOptions = {
//   plugins: {
//     tooltip: {
//       callbacks: {
//         label: function (context: any) {
//           const score = context.raw;
//           const quizTitle = validPerformance[context.dataIndex]?.quizTitle || "";
//           return `${quizTitle}: ${score}`;
//         },
//       },
//     },
//   },
// };

// // Group scores by course
// const courseScores: Record<string, number[]> = {};

// validPerformance.forEach(p => {
//   if (!courseScores[p.courseName]) {
//     courseScores[p.courseName] = [];
//   }
//   courseScores[p.courseName].push(p.score);
// });

// // Compute averages
// const courseNames = Object.keys(courseScores);
// const avgScores = courseNames.map(
//   name =>
//     courseScores[name].reduce((a, b) => a + b, 0) / courseScores[name].length
// );

// const barData = {
//   labels: courseNames,
//   datasets: [
//     {
//       label: "Average Score per Course",
//       data: avgScores,
//       backgroundColor: "rgba(54, 162, 235, 0.6)",
//       borderColor: "rgba(54, 162, 235, 1)",
//       borderWidth: 1,
//     },
//   ],
// };


// const barOptions = {
//   plugins: {
//     tooltip: {
//       callbacks: {
//         label: function (context: any) {
//           const score = context.raw;
//           const courseName = context.label;
//           return `${courseName}: ${score.toFixed(1)} avg`;
//         },
//       },
//     },
//   },
// };



// const now = new Date();

// coursesWithQuizzes.forEach((course: Course) => {
//   (course.quizzes || []).forEach((q: Quiz) => {
//     console.log("Quiz check:", {
//       id: q.id,
//       title: q.title,
//       sectionID: q.sectionID,
//       courseSection: course.sectionNumber,
//       deadline: q.deadline,
//       deadlinePassed: new Date(q.deadline) < now,
//       attempts: q.attempts,
//       attemptsLength: q.attempts?.length || 0,
//     });
//   });
// });


// const notCompletedQuizzes = coursesWithQuizzes.flatMap(course =>
//   (course.quizzes || []).filter((q: Quiz) =>
//     new Date(q.deadline) < now &&
//     (!q.attempts || q.attempts.length === 0)
//   )
// );

// const pendingQuizzes = coursesWithQuizzes.flatMap(course =>
//   (course.quizzes || []).filter((q: Quiz) =>
//     new Date(q.deadline) >= now &&
//     (!q.attempts || q.attempts.length === 0)
//   )
// );

// const completedQuizzes = coursesWithQuizzes.flatMap(course =>
//   (course.quizzes || []).filter((q: Quiz) =>
//     q.attempts && q.attempts.length > 0 //  no deadline check
//   )
// );


// const totalQuizzes =
//   completedQuizzes.length + pendingQuizzes.length + notCompletedQuizzes.length;

// const pieChartData = {
//   labels: ["Completed", "Pending", "Not Completed"],
//   datasets: [
//     {
//       data: [
//         completedQuizzes.length,
//         pendingQuizzes.length,
//         notCompletedQuizzes.length,
//       ],
//       backgroundColor: ["#22c55e", "#facc15", "#ef4444"], // green, yellow, red
//     },
//   ],
// };

// const pieOptions = {
//   plugins: {
//     tooltip: {
//       callbacks: {
//         label: function (context: any) {
//           const label = context.label || "";
//           const value = context.raw;
//           // Find the quiz title from your arrays
//           let quizTitle = "";
//           if (label === "Completed") {
//             quizTitle = completedQuizzes[context.dataIndex]?.title || "";
//           } else if (label === "Pending") {
//             quizTitle = pendingQuizzes[context.dataIndex]?.title || "";
//           } else if (label === "Not Completed") {
//             quizTitle = notCompletedQuizzes[context.dataIndex]?.title || "";
//           }
//           return `${label}: ${value} (${quizTitle})`;
//         },
//       },
//     },
//   },
// };



// console.log("Pie chart breakdown:", {
//   completed: completedQuizzes,
//   pending: pendingQuizzes,
//   notCompleted: notCompletedQuizzes,
// });




//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Left: Sidebar */}
//       <aside className="w-64 bg-white border-r">
//           <div className="sticky top-6">
//         <Sidebar />
//         </div>
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

//               <section className="mt-10 mb-5">
//               <h2 className="text-2xl font-bold mb-6">📈 Performance & 📊 Course Averages</h2>
//               <div className="flex gap-6">
//                 {/* Line chart */}
//                 <div className="flex-1 bg-white rounded-lg shadow p-6">
//                   {validPerformance.length > 0 ? (
//                     <Line data={lineData} options={lineOptions} />
//                   ) : (
//                     <p className="text-gray-500">No performance data yet.</p>
//                   )}
//                 </div>

//               {/* Bar chart */}
//               <div className="flex-1 bg-white rounded-lg shadow p-6">
//                 {courseNames.length > 0 ? (
//                   <Bar data={barData} options={barOptions} />
//                 ) : (
//                   <p className="text-gray-500">No course data yet.</p>
//                 )}
//               </div>
//             </div>
//           </section>
//           <section className="mt-10 mb-5">
//             <h2 className="text-3xl font-bold mb-6">🎯 Overall Completion</h2>

//             <div className="flex justify-center">
//               {/* White box container stretched full width */}
//               <div className="w-full bg-white rounded-lg shadow p-6 flex gap-8">
                
//                 {/* Pie Chart */}
//                 <div className="w-1/3 flex items-center justify-center">
//                   <Doughnut data={pieChartData} options={pieOptions} />
//                 </div>

//                 {/* Quiz Lists */}
//                 <div className="flex-1 grid grid-cols-3 gap-6">
//                   <div>
//                     <h3 className="text-xl font-semibold text-green-600 mb-3">Completed</h3>
//                     <ul className="list-disc list-inside text-lg">
//                       {completedQuizzes.map(q => (
//                         <li key={q.id}>{q.title}</li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h3 className="text-xl font-semibold text-yellow-600 mb-3">Pending</h3>
//                     <ul className="list-disc list-inside text-lg">
//                       {pendingQuizzes.map(q => (
//                         <li key={q.id}>{q.title}</li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h3 className="text-xl font-semibold text-red-600 mb-3">Not Completed</h3>
//                     <ul className="list-disc list-inside text-lg">
//                       {notCompletedQuizzes.map(q => (
//                         <li key={q.id}>{q.title}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>





//           </main>

//           {/* Right column */}
//       <aside className="w-80">
//   <div className="sticky top-6 space-y-4">
//     <ProfileCard />
// <div className="bg-white p-5 rounded-lg shadow">
//   <h4 className="font-semibold mb-2">Badges:</h4>

//   <div className="grid grid-cols-3 gap-1 place-items-center">
//   {studentBadges.map((badge) => (
//     <div key={badge.id} className="flex flex-col items-center">
//       <img
//         src={badge.imageUrl}
//         alt={badge.name}
//         className="w-32 h-32 object-contain"
//         title={badge.name} 
//       />
//     </div>
//   ))}
// </div>

// </div>



//   </div>
// </aside>


//         </div>
//       </div>
//     </div>
//   );
// };


"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ProfileCard from "@/components/ui/ProfileCard";
import ViewCourses from "@/components/layout//ViewCourses";
import { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
  deadline: string;
  sectionID: number;
  attempts?: {
    id: number;
    score: number;
  }[];
}

interface Course {
  id: number;
  crs_name: string;
  sectionNumber: number;
  quizzes: Quiz[];
}

interface Badge {
  id: number;
  name: string;
  imageUrl: string;
}

interface Performance {
  quizTitle: string;
  courseName: string;
  score: number;
  submitted_at: string;
}

const DashboardPage: React.FC = () => {

const [performance, setPerformance] = useState<Performance[]>([]);
const [coursesWithQuizzes, setCoursesWithQuizzes] = useState<any[]>([]);
const [studentBadges, setStudentBadges] = useState<Badge[]>([]);

useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/info/students/badges", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json()).then(setStudentBadges);

  fetch("http://localhost:5000/api/info/students/performance", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json()).then(setPerformance);

  fetch("http://localhost:5000/api/info/students/coursesWithQuizzes", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json()).then(setCoursesWithQuizzes);

}, []);

const validPerformance = performance.filter(p => !isNaN(new Date(p.submitted_at).getTime()));

const lineData = {
  labels: validPerformance.map(p => new Date(p.submitted_at).toISOString().split("T")[0]),
  datasets: [{
    label: "Scores",
    data: validPerformance.map(p => p.score),
    borderColor: "#2563eb",
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    tension: 0.4,
  }]
};

const courseScores: Record<string, number[]> = {};
validPerformance.forEach(p => {
  if (!courseScores[p.courseName]) courseScores[p.courseName] = [];
  courseScores[p.courseName].push(p.score);
});

const courseNames = Object.keys(courseScores);
const avgScores = courseNames.map(n =>
  courseScores[n].reduce((a, b) => a + b, 0) / courseScores[n].length
);

const barData = {
  labels: courseNames,
  datasets: [{
    label: "Average Score",
    data: avgScores,
    backgroundColor: "#6366f1",
  }]
};

const now = new Date();

const completedQuizzes = coursesWithQuizzes.flatMap(c =>
  (c.quizzes || []).filter((q: Quiz) => q.attempts?.length)
);

const pendingQuizzes = coursesWithQuizzes.flatMap(c =>
  (c.quizzes || []).filter((q: Quiz) =>
    new Date(q.deadline) >= now && (!q.attempts?.length)
  )
);

const notCompletedQuizzes = coursesWithQuizzes.flatMap(c =>
  (c.quizzes || []).filter((q: Quiz) =>
    new Date(q.deadline) < now && (!q.attempts?.length)
  )
);

// Define weeklyQuizzes before your return()
const weeklyQuizzes = coursesWithQuizzes
  .flatMap(c => c.quizzes || [])
  .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  .slice(0, 3);

const pieChartData = {
  labels: ["Completed", "Pending", "Missed"],
  datasets: [{
    data: [
      completedQuizzes.length,
      pendingQuizzes.length,
      notCompletedQuizzes.length
    ],
    backgroundColor: ["#22c55e", "#eab308", "#ef4444"]
  }]
};

return (
<div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800">

  {/* Sidebar */}
  <aside className="w-64 bg-white/80 backdrop-blur border-r">
    <div className="sticky top-6 px-3">
      <Sidebar />
    </div>
  </aside>

  {/* Main */}
  <div className="flex-1 flex flex-col">
    <Header />

    <div className="flex gap-8 p-8 max-w-[1600px] mx-auto w-full">

      {/* Content */}
      <main className="flex-1 space-y-8">

        {/* Announcements */}
        {/* <section className="bg-white rounded-2xl shadow-sm p-6 border">
          <h3 className="text-xl font-semibold mb-4">Announcements</h3>
          <div className="h-40 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
            No announcements yet
          </div>

        </section> */}
        {/* Weekly Tasks */}
<section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-5">
    <div>
      <h3 className="text-xl font-semibold text-slate-800">
        Weekly Tasks
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Complete all quizzes to refresh your checklist
      </p>
    </div>

    <div className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
      {
        weeklyQuizzes.filter(q =>
          completedQuizzes.some(c => c.id === q.id)
        ).length
      }
      /3 Done
    </div>
  </div>

  {/* Checklist */}
  <div className="space-y-3">
    {weeklyQuizzes.map((q, index) => {
      const isCompleted = completedQuizzes.some(c => c.id === q.id);

      const courseName =
        coursesWithQuizzes.find(course =>
          course.quizzes?.some((quiz: Quiz) => quiz.id === q.id)
        )?.courseName || "Unknown Course";

      return (
        <div
          key={q.id}
          className={`flex items-center gap-4 p-4 rounded-xl border transition-all
            ${isCompleted
              ? "bg-green-50 border-green-200"
              : "bg-slate-50 border-slate-200 hover:border-blue-200"
            }`}
        >
          {/* Checkbox */}
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold
              ${isCompleted
                ? "bg-green-500 text-white"
                : "border-2 border-slate-300 bg-white"
              }`}
          >
            {isCompleted ? "✓" : ""}
          </div>

          {/* Task Info */}
          <div className="flex-1">
            <p className={`font-medium ${isCompleted ? "text-green-700 line-through" : "text-slate-700"}`}>
              {q.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                {courseName}
              </span>
              <span className="text-xs text-slate-400">
                Quiz #{index + 1}
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            {isCompleted ? (
              <span className="text-green-600 text-sm font-medium">Completed</span>
            ) : (
              <span className="text-amber-500 text-sm font-medium">Pending</span>
            )}
          </div>
        </div>
      );
    })}
  </div>
</section>



        {/* Courses */}
        <section className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Courses</h2>

          <div className="flex gap-3">
            <input className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 w-64"/>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
              Filter
            </button>
          </div>
        </section>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <ViewCourses />
        </div>

        {/* Charts */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Performance</h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <Line data={lineData} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <Bar data={barData} />
            </div>
          </div>
        </section>

        {/* Completion */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border flex gap-10">
          <div className="w-1/3 flex justify-center items-center">
            <Doughnut data={pieChartData} />
          </div>

          <div className="flex-1 grid grid-cols-3 gap-6 text-sm">

            <div>
              <h3 className="text-green-600 font-semibold mb-2">Completed</h3>
              {completedQuizzes.map(q => <p key={q.id}>• {q.title}</p>)}
            </div>

            <div>
              <h3 className="text-yellow-500 font-semibold mb-2">Pending</h3>
              {pendingQuizzes.map(q => <p key={q.id}>• {q.title}</p>)}
            </div>

            <div>
              <h3 className="text-red-500 font-semibold mb-2">Missed</h3>
              {notCompletedQuizzes.map(q => <p key={q.id}>• {q.title}</p>)}
            </div>

          </div>
        </section>

      </main>

      {/* Right Panel */}
      <aside className="w-80 space-y-6">

        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <ProfileCard />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <h4 className="font-semibold mb-4">Badges</h4>

          <div className="grid grid-cols-3 gap-3">
            {studentBadges.map(b => (
              <img
                key={b.id}
                src={b.imageUrl}
                className="w-20 h-20 object-contain hover:scale-110 transition"
              />
            ))}
          </div>

        </div>

      </aside>

    </div>
  </div>
</div>
);
};
export default DashboardPage;
