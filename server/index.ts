import "dotenv/config";
import cors from "cors"
import express from "express";
import authRoutes from "./routes/auth";
import quizRoutes from "./routes/quiz"
import studentRoutes from "./routes/info";
import  InstructorRoutes  from "./routes/inst";

const app = express();

// cors configuration to allow requests from frontend
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

// Middleware allows backend to read JSON body
app.use(express.json());

//connect auth routes 
app.use("/api/auth", authRoutes);

app.use("/api/quiz", quizRoutes)

app.use("/api/info", studentRoutes);

app.use("/api/inst", InstructorRoutes);

// starting server 
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});