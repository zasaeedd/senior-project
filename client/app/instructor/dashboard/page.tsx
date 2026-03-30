import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DashboardPage from "@/app/student/dashboard/page";
import InstructorSidebar from "@/components/layout/InstructorSidebar";
import InstructorHeader from "@/components/layout/InstructorHeader";
import ViewCourses from "@/components/layout/ViewCourses";

<aside className="w-64 bg-white border-r">
  <InstructorSidebar />
</aside>;

const InstructorDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white border-r">
        <ViewCourses />
        <InstructorSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* <Header /> */}

         <div className="p-6 space-y-6">
          <div className="flex-1 flex flex-col">
            <InstructorHeader/>
          </div> 

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow h-64 flex items-center justify-center text-gray-400">
              Bar Chart Placeholder
            </div>
            <div className="bg-white p-4 rounded-lg shadow h-64 flex items-center justify-center text-gray-400">
              Pie Chart Placeholder
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Average Score</h3>
              <p className="text-lg">80%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Most Struggled Topic</h3>
              <p>Chapter 6</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Understanding Level</h3>
              <div className="w-full bg-gray-200 h-3 rounded">
                <div className="bg-green-500 h-3 rounded w-4/5"></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Top Performer</h3>
              <p>Nora Mohammed</p>
            </div>
          </div>

          {/* Details Button */}
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
            Click for Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboardPage;
