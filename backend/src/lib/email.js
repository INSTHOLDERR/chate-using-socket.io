import nodemailer from "nodemailer";

// Create transporter with pooling enabled — reuses SMTP connection
// instead of opening a new TCP connection for every email
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true,          // keep SMTP connection alive between emails
    maxConnections: 5,
    maxMessages: 100,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Explicit timeouts to fail fast rather than hang
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  // Warm up connection immediately when server starts
  transporter.verify((err) => {
    if (err) console.error("SMTP connection error:", err.message);
    else console.log("SMTP server ready");
  });

  return transporter;
};

// Pre-warm on import so the connection is ready before first OTP request
getTransporter();

const sendMail = async (mailOptions) => {
  try {
    await getTransporter().sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error.message);
    return false;
  }
};

export const sendOTPEmail = (email, otp) =>
  sendMail({
    from: `"Chat App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Email Verification</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; background: #f3f4f6; padding: 10px; text-align: center;">${otp}</h1>
        <p style="color: #ef4444; font-weight: bold;">⏱ This OTP is valid for 3 minutes only.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr />
        <p style="color: #6b7280; font-size: 12px;">Chat App - Secure Messaging Platform</p>
      </div>
    `,
  });

export const sendLoginOTPEmail = (email, otp) =>
  sendMail({
    from: `"Chat App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Login Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Login Verification</h2>
        <p>Your OTP to complete login is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; background: #f3f4f6; padding: 10px; text-align: center;">${otp}</h1>
        <p style="color: #ef4444; font-weight: bold;">⏱ This OTP is valid for 3 minutes only.</p>
        <p>If you didn't try to login, please secure your account immediately.</p>
        <hr />
        <p style="color: #6b7280; font-size: 12px;">Chat App - Secure Messaging Platform</p>
      </div>
    `,
  });

export const sendPasswordResetOTP = (email, otp) =>
  sendMail({
    from: `"Chat App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Password Reset Request</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; background: #f3f4f6; padding: 10px; text-align: center;">${otp}</h1>
        <p style="color: #ef4444; font-weight: bold;">⏱ This OTP is valid for 3 minutes only.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr />
        <p style="color: #6b7280; font-size: 12px;">Chat App - Secure Messaging Platform</p>
      </div>
    `,
  });
