import Image from "next/image";
import type { GalleryItem } from "@/lib/schema";

const label = (g: GalleryItem) => g.name || "Tanpa nama";

/** Numbered photo grid. */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((g) => (
        <figure key={g.id} className="overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/70">
          <div className="relative aspect-square overflow-hidden bg-stone-100">
            <Image
              src={g.imageUrl}
              alt={label(g)}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
          <figcaption className="flex items-baseline gap-2 p-3 sm:p-4">
            <span className="shrink-0 text-sm font-semibold text-bract-600">#{g.number}</span>
            <span className={`truncate ${g.name ? "text-leaf-900" : "italic text-stone-400"}`}>{label(g)}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
