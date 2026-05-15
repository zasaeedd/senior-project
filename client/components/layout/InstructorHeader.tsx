// "use client";

// import * as React from "react";
// import CreateQuiz from "./CreateQuiz";

// interface Instructor {
//   userId: number;
//   firstName: string;
//   lastName: string;
//   role: string;
// }

// const InstructorHeader: React.FC = () => {
//   const [user, setUser] = React.useState<Instructor | null>(null);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);

//   const [showForm, setShowForm] = React.useState(false);

//   React.useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("User not authenticated");
//           setLoading(false);
//           return;
//         }

//         const response = await fetch("http://localhost:5000/api/auth/me", {
//           method: "GET", // backend defines router.get("/me")
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const userData = await response.json();
//         setUser(userData);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch user data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <header className="w-full bg-white shadow rounded-lg px-6 py-6 flex justify-between items-center">
//       <h1 className="text-xl font-bold">
//         {loading
//           ? "Loading..."
//           : error
//           ? `Error: ${error}`
//           : `Welcome back ${user?.firstName} ${user?.lastName}!`}
//       </h1>

//       <div className="flex gap-4">
//      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//   Send Announcement
// </button>

// <button
//   onClick={() => setShowForm(true)}
//   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// >
//   Add Quiz
// </button>

//       </div>

//       {/* Modal for CreateQuiz */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg w-[600px] max-h-[88vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">Create a New Quiz</h2>
//             <CreateQuiz onClose={()=> setShowForm(false)}/>
//             <button
//               onClick={() => setShowForm(false)}
//               className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default InstructorHeader;

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

        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch user data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <header
        className="
          w-full
          bg-white
          border
          border-slate-200
          rounded-2xl
          px-6
          py-5
          flex
          items-center
          justify-between
          shadow-sm
        "
      >

        {/* Welcome Text */}
        <div>

          <h1 className="text-2xl font-bold text-slate-800">

            {loading
              ? "Loading..."
              : error
              ? `Error: ${error}`
              : `Welcome back, ${user?.firstName}!`}

          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your courses and analytics
          </p>

        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">


          {/* Add Quiz */}
          <button
            onClick={() => setShowForm(true)}
            className="
              px-5
              py-2.5
              rounded-xl
              bg-blue-600
              text-white
              font-medium
              hover:bg-blue-700
              transition
              shadow-sm
            "
          >
            Add Quiz
          </button>

        </div>

      </header>

      {/* MODAL */}
      {showForm && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div
            className="
              bg-white
              rounded-3xl
              shadow-2xl
              border
              border-slate-200
              w-[650px]
              max-h-[90vh]
              overflow-y-auto
              p-6
            "
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  Create New Quiz
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add a new quiz for your students
                </p>

              </div>

              <button
                onClick={() => setShowForm(false)}
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-slate-100
                  hover:bg-red-50
                  hover:text-red-600
                  transition
                  flex
                  items-center
                  justify-center
                  text-lg
                "
              >
                ✕
              </button>

            </div>

            {/* Quiz Form */}
            <CreateQuiz onClose={() => setShowForm(false)} />

          </div>

        </div>

      )}
    </>
  );
};

export default InstructorHeader;