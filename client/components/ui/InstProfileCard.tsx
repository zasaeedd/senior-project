"use client";

import React, { useEffect, useState } from "react";


interface Instructor {
  department: string;
}

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  instructor?: Instructor; 
}

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const InstructorProfileCard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
            "Content-Type": "application/json",
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

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-24 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-red-500">{error || "User not found"}</div>
      </div>
    );
  }


  return (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center gap-4">
      {/* Placeholder for instructor image */}
      <div className="w-16 h-16 bg-gray-300 rounded-full" />
      <div>
        <div className="font-semibold">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-sm text-gray-500">{user.role}</div>
        {user.instructor?.department && (
          <div className="text-sm text-gray-500">
            Department: {user.instructor.department}
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default InstructorProfileCard;
