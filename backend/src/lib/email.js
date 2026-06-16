import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const otpEmailTemplate = (title, subtitle, otp, color = "#3b82f6") => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 30px; border-radius: 12px;">
    <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">
      <h2 style="color: ${color}; margin-top: 0;">${title}</h2>
      <p style="color: #374151;">${subtitle}</p>
      <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #111827;">${otp}</span>
      </div>
      <p style="color: #6b7280; font-size: 14px;">⏰ This OTP expires in <strong>3 minutes</strong>.</p>
      <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">Chat App – Secure Messaging Platform</p>
  </div>
`;

export const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Chat App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification OTP",
      html: otpEmailTemplate(
        "Email Verification",
        "Your OTP for email verification is:",
        otp,
        "#6366f1"
      ),
    });
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

export const sendLoginOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Chat App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Login Verification OTP",
      html: otpEmailTemplate(
        "Login Verification",
        "Your OTP for login is:",
        otp,
        "#3b82f6"
      ),
    });
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

export const sendPasswordResetOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Chat App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: otpEmailTemplate(
        "Password Reset Request",
        "Your OTP for password reset is:",
        otp,
        "#ef4444"
      ),
    });
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};
