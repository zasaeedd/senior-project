"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
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
    <nav className="h-full flex flex-col pl-6">
      {/* Sidebar Heading */}
      <h2 className="text-2xl  mb-6">Instructor Tools 🛠️</h2>

      {/* Tool List */}
      <div className="flex-1 overflow-y-auto pr-4">
        <ul className="space-y-2 text-base text-gray-700 ">
          <li className="p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Dashboard</li>
          <li className="p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Analytics</li>
          <li className="p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Announcements</li>
          <li className="p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Profile</li>
        </ul>
      </div>

      {/* Logout Button */}
      <div className="flex justify center p-3 border-t">
        <Button
          onClick={handleLogout}
          className="flex gap-3 items-center text-red-600 hover:bg-red-50 w-full justify-center"
        >
          <LogOut size={20} /> Logout
        </Button>
      </div>
    </nav>
  );
};

export default InstructorSidebar;
