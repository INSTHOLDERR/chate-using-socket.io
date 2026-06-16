import express from "express";
import {
  sendSignupOTP,
  verifySignupOTP,
  login,
  logout,
  updateProfile,
  checkAuth,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Signup with OTP
router.post("/send-signup-otp", sendSignupOTP);
router.post("/verify-signup", verifySignupOTP);

// Login / Logout
router.post("/login", login);
router.post("/logout", logout);

// Forgot Password
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

// Profile
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
