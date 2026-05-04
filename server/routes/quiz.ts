import express from "express";
// import { createQuiz, getQuiz, getInstructorSections, submitQuizAttempt } from "../controllers/quizController";
import { createQuiz, getQuiz, getInstructorSections, submitAttempt, startAttempt, viewLeaderboard, usePowerUp } from "../controllers/quizController";

import { authenticate } from "../middleware/authMiddleware";

const router = express.Router()

// create a manual quiz by an authenticated instructor
router.post("/creation", authenticate, createQuiz);

// retrieve quiz details for student/s
// router.post("/:quizId", authenticate, getQuiz);

router.get("/instructor/sections", authenticate, getInstructorSections);
router.get("/students/courses/:courseId/quizzes/:quizId", authenticate, getQuiz);
// router.post("/students/courses/:courseId/quizzes/:quizId/attempts", authenticate, submitQuizAttempt);
router.post("/students/courses/:courseId/quizzes/:quizId/attempts/start", authenticate, startAttempt);
router.post("/students/courses/:courseId/quizzes/:quizId/attempts/submit", authenticate, submitAttempt);

// for the leaderbaord
router.get(
  "/students/courses/:courseId/quizzes/:quizId/leaderboard",
  authenticate,
  viewLeaderboard
);

router.post("/students/courses/:courseId/quizzes/:quizId/usePowerUp",  authenticate, usePowerUp );



export default router