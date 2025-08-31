import nodemailer from "nodemailer";
import { emailConfig } from "../../utils/email.config";
import * as EmailTemplates from "./templates";

const transporter = nodemailer.createTransport({
  host: emailConfig.smtpHost,
  port: emailConfig.smtpPort,
  secure: emailConfig.smtpPort === 465,
  auth: {
    user: emailConfig.smtpUser,
    pass: emailConfig.smtpPass,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private async sendEmail(options: EmailOptions) {
    try {
      const info = await transporter.sendMail({
        from: emailConfig.fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`✅Email sent: ${info.messageId}`);
    } catch (error: any) {
      console.error("❌ Email send failed:", error.message);
      throw new Error("Email send failed");
    }
  }

  //customer signup mail
  async sendCustomerSignupOtpMail(
    to: string,
    options: EmailTemplates.CustomerSignupOtpOptions
  ) {
    const { subject, html } = EmailTemplates.customerSignupOtpTemplate(options);
    await this.sendEmail({ to, subject, html });
  }

  //customer signin mail
  async sendCustomerSigninOtpMail(
    to: string,
    options: EmailTemplates.CustomerSigninOtpOptions
  ) {
    const { subject, html } = EmailTemplates.customerSigninOtpTemplate(options);
    await this.sendEmail({ to, subject, html });
  }

  // customer resend signin, signup mail
  async sendResendOtpMail(
    to: string,
    options: EmailTemplates.ResendOtpOptions
  ) {
    const { subject, html } = EmailTemplates.resendOtpTemplate(options);
    await this.sendEmail({ to, subject, html });
  }

  //welcome customer mail
  async sendWelcomeCustomerMail(
    to: string,
    options: EmailTemplates.WelcomeCustomerOptions
  ) {
    const { subject, html } = EmailTemplates.welcomeCustomerTemplate(options);
    await this.sendEmail({ to, subject, html });
  }

  //create ticket mail
  async sendTicketCreatedMail(
    to: string,
    options: EmailTemplates.TicketCreatedOptions
  ) {
    const { subject, html } = EmailTemplates.ticketCreated(options);
    await this.sendEmail({ to, subject, html });
  }
}

export const emailService = new EmailService();
