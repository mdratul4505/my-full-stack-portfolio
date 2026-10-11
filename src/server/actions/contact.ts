"use server";

import prisma from "@/lib/prisma";
import { contactSchema, ContactInput } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/email";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export async function submitContactAction(data: ContactInput): Promise<{
  success: boolean;
  emailSent?: boolean;
  message?: string;
  error?: string;
}> {
  try {
    let ip = "127.0.0.1";
    try {
      const headersList = await headers();
      const forwardedFor = headersList.get("x-forwarded-for");
      if (forwardedFor) {
        ip = forwardedFor.split(",")[0].trim();
      }
    } catch {
      // Graceful fallback if headers context is not present
    }

    // Rate limiting: 5 messages per 10 minutes
    const rateCheck = checkRateLimit(`contact-${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return {
        success: false,
        error: "Too many messages sent recently. Please wait a few minutes before sending another.",
      };
    }

    const validated = contactSchema.parse(data);

    // 1. Store the message in PostgreSQL
    await prisma.contactMessage.create({
      data: {
        name: validated.name,
        email: validated.email,
        subject: validated.subject,
        message: validated.message,
        ipAddress: ip,
      },
    });

    try {
      revalidatePath("/admin/messages");
      revalidatePath("/admin/dashboard");
    } catch {
      // Safe fallback
    }

    // 2. Fetch recipient address from PortfolioSettings
    const settings = await prisma.portfolioSettings.findUnique({
      where: { id: "default" },
    });
    const recipient = settings?.contactEmail || settings?.email || process.env.CONTACT_RECEIVER_EMAIL;

    // 3. Dispatch email notification via server email service
    const emailResult = await sendContactNotification({
      name: validated.name,
      email: validated.email,
      subject: validated.subject,
      message: validated.message,
      recipientEmail: recipient,
    });

    if (!emailResult.success) {
      console.warn("Contact form email notification warning:", emailResult.error);
    }

    return {
      success: true,
      emailSent: emailResult.success,
      message: emailResult.success
        ? "Thank you! Your message has been sent successfully."
        : "Thank you! Your message was received and saved to the inbox successfully.",
    };
  } catch (error: unknown) {
    console.error("submitContactAction error:", error);
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation failed",
      };
    }
    return {
      success: false,
      error: "Unable to submit your message at this time. Please try again later.",
    };
  }
}
