"use server";

import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/guard";
import { projectSchema, ProjectInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function createProjectAction(data: ProjectInput) {
  try {
    await requireAdminSession();
    const validated = projectSchema.parse(data);

    // Verify slug uniqueness
    const existing = await prisma.project.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return { success: false, error: `A project with the slug "${validated.slug}" already exists.` };
    }

    const techArray = Array.isArray(validated.technologies)
      ? validated.technologies
      : (validated.technologies as string).split(",").map((t) => t.trim()).filter(Boolean);

    const project = await prisma.project.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        imageUrl: validated.imageUrl || null,
        technologies: techArray,
        liveUrl: validated.liveUrl || null,
        githubUrl: validated.githubUrl || null,
        isFeatured: validated.isFeatured,
        order: validated.order,
        isPublished: validated.isPublished,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");

    return { success: true, data: project };
  } catch (error: unknown) {
    console.error("createProjectAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to create project") };
  }
}

export async function updateProjectAction(id: string, data: Partial<ProjectInput>) {
  try {
    await requireAdminSession();
    const validated = projectSchema.partial().parse(data);

    if (validated.slug) {
      const existing = await prisma.project.findFirst({
        where: { slug: validated.slug, NOT: { id } },
      });
      if (existing) {
        return { success: false, error: `Slug "${validated.slug}" is already used by another project.` };
      }
    }

    let techArray: string[] | undefined = undefined;
    if (validated.technologies) {
      techArray = Array.isArray(validated.technologies)
        ? validated.technologies
        : (validated.technologies as string).split(",").map((t) => t.trim()).filter(Boolean);
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(validated.title && { title: validated.title }),
        ...(validated.slug && { slug: validated.slug }),
        ...(validated.description && { description: validated.description }),
        ...(validated.imageUrl !== undefined && { imageUrl: validated.imageUrl }),
        ...(techArray && { technologies: techArray }),
        ...(validated.liveUrl !== undefined && { liveUrl: validated.liveUrl }),
        ...(validated.githubUrl !== undefined && { githubUrl: validated.githubUrl }),
        ...(validated.isFeatured !== undefined && { isFeatured: validated.isFeatured }),
        ...(validated.order !== undefined && { order: validated.order }),
        ...(validated.isPublished !== undefined && { isPublished: validated.isPublished }),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, data: project };
  } catch (error: unknown) {
    console.error("updateProjectAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to update project") };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await requireAdminSession();

    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteProjectAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to delete project") };
  }
}

export async function toggleProjectPublishAction(id: string, isPublished: boolean) {
  try {
    await requireAdminSession();

    const project = await prisma.project.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");

    return { success: true, data: project };
  } catch (error: unknown) {
    console.error("toggleProjectPublishAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to update publish state") };
  }
}

export async function toggleProjectFeaturedAction(id: string, isFeatured: boolean) {
  try {
    await requireAdminSession();

    const project = await prisma.project.update({
      where: { id },
      data: { isFeatured },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, data: project };
  } catch (error: unknown) {
    console.error("toggleProjectFeaturedAction error:", error);
    return { success: false, error: getErrorMessage(error, "Failed to update featured state") };
  }
}
