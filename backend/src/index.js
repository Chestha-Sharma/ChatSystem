import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import massageRoutes from "./routes/massage.route.js";
import cors from "cors"; //backend and frontend are working at different ports so it is used to fix that error bcz generaly it is not allowed according to browser safety policy
import { app , server , io } from "./lib/socket.js";


dotenv.config(); 
 

const PORT = process.env.PORT;


app.use(cookieParser()); //with this we will be able to access cookies in req.cookies like req.cookies.jwt
app.use(cors({
    origin:import.meta.env.NODE_ENV === 'development' ?
                 'http://localhost:5001/api'
                 : 'https://chatsystem-n8qp.onrender.com/api', //backend saying 5173 is allowed to come from frontend
    credentials:true, //it allows cookies
}
));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


//cookie vs backend

// const token = localStorage.getItem('token')
// axios.get('/api/check', {
//   headers: { Authorization: `Bearer ${token}` } // ← khud daalna padta
// })

// // Cookie — automatic!
// axios.get('/api/check')
// // bas itna — cookie khud jaayegi browser se 


app.use('/api/auth',authRoutes);
app.use('/api/messages',massageRoutes);

server.listen(PORT,()=>{
console.log(`Server is running on port ${PORT}`);
connectDB();
});