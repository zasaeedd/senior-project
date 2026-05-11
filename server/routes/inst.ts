import express from "express";
import { jwtAuthenticate } from "../middleware/authMiddleware";
import { getInstructorCourses,
         getInstructorAnalytics,
         getUngradedAttempts,
         getSectionDetails,
         getAttemptDetails,
         gradeAttempt,
         viewLeaderboardInst,
     } from "../controllers/instructorController";
import { viewLeaderboard } from "../controllers/quizController";
 
const router = express.Router();

// List all courses + sections taught by the instructor
router.get("/courses", jwtAuthenticate, getInstructorCourses);

// a route that returns current course + section details (used in details/page.tsx)
router.get("/section/:id/details", jwtAuthenticate, getSectionDetails );

// A route for getting ungraded written questions (used in pendingQuizzes file)
router.get("/attempts/ungraded", jwtAuthenticate, getUngradedAttempts);


// Get details of a specific attempt
router.get("/attempt/:attemptId", jwtAuthenticate, getAttemptDetails);

//  update the scores with the new scores and recalculate  for the attempts amd maek the attempt as graded.
router.post("/attempt/:attemptId/grade", jwtAuthenticate, gradeAttempt);


// Get analytics for a specific course (not used)
router.get("/courses/:courseId/section/:sectionId/analytics", jwtAuthenticate, getInstructorAnalytics);

router.get("/courses/:courseId/section/:sectionId/leaderBoard", jwtAuthenticate, viewLeaderboardInst);

// // Get performance breakdown for a specific course (not used)
// router.get("/courses/:courseId/performance", jwtAuthenticate, getInstructorCoursePerformance);

export default router;
