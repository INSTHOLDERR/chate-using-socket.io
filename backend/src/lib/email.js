import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Chat App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; background: #f3f4f6; padding: 10px; text-align: center;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr />
          <p style="color: #6b7280; font-size: 12px;">Chat App - Secure Messaging Platform</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

export const sendPasswordResetOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Chat App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Password Reset Request</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; background: #f3f4f6; padding: 10px; text-align: center;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr />
          <p style="color: #6b7280; font-size: 12px;">Chat App - Secure Messaging Platform</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};