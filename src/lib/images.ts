import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel functions accept ~4.5 MB request bodies
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export function isValidImageUrl(url: string) {
  return url === "" || /^https?:\/\/\S+$/i.test(url) || /^\/uploads\/[\w.-]+$/.test(url);
}

/**
 * Stores an uploaded image and returns its public URL.
 * - With BLOB_READ_WRITE_TOKEN (Vercel Blob) → uploads to Blob storage.
 * - Otherwise in development → writes to /public/uploads.
 */
export async function saveUpload(file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) throw new Error("Image must be JPG, PNG, WebP, GIF or AVIF.");
  if (file.size > MAX_BYTES) throw new Error("Image must be 4 MB or smaller.");

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const name = `${randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`bougainvillea/${name}`, file, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Image upload needs Vercel Blob. Add a Blob store to the project (sets BLOB_READ_WRITE_TOKEN), or paste an image URL instead.",
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

/** Resolves the final image URL from a form: an uploaded file wins over a pasted URL. */
export async function imageFromForm(fd: FormData, fileField: string, urlField: string) {
  const file = fd.get(fileField);
  if (file instanceof File && file.size > 0) return saveUpload(file);
  const url = String(fd.get(urlField) ?? "").trim();
  if (!isValidImageUrl(url)) throw new Error("Image URL must start with http:// or https://");
  return url;
}
