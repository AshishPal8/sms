import { wrapInLayout } from "./shared/layout";

export interface CustomerSigninOtpOptions {
  name: string;
  otp: string;
}

export const customerSigninOtpTemplate = ({
  name,
  otp,
}: CustomerSigninOtpOptions) => ({
  subject: "Your Sign-In OTP Code",

  html: wrapInLayout(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>You requested to <strong>sign in</strong>. Please use the OTP below to complete login:</p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="
        display: inline-block;
        font-size: 24px;
        font-weight: bold;
        color: #16a34a;
        letter-spacing: 4px;
        padding: 12px 24px;
        border: 2px dashed #16a34a;
        border-radius: 6px;
      ">
        ${otp}
      </span>
    </div>
    <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `),
});
