import prisma from "../src/lib/prisma";

async function main() {
  const current = await prisma.portfolioSettings.findUnique({
    where: { id: "default" },
  });
  console.log("Existing settings:", current);

  const updated = await prisma.portfolioSettings.upsert({
    where: { id: "default" },
    update: {
      name: "Md. Ratul Hasan",
      headline: "Full-Stack Web Developer",
      aboutText: "I am a dedicated Full-Stack Web Developer currently studying Computer Science & Technology (CST) at Satkhira Polytechnic Institute. My journey centers on crafting high-performance, accessible, and aesthetically refined web applications with React, Next.js, TypeScript, Tailwind CSS, Node.js, Express, and PostgreSQL.\n\nI enjoy architecting intuitive user experiences, writing clean and maintainable code, and building robust full-stack solutions with PostgreSQL and Prisma. Driven by continuous learning, I am eager to contribute to impactful software engineering projects and collaborate with innovative teams.",
      email: "dev.ratul.coder@gmail.com",
      contactEmail: "dev.ratul.coder@gmail.com",
      phone: "01985435655",
      profileImage: "/profile.jpg",
    },
    create: {
      id: "default",
      name: "Md. Ratul Hasan",
      headline: "Full-Stack Web Developer",
      shortBio: "Passionate about building modern, responsive, user-friendly full-stack web applications with clean code and intuitive design.",
      aboutText: "I am Md. Ratul Hasan, a dedicated Full-Stack Web Developer currently studying Computer Science & Technology at Satkhira Polytechnic Institute.\n\nMy journey revolves around building high-performance, modern, and accessible web applications using React, Next.js, TypeScript, Tailwind CSS, Node.js, Express, and PostgreSQL.\n\nI focus on scalable architecture, clean code standards, seamless user experiences, and robust database design with Prisma ORM.",
      email: "dev.ratul.coder@gmail.com",
      contactEmail: "dev.ratul.coder@gmail.com",
      phone: "01985435655",
      profileImage: "/profile.jpg",
      githubUrl: "https://github.com/mdratul4505",
      availableForWork: true,
    },
  });

  console.log("Updated settings in database:", updated);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
