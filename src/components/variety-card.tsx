import Link from "next/link";
import { FlowerImage } from "./flower-image";
import type { Variety } from "@/lib/schema";

export function VarietyCard({ v, typeName, priority }: { v: Variety; typeName?: string; priority?: boolean }) {
  return (
    <Link
      href={`/koleksi/${v.id}`}
      className="group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-bract-900/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <FlowerImage
          src={v.imageUrl || v.imageFlower}
          alt={v.name}
          color={v.color}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="transition duration-500 group-hover:scale-105"
        />
        {v.imageUrl && v.imageFlower && (
          <FlowerImage
            src={v.imageFlower}
            alt=""
            color={v.color}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        {typeName && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-leaf-900 backdrop-blur">
            {typeName}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg text-stone-900">{v.name}</h3>
          {v.color && <p className="text-sm text-stone-500">{v.color}</p>}
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-bract-50 text-bract-700 transition group-hover:bg-bract-600 group-hover:text-white">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
