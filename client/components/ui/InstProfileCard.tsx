// "use client";

// import React, { useEffect, useState } from "react";


// interface Instructor {
//   department: string;
// }

// interface User {
//   userId: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   instructor?: Instructor; 
// }

// interface User {
//   userId: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
// }

// const InstructorProfileCard: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("User not authenticated");
//           setLoading(false);
//           return;
//         }

//         const response = await fetch("http://localhost:5000/api/auth/me", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
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

//   if (loading) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow">
//         <div className="flex items-center gap-4">
//           <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse" />
//           <div className="flex-1">
//             <div className="h-4 bg-gray-300 rounded w-24 mb-2 animate-pulse" />
//             <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !user) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow">
//         <div className="text-sm text-red-500">{error || "User not found"}</div>
//       </div>
//     );
//   }


//   return (
//   <div className="bg-white p-4 rounded-lg shadow">
//     <div className="flex items-center gap-4">
//       {/* Placeholder for instructor image */}
//       <div className="w-16 h-16 bg-gray-300 rounded-full" />
//       <div>
//         <div className="font-semibold">
//           {user.firstName} {user.lastName}
//         </div>
//         <div className="text-sm text-gray-500">{user.role}</div>
//         {user.instructor?.department && (
//           <div className="text-sm text-gray-500">
//             Department: {user.instructor.department}
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );

// };

// export default InstructorProfileCard;



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
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // initials (student-style avatar)
  const cleanName = (name?: string) => {
  return name
    ?.replace(/^(mr|mrs|ms|dr)\.?\s+/i, "")
    .trim();
};
const getInitials = (first?: string, last?: string) => {
  const cleanFirst = cleanName(first);
  const cleanLast = cleanName(last);

  return `${cleanFirst?.[0] ?? ""}${cleanLast?.[0] ?? ""}`.toUpperCase();
};

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-slate-200 animate-pulse" />

          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-28 animate-pulse" />
            <div className="h-3 bg-slate-100 rounded w-20 animate-pulse" />
          </div>

        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <p className="text-sm text-red-500">
          {error || "User not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

      <div className="flex items-center gap-4">

        {/* Avatar (Student-style initials) */}
        <div className="relative">

          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">

            {user && getInitials(user.firstName, user.lastName)}

          </div>

          {/* subtle ring */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-100"></div>

        </div>

        {/* Info */}
        <div>

          <div className="font-semibold text-slate-800">
            {user.firstName} {user.lastName}
          </div>

          <div className="text-sm text-slate-500">
            {user.role}
          </div>

          {user.instructor?.department && (
            <div className="text-xs text-slate-400 mt-1">
              {user.instructor.department}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default InstructorProfileCard;