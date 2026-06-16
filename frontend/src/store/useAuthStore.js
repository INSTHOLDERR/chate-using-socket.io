import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  otpSent: false,
  otpVerified: false,
  resetEmail: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Send OTP for signup
  sendSignupOTP: async (email) => {
    try {
      const response = await axiosInstance.post("/auth/send-signup-otp", { email });
      if (response.data.message) {
        toast.success("OTP sent to your email");
        set({ otpSent: true });
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      return false;
    }
  },

  // Verify OTP and complete signup
  verifySignup: async (formData, otp) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/verify-signup", {
        ...formData,
        otp,
      });
      set({ authUser: response.data, otpVerified: true });
      toast.success("Account created successfully");
      get().connectSocket();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },


  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Forgot Password - Send OTP
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Reset OTP sent to your email");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset OTP");
      return false;
    }
  },

  // Verify Reset OTP
  verifyResetOTP: async (email, otp) => {
    try {
      const response = await axiosInstance.post("/auth/verify-reset-otp", { email, otp });
      toast.success("OTP verified");
      set({ resetEmail: email });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      return false;
    }
  },

  // Reset Password
  resetPassword: async (newPassword, confirmPassword) => {
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        email: get().resetEmail,
        newPassword,
        confirmPassword,
      });
      toast.success("Password reset successfully");
      set({ resetEmail: null });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
      return false;
    }
  },

  // Google Authentication
  googleAuth: async (credential) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/google-auth", { credential });
      set({ authUser: response.data });
      toast.success("Google login successful");
      get().connectSocket();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Google authentication failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  
  resetOTPStates: () => {
    set({ otpSent: false, otpVerified: false, resetEmail: null });
  },
}));