/**
 * Helper to compress and convert image files to optimized Base64 data URLs on the client.
 * This avoids serverless read-only filesystem limitations (like Vercel EROFS) and 4.5MB payload limits.
 */
export function compressImageFile(
  file: File,
  maxDimension = 1400,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Selected file is not an image."));
      return;
    }

    // Direct read for SVG files to preserve vector crispness
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read SVG file."));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            // Fallback to original data URL if 2d context fails
            resolve(reader.result as string);
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Try modern WebP first
          try {
            const webpData = canvas.toDataURL("image/webp", quality);
            if (webpData.startsWith("data:image/webp")) {
              resolve(webpData);
              return;
            }
          } catch {
            // WebP not supported in older canvas implementations
          }

          // Fallback to JPEG
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch {
          resolve(reader.result as string);
        }
      };

      img.onerror = () => reject(new Error("Failed to decode image data."));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read selected file."));
    reader.readAsDataURL(file);
  });
}
