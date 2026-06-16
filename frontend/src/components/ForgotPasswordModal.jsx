import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const OTP_DURATION = 3 * 60;  // 3 minutes
const RESEND_COOLDOWN = 60;   // 60s cooldown before resend

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [expired, setExpired] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const [isResending, setIsResending] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const timerRef = useRef(null);
  const cooldownRef = useRef(null);
  const inputRefs = useRef([]);

  const { forgotPassword, verifyResetOTP, resetPassword } = useAuthStore();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1); setEmail(""); setOtp(["", "", "", "", "", ""]);
      setNewPassword(""); setConfirmPassword("");
      setTimeLeft(OTP_DURATION); setExpired(false);
      setResendCooldown(RESEND_COOLDOWN);
      clearInterval(timerRef.current);
      clearInterval(cooldownRef.current);
    }
  }, [isOpen]);

  const startMainTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(OTP_DURATION);
    setExpired(false);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); setExpired(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const startCooldown = () => {
    clearInterval(cooldownRef.current);
    setResendCooldown(RESEND_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // Start timers when entering OTP step
  useEffect(() => {
    if (step === 2) {
      startMainTimer();
      startCooldown();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(cooldownRef.current);
    };
  }, [step]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setIsSendingOTP(true);
    try {
      const success = await forgotPassword(email);
      if (success) setStep(2);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      const success = await forgotPassword(email);
      if (success) {
        setOtp(["", "", "", "", "", ""]);
        startMainTimer();
        startCooldown();
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) { toast.error("Please enter complete OTP"); return; }
    if (expired) { toast.error("OTP expired. Please resend."); return; }
    setIsVerifying(true);
    try {
      const success = await verifyResetOTP(email, otpValue);
      if (success) {
        clearInterval(timerRef.current);
        clearInterval(cooldownRef.current);
        setStep(3);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { toast.error("Please fill all fields"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setIsResetting(true);
    try {
      const success = await resetPassword(newPassword, confirmPassword);
      if (success) onClose();
    } finally {
      setIsResetting(false);
    }
  };

  if (!isOpen) return null;

  const timerColor = timeLeft <= 30 ? "text-red-500" : timeLeft <= 60 ? "text-yellow-500" : "text-green-600";
  const canResend = resendCooldown === 0 && !isResending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full shadow-2xl">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${step > s ? "bg-green-500 text-white" : step === s ? "bg-blue-500 text-white" : "bg-base-200 text-base-content/40"}`}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-green-400" : "bg-base-200"}`} />}
            </div>
          ))}
        </div>

        {/* ── Step 1: Enter Email ── */}
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-base-content">Forgot Password?</h2>
              <p className="text-base-content/60 text-sm mt-1">Enter your email to receive a reset OTP</p>
            </div>
            <form onSubmit={handleSendOTP} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={isSendingOTP}
                className="w-full bg-blue-500 text-white py-2.5 rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingOTP ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </span>
                ) : "Send OTP"}
              </button>
              <button type="button" onClick={onClose}
                className="w-full text-base-content/50 hover:text-base-content py-2 rounded-xl hover:bg-base-200 transition text-sm">
                Cancel
              </button>
            </form>
          </>
        )}

        {/* ── Step 2: Enter OTP ── */}
        {step === 2 && (
          <>
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-base-content">Check Your Email</h2>
              <p className="text-base-content/60 text-sm mt-1">Enter the 6-digit code sent to</p>
              <p className="font-semibold text-blue-500 text-sm">{email}</p>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className={`w-4 h-4 ${timerColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {expired ? (
                <span className="text-red-500 font-semibold text-sm">OTP Expired — please resend</span>
              ) : (
                <span className={`font-mono font-bold text-lg ${timerColor}`}>{formatTime(timeLeft)}</span>
              )}
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
                    className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                      ${expired ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                        : digit ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-base-300 bg-base-100 text-base-content focus:border-blue-400 focus:ring-2 focus:ring-blue-100"}`}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={isVerifying || expired || otp.join("").length !== 6}
                className="w-full bg-blue-500 text-white py-2.5 rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : "Verify OTP"}
              </button>
            </form>

            <div className="mt-3 flex flex-col gap-2 text-center">
              <button
                onClick={handleResendOTP}
                disabled={!canResend}
                className={`text-sm font-medium transition ${
                  canResend ? "text-blue-500 hover:text-blue-600" : "text-base-content/30 cursor-not-allowed"
                }`}
              >
                {isResending ? "Sending..." : resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
              </button>
              <button onClick={() => { clearInterval(timerRef.current); clearInterval(cooldownRef.current); setStep(1); }}
                className="text-sm text-base-content/50 hover:text-base-content py-1 rounded-lg hover:bg-base-200 transition">
                ← Change Email
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Reset Password ── */}
        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-base-content">Set New Password</h2>
              <p className="text-base-content/60 text-sm mt-1">Choose a strong new password</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div className="relative">
                <input
                  type={showNewPwd ? "text" : "password"}
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-400 outline-none"
                  required autoFocus
                />
                <button type="button" onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content">
                  {showNewPwd ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPwd ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content">
                  {showConfirmPwd ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => {
                      const strength = newPassword.length >= 12 ? 4 : newPassword.length >= 8 ? 3 : newPassword.length >= 6 ? 2 : 1;
                      return <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? (strength >= 4 ? "bg-green-500" : strength >= 3 ? "bg-blue-500" : strength >= 2 ? "bg-yellow-500" : "bg-red-400") : "bg-base-200"}`} />;
                    })}
                  </div>
                  <p className="text-xs text-base-content/50">
                    {newPassword.length < 6 ? "Too short" : newPassword.length < 8 ? "Weak" : newPassword.length < 12 ? "Good" : "Strong"}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isResetting}
                className="w-full bg-green-500 text-white py-2.5 rounded-xl hover:bg-green-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </span>
                ) : "Reset Password"}
              </button>
              <button type="button" onClick={onClose}
                className="w-full text-base-content/50 hover:text-base-content py-2 rounded-xl hover:bg-base-200 transition text-sm">
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
