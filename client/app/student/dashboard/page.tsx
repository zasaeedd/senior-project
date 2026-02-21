import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left: Sidebar */}
      <aside className="w-64 bg-white border-r">
        <Sidebar />
      </aside>

      {/* Middle: Main content (flex-1 so it fills remaining width) */}
      <div className="flex-1 flex flex-col">
        {/* Header spans full width of main area */}
        <Header />

        {/* Main area: two columns inside the main content */}
        <div className="flex gap-6 p-6">
          {/* Content column (courses, carousel) */}
          <main className="flex-1">
            {/* Announcement / Carousel placeholder */}
            <section className="mb-6">
              <div className="w-full bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Announcements</h3>
                <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                  Carousel / announcements placeholder
                </div>
              </div>
            </section>

            {/* Courses header with search/filter */}
            <section className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">📚 Courses</h2>

              <div className="flex gap-2">
                <input
                  className="border rounded px-3 py-2 w-64"
                  placeholder="Search courses..."
                />
                <button className="px-4 py-2 rounded bg-slate-700 text-white">
                  Filter
                </button>
              </div>
            </section>

            {/* Course cards grid */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Example course card */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold">Operating Systems</h3>
                  <p className="text-sm text-gray-500">Dr. Ahmed</p>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div className="bg-slate-700 h-2 rounded w-1/3" />
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Progress: 33%
                    </div>
                  </div>
                </div>

                {/* Duplicate cards */}
                <div className="bg-white p-4 rounded-lg shadow">
                  Course Card 2
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  Course Card 3
                </div>
              </div>
            </section>
          </main>

          {/* Right column: profile / badges */}
          <aside className="w-80">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full" />
                  <div>
                    <div className="font-semibold">Noora</div>
                    <div className="text-sm text-gray-500">Student</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Points: <strong>120</strong> • Streak: <strong>5</strong>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold mb-2">Badges</h4>
                <div className="h-24 flex items-center justify-center text-gray-400">
                  Placeholder for badges / frames
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
