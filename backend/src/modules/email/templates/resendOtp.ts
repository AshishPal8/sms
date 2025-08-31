import { wrapInLayout } from "./shared/layout";

export interface ResendOtpOptions {
  name: string;
  otp: string;
  action: "signup" | "signin";
}

export const resendOtpTemplate = ({ name, otp, action }: ResendOtpOptions) => ({
  subject: `Your ${action === "signup" ? "Signup" : "Sign-In"} OTP (Resent)`,
  html: wrapInLayout(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Here's your new OTP to complete <strong>${action}</strong>:</p>
    <div style="text-align:center;margin:20px 0;">
      <span style="
        font-size:24px;
        font-weight:bold;
        color:#f97316;
        letter-spacing:4px;
        padding:12px 24px;
        border:2px dashed #f97316;
        border-radius:6px;
        display:inline-block;">
        ${otp}
      </span>
    </div>
    <p>This code is valid for <strong>10 minutes</strong>. Do not share it.</p>
    <p>If you didn't request this OTP, you can ignore this email.</p>
  `),
});
