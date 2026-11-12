import type { Metadata } from "next";
import Link from "next/link";
import { FlagButton } from "./flag-button";
import { VarietyFilters } from "./variety-filters";
import { FlowerImage } from "@/components/flower-image";
import { getTypes, getVarieties } from "@/lib/data";
import { photoCount } from "@/lib/schema";

export const metadata: Metadata = { title: "Varieties" };

export default async function VarietiesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; saved?: string }>;
}) {
  const [{ q = "", type = "", saved }, types, all] = await Promise.all([searchParams, getTypes(), getVarieties()]);
  const typeName = new Map(types.map((t) => [t.id, t.name]));
  const varieties = all.filter(
    (v) =>
      (!type || v.typeId === type) &&
      (!q || `${v.name} ${v.color}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-leaf-900">Varieties</h1>
          <p className="mt-1 text-sm text-stone-500">{all.length} total</p>
        </div>
        <Link href="/admin/varieties/new" className="btn-primary">
          + New variety
        </Link>
      </div>

      {saved && (
        <div role="status" className="rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf-700 ring-1 ring-leaf-100">
          Saved successfully.
        </div>
      )}

      <VarietyFilters types={types} q={q} type={type} />

      {varieties.length ? (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-stone-100">
            {varieties.map((v) => (
              <li key={v.id} className="flex items-center gap-4 p-3 sm:p-4">
                <Link href={`/admin/varieties/${v.id}`} className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                  <FlowerImage src={v.imageUrl} alt={v.name} color={v.color} sizes="56px" />
                </Link>
                <Link href={`/admin/varieties/${v.id}`} className="min-w-0 flex-1">
                  <div className="truncate font-medium text-stone-900 hover:text-bract-700">{v.name}</div>
                  <div className="truncate text-sm text-stone-500">
                    {typeName.get(v.typeId) ?? <span className="text-amber-600">No type</span>} · {v.color || "—"}
                  </div>
                </Link>
                <PhotoBadge count={photoCount(v)} />
                <div className="hidden items-center gap-2 sm:flex">
                  <FlagButton id={v.id} field="featured" on={v.featured} labels={["★ Featured", "☆ Feature"]} />
                  <FlagButton id={v.id} field="published" on={v.published} labels={["Published", "Draft"]} />
                </div>
                <Link href={`/admin/varieties/${v.id}`} className="btn-ghost px-3 py-1.5 text-xs">
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="card p-12 text-center text-sm text-stone-500">
          {all.length ? "No varieties match your filters." : "No varieties yet — add your first one."}
        </div>
      )}
    </div>
  );
}

function PhotoBadge({ count }: { count: number }) {
  const done = count === 3;
  return (
    <span
      title="Whole plant, flower and leaf photos"
      className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium md:inline ${
        done ? "bg-stone-100 text-stone-600" : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
      }`}
    >
      📷 {count}/3
    </span>
  );
}
