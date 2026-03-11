import React from "react";

const InstructorSidebar: React.FC = () => {
  return (
    <nav className="h-full flex flex-col p-4">
      <h2 className="text-xl font-bold mb-4">Courses</h2>
      <ul className="space-y-2 text-gray-700">
        <li className="hover:text-slate-700 cursor-pointer">ITCS240</li>
        <li className="hover:text-slate-700 cursor-pointer">ITCS440</li>
        <li className="hover:text-slate-700 cursor-pointer">ITCS494</li>
        <li className="hover:text-slate-700 cursor-pointer">ITCS333</li>
      </ul>

      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Instructor Tools</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="hover:text-slate-700 cursor-pointer">Dashboard</li>
          <li className="hover:text-slate-700 cursor-pointer">Analytics</li>
          <li className="hover:text-slate-700 cursor-pointer">Announcements</li>
          <li className="hover:text-slate-700 cursor-pointer">Profile</li>
        </ul>
      </div>
    </nav>
  );
};

export default InstructorSidebar;