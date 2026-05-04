"use client";

import { useParams } from "next/navigation";
import Quizzes from "@/components/ui/quizzes";

export default function CoursePage() {
  const { courseId } = useParams();
  const courseIdString = Array.isArray(courseId) ? courseId[0] : courseId;

  return (
    <div className="p-6">
            <Quizzes courseId={courseIdString} />
    </div>
  );
}
