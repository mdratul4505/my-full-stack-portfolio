"use server";

import { requireAdminSession } from "@/lib/auth/guard";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".jfif",
  ".bmp",
  ".ico",
  ".heic",
  ".heif",
];

export async function uploadImageAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    await requireAdminSession();

    const file = formData.get("file") as File | null;
    if (!file || typeof file === "string") {
      return { success: false, error: "No file was selected for upload." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File exceeds maximum size of 25MB." };
    }

    // Check extension or mime
    const originalName = file.name || "image.png";
    const extension = path.extname(originalName).toLowerCase() || ".png";

    const isImageMime = file.type.startsWith("image/");
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(extension);

    if (!isImageMime && !isAllowedExt) {
      return {
        success: false,
        error: "Invalid file type. Please upload a valid image (JPEG, PNG, WebP, GIF, SVG, etc.).",
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    const safeHash = crypto.randomBytes(16).toString("hex");
    const safeExtension = isAllowedExt ? extension : ".png";
    const filename = `${Date.now()}-${safeHash}${safeExtension}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return { success: true, url: publicUrl };
  } catch (error: unknown) {
    console.error("uploadImageAction error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to upload image." };
  }
}
