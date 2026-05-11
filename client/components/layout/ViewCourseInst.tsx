"use client";

import * as React from "react";

interface Course {
  id: number;
  crs_name: string;
  crs_code: string;
  credits: number;
}

interface CourseResponse {
  courseId: number;
  courseCode: string;
  courseName: string;
  credits?: number;
  sections: {
    sectionId: number,
    sectionNumber: number;
    totalStudents: number;
  }[];
}


interface Section {
  id: number;
  total_std: number;
  course: Course;
  _count?: { enrollments: number};
}

interface Instructor {
  id: number;
  department: string;
  section: Section[];
}

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  role: string;
  instructor?: Instructor;
}

// to connect to the dashboard with the selected Course and section Id
interface ViewCourseInstProps {
  onSelectedCourse: (
    courseId: number, 
    sectionId: number   | null,
    courseCode: string,
    courseName: string,
    sections: {sectionId: number; sectionNumber: number}[]
  ) => void;
}



const ViewCourseInst: React.FC<ViewCourseInstProps> = ({onSelectedCourse}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [courses, setCourses] = React.useState<CourseResponse[]>([]);

  // Group sections by course
    const courseMap: Record<number, { course: Course; sections: Section[] }> = {};

  user?.instructor?.section?.forEach((sec) => {
  const courseId = sec.course.id;
  if (!courseMap[courseId]) {
    courseMap[courseId] = { course: sec.course, sections: [] };
  }
  courseMap[courseId].sections.push(sec);
  });

  // const courses = Object.values(courseMap);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/inst/courses", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const courseData: CourseResponse[] = await response.json();
        // sort the sections
        courseData.forEach(course => {
          course.sections.sort((a,b) => a.sectionNumber - b.sectionNumber)
        })
        setCourses(courseData);
        console.log("Courses loaded:", courseData);


        if (courseData.length > 0) {
        const firstCourse = courseData[0];
        const firstSectionId = firstCourse.sections[0]?.sectionId ?? null;
        onSelectedCourse(
          firstCourse.courseId,
          firstSectionId,
          firstCourse.courseCode,
          firstCourse.courseName,
          firstCourse.sections
        );
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl mb-4">My Courses ✍️</h2>
//      {courses.length ? (
//   <ul className="space-y-4 border-b pb-4">
//     {courses.map((course) => (
// <li key={course.courseId} className="border p-4 rounded-lg relative group">
//   <button
//     className="w-full p-2 text-left rounded hover:bg-gray-100"
//     onClick={() =>
//       onSelectedCourse(
//         course.courseId,
//         course.sections[0]?.sectionId ?? null,
//         course.courseCode,
//         course.courseName,
//         course.sections
//       )
//     }
//   >
//     {course.courseCode}
//   </button>

//   {/* Hover info tied to li.group hover */}

  
//   {/* <div className="absolute left-full top-0 ml-2 w-64 bg-white border rounded shadow-lg p-3 opacity-0 transition-opacity group-hover:opacity-100">
//     <h3 className="text-lg font-bold">{course.courseName}</h3>
//     <p>Sections: {course.sections.length}</p>
//     <p>
//       Total students:{" "}
//       {course.sections.reduce((sum, s) => sum + s.totalStudents, 0)}
//     </p>
//   </div> */}
// </li>





//     ))}
//   </ul>
// ) : (
//   <p>No courses found.</p>
// )}

//     </div>
//   );
// };
return (
  <div className="p-5">

    <div className="mb-5">

      <h2 className="text-xl font-bold text-slate-800">
        My Courses
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Select a course
      </p>

    </div>

    {courses.length ? (

      <ul className="space-y-3">

        {courses.map((course) => (

          <li key={course.courseId}>

            <button
              className="
                w-full
                text-left
                p-4
                rounded-2xl
                bg-white
                border
                border-slate-200
                hover:border-blue-200
                hover:bg-blue-50
                transition-all
              "
              onClick={() =>
                onSelectedCourse(
                  course.courseId,
                  course.sections[0]?.sectionId ?? null,
                  course.courseCode,
                  course.courseName,
                  course.sections
                )
              }
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold text-slate-800">
                    {course.courseCode}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {course.courseName}
                  </p>

                </div>

                <div className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                  {course.sections.length}
                </div>

              </div>

            </button>

          </li>

        ))}

      </ul>

    ) : (

      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500">
        No courses found
      </div>

    )}

  </div>
);
}
export default ViewCourseInst;


