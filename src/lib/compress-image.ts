// Browser-only: shrink a photo to a web/phone-friendly size before it is uploaded.

/** Longest edge in pixels — sharp on phones and laptops, still small on disk. */
export const MAX_DIMENSION = 1600;
/** Aim to stay under this; quality steps down until it fits. */
export const TARGET_BYTES = 500 * 1024;
/** Server rejects anything larger (see src/lib/images.ts). */
export const MAX_UPLOAD_BYTES = 1.2 * 1024 * 1024;

export type Compressed = { file: File; width: number; height: number; originalBytes: number };

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    // Modern browsers apply the photo's EXIF rotation automatically when decoding.
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This file couldn't be read as an image. Try a JPG or PNG."));
    };
    img.src = url;
  });
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

export async function compressImage(file: File): Promise<Compressed> {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; // flatten transparency for JPEG fallback
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  // Prefer WebP; older Safari silently returns PNG, so fall back to JPEG.
  const probe = await toBlob(canvas, "image/webp", 0.8);
  const type = probe?.type === "image/webp" ? "image/webp" : "image/jpeg";

  let blob: Blob | null = type === "image/webp" ? probe : null;
  for (const quality of [0.8, 0.7, 0.6, 0.5]) {
    if (!blob || quality !== 0.8) blob = await toBlob(canvas, type, quality);
    if (blob && blob.size <= TARGET_BYTES) break;
  }
  if (!blob) throw new Error("Couldn't process this image.");
  if (blob.size > MAX_UPLOAD_BYTES) throw new Error("This image is still too large after compressing. Try a smaller photo.");

  const base = file.name.replace(/\.[^.]+$/, "") || "photo";
  const ext = type === "image/webp" ? "webp" : "jpg";
  return {
    file: new File([blob], `${base}.${ext}`, { type, lastModified: Date.now() }),
    width,
    height,
    originalBytes: file.size,
  };
}

export const formatBytes = (n: number) =>
  n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
