"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { Home, BookOpen, User, LogOut } from "lucide-react";
import { JSX, ReactNode } from "react";
import { Button } from "../ui/button";

type MenuItem = {
  name: string;
  icon: ReactNode;
  path: string;
};

export default function Sidebar(): JSX.Element {
  const router = useRouter();
  const menu: MenuItem[] = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/student/dashboard" },
    { name: "Courses", icon: <BookOpen size={20} />, path: "/student/courses" },
    { name: "Profile", icon: <User size={20} />, path: "/student/profile" },
  ];

  const handleLogout = () => {
    // clear authentication data from localstorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    // redirect user to login page
    router.push("/login");
  }

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b">Student Panel</h2>

      <nav className="flex-1 p-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="flex items-center gap-3 p-2 my-1 rounded-lg hover:bg-gray-100"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <Button 
      onClick={handleLogout}
      className="p-3 border-t flex gap-3 items-center text-red-600 hover:bg-red-50">
        <LogOut size={20} /> Logout
      </Button>
    </div>
  );
}

