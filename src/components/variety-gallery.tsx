"use client";

import { useState } from "react";
import { FlowerImage } from "./flower-image";

type Shot = { label: string; src: string };

/** Main photo with labelled thumbnails (Pokok penuh / Bunga / Daun). */
export function VarietyGallery({ name, color, shots }: { name: string; color: string; shots: Shot[] }) {
  const available = shots.filter((s) => s.src);
  const [active, setActive] = useState(0);
  const current = available[active];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-bract-900/10">
        <FlowerImage
          key={current?.src ?? "placeholder"}
          src={current?.src}
          alt={current ? `${name} — ${current.label}` : name}
          color={color}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {current && (
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-leaf-900 backdrop-blur">
            {current.label}
          </span>
        )}
      </div>
      {available.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-3" role="tablist" aria-label={`Gambar ${name}`}>
          {available.map((s, i) => (
            <button
              key={s.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`group text-left ${i === active ? "" : "opacity-70 hover:opacity-100"}`}
            >
              <div
                className={`relative aspect-square overflow-hidden rounded-2xl ring-2 transition ${
                  i === active ? "ring-bract-500" : "ring-transparent"
                }`}
              >
                <FlowerImage src={s.src} alt={`${name} — ${s.label}`} color={color} sizes="160px" />
              </div>
              <div className={`mt-1.5 text-center text-xs ${i === active ? "font-medium text-bract-700" : "text-stone-500"}`}>
                {s.label}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
