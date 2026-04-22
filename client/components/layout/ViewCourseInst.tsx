"use client";

import * as React from "react";

interface Course {
  id: number;
  crs_name: string;
  crs_code: string;
  credits: number;
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

const ViewCourseInst: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Group sections by course
const courseMap: Record<number, { course: Course; sections: Section[] }> = {};

user?.instructor?.section?.forEach((sec) => {
  const courseId = sec.course.id;
  if (!courseMap[courseId]) {
    courseMap[courseId] = { course: sec.course, sections: [] };
  }
  courseMap[courseId].sections.push(sec);
});

const courses = Object.values(courseMap);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Courses ✍️</h2>
      {user?.instructor?.section?.length ? (
        <ul className="space-y-4">
  {courses.map(({ course, sections }) => (
    <li key={course.id} className="border p-4 rounded group relative">
      <span className="font-semibold">{course.crs_code}</span>

      {/* Hover info */}
        <div className="absolute left-full top-0 ml-2 w-64 bg-white border rounded shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity">        <h3 className="text-lg font-bold">{course.crs_name}</h3>
        <p>Credits: {course.credits}</p>
        <p>Sections: {sections.length}</p>
        <p>Total students: {sections.reduce((sum, s) => sum + (s._count?.enrollments || 0), 0)}</p>
      </div>
    </li>
  ))}
</ul>

      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
};

export default ViewCourseInst;