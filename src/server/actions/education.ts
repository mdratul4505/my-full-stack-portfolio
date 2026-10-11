"use server";

import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/guard";
import { educationSchema, EducationInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function createEducationAction(data: EducationInput) {
  try {
    await requireAdminSession();
    const validated = educationSchema.parse(data);

    const record = await prisma.education.create({
      data: {
        institution: validated.institution,
        department: validated.department,
        degree: validated.degree || null,
        semester: validated.semester || null,
        startYear: validated.startYear || null,
        endYear: validated.endYear || null,
        cgpa: validated.cgpa || null,
        description: validated.description || null,
        order: validated.order,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/education");

    return { success: true, data: record };
  } catch (error: unknown) {
    console.error("createEducationAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to create education record") };
  }
}

export async function updateEducationAction(id: string, data: Partial<EducationInput>) {
  try {
    await requireAdminSession();
    const validated = educationSchema.partial().parse(data);

    const record = await prisma.education.update({
      where: { id },
      data: {
        ...(validated.institution && { institution: validated.institution }),
        ...(validated.department && { department: validated.department }),
        ...(validated.degree !== undefined && { degree: validated.degree }),
        ...(validated.semester !== undefined && { semester: validated.semester }),
        ...(validated.startYear !== undefined && { startYear: validated.startYear }),
        ...(validated.endYear !== undefined && { endYear: validated.endYear }),
        ...(validated.cgpa !== undefined && { cgpa: validated.cgpa }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.order !== undefined && { order: validated.order }),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/education");

    return { success: true, data: record };
  } catch (error: unknown) {
    console.error("updateEducationAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to update education record") };
  }
}

export async function deleteEducationAction(id: string) {
  try {
    await requireAdminSession();

    await prisma.education.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/education");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteEducationAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to delete education record") };
  }
}
