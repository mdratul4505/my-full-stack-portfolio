import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
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

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const extension = path.extname(file.name || "").toLowerCase() || ".png";
    const isImageMime = file.type ? file.type.startsWith("image/") : false;
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(extension);

    if (!isImageMime && !isAllowedExt) {
      return NextResponse.json(
        { error: "Invalid file type. Please select a valid image file." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size of 25MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique safe filename
    const safeHash = crypto.randomBytes(16).toString("hex");
    const filename = `${Date.now()}-${safeHash}${extension}`;

    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl });
    } catch (fsError) {
      console.warn("Filesystem write failed in /api/upload (serverless). Falling back to Base64 data URL.", fsError);
      const mime = file.type || "image/png";
      const base64 = buffer.toString("base64");
      return NextResponse.json({ success: true, url: `data:${mime};base64,${base64}` });
    }
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 });
  }
}
