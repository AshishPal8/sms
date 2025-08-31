import { wrapInLayout } from "./shared/layout";

export interface WelcomeCustomerOptions {
  name: string;
}

export const welcomeCustomerTemplate = ({ name }: WelcomeCustomerOptions) => ({
  subject: "Welcome to SMS Platform 🎉",
  html: wrapInLayout(`
    <h2>Hi ${name},</h2>
    <p>🎉 Thank you for registering with us!</p>
    <p>You can now create tickets, track their progress, and get support easily through our platform.</p>
    <p style="margin:20px 0;">
      <a href="https://yourdomain.com" style="
        display:inline-block;
        background:#4A90E2;
        color:#fff;
        padding:12px 20px;
        border-radius:6px;
        text-decoration:none;
        font-weight:bold;
      ">
        Get Started →
      </a>
    </p>
    <p>We’re excited to have you on board!</p>
  `),
});
