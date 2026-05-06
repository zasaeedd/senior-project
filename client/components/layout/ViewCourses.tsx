// "use client";

// import * as React from "react";

// import Link from "next/link";

// interface Course {
//   courseId: number;
//   courseCode: string;
//   courseName: string;
//   sectionNumber: number;
//   status: string;
//   xp: number;
//   quizzes?: { id: number; title: string; deadline: string }[]; 
// }

// const ViewCourses: React.FC = () => {
//   const [courses, setCourses] = React.useState<Course[]>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);

//   React.useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("User not authenticated");
//           setLoading(false);
//           return;
//         }

//         const response = await fetch(
//           "http://localhost:5000/api/info/students/courses",
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch courses");
//         }

//         const coursesData = await response.json();
//         setCourses(coursesData);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Failed to fetch courses",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   if (loading) return <p>Loading courses...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <section>
//       {courses.length ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.map((course) => {
//             const progress = Math.min((course.xp / 100) * 100, 100);

//             return (
//               <Link href={`/student/courses/${course.courseId}`}>
//                 <div
//                   key={course.courseId}
//                   className="bg-white rounded-xl shadow-md p-6 transition-transform transform hover:scale-105 hover:shadow-lg"
//                 >
//                   <h3 className="font-semibold text-lg text-slate-800">
//                     {course.courseCode} – {course.courseName}
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Section {course.sectionNumber}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Status: {course.status}
//                   </p>

//                   {/* Progress bar */}
//                   <div className="mt-4">
//                     <div className="w-full bg-gray-200 h-2 rounded-full">
//                       <div
//                         className="bg-slate-700 h-2 rounded-full"
//                         style={{ width: `${progress}%` }}
//                       />
//                     </div>
//                     <div className="mt-2 text-sm text-gray-600">
//                       Progress: {progress.toFixed(0)}%
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       ) : (
//         <p>No courses found.</p>
//       )}
//     </section>
//   );
// };

// export default ViewCourses;


"use client";

import * as React from "react";
import Link from "next/link";

interface Course {
  courseId: number;
  courseCode: string;
  courseName: string;
  sectionNumber: number;
  status: string;
  xp: number;
}

const ViewCourses: React.FC = () => {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/info/students/courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="text-slate-500">Loading courses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section>
      {courses.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => {
            const progress = Math.min((course.xp / 100) * 100, 100);

            return (
              <Link key={course.courseId} href={`/student/courses/${course.courseId}`}>
                <div className="group bg-white/90 backdrop-blur border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">

                  {/* Top Row */}
                  <div className="flex justify-between items-start">
                    
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800 leading-snug">
                        {course.courseCode}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {course.courseName}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${course.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"}
                    `}>
                      {course.status}
                    </span>

                  </div>

                  {/* Section */}
                  <p className="text-sm text-slate-500 mt-3">
                    Section {course.sectionNumber}
                  </p>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 group-hover:from-blue-600 group-hover:to-indigo-600"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-500">No courses found.</p>
      )}
    </section>
  );
};

export default ViewCourses;