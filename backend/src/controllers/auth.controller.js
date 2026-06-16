import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import OTP from "../models/otp.model.js";
import { sendOTPEmail, sendLoginOTPEmail, sendPasswordResetOTP } from "../lib/email.js";
import crypto from "crypto";

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// SIGNUP 

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ fullName, email, password: hashedPassword });
    if (!newUser) return res.status(400).json({ message: "Invalid user data" });

    generateToken(newUser._id, res);
    await newUser.save();
    return res.status(201).json({
      _id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Send OTP for signup
export const sendSignupOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const otp = generateOTP();
    await OTP.deleteMany({ email, purpose: "signup" });
    await OTP.create({ email, otp, purpose: "signup" });

    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) return res.status(500).json({ message: "Failed to send OTP email" });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("Error in sendSignupOTP:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify OTP signup
export const verifySignupOTP = async (req, res) => {
  try {
    const { fullName, email, password, otp } = req.body;
    if (!fullName || !email || !password || !otp)
      return res.status(400).json({ message: "All fields are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const otpRecord = await OTP.findOne({
      email, otp, purpose: "signup",
      expiresAt: { $gt: new Date() },
    });
    if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    await OTP.deleteOne({ _id: otpRecord._id });
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in verifySignupOTP:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGIN 

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Credentials valid — now send OTP
    const otp = generateOTP();
    await OTP.deleteMany({ email, purpose: "login" });
    await OTP.create({ email, otp, purpose: "login" });

    const emailSent = await sendLoginOTPEmail(email, otp);
    if (!emailSent) return res.status(500).json({ message: "Failed to send OTP email" });

    res.status(200).json({ message: "OTP sent to your email", email });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const otpRecord = await OTP.findOne({
      email, otp, purpose: "login",
      expiresAt: { $gt: new Date() },
    });
    if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    await OTP.deleteOne({ _id: otpRecord._id });
    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id, fullName: user.fullName, email: user.email, profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in verifyLoginOTP:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// LOGOUT


export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// FORGOT PASSWORD



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found with this email" });

    const otp = generateOTP();
    await OTP.deleteMany({ email, purpose: "reset_password" });
    await OTP.create({ email, otp, purpose: "reset_password" });

    const emailSent = await sendPasswordResetOTP(email, otp);
    if (!emailSent) return res.status(500).json({ message: "Failed to send OTP email" });

    res.status(200).json({ message: "Password reset OTP sent successfully" });
  } catch (error) {
    console.log("Error in forgotPassword:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify reset OTP
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const otpRecord = await OTP.findOne({
      email, otp, purpose: "reset_password",
      expiresAt: { $gt: new Date() },
    });
    if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

    res.status(200).json({ message: "OTP verified successfully", email });
  } catch (error) {
    console.log("Error in verifyResetOTP:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });
    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });
    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    await OTP.deleteMany({ email });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Error in resetPassword:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// PROFILE


export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile image is required" });

    const uploadResponse = await cloudinary.uploader.upload(profilePic, { folder: "profile_pics" });
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Update profile error:", error);
    return res.status(500).json({ message: "Image upload failed" });
  }
};

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// GOOGLE AUTH

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    const { OAuth2Client } = await import("google-auth-library");
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        fullName: name,
        email,
        password: crypto.randomBytes(20).toString("hex"),
        profilePic: picture || "",
        googleId,
      });
      await user.save();
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id, fullName: user.fullName, email: user.email, profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in googleAuth:", error.message);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
