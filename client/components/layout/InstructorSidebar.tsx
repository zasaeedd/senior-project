// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import { LogOut } from "lucide-react";
// import { Button } from "../ui/button";

// const InstructorSidebar: React.FC = () => {
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("role");
//     router.push("/login");
//   };

//   return (
//     <nav className="h-full flex flex-col pl-6">
//       {/* Sidebar Heading */}
//       <h2 className="text-2xl  mb-6">Instructor Tools 🛠️</h2>

//       {/* Tool List */}
//       <div className="flex-1 overflow-y-auto pr-4">
//         <ul className="space-y-2 text-base text-gray-700 ">
//           <li className="p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Dashboard</li>
//           <li className="p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Analytics</li>
//           <li className="p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Announcements</li>
//           <li className="p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Profile</li>
//         </ul>
//       </div>

//       {/* Logout Button */}
//       <div className="flex justify center p-3 border-t">
//         <Button
//           onClick={handleLogout}
//           className="flex gap-3 items-center text-red-600 hover:bg-red-50 w-full justify-center"
//         >
//           <LogOut size={20} /> Logout
//         </Button>
//       </div>
//     </nav>
//   );
// };

// export default InstructorSidebar;

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Megaphone,
  User,
  LogOut,
} from "lucide-react";

import { Button } from "../ui/button";

const InstructorSidebar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <nav className="h-full flex flex-col p-5">

      <div className="mb-8">

        <h2 className="text-xl font-bold text-slate-800">
          Instructor Tools
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Quick access panel
        </p>

      </div>

      <div className="flex-1">

        <ul className="space-y-2">

          <li className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium cursor-pointer">
            <LayoutDashboard size={18} />
            Dashboard
          </li>

          <li className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer">
            <BarChart3 size={18} />
            Analytics
          </li>

          <li className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer">
            <Megaphone size={18} />
            Announcements
          </li>

          <li className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer">
            <User size={18} />
            Profile
          </li>

        </ul>

      </div>

      <div className="pt-5 border-t border-slate-100">

        <Button
          onClick={handleLogout}
          className="
            w-full
            flex items-center justify-center gap-2
            bg-slate-100
            hover:bg-red-50
            text-slate-700
            hover:text-red-600
            rounded-xl
            py-6
            shadow-none
          "
        >
          <LogOut size={18} />
          Logout
        </Button>

      </div>

    </nav>
  );
};

export default InstructorSidebar;