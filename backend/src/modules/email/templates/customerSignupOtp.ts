import { wrapInLayout } from "./shared/layout";

export interface CustomerSignupOtpOptions {
  name: string;
  otp: string;
}

export const customerSignupOtpTemplate = ({
  name,
  otp,
}: CustomerSignupOtpOptions) => ({
  subject: "Verify your account - OTP Code",
  html: wrapInLayout(`
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for signing up! Please use the OTP below to verify your email:</p>

        <div style="text-align: center; margin: 20px 0;">
            <span style="
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            color: #4A90E2;
            letter-spacing: 4px;
            padding: 12px 24px;
            border: 2px dashed #4A90E2;
            border-radius: 6px;
            ">
            ${otp}
            </span>
        </div>
        <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p>If you didn't sign up, please ignore this email.</p>
    `),
});
