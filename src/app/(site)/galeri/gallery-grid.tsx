"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/schema";

const label = (g: GalleryItem) => g.name || "Tanpa nama";

/** Numbered photo grid; click a photo to view it large (arrow keys / Esc work). */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const current = open === null ? null : items[open];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, items.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((g, i) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setOpen(i)}
            className="group overflow-hidden rounded-3xl bg-white text-left ring-1 ring-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bract-900/5 hover:ring-bract-200"
          >
            <div className="relative aspect-square overflow-hidden bg-stone-100">
              <Image
                src={g.imageUrl}
                alt={label(g)}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-baseline gap-2 p-3 sm:p-4">
              <span className="shrink-0 text-sm font-semibold text-bract-600">#{g.number}</span>
              <span className={`truncate ${g.name ? "text-leaf-900" : "italic text-stone-400"}`}>{label(g)}</span>
            </div>
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`#${current.number} ${label(current)}`}
          className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div className="flex items-center justify-between gap-4 text-white">
            <p className="min-w-0 truncate text-lg">
              <span className="font-semibold text-bract-300">#{current.number}</span> {label(current)}
            </p>
            <button type="button" aria-label="Tutup" className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="relative my-4 flex-1" onClick={(e) => e.stopPropagation()}>
            <Image src={current.imageUrl} alt={label(current)} fill sizes="100vw" className="object-contain" />
          </div>
          {items.length > 1 && (
            <div className="flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              {[
                { d: "M15 6l-6 6 6 6", aria: "Sebelum", step: -1 },
                { d: "M9 6l6 6-6 6", aria: "Seterusnya", step: 1 },
              ].map((b) => (
                <button
                  key={b.aria}
                  type="button"
                  aria-label={b.aria}
                  onClick={() => setOpen((i) => (i === null ? i : (i + b.step + items.length) % items.length))}
                  className="grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={b.d} />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
