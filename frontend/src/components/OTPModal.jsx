import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const OTP_DURATION = 3 * 60; // 3 minutes in seconds
const RESEND_COOLDOWN = 60;   // 60s before resend is allowed again

const OTPModal = ({
  isOpen,
  onClose,
  onSubmit,
  onResend,
  email,
  title = "Verify Your Email",
  submitLabel = "Verify & Continue",
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [expired, setExpired] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef(null);
  const cooldownRef = useRef(null);
  const inputRefs = useRef([]);

  const { isSigningUp, isLoggingIn } = useAuthStore();
  const isLoading = isSigningUp || isLoggingIn;

  // Reset and start timers whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(OTP_DURATION);
      setExpired(false);
      startMainTimer();
      startCooldown();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      clearInterval(timerRef.current);
      clearInterval(cooldownRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(cooldownRef.current);
    };
  }, [isOpen]);

  const startMainTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(OTP_DURATION);
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

  const startCooldown = () => {
    clearInterval(cooldownRef.current);
    setResendCooldown(RESEND_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    if (expired) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }
    onSubmit(otpValue);
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      const success = await onResend?.();
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

  if (!isOpen) return null;

  const timerColor =
    timeLeft <= 30
      ? "text-red-500"
      : timeLeft <= 60
      ? "text-yellow-500"
      : "text-green-600";

  const canResend = resendCooldown === 0 && !isResending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-base-content">{title}</h2>
          <p className="text-base-content/60 text-sm mt-1">We sent a 6-digit code to</p>
          <p className="font-semibold text-blue-500 text-sm">{email}</p>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-2 mb-5">
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

        {/* OTP Inputs */}
        <form onSubmit={handleSubmit}>
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
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                  ${expired
                    ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : digit
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-base-300 bg-base-100 text-base-content focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  }`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || expired || otp.join("").length !== 6}
            className="w-full bg-blue-500 text-white py-2.5 rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Verifying...
              </span>
            ) : (
              submitLabel
            )}
          </button>
        </form>

        {/* Resend & Cancel */}
        <div className="mt-4 flex flex-col gap-2 text-center">
          {onResend && (
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`text-sm font-medium transition ${
                canResend
                  ? "text-blue-500 hover:text-blue-600"
                  : "text-base-content/30 cursor-not-allowed"
              }`}
            >
              {isResending
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          )}
          <button
            onClick={onClose}
            className="text-sm text-base-content/50 hover:text-base-content transition py-1 rounded-lg hover:bg-base-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
