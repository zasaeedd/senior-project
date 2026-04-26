import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getInstructorCourses,
         getInstructorCourseAnalytics,
         getUngradedAttempts,
         getSectionDetails,
         getAttemptDetails,
         gradeAttempt,
     } from "../controllers/instructorController";
 
const router = express.Router();

// List all courses + sections taught by the instructor
router.get("/courses", authenticate, getInstructorCourses);

// a route that returns current course + section details (used in details/page.tsx)
router.get("/section/:id/details", authenticate, getSectionDetails );

// A route for getting ungraded written questions (used in pendingQuizzes file)
router.get("/attempts/ungraded", authenticate, getUngradedAttempts);


// Get details of a specific attempt
router.get("/attempt/:attemptId", authenticate, getAttemptDetails);

//  update the scores with the new scores and recalculate  for the attempts amd maek the attempt as graded.
router.post("/attempt/:attemptId/grade", authenticate, gradeAttempt);


// Get analytics for a specific course (not used)
// router.get("/courses/:courseId/section/:sectionId/analytics", authenticate, getInstructorCourseAnalytics);

// // Get performance breakdown for a specific course (not used)
// router.get("/courses/:courseId/performance", authenticate, getInstructorCoursePerformance);

export default router;
