import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import massageRoutes from "./routes/massage.route.js";
import cors from "cors";  
import { app , server , io } from "./lib/socket.js";


dotenv.config(); 
 

const PORT = process.env.PORT;


 



app.use(cookieParser()); //with this we will be able to access cookies in req.cookies like req.cookies.jwt
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://chatsystem-n8qp.onrender.com'
    : 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
 
app.use('/api/auth',authRoutes);
app.use('/api/messages',massageRoutes);

server.listen(PORT,()=>{
console.log(`Server is running on port ${PORT}`);
connectDB();
});