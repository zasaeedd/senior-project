// "use client";

// import React, { useEffect, useState} from "react";

// interface User {
//     userId: number,
//     firstName: string,
//     lastName: string,
//     email: string,
//     role: string;
// }

// const ProfileCard: React.FC = () => {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if(!token) {
//                     setError("User not authentiacted");
//                     setLoading(false);
//                     return
//                 }

//                 const response = await fetch("http://localhost:5000/api/auth/me", {
//                     method: "GET",
//                     headers: {
//                         "Authorization": `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 });


//                 if(!response.ok) {
//                     throw new Error("failed to fetch user data")
//                 }

//                 const userData = await response.json();
//                 setUser(userData);

//             } catch(err) {
//                 setError(err instanceof Error ? err.message : "Failed to fetch user data");
//             } finally {
//                 setLoading(false)
//             }
//         };
//         fetchUser();
//     }, [])

//     if(loading) {
//         return (
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
//     }

//      if (error || !user) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow">
//         <div className="text-sm text-red-500">{error || "User not found"}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow">
//       <div className="flex items-center gap-4">
//         <div className="w-16 h-16 bg-gray-300 rounded-full" />
//         <div>
//           <div className="font-semibold">
//             {user.firstName} {user.lastName}
//           </div>
//           <div className="text-sm text-gray-500">{user.role}</div>
//         </div>
//       </div>
//       <div className="mt-4 text-sm text-gray-600">
//         Points: <strong>120</strong> • Streak: <strong>5</strong>
//       </div>
//     </div>
//   );
// } 

// export default ProfileCard;

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image"; // for coin image

interface Enrollment {
  id: number;
  xp: number;
  section: {
    id: number;
    course: {
      id: number;
      name: string;
    };
  };
}

interface Student {
  id: number;
  enrollments: Enrollment[];
}
interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string; // assuming backend returns this
  xp?: number;         // assuming enrollment XP is returned
  student?: Student;
}

const ProfileCard: React.FC = () => {
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur p-5 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-16 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white/90 backdrop-blur p-5 rounded-2xl shadow-sm border">
        <p className="text-sm text-red-500">{error || "User not found"}</p>
      </div>
    );
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="bg-white/90 backdrop-blur p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
      
      {/* Top */}
      <div className="flex items-center gap-4">
        
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
          {initials}
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-slate-800 leading-tight">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-slate-500 capitalize">{user.role}</p>
          <p className="text-sm text-slate-500">{user.department}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t"></div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg py-3 flex items-center justify-center gap-2">
          <Image src="/assets/coins.png" alt="Coin" width={39} height={30} />
          <p className="text-xs text-slate-500">XP</p>
          <p className="font-semibold text-blue-600 text-lg">
            {user.student?.enrollments?.[0]?.xp ?? 0}     
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
