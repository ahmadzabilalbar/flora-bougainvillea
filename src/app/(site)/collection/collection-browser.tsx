"use client";

import { useMemo, useState } from "react";
import { VarietyCard } from "@/components/variety-card";
import type { BougainvilleaType, Variety } from "@/lib/schema";

export function CollectionBrowser({
  types,
  varieties,
  initialType,
}: {
  types: BougainvilleaType[];
  varieties: Variety[];
  initialType: string;
}) {
  const [type, setType] = useState(initialType);
  const [q, setQ] = useState("");
  const typeName = useMemo(() => new Map(types.map((t) => [t.id, t.name])), [types]);

  const filtered = varieties.filter((v) => {
    if (type && v.typeId !== type) return false;
    if (!q) return true;
    const hay = `${v.name} ${v.color} ${typeName.get(v.typeId) ?? ""}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const select = (id: string) => {
    setType(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("type", id);
    else url.searchParams.delete("type");
    window.history.replaceState(null, "", url);
  };

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 mt-8 flex flex-col gap-3 bg-cream/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {[{ id: "", name: "All" }, ...types].map((t) => (
            <button
              key={t.id}
              onClick={() => select(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                type === t.id
                  ? "bg-leaf-900 text-white"
                  : "bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-stone-300"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <svg viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or colour…"
            className="input rounded-full pl-10"
            aria-label="Search varieties"
          />
        </div>
      </div>

      {type && types.find((t) => t.id === type)?.description && (
        <p className="mt-4 max-w-2xl text-stone-600">{types.find((t) => t.id === type)!.description}</p>
      )}

      {filtered.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((v, i) => (
            <VarietyCard key={v.id} v={v} typeName={typeName.get(v.typeId)} priority={i < 4} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-3xl border border-dashed border-stone-300 p-12 text-center text-stone-500">
          No varieties match your filters.
        </p>
      )}
    </>
  );
}
