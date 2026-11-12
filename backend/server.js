import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
dotenv.config();
const app=express();
//Middleware
app.use(cors());
app.use(express.json());
app.use("/api/tasks",taskRoutes)
//test route
// app.get("/api/tasks",(req,res)=>{
// res.json("Task Manager API is running");
// });

const PORT=process.env.PORT||5000;
const startServer=async()=>{
await connectDB()
app.listen(PORT,()=>{
console.log(`Server started om http://localhost:${PORT}`)
})
}
startServer();

