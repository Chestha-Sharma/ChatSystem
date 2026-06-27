import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req,res,next)=>{
    try{
     const token = req.cookies.jwt;
     if(!token){
        return res.status(401).json({message : "Unauthorized-No token found"});
     }
     const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
     if(!decoded){
        return res.status(401).json({message : "Unauthorized-Invalid token"});
     }
     const user = await User.findOne({_id:decoded._id}).select("-password"); // ya user = await User.findById(decoded._id);
     if(!user){
        return res.status(401).json({message : "Unauthorized-Invalid token"});
     }
     req.user = user;
     next();
    }
    catch(error){
        console.log("Error in protect route middleware",error.message);
        return res.status(500).json({message : "Internal server error"});
    }
};