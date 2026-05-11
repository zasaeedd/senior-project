import express from "express";
// import { createQuiz, getQuiz, getInstructorSections, submitQuizAttempt } from "../controllers/quizController";
import { createQuiz, getQuiz, getInstructorSections, submitAttempt, startAttempt, viewLeaderboard, usePowerUp } from "../controllers/quizController";

import { jwtAuthenticate } from "../middleware/authMiddleware";

const router = express.Router()

// create a manual quiz by an authenticated instructor
router.post("/creation", jwtAuthenticate, createQuiz);

// retrieve quiz details for student/s
// router.post("/:quizId", jwtAuthenticate, getQuiz);

router.get("/instructor/sections", jwtAuthenticate, getInstructorSections);
router.get("/students/courses/:courseId/quizzes/:quizId", jwtAuthenticate, getQuiz);
// router.post("/students/courses/:courseId/quizzes/:quizId/attempts", jwtAuthenticate, submitQuizAttempt);
router.post("/students/courses/:courseId/quizzes/:quizId/attempts/start", jwtAuthenticate, startAttempt);
router.post("/students/courses/:courseId/quizzes/:quizId/attempts/submit", jwtAuthenticate, submitAttempt);

// for the leaderbaord
router.get(
  "/students/courses/:courseId/quizzes/:quizId/leaderboard",
  jwtAuthenticate,
  viewLeaderboard
);

router.post("/students/courses/:courseId/quizzes/:quizId/usePowerUp",  jwtAuthenticate, usePowerUp );




export default router