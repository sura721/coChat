import express from "express";
import { deleteAccount, login, logout, resendOTP, signup, updateProfile,verifyOTP } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post('/signup',signup)
router.post('/verify',verifyOTP)
router.post('/resend-otp',resendOTP)
router.post('/delete-account',deleteAccount)
router.post('/login',login)
router.post('/logout',logout)
router.put('/update-profile',protectRoute,updateProfile)


export default router;