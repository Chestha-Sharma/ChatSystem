import { text } from "express";
import mongoose from "mongoose";


const massageSchema = new mongoose.Schema(
    {
        senderId:{
            type : String,
            ref : "User",
            required:true
        },
        receiverId :{
            tyoe : String,
            ref:"User",
            required:true
        },
        text:{
            type : String, 
        },
        image:{
            type : String
        },
    },
    {
        timestamps:true
    }
);

const Massage = mongoose.model("Massage",massageSchema);

export default Massage;