import express from "express";
import {
  sendSignupOTP,
  verifySignupOTP,
  sendLoginOTP,
  verifyLoginOTP,
  logout,
  updateProfile,
  checkAuth,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  googleAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Signup with OTP
router.post("/send-signup-otp", sendSignupOTP);
router.post("/verify-signup", verifySignupOTP);

// Login with OTP
router.post("/send-login-otp", sendLoginOTP);
router.post("/verify-login", verifyLoginOTP);

router.post("/logout", logout);

// Forgot Password
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

// Google Auth
router.post("/google-auth", googleAuth);

// Profile
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
