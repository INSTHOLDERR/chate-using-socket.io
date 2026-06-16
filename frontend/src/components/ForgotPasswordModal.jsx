import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const OTP_DURATION = 3 * 60;

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [expired, setExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const inputRefs = useRef([]);
  const { forgotPassword, verifyResetOTP, resetPassword } = useAuthStore();

  // Timer — only runs on step 2
  useEffect(() => {
    if (step !== 2) return;
    setTimeLeft(OTP_DURATION);
    setExpired(false);
  }, [step]);

  useEffect(() => {
    if (step !== 2 || expired) return;
    if (timeLeft <= 0) { setExpired(true); return; }
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [step, timeLeft, expired]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const resetAll = () => {
    setStep(1); setEmail(""); setOtp(["", "", "", "", "", ""]);
    setNewPassword(""); setConfirmPassword("");
    setTimeLeft(OTP_DURATION); setExpired(false);
  };

  // OTP input helpers
  const handleOTPChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((c, i) => { newOtp[i] = c; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // Step handlers
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    const success = await forgotPassword(email);
    if (success) setStep(2);
  };

  const handleResend = async () => {
    setResending(true);
    const success = await forgotPassword(email);
    setResending(false);
    if (success) {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(OTP_DURATION);
      setExpired(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      toast.success("New OTP sent!");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (expired) { toast.error("OTP expired. Please resend."); return; }
    const otpValue = otp.join("");
    if (otpValue.length !== 6) { toast.error("Please enter complete OTP"); return; }
    const success = await verifyResetOTP(email, otpValue);
    if (success) setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    const success = await resetPassword(newPassword, confirmPassword);
    if (success) { onClose(); resetAll(); }
  };

  if (!isOpen) return null;

  const timerColor = timeLeft <= 30 ? "text-red-500" : timeLeft <= 60 ? "text-orange-500" : "text-blue-500";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-base-100 rounded-2xl p-8 max-w-sm w-full shadow-2xl">

        {/* Step 1 – Email */}
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-base-content">Forgot Password?</h2>
              <p className="text-base-content/60 text-sm mt-1">Enter your email to receive a reset OTP</p>
            </div>
            <form onSubmit={handleSendOTP} className="space-y-4">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                required
              />
              <button type="submit" className="w-full bg-blue-500 text-white py-2.5 rounded-xl hover:bg-blue-600 transition font-medium">
                Send OTP
              </button>
              <button type="button" onClick={() => { onClose(); resetAll(); }} className="w-full text-base-content/50 py-2 hover:text-base-content transition text-sm">
                Cancel
              </button>
            </form>
          </>
        )}

        {/* Step 2 – OTP */}
        {step === 2 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-base-content">Enter OTP</h2>
              <p className="text-base-content/60 text-sm mt-1">
                Code sent to <span className="font-medium text-base-content">{email}</span>
              </p>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <svg className={`w-4 h-4 ${timerColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {expired
                ? <span className="text-red-500 font-semibold text-sm">OTP expired</span>
                : <span className={`font-mono font-bold text-lg ${timerColor}`}>{formatTime(timeLeft)}</span>
              }
            </div>

            <form onSubmit={handleVerifyOTP}>
              <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    disabled={expired}
                    className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                      ${digit ? "border-blue-500 bg-blue-50 text-blue-600" : "border-base-300 bg-base-100"}
                      ${expired ? "opacity-40 cursor-not-allowed" : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}
                    `}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={expired}
                className="w-full bg-blue-500 text-white py-2.5 rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify OTP
              </button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <p className="text-sm text-base-content/60">
                Didn't receive it?{" "}
                <button
                  onClick={handleResend}
                  disabled={resending || (!expired && timeLeft > 0)}
                  className="text-blue-500 font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              </p>
              <button onClick={() => setStep(1)} className="text-sm text-base-content/50 hover:text-base-content transition">
                ← Back
              </button>
            </div>
          </>
        )}

        {/* Step 3 – New Password */}
        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-base-content">Reset Password</h2>
              <p className="text-base-content/60 text-sm mt-1">Create your new password</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border-2 border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-2.5 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  required
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content">
                  {showNew ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-2 border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-2.5 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content">
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-xs">Passwords do not match</p>
              )}
              <button type="submit" className="w-full bg-green-500 text-white py-2.5 rounded-xl hover:bg-green-600 transition font-medium mt-2">
                Reset Password
              </button>
              <button type="button" onClick={() => { onClose(); resetAll(); }} className="w-full text-base-content/50 py-2 hover:text-base-content transition text-sm">
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
