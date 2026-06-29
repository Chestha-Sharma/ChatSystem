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




//hamne abhi frontennd and backend ko alag alag deploy kiya h so frontend and backend are at different domains so it is not possible to send cookies in incognito its browser privacy policy if we wants to use in incog then we have to took both of them at same domain and same side deployement 
//using
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// if(process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
//   });
// }






app.use(cookieParser()); //with this we will be able to access cookies in req.cookies like req.cookies.jwt
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://chatsystem-1-zqf0.onrender.com'
    : 'http://localhost:5173',
  credentials: true,
}));

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