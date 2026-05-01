import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const OTPModal = ({ isOpen, onClose, onSubmit, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { isSigningUp } = useAuthStore();

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      onSubmit(otpValue);
    } else {
      toast.error("Please enter complete OTP");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-4">
          Enter the 6-digit code sent to {email}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center text-2xl border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isSigningUp ? "Verifying..." : "Verify & Create Account"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-3 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPModal;