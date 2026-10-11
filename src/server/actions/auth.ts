"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema, LoginInput } from "@/lib/validations";
import { createAdminSession, clearAdminSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function loginAction(data: LoginInput): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Rate limiting: 5 attempts per 5 minutes per IP
    const rateCheck = checkRateLimit(`login-${ip}`, 5, 5 * 60 * 1000);
    if (!rateCheck.success) {
      return {
        success: false,
        error: "Too many login attempts. Please wait 5 minutes before trying again.",
      };
    }

    const parseResult = loginSchema.safeParse(data);
    if (!parseResult.success) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    const { email, password } = parseResult.data;

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      // Intentionally uniform generic error message to prevent email enumeration
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    await createAdminSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    return { success: true };
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    await clearAdminSession();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}
