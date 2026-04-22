"use client";

import * as React from "react";
import CreateQuiz from "./CreateQuiz";

interface Instructor {
  userId: number;
  firstName: string;
  lastName: string;
  role: string;
}

const InstructorHeader: React.FC = () => {
  const [user, setUser] = React.useState<Instructor | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [showForm, setShowForm] = React.useState(false);

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
          method: "GET", // backend defines router.get("/me")
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

  return (
    <header className="w-full bg-white shadow rounded-lg px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        {loading
          ? "Loading..."
          : error
          ? `Error: ${error}`
          : `Welcome back ${user?.firstName} ${user?.lastName}!`}
      </h1>

      <div className="flex gap-4">
     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Send Announcement
</button>

<button
  onClick={() => setShowForm(true)}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  Add Quiz
</button>

      </div>

      {/* Modal for CreateQuiz */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-[600px] max-h-[88vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create a New Quiz</h2>
            <CreateQuiz onClose={()=> setShowForm(false)}/>
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default InstructorHeader;