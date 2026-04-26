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
  const [selectedSections, setSelectedSections] = React.useState<{sectionId: number; sectionNumber: number}[]>([]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="sticky top-6">
          <ViewCourseInst
            onSelectedCourse={(courseId, sectionId, courseCode,courseName, sections) => {
              setSelectedCourseId(courseId);
              setSelectedSectionId(sectionId);
              setSelectedCourseCode(courseCode);
              setSelectedCourseName(courseName);
              setSelectedSections(sections);
            }}
          />
          <InstructorSidebar />
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-6 space-y-6">
        <InstructorHeader />

        <DashboardCenter
          selectedCourseId={selectedCourseId}
          selectedSectionId={selectedSectionId}
          selectedCourseCode={selectedCourseCode}
          selectedCourseName={selectedCourseName}
          sections={selectedSections}
          onSectionChange={(sectionId) =>setSelectedSectionId(sectionId)}

        />
      </main>

      {/* Right Column */}
      <aside className="w-80">
        <div className="sticky top-6 space-y-4">
          <InstructorProfileCard />
        </div>
      </aside>
    </div>
  );
};

export default InstructorDashboardPage;
