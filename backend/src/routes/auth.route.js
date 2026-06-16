import express from "express";
import {
  sendSignupOTP,
  verifySignupOTP,
  login,
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

// ── Signup OTP flow ──────────────────────────────────────
router.post("/send-signup-otp", sendSignupOTP);
router.post("/verify-signup", verifySignupOTP);

// ── Login OTP flow ───────────────────────────────────────
router.post("/login", login);           // validates creds, sends OTP
router.post("/verify-login", verifyLoginOTP); // verifies OTP, issues token

// ── Logout ───────────────────────────────────────────────
router.post("/logout", logout);

// ── Forgot Password flow ─────────────────────────────────
router.post("/forgot-password", forgotPassword);   // confirm email, send OTP
router.post("/verify-reset-otp", verifyResetOTP);  // verify OTP
router.post("/reset-password", resetPassword);     // set new password

// ── Google Auth ──────────────────────────────────────────
router.post("/google-auth", googleAuth);

// ── Profile ──────────────────────────────────────────────
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
