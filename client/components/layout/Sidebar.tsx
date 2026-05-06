// "use client";
// import Link from "next/link";
// import {useRouter} from "next/navigation";
// import { Home, BookOpen, User, LogOut } from "lucide-react";
// import { JSX, ReactNode } from "react";
// import { Button } from "../ui/button";

// type MenuItem = {
//   name: string;
//   icon: ReactNode;
//   path: string;
// };

// export default function Sidebar(): JSX.Element {
//   const router = useRouter();
//   const menu: MenuItem[] = [
//     { name: "Dashboard", icon: <Home size={20} />, path: "/student/dashboard" },
//     { name: "Courses", icon: <BookOpen size={20} />, path: "/student/courses" },
//     { name: "Profile", icon: <User size={20} />, path: "/student/profile" },
//   ];

//   const handleLogout = () => {
//     // clear authentication data from localstorage
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("role");

//     // redirect user to login page
//     router.push("/login");
//   }

//   return (
//     <div className="w-64 h-screen bg-white shadow-md flex flex-col">
//       <h2 className="text-xl font-bold p-4 border-b">Student Panel</h2>

//       <nav className="flex-1 p-2">
//         {menu.map((item) => (
//           <Link
//             key={item.name}
//             href={item.path}
//             className="flex items-center gap-3 p-2 my-1 rounded-lg hover:bg-gray-100"
//           >
//             {item.icon}
//             <span>{item.name}</span>
//           </Link>
//         ))}
//       </nav>

//       <Button 
//       onClick={handleLogout}
//       className="p-3 border-t flex gap-3 items-center text-red-600 hover:bg-red-50">
//         <LogOut size={20} /> Logout
//       </Button>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, BookOpen, User, LogOut } from "lucide-react";
import { JSX, ReactNode } from "react";

type MenuItem = {
  name: string;
  icon: ReactNode;
  path: string;
};

export default function Sidebar(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  const menu: MenuItem[] = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/student/dashboard" },
    { name: "Courses", icon: <BookOpen size={20} />, path: "/student/courses" },
    { name: "Profile", icon: <User size={20} />, path: "/student/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="w-64 h-screen bg-white/80 backdrop-blur border-r flex flex-col px-3 py-4">
      
      {/* Logo / Title */}
      <div className="px-3 mb-6">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          Student Panel
        </h2>
        <div className="w-10 h-1 bg-blue-600 rounded mt-2"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menu.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }
              `}
            >
              <span className={isActive ? "text-white" : "text-slate-500"}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </div>
  );
}

