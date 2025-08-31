import { wrapInLayout } from "./shared/layout";

export interface TicketCreatedOptions {
  customerName: string;
  ticketTitle: string;
  ticketId: string;
}

export const ticketCreated = ({
  customerName,
  ticketTitle,
  ticketId,
}: TicketCreatedOptions) => ({
  subject: `🎫 Ticket Created: ${ticketTitle}`,
  html: wrapInLayout(`
    <h2>Hi ${customerName},</h2>
    <p>Your support ticket has been created successfully ✅</p>
    <p><strong>Ticket Title:</strong> ${ticketTitle}</p>
    <p><strong>Ticket ID:</strong> ${ticketId}</p>
    <p>Our support team will review it and update you shortly.</p>
    <p style="margin:20px 0;">
      <a href="https://yourdomain.com/profile/${ticketId}" style="
        display:inline-block;
        background:#4A90E2;
        color:#fff;
        padding:12px 20px;
        border-radius:6px;
        text-decoration:none;
        font-weight:bold;
      ">
        View Ticket →
      </a>
    </p>
    <p>Thank you for reaching out to us. We're here to help!</p>
  `),
});
