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

const ViewCourses: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      {user?.instructor?.section?.length ? (
        <ul className="space-y-4">
          {user.instructor.section.map((section) => (
            <li key={section.id} className="border p-4 rounded group relative">
            <span className="font-semibold">{section.course.crs_code}</span>

            {/* Hidden details that appear on hover */}
            <div className="absolute left-0 top-full mt-2 w-64 bg-white border rounded shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-lg font-bold">{section.course.crs_name}</h3>
                <p>Credits: {section.course.credits}</p>
                <p>Students Enrolled: {section.total_std}</p>
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

export default ViewCourses;