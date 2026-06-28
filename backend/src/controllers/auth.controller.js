import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// status = delivery boy ko instruction do "yeh urgent hai" (code) 
// send/json = actual parcel do (data)
// Dono saath karte hain — pehle instruction, phir parcel! 📦



export const signup = async (req,res)=>{
    const {fullname , email ,password ,confirmpassword} = req.body;
    try{
        if(!fullname){
            return res.status(400).json({message : "Fullname is required"});
        }
        if(!email){
            return res.status(400).json({message : "Email is required"});
        }
        if(!password){
            return res.status(400).json({message : "Password is required"});
        } 
        if(password !== confirmpassword){
            return res.status(400).json({message : "Password and confirm password should be same"});
        }
       if(password.length<6){
        return res.status(400).json({message : "Password should be atleast 6 characters long"});
       }
       const user = await User.findOne({email});
       if(user){
        return res.status(400).json({message : "Email already exists"});
       }

       const salt = await bcrypt.genSalt(10);
       const hashPassword = await bcrypt.hash(password,salt);
       const newUser = new User({
        fullname,
        email,
        password:hashPassword});
       if(!newUser){
        return res.status(400).json({message : "User creation failed"});
       }
       generateToken(newUser._id,res);
       await newUser.save();
       res.status(201).json({
        _id:newUser._id,
        fullname:newUser.fullname,
        email:newUser.email,
        profilepic:newUser.profilepic
       });
    }
    catch(error){
        console.log("Error in signup controller",error.message);
        res.status(500).json({message : "Internal server error"}); 
        return;
    }
};

export const login = async (req,res)=>{
    const {email,password} = req.body;
   try{
      const user = await User.findOne({email});
      if(!user){
          return res.status(400).json({message : "Invalid credentials"});
      }
      const isPasswordMatch = await bcrypt.compare(password,user.password);
      if(!isPasswordMatch){
          return res.status(400).json({message : "Invalid credentials"});
      }
      generateToken(user._id,res);
      res.status(200).json({
          _id:user._id,
          fullname:user.fullname,
          email:user.email,
          profilepic:user.profilepic
      });
   }
   catch(error){
    console.log("Error in signup controller",error.message);
    return res.status(500).json({message : "Internal server error"});
   }
};

export const logout = (req,res)=>{
    try{
      res.cookie("jwt","",{maxAge:0});
      res.status(200).json({message : "Logged out successfully"});
    }
    catch(error){
      console.log("Error in logout controller",error.message);
      return res.status(500).json({message : "Internal server error"});
    }
};

export const updateProfile = async (req,res)=>{
   try{
     const {profilepic} = req.body;
     const userId = req.user._id;
     if(!profilepic){
       return res.status(400).json({message : "Profile pic is required"});
     }
     const uploadRespose = await cloudinary.uploader.upload(profilepic);
     const updateProfile = await User.findByIdAndUpdate(userId,{profilepic:uploadRespose.secure_url},{new:true});
     res.status(200).json(updateProfile);
   }
   catch(error){
    console.log("Error in update profile controller",error.message);
    return res.status(500).json({message : "Internal server error"});
   }
};

export const checkAuth = (req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        console.log("Error in check auth controller",error.message);
        return res.status(500).json({message : "Internal server error"});
    }
};