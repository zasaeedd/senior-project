import express from "express";
import { createQuiz, getQuiz } from "../controllers/quizController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router()

// create a manual quiz by an authenticated instructor
router.post("/creation", authenticate, createQuiz);

// retrieve quiz details for student/s
// router.post("/:quizId", authenticate, getQuiz);

router.get("/:quizId", authenticate, getQuiz);



export default router