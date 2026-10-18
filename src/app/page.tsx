import React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { GlowEffect } from "@/components/portfolio/GlowEffect";
import { Navbar } from "@/components/portfolio/Navbar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { EducationSection } from "@/components/portfolio/EducationSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { Footer } from "@/components/portfolio/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Dynamic database-backed SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.portfolioSettings.findUnique({
    where: { id: "default" },
  });

  const name = settings?.name || "Md. Ratul Hasan";
  const headline = settings?.headline || "Full-Stack Web Developer";
  const bio =
    settings?.shortBio ||
    "Personal portfolio showcasing full-stack web applications, technical skills, and projects.";

  return {
    title: `${name} | ${headline}`,
    description: bio,
    keywords: [
      "Md. Ratul Hasan",
      "Full-Stack Web Developer",
      "React Developer",
      "Next.js Developer",
      "Full-Stack Engineer",
      "PostgreSQL Developer",
      "Satkhira Polytechnic Institute",
      "Portfolio",
    ],
    authors: [{ name }],
    creator: name,
    openGraph: {
      title: `${name} | ${headline}`,
      description: bio,
      type: "website",
      locale: "en_US",
      siteName: `${name} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${headline}`,
      description: bio,
    },
  };
}

export default async function PortfolioHomePage() {
  // Query all database records directly on the server
  const [settings, skills, projects, education] = await Promise.all([
    prisma.portfolioSettings.findUnique({
      where: { id: "default" },
    }),
    prisma.skill.findMany({
      where: { isPublished: true },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    }),
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    }),
    prisma.education.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  const devName = settings?.name || "Md. Ratul Hasan";
  const headline = settings?.headline || "Full-Stack Web Developer";
  const shortBio = settings?.shortBio || "Passionate about building modern, responsive, user-friendly web applications.";
  const aboutText = settings?.aboutText || "";

  return (
    <div className="relative min-h-screen bg-[#111111] text-white selection:bg-[#84CC16]/20 selection:text-[#84CC16]">
      <GlowEffect />

      {/* Public Navbar */}
      <Navbar resumeUrl={settings?.resumeUrl} profileImage={settings?.profileImage} />

      {/* Main Portfolio Sections */}
      <main>
        <HeroSection
          name={devName}
          headline={headline}
          shortBio={shortBio}
          profileImage={settings?.profileImage}
          githubUrl={settings?.githubUrl}
          linkedinUrl={settings?.linkedinUrl}
          email={settings?.email}
        />

        <AboutSection
          aboutText={aboutText}
          name={devName}
          headline={headline}
        />

        <SkillsSection skills={skills} />

        <EducationSection educationList={education} />

        <ProjectsSection projects={projects} />

        <ContactSection email={settings?.email} phone={settings?.phone} name={devName} />
      </main>

      {/* Public Footer */}
      <Footer
        name={devName}
        githubUrl={settings?.githubUrl}
        linkedinUrl={settings?.linkedinUrl}
        email={settings?.email}
      />
    </div>
  );
}
