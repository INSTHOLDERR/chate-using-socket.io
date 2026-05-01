import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { forgotPassword, verifyResetOTP, resetPassword } = useAuthStore();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    const success = await forgotPassword(email);
    if (success) {
      setStep(2);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }
    const success = await verifyResetOTP(email, otpValue);
    if (success) {
      setStep(3);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const success = await resetPassword(newPassword, confirmPassword);
    if (success) {
      onClose();
      setStep(1);
      setEmail("");
      setOtp(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
            <p className="text-gray-600 mb-4">
              Enter your email to receive a password reset OTP
            </p>
            <form onSubmit={handleSendOTP}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Send OTP
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full mt-3 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
            <p className="text-gray-600 mb-4">
              Enter the 6-digit code sent to {email}
            </p>
            <form onSubmit={handleVerifyOTP}>
              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`reset-otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-2xl border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mt-3 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Back
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
            <p className="text-gray-600 mb-4">
              Enter your new password
            </p>
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full mt-3 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;