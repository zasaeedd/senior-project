import express from "express";
import { jwtAuthenticate } from "../middleware/authMiddleware";
import { getStudentCourses , getStudentCoursesWithQuizzes} from "../controllers/coursesController";
import { getCourseQuizzes , getCourseProgress, getStudentPerformance, getStudentBadges } from "../controllers/coursesController";


const router = express.Router();

router.get("/students/courses", jwtAuthenticate, getStudentCourses);
router.get("/students/coursesWithQuizzes", jwtAuthenticate,  getStudentCoursesWithQuizzes);

// router.get("/students/courses/:courseId/quizzes", jwtAuthenticate, getCourseQuizzes)
router.get("/students/courses/:courseId", jwtAuthenticate, getCourseQuizzes)
router.get("/students/courses/:courseId/progress", jwtAuthenticate, getCourseProgress)
router.get("/students/performance", jwtAuthenticate, getStudentPerformance)
// router.get("/students/courses/:courseId/performance", jwtAuthenticate, getStudentPerformance)


router.get("/students/badges", jwtAuthenticate, getStudentBadges);


export default router;