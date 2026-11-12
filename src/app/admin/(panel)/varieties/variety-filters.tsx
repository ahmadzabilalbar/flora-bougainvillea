"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { BougainvilleaType } from "@/lib/schema";

export function VarietyFilters({ types, q, type }: { types: BougainvilleaType[]; q: string; type: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(q);

  const go = (next: { q?: string; type?: string }) => {
    const p = new URLSearchParams();
    const nq = next.q ?? query;
    const nt = next.type ?? type;
    if (nq) p.set("q", nq);
    if (nt) p.set("type", nt);
    router.replace(`${pathname}${p.size ? `?${p}` : ""}`);
  };

  useEffect(() => {
    if (query === q) return;
    const t = setTimeout(() => go({ q: query }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or colour…"
        className="input sm:max-w-xs"
        aria-label="Search"
      />
      <select value={type} onChange={(e) => go({ type: e.target.value })} className="input sm:max-w-[14rem]" aria-label="Filter by type">
        <option value="">All types</option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
