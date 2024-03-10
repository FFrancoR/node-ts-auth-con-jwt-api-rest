import dotenv from "dotenv";
import express from "express"
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
dotenv.config()
const app = express();

app.use(express.json())

//Routes
//1)Auth
app.use("/auth", authRoutes)
//2)Users
app.use("/users", userRoutes)
   console.log("Server up")
export default app