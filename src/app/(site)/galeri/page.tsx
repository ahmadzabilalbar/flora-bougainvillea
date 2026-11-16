import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryGrid } from "./gallery-grid";
import { getContent, getGallery, safe } from "@/lib/data";
import { isOn } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Galeri Bougainvillea",
  description: "Galeri gambar bougainvillea, bernombor dan bernama.",
};

export default async function GalleryPage() {
  const [items, c] = await Promise.all([safe(getGallery(), []), getContent()]);
  if (!isOn(c.showGaleri)) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-16">
      <p className="text-sm font-medium uppercase tracking-widest text-bract-600">Galeri</p>
      <h1 className="mt-2 font-display text-5xl text-leaf-900 sm:text-6xl">Galeri bougainvillea</h1>
      {items.length === 0 && (
        <p className="mt-4 max-w-2xl text-lg text-stone-600">Belum ada gambar lagi. Datang lagi nanti!</p>
      )}
      {items.length > 0 && (
        <div className="mt-10">
          <GalleryGrid items={items} />
        </div>
      )}
    </div>
  );
}
