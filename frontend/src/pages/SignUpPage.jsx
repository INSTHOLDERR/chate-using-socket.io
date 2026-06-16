import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OTPModal from "../components/OTPModal";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
  });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [tempFormData, setTempFormData] = useState(null);
  const { sendSignupOTP, verifySignup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) { toast.error("Full name is required"); return false; }
    if (!formData.email.trim()) { toast.error("Email is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(formData.email)) { toast.error("Invalid email"); return false; }
    if (!formData.password) { toast.error("Password is required"); return false; }
    if (formData.password.length < 6) { toast.error("Minimum 6 characters"); return false; }
    if (formData.password !== formData.confirmPassword) { toast.error("Passwords do not match"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const success = await sendSignupOTP(formData.email);
    if (success) {
      setTempFormData({ fullName: formData.fullName, email: formData.email, password: formData.password });
      setShowOTPModal(true);
    }
  };

  const handleOTPSubmit = async (otp) => {
    const success = await verifySignup(tempFormData, otp);
    if (success) {
      setShowOTPModal(false);
      navigate("/");
    }
  };

  const handleResend = async () => {
    const success = await sendSignupOTP(formData.email);
    return !!success;
  };

  return (
    <>
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex items-center justify-center px-6 py-10 bg-base-100">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-base-content">Create Account 🚀</h2>
              <p className="text-base-content/60 text-sm mt-1">Join and start chatting instantly</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-base-300 bg-base-100 text-base-content rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 border border-base-300 bg-base-100 text-base-content rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Password</label>
                <input
                  type="password"
                  className="w-full mt-1 border border-base-300 bg-base-100 text-base-content rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Confirm Password</label>
                <input
                  type="password"
                  className="w-full mt-1 border border-base-300 bg-base-100 text-base-content rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                {isSigningUp ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </span>
                ) : "Send OTP & Verify"}
              </button>
            </form>

            <p className="text-sm text-center text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 font-medium">Login</Link>
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
          <div className="text-center text-white px-10">
            <h2 className="text-4xl font-bold mb-4">Join the Community 💬</h2>
            <p className="text-lg opacity-90">Connect, share, and chat with people around the world.</p>
            <img
              src="https://illustrations.popsy.co/white/social-network.svg"
              alt="signup illustration"
              className="mt-10 w-80 mx-auto"
            />
          </div>
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onSubmit={handleOTPSubmit}
        onResend={handleResend}
        email={formData.email}
        title="Verify Your Email"
        submitLabel="Verify & Create Account"
      />
    </>
  );
};

export default SignUpPage;
