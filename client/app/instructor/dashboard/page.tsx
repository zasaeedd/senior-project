// "use client";

// import React from "react";
// import InstructorSidebar from "@/components/layout/InstructorSidebar";
// import InstructorHeader from "@/components/layout/InstructorHeader";
// import ViewCourseInst from "@/components/layout/ViewCourseInst";
// import InstructorProfileCard from "@/components/ui/InstProfileCard";
// import DashboardCenter from "@/components/layout/DashboardCenter";

// const InstructorDashboardPage: React.FC = () => {
//   const [selectedCourseId, setSelectedCourseId] = React.useState<number | null>(1);
//   const [selectedSectionId, setSelectedSectionId] = React.useState<number | null>(1);
//   const [selectedCourseCode, setSelectedCourseCode] = React.useState<string | null>(null);
//   const [selectedCourseName, setSelectedCourseName] = React.useState<string | null>(null);
//   const [selectedSections, setSelectedSections] = React.useState<{sectionId: number; sectionNumber: number}[]>([]);

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Left Sidebar */}
//       <aside className="w-64 bg-white border-r">
//         <div className="sticky top-6">
//           <ViewCourseInst
//             onSelectedCourse={(courseId, sectionId, courseCode,courseName, sections) => {
//               setSelectedCourseId(courseId);
//               setSelectedSectionId(sectionId);
//               setSelectedCourseCode(courseCode);
//               setSelectedCourseName(courseName);
//               setSelectedSections(sections);
//             }}
//           />
//           <InstructorSidebar />
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="w-3/4 p-6 space-y-6">
//         <InstructorHeader />

//         <DashboardCenter
//           selectedCourseId={selectedCourseId}
//           selectedSectionId={selectedSectionId}
//           selectedCourseCode={selectedCourseCode}
//           selectedCourseName={selectedCourseName}
//           sections={selectedSections}
//           onSectionChange={(sectionId) =>setSelectedSectionId(sectionId)}

//         />
//       </main>

//       {/* Right Column */}
//       <aside className="w-80">
//         <div className="sticky top-6 space-y-4">
//           <InstructorProfileCard />
//         </div>
//       </aside>
//     </div>
//   );
// };

// export default InstructorDashboardPage;
"use client";

import React from "react";
import InstructorSidebar from "@/components/layout/InstructorSidebar";
import InstructorHeader from "@/components/layout/InstructorHeader";
import ViewCourseInst from "@/components/layout/ViewCourseInst";
import InstructorProfileCard from "@/components/ui/InstProfileCard";
import DashboardCenter from "@/components/layout/DashboardCenter";

const InstructorDashboardPage: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = React.useState<number | null>(1);
  const [selectedSectionId, setSelectedSectionId] = React.useState<number | null>(1);
  const [selectedCourseCode, setSelectedCourseCode] = React.useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = React.useState<string | null>(null);

  const [selectedSections, setSelectedSections] = React.useState<
    { sectionId: number; sectionNumber: number }[]
  >([]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800">

      {/* LEFT COLUMN */}
      <aside className="w-72 bg-white border-r border-slate-200">

        <div className="sticky top-0 h-screen flex flex-col">

          {/* Logo */}
          {/* <div className="px-6 py-6 border-b border-slate-100">

            <h1 className="text-2xl font-bold text-slate-800">
              Instructor Dashboard
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage your courses
            </p>

          </div> */}

          {/* Courses */}
          <div className="px-4 pt-5">

            <div className="bg-blue-50 rounded-2xl border border-blue-100">
              <ViewCourseInst
                onSelectedCourse={(
                  courseId,
                  sectionId,
                  courseCode,
                  courseName,
                  sections
                ) => {
                  setSelectedCourseId(courseId);
                  setSelectedSectionId(sectionId);
                  setSelectedCourseCode(courseCode);
                  setSelectedCourseName(courseName);
                  setSelectedSections(sections);
                }}
              />
            </div>

          </div>

          {/* Sidebar */}
          <div className="flex-1 px-4 py-4">

            <div className="bg-slate-50 rounded-2xl border border-slate-200 h-full">
              <InstructorSidebar />
            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-4">
          <InstructorHeader />
        </div>

        {/* Dashboard */}
        <div className="flex gap-6">

          {/* Center */}
          <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm">

            <DashboardCenter
              selectedCourseId={selectedCourseId}
              selectedSectionId={selectedSectionId}
              selectedCourseCode={selectedCourseCode}
              selectedCourseName={selectedCourseName}
              sections={selectedSections}
              onSectionChange={(sectionId) =>
                setSelectedSectionId(sectionId)
              }
            />

          </div>

          {/* Right */}
          <aside className="w-80 space-y-5">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
              <InstructorProfileCard />
            </div>

            <div className="bg-blue-50 rounded-3xl border border-blue-100 p-5">

              <h3 className="font-semibold text-slate-800 mb-4">
                Current Selection
              </h3>

              <div className="space-y-4">

                <div className="bg-white rounded-2xl border border-blue-100 p-4">
                  <p className="text-sm text-slate-500">
                    Active Course
                  </p>

                  <h4 className="text-lg font-bold text-blue-600 mt-1">
                    {selectedCourseCode || "N/A"}
                  </h4>
                </div>

                <div className="bg-white rounded-2xl border border-blue-100 p-4">
                  <p className="text-sm text-slate-500">
                    Selected Section
                  </p>

                  <h4 className="text-lg font-bold text-blue-600 mt-1">
                    {selectedSectionId || "N/A"}
                  </h4>
                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};

export default InstructorDashboardPage;