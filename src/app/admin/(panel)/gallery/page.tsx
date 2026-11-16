import type { Metadata } from "next";
import Link from "next/link";
import { GalleryCard, GalleryUploader, RenumberNotice } from "./gallery-manager";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryAdmin() {
  const items = await getGallery();
  // Numbers should run 1, 2, 3… with no gaps or repeats.
  const numbers = new Set(items.map((g) => g.number));
  const tidy = items.every((g, i) => g.number === i + 1);
  const missing = items.map((_, i) => i + 1).filter((n) => !numbers.has(n));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-leaf-900">Gallery</h1>
          <p className="mt-1 text-sm text-stone-500">
            Numbered bougainvillea photos shown on the public{" "}
            <Link href="/galeri" className="text-bract-700 hover:text-bract-900">
              Galeri
            </Link>{" "}
            page. Edit a name or number and press Enter (or click away) to save.
          </p>
        </div>
        <span className="rounded-full bg-bract-50 px-3 py-1 text-sm text-bract-700">
          {items.length} photo{items.length === 1 ? "" : "s"}
        </span>
      </div>
      <GalleryUploader items={items} />
      {!tidy && <RenumberNotice missing={missing} total={items.length} />}
      {items.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {items.map((g) => (
            <GalleryCard key={`${g.id}-${g.updatedAt}`} item={g} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center text-sm text-stone-500">No photos yet. Upload some above.</div>
      )}
    </div>
  );
}
