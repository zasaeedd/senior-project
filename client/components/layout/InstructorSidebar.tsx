"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

const InstructorSidebar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // clear authentication data from localstorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    // redirect user to login page
    router.push("/login");
  };

  return (
    <nav className="h-full flex flex-col">
        <h2 className="text-xl font-bold p-4 border-b"></h2>

  <h2 className="text-xl font-bold p-4">Instructor Tools</h2>

  <div className="flex-1 p-2">
    <ul className="space-y-2 text-base text-gray-700">
      <li className="flex items-center gap-3 p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Dashboard</li>
      <li className="flex items-center gap-3 p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Analytics</li>
      <li className="flex items-center gap-3 p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Announcements</li>
      <li className="flex items-center gap-3 p-2 my-1 rounded-lg hover:bg-gray-100 cursor-pointer">Profile</li>
    </ul>
  </div>

  <Button
    onClick={handleLogout}
    className="p-3 border-t flex gap-3 items-center text-red-600 hover:bg-red-50"
  >
    <LogOut size={20} /> Logout
  </Button>
</nav>

  );
};

export default InstructorSidebar;
