import type { Metadata } from "next";
import { GalleryGrid } from "./gallery-grid";
import { getGallery, safe } from "@/lib/data";

export const metadata: Metadata = {
  title: "Galeri Bougainvillea",
  description: "Galeri gambar bougainvillea, bernombor dan bernama.",
};

export default async function GalleryPage() {
  const items = await safe(getGallery(), []);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-16">
      <p className="text-sm font-medium uppercase tracking-widest text-bract-600">Galeri</p>
      <h1 className="mt-2 font-display text-5xl text-leaf-900 sm:text-6xl">Galeri bougainvillea</h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-600">
        {items.length
          ? `${items.length} gambar dari laman kami. Klik gambar untuk tengok lebih besar.`
          : "Belum ada gambar lagi. Datang lagi nanti!"}
      </p>
      {items.length > 0 && (
        <div className="mt-10">
          <GalleryGrid items={items} />
        </div>
      )}
    </div>
  );
}
