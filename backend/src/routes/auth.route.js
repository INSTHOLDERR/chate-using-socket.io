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
  googleAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-signup-otp", sendSignupOTP);
router.post("/verify-signup", verifySignupOTP);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.post("/google-auth", googleAuth);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
