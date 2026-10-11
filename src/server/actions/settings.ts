"use server";

import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/guard";
import { settingsSchema, SettingsInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function updateSettingsAction(data: SettingsInput) {
  try {
    await requireAdminSession();
    const validated = settingsSchema.parse(data);

    const updated = await prisma.portfolioSettings.upsert({
      where: { id: "default" },
      update: {
        name: validated.name,
        headline: validated.headline,
        shortBio: validated.shortBio,
        aboutText: validated.aboutText,
        profileImage: validated.profileImage || null,
        resumeUrl: validated.resumeUrl || null,
        email: validated.email,
        contactEmail: validated.contactEmail || null,
        phone: validated.phone || null,
        githubUrl: validated.githubUrl || null,
        linkedinUrl: validated.linkedinUrl || null,
        twitterUrl: validated.twitterUrl || null,
        availableForWork: validated.availableForWork,
      },
      create: {
        id: "default",
        name: validated.name,
        headline: validated.headline,
        shortBio: validated.shortBio,
        aboutText: validated.aboutText,
        profileImage: validated.profileImage || null,
        resumeUrl: validated.resumeUrl || null,
        email: validated.email,
        contactEmail: validated.contactEmail || null,
        phone: validated.phone || null,
        githubUrl: validated.githubUrl || null,
        linkedinUrl: validated.linkedinUrl || null,
        twitterUrl: validated.twitterUrl || null,
        availableForWork: validated.availableForWork,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/about");

    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("updateSettingsAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to update settings") };
  }
}
