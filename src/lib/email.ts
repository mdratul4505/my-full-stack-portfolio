import { Resend } from "resend";
import nodemailer from "nodemailer";

export interface SendContactNotificationParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  recipientEmail?: string | null;
}

export async function sendContactNotification(
  params: SendContactNotificationParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const recipient =
    params.recipientEmail ||
    process.env.CONTACT_RECEIVER_EMAIL ||
    "dev.ratul.coder@gmail.com";

  const emailSubject = `[Portfolio Message] ${params.subject} - from ${params.name}`;

  const emailText = `New Message from Portfolio Contact Form:

Name: ${params.name}
Email: ${params.email}
Subject: ${params.subject}

Message:
${params.message}

---
Sent via Md. Ratul Hasan's Full-Stack Portfolio`;

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #111111; color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #303030; max-width: 600px; margin: 0 auto;">
      <div style="border-bottom: 1px solid #303030; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="color: #84CC16; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">New Portfolio Inquiry</span>
        <h2 style="color: #ffffff; margin: 8px 0 0 0; font-size: 20px;">${params.subject}</h2>
      </div>

      <div style="margin-bottom: 20px; font-size: 14px; line-height: 1.6;">
        <p style="margin: 4px 0;"><strong style="color: #A3A3A3;">Sender Name:</strong> <span style="color: #ffffff;">${params.name}</span></p>
        <p style="margin: 4px 0;"><strong style="color: #A3A3A3;">Sender Email:</strong> <a href="mailto:${params.email}" style="color: #84CC16; text-decoration: none;">${params.email}</a></p>
      </div>

      <div style="background-color: #1A1A1A; padding: 18px; border-radius: 8px; border: 1px solid #303030; color: #f5f5f5; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-bottom: 24px;">
${params.message}
      </div>

      <div style="border-top: 1px solid #303030; padding-top: 16px; font-size: 12px; color: #737373; font-family: monospace;">
        <p style="margin: 0;">Sent directly from Md. Ratul Hasan's Portfolio Website to <strong>${recipient}</strong>.</p>
        <p style="margin: 4px 0 0 0;">Reply directly to this email to respond to ${params.name} (${params.email}).</p>
      </div>
    </div>
  `;

  // 1. Check for Gmail / Custom SMTP credentials
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass.replace(/\s+/g, ""), // Remove any spaces in app passwords
        },
      });

      const info = await transporter.sendMail({
        from: `"${params.name} via Portfolio" <${smtpUser}>`,
        to: recipient,
        replyTo: params.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });

      console.log("Email dispatched via Gmail SMTP successfully. ID:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (smtpErr: unknown) {
      console.error("Gmail SMTP error:", smtpErr);
      const errMessage = smtpErr instanceof Error ? smtpErr.message : "SMTP sending failed";
      // Fall through to try Resend if configured
      if (!process.env.RESEND_API_KEY) {
        return { success: false, error: errMessage };
      }
    }
  }

  // 2. Check for Resend API Key
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey.trim() !== "") {
    try {
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: recipient,
        replyTo: params.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Failed to send email via Resend",
        };
      }

      console.log("Email dispatched via Resend successfully. ID:", data?.id);
      return { success: true, messageId: data?.id };
    } catch (resendErr: unknown) {
      console.error("Resend error:", resendErr);
      const errMessage = resendErr instanceof Error ? resendErr.message : "Resend sending failed";
      return { success: false, error: errMessage };
    }
  }

  // If neither provider is configured:
  return {
    success: false,
    error:
      "No email provider credentials found. Configure either GMAIL_APP_PASSWORD or RESEND_API_KEY in .env to receive notifications.",
  };
}
