import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from '../prisma/prisma.config';
import { generateToken } from "../utils/jwt";




export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
const instructorId = (req.user as { id: number }).id;

    const sections = await prisma.section.findMany({
      where: { instructorID: instructorId },
      include: {
        course: true
      }
    });

    // Transform into course list with sections
    const courses = sections.map(sec => ({
      courseId: sec.course.id,
      courseCode: sec.course.crs_code,
      courseName: sec.course.crs_name,
      sectionId: sec.id,
      sectionNumber: sec.sectionNumber
    }));

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch instructor courses" });
  }
};




// export const getInstructorCourseAnalytics = async (req: Request, res: Response) => {
//   const { courseId } = req.params;
//   try {
//     // Example: average score, completion rate, top performer
//     const analytics = await analyticsService.getCourseAnalytics(Number(courseId));
//     res.json(analytics);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch course analytics" });
//   }
// };







// export const getInstructorCoursePerformance = async (req: Request, res: Response) => {
//   const { courseId } = req.params;
//   try {
//     const performance = await analyticsService.getCoursePerformance(Number(courseId));
//     res.json(performance);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch course performance" });
//   }
// };
