import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const TIMER_SECONDS = 180; // 3 minutes

const OTPModal = ({ isOpen, onClose, onSubmit, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [expired, setExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const timerRef = useRef(null);
  const { isSigningUp, sendSignupOTP } = useAuthStore();

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
    setExpired(false);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!isOpen) return;
    setOtp(["", "", "", "", "", ""]);
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [isOpen]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const newOtp = [...otp];
      pasted.split("").forEach((ch, i) => { newOtp[i] = ch; });
      setOtp(newOtp);
      document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
    }
  };

  const handleResend = async () => {
    setResending(true);
    const success = await sendSignupOTP(email);
    setResending(false);
    if (success) {
      setOtp(["", "", "", "", "", ""]);
      startTimer();
      document.getElementById("otp-0")?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expired) { toast.error("OTP has expired. Please resend."); return; }
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      onSubmit(otpValue);
    } else {
      toast.error("Please enter the complete 6-digit OTP");
    }
  };

  if (!isOpen) return null;

  const timerColor = timeLeft <= 30 ? "text-red-500" : timeLeft <= 60 ? "text-orange-500" : "text-blue-500";
  const barColor = timeLeft <= 30 ? "bg-red-500" : timeLeft <= 60 ? "bg-orange-500" : "bg-blue-500";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
          <p className="text-gray-500 text-sm mt-1">
            We sent a 6-digit code to<br />
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg className={`w-4 h-4 ${timerColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {expired ? (
            <span className="text-red-500 font-semibold text-sm">OTP expired</span>
          ) : (
            <span className={`font-mono font-bold text-lg ${timerColor}`}>{formatTime(timeLeft)}</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
          <div
            className={`h-1.5 rounded-full transition-all duration-1000 ${barColor}`}
            style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {/* OTP inputs */}
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={expired}
                className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                  ${expired
                    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : digit
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 focus:border-blue-500 text-gray-800"
                  }`}
              />
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSigningUp || expired || otp.join("").length < 6}
            className="w-full bg-blue-500 text-white py-2.5 rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningUp ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </span>
            ) : "Verify & Create Account"}
          </button>
        </form>

        {/* Resend */}
        <div className="text-center mt-4">
          <span className="text-gray-500 text-sm">Didn't receive the code? </span>
          <button
            onClick={handleResend}
            disabled={resending || (!expired && timeLeft > 0)}
            className={`text-sm font-medium transition ${
              expired || timeLeft === 0
                ? "text-blue-500 hover:text-blue-600 cursor-pointer"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            {resending ? "Sending..." : expired ? "Resend OTP" : `Resend in ${formatTime(timeLeft)}`}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 text-gray-500 py-2 rounded-xl hover:bg-gray-100 transition text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
