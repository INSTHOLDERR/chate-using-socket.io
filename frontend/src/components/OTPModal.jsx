import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const OTP_DURATION = 3 * 60; // 3 minutes in seconds

const OTPModal = ({ isOpen, onClose, onSubmit, onResend, email, title = "Verify Your Email" }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [expired, setExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const { isSigningUp } = useAuthStore();
  const inputRefs = useRef([]);

  // Reset & start timer whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(OTP_DURATION);
      setExpired(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  // Countdown
  useEffect(() => {
    if (!isOpen) return;
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expired) { toast.error("OTP has expired. Please resend."); return; }
    const otpValue = otp.join("");
    if (otpValue.length !== 6) { toast.error("Please enter the complete 6-digit OTP"); return; }
    onSubmit(otpValue);
  };

  const handleResend = async () => {
    if (!onResend) return;
    setResending(true);
    const success = await onResend();
    setResending(false);
    if (success) {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(OTP_DURATION);
      setExpired(false);
      inputRefs.current[0]?.focus();
      toast.success("New OTP sent!");
    }
  };

  if (!isOpen) return null;

  const timerColor = timeLeft <= 30 ? "text-red-500" : timeLeft <= 60 ? "text-orange-500" : "text-blue-500";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-base-100 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-base-content">{title}</h2>
          <p className="text-base-content/60 text-sm mt-1">
            6-digit code sent to <span className="font-medium text-base-content">{email}</span>
          </p>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <svg className={`w-4 h-4 ${timerColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {expired ? (
            <span className="text-red-500 font-semibold text-sm">OTP expired</span>
          ) : (
            <span className={`font-mono font-bold text-lg ${timerColor}`}>{formatTime(timeLeft)}</span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* OTP Inputs */}
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
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
            disabled={isSigningUp || expired}
            className="w-full bg-blue-500 text-white py-2.5 rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningUp ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </span>
            ) : "Verify OTP"}
          </button>
        </form>

        {/* Resend & Cancel */}
        <div className="mt-4 text-center space-y-2">
          {onResend && (
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
          )}
          <button
            onClick={onClose}
            className="text-sm text-base-content/50 hover:text-base-content transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
