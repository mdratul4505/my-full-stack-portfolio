"use server";

import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function markMessageReadAction(id: string, isRead: boolean) {
  try {
    await requireAdminSession();

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");

    return { success: true, data: message };
  } catch (error: unknown) {
    console.error("markMessageReadAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to update message status") };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await requireAdminSession();

    await prisma.contactMessage.delete({
      where: { id },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteMessageAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to delete message") };
  }
}
