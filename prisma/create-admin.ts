import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  let email = process.env.ADMIN_INITIAL_EMAIL || "admin@ratulhasan.dev";
  let password = process.env.ADMIN_INITIAL_PASSWORD || "AdminPassword2026!";
  let name = process.env.ADMIN_INITIAL_NAME || "Md. Ratul Hasan";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email" && args[i + 1]) {
      email = args[i + 1];
      i++;
    } else if (args[i] === "--password" && args[i + 1]) {
      password = args[i + 1];
      i++;
    } else if (args[i] === "--name" && args[i + 1]) {
      name = args[i + 1];
      i++;
    }
  }

  if (!email || !password) {
    console.error("Usage: npx tsx prisma/create-admin.ts [--email <email>] [--password <password>] [--name <name>]");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Error: Password must be at least 8 characters long.");
    process.exit(1);
  }

  console.log(`Setting up Admin account for: ${email}...`);
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
    },
    create: {
      email,
      passwordHash,
      name,
    },
  });

  console.log(`✓ Admin user successfully configured!`);
  console.log(`  ID: ${admin.id}`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Name: ${admin.name}`);
}

main()
  .catch((e) => {
    console.error("Error creating admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
