import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, isLoggingIn, googleAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    await login(formData);
  };

  const handleGoogleSuccess = async (response) => {
    const success = await googleAuth(response.credential);
    if (success) {
   
      setTimeout(() => {
        navigate("/");
      }, 100);
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
    toast.error("Google login failed. Please try again.");
  };

  return (
    <>
      <div className="min-h-screen grid lg:grid-cols-2">

        <div className="flex items-center justify-center px-6 py-10 bg-white">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome Back 👋
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Login to continue chatting
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-500 hover:text-blue-600 transition"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                shape="rectangular"
                text="continue_with"
              />
            </div>

            <p className="text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 font-medium hover:text-blue-600 transition">
                Signup
              </Link>
            </p>
          </div>
        </div>

  
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
          <div className="text-center text-white px-10">
            <h2 className="text-4xl font-bold mb-4">
              Stay Connected 💬
            </h2>
            <p className="text-lg opacity-90">
              Chat in real-time, share moments, and connect with people instantly.
            </p>
            <img
              src="https://illustrations.popsy.co/white/chat.svg"
              alt="chat illustration"
              className="mt-10 w-80 mx-auto"
            />
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default LoginPage;