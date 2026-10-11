"use server";

import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/guard";
import { skillSchema, SkillInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function createSkillAction(data: SkillInput) {
  try {
    await requireAdminSession();
    const validated = skillSchema.parse(data);

    // Prevent duplicate skill name in same category
    const existing = await prisma.skill.findFirst({
      where: {
        name: { equals: validated.name, mode: "insensitive" },
        category: validated.category,
      },
    });

    if (existing) {
      return { success: false, error: `Skill "${validated.name}" already exists in ${validated.category}` };
    }

    const skill = await prisma.skill.create({
      data: {
        name: validated.name,
        category: validated.category,
        icon: validated.icon || null,
        proficiency: validated.proficiency || null,
        order: validated.order,
        isPublished: validated.isPublished,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    revalidatePath("/admin/dashboard");

    return { success: true, data: skill };
  } catch (error: unknown) {
    console.error("createSkillAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to create skill") };
  }
}

export async function updateSkillAction(id: string, data: Partial<SkillInput>) {
  try {
    await requireAdminSession();
    const validated = skillSchema.partial().parse(data);

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.category && { category: validated.category }),
        ...(validated.icon !== undefined && { icon: validated.icon }),
        ...(validated.proficiency !== undefined && { proficiency: validated.proficiency }),
        ...(validated.order !== undefined && { order: validated.order }),
        ...(validated.isPublished !== undefined && { isPublished: validated.isPublished }),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true, data: skill };
  } catch (error: unknown) {
    console.error("updateSkillAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to update skill") };
  }
}

export async function deleteSkillAction(id: string) {
  try {
    await requireAdminSession();

    await prisma.skill.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteSkillAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to delete skill") };
  }
}

export async function toggleSkillPublishAction(id: string, isPublished: boolean) {
  try {
    await requireAdminSession();

    const skill = await prisma.skill.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true, data: skill };
  } catch (error: unknown) {
    console.error("toggleSkillPublishAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to update status") };
  }
}

export async function reorderSkillsAction(items: { id: string; order: number }[]) {
  try {
    await requireAdminSession();

    await prisma.$transaction(
      items.map((item) =>
        prisma.skill.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true };
  } catch (error: unknown) {
    console.error("reorderSkillsAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to reorder skills") };
  }
}
