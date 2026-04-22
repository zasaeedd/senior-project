import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getInstructorCourses } from "../controllers/instructorController";

const router = express.Router();

// Get all courses taught by the instructor
router.get("/courses", authenticate, getInstructorCourses);

// // Get analytics for a specific course
// router.get("/courses/:courseId/analytics", authenticate, getInstructorCourseAnalytics);

// // Get performance breakdown for a specific course
// router.get("/courses/:courseId/performance", authenticate, getInstructorCoursePerformance);

export default router;
