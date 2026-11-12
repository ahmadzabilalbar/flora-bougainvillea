import type { Metadata } from "next";
import { AddType, TypeRow } from "./types-manager";
import { getTypes, getVarieties } from "@/lib/data";

export const metadata: Metadata = { title: "Types" };

export default async function TypesAdmin() {
  const [types, varieties] = await Promise.all([getTypes(), getVarieties()]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-leaf-900">Types</h1>
        <p className="mt-1 text-sm text-stone-500">
          Group varieties into types (e.g. Glabra, Dwarf, Variegated). Lower sort numbers appear first.
        </p>
      </div>
      <AddType nextSort={(types.at(-1)?.sort ?? 0) + 1} />
      {types.length ? (
        <div className="space-y-3">
          {types.map((t) => (
            <TypeRow key={`${t.id}-${t.name}-${t.sort}-${t.description}`} type={t} count={varieties.filter((v) => v.typeId === t.id).length} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center text-sm text-stone-500">No types yet.</div>
      )}
    </div>
  );
}
