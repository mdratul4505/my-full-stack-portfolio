import React from "react";
import prisma from "@/lib/prisma";
import { SettingsManagerClient } from "./SettingsManagerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await prisma.portfolioSettings.findUnique({
    where: { id: "default" },
  });

  const safeSettings = {
    name: settings?.name || "Md. Ratul Hasan",
    headline: settings?.headline || "Full-Stack Web Developer",
    shortBio: settings?.shortBio || "",
    aboutText: settings?.aboutText || "",
    profileImage: settings?.profileImage || "",
    resumeUrl: settings?.resumeUrl || "",
    email: settings?.email || "dev.ratul.coder@gmail.com",
    contactEmail: settings?.contactEmail || "",
    phone: settings?.phone || "01985435655",
    githubUrl: settings?.githubUrl || "https://github.com/mdratul4505",
    linkedinUrl: settings?.linkedinUrl || "",
    twitterUrl: settings?.twitterUrl || "",
    availableForWork: settings?.availableForWork ?? true,
  };

  return <SettingsManagerClient initialSettings={safeSettings} />;
}
