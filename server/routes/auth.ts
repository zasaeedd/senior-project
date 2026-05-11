import express from "express";
import { login, getCurrentUser } from "../controllers/authController";
import { jwtAuthenticate } from "../middleware/authMiddleware";

const router = express.Router()

// handle user login and create token
router.post("/login",login);

// authenticate user by token then get its user info from the db
router.get("/me", jwtAuthenticate, getCurrentUser);

export default router