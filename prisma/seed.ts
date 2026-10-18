import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed or Update Portfolio Settings
  await prisma.portfolioSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Md. Ratul Hasan",
      headline: "Frontend Developer & Aspiring Full-Stack Engineer",
      shortBio:
        "Passionate about building modern, responsive, and user-friendly web applications with clean architecture and intuitive user experiences.",
      aboutText:
        "I am a dedicated Frontend Developer and Aspiring Full-Stack Engineer currently studying Computer Science & Technology (CST) at Satkhira Polytechnic Institute. My journey centers on crafting high-performance, accessible, and aesthetically refined web interfaces with React, Next.js, TypeScript, and Tailwind CSS.\n\nI enjoy architecting intuitive user experiences, writing clean and maintainable code, and expanding my full-stack capabilities with Node.js, PostgreSQL, and Prisma. Driven by continuous learning, I am eager to contribute to impactful software engineering projects and collaborate with innovative teams.",
      email: "md.ratulhasan.dev@gmail.com",
      contactEmail: "md.ratulhasan.dev@gmail.com",
      githubUrl: "https://github.com/mdratul4505",
      linkedinUrl: "",
      twitterUrl: "",
      resumeUrl: "",
      availableForWork: true,
    },
  });
  console.log("✓ Portfolio settings seeded");

  // 2. Seed Skills if none exist
  const existingSkillsCount = await prisma.skill.count();
  if (existingSkillsCount === 0) {
    const skillsData = [
      // Frontend Development
      { name: "HTML", category: "Frontend Development", icon: "Code2", proficiency: "Proficient", order: 1 },
      { name: "CSS", category: "Frontend Development", icon: "Palette", proficiency: "Proficient", order: 2 },
      { name: "JavaScript", category: "Frontend Development", icon: "FileCode", proficiency: "Advanced", order: 3 },
      { name: "TypeScript", category: "Frontend Development", icon: "FileCode2", proficiency: "Proficient", order: 4 },
      { name: "React", category: "Frontend Development", icon: "Atom", proficiency: "Advanced", order: 5 },
      { name: "Next.js", category: "Frontend Development", icon: "Layers", proficiency: "Proficient", order: 6 },
      { name: "Tailwind CSS", category: "Frontend Development", icon: "Wind", proficiency: "Advanced", order: 7 },
      { name: "DaisyUI", category: "Frontend Development", icon: "Sparkles", proficiency: "Proficient", order: 8 },

      // Backend Development
      { name: "Node.js", category: "Backend Development", icon: "Server", proficiency: "Proficient", order: 1 },
      { name: "Express.js", category: "Backend Development", icon: "Cpu", proficiency: "Proficient", order: 2 },
      { name: "REST API", category: "Backend Development", icon: "Globe", proficiency: "Advanced", order: 3 },

      // Database
      { name: "MongoDB", category: "Database", icon: "Database", proficiency: "Proficient", order: 1 },
      { name: "PostgreSQL", category: "Database", icon: "HardDrive", proficiency: "Proficient", order: 2 },
      { name: "Prisma", category: "Database", icon: "Boxes", proficiency: "Proficient", order: 3 },

      // Tools & Version Control
      { name: "VS Code", category: "Tools & Version Control", icon: "Laptop", proficiency: "Daily Driver", order: 1 },
      { name: "Git", category: "Tools & Version Control", icon: "GitBranch", proficiency: "Advanced", order: 2 },
      { name: "GitHub", category: "Tools & Version Control", icon: "Github", proficiency: "Advanced", order: 3 },
      { name: "Postman", category: "Tools & Version Control", icon: "Send", proficiency: "Proficient", order: 4 },
      { name: "Vercel", category: "Tools & Version Control", icon: "CloudUpload", proficiency: "Proficient", order: 5 },
      { name: "Netlify", category: "Tools & Version Control", icon: "Cloud", proficiency: "Proficient", order: 6 },
    ];

    for (const skill of skillsData) {
      await prisma.skill.create({
        data: {
          ...skill,
          isPublished: true,
        },
      });
    }
    console.log(`✓ Seeded ${skillsData.length} skills`);
  }

  // 3. Seed Projects if none exist
  const existingProjectsCount = await prisma.project.count();
  if (existingProjectsCount === 0) {
    const projectsData = [
      {
        title: "Artora",
        slug: "artora",
        description:
          "An intuitive web platform tailored for digital artists, creative professionals, and art enthusiasts to showcase and explore artwork.",
        liveUrl: "https://artora-d8ed5.web.app",
        githubUrl: null,
        technologies: ["React", "JavaScript", "Tailwind CSS", "Firebase"],
        isFeatured: true,
        order: 1,
        isPublished: true,
      },
      {
        title: "SkillSwap",
        slug: "skill-swap",
        description:
          "A collaborative community platform facilitating mutual skill-sharing and peer-to-peer knowledge exchange for passionate learners.",
        liveUrl: null,
        githubUrl: "https://github.com/mdratul4505/skill-swap-client",
        technologies: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
        isFeatured: true,
        order: 2,
        isPublished: true,
      },
      {
        title: "StyleDecor",
        slug: "style-decor",
        description:
          "A sleek modern interior design web showcase presenting curated living spaces, furniture collections, and home styling concepts.",
        liveUrl: "https://style-decor-client-sepia.vercel.app/",
        githubUrl: null,
        technologies: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
        isFeatured: true,
        order: 3,
        isPublished: true,
      },
      {
        title: "RentNest",
        slug: "rent-nest",
        description:
          "A comprehensive housing and rental management application helping prospective tenants find quality accommodations smoothly.",
        liveUrl: null,
        githubUrl: null,
        technologies: ["Next.js", "React", "Tailwind CSS", "PostgreSQL", "Prisma"],
        isFeatured: false,
        order: 4,
        isPublished: true,
      },
    ];

    for (const project of projectsData) {
      await prisma.project.create({
        data: project,
      });
    }
    console.log(`✓ Seeded ${projectsData.length} projects`);
  }

  // 4. Seed Education if none exist
  const existingEducationCount = await prisma.education.count();
  if (existingEducationCount === 0) {
    await prisma.education.create({
      data: {
        institution: "Satkhira Polytechnic Institute",
        department: "Computer Science & Technology (CST)",
        degree: "Diploma in Engineering",
        semester: "6th Semester",
        startYear: "2022",
        endYear: "2026 (Expected)",
        cgpa: null,
        description:
          "Enrolled in the Computer Science & Technology program. Focusing on software development, algorithmic problem solving, web systems architecture, and database engineering.",
        order: 1,
      },
    });
    console.log("✓ Seeded education entry");
  }

  // 5. Seed or Update Admin User
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || "dev.ratul.coder@gmail.com";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "password833133";
  const adminName = process.env.ADMIN_INITIAL_NAME || "Md. Ratul Hasan";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
    },
  });
  console.log(`✓ Admin user prepared (${adminEmail})`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
