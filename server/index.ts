import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth";


const app = express();

// Middleware allows backend to read JSON body
app.use(express.json());

//connect auth routes 
app.use("/api/auth", authRoutes);

// starting server 
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});