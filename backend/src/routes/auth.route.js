import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/signup',signup); 
router.post('/login',login); 
router.post('/logout',logout);

router.put('/update-profile',protectRoute, updateProfile);  //protectRoute middleware checks is use signed in

router.get('/check',protectRoute,checkAuth); //whenever refresh the application

export default router;