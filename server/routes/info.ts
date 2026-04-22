import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getStudentCourses , getStudentCoursesWithQuizzes} from "../controllers/coursesController";
import { getCourseQuizzes , getCourseProgress, getStudentPerformance } from "../controllers/coursesController";


const router = express.Router();

router.get("/students/courses", authenticate, getStudentCourses);
router.get("/students/coursesWithQuizzes", authenticate,  getStudentCoursesWithQuizzes);

// router.get("/students/courses/:courseId/quizzes", authenticate, getCourseQuizzes)
router.get("/students/courses/:courseId", authenticate, getCourseQuizzes)
router.get("/students/courses/:courseId/progress", authenticate, getCourseProgress)
router.get("/students/performance", authenticate, getStudentPerformance)
// router.get("/students/courses/:courseId/performance", authenticate, getStudentPerformance)


export default router;