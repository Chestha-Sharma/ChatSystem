import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import massageRoutes from "./routes/massage.route.js";
import cors from "cors"; //backend and frontend are working at different ports so it is used to fix that error bcz generaly it is not allowed according to browser safety policy

dotenv.config(); 

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser()); //with this we will be able to access cookies in req.cookies like req.cookies.jwt
app.use(cors({
    origin:'http://localhost:5173', //backedn saying 5173 is allowed to come from frontend
    Credentials:true, //it allows cookies
}
));


//cookie vs backend

// const token = localStorage.getItem('token')
// axios.get('/api/check', {
//   headers: { Authorization: `Bearer ${token}` } // ← khud daalna padta
// })

// // Cookie — automatic!
// axios.get('/api/check')
// // bas itna — cookie khud jaayegi browser se ✅


app.use('/api/auth',authRoutes);
app.use('/api/massage',massageRoutes);

app.listen(PORT,()=>{
console.log(`Server is running on port ${PORT}`);
connectDB();
});