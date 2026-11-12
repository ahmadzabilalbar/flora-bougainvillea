import type { Metadata } from "next";
import Link from "next/link";
import { toggleVarietyFlag } from "../../actions";
import { VarietyFilters } from "./variety-filters";
import { FlowerImage } from "@/components/flower-image";
import { getTypes, getVarieties } from "@/lib/data";

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

function FlagButton({
  id,
  field,
  on,
  labels,
}: {
  id: string;
  field: "featured" | "published";
  on: boolean;
  labels: [string, string];
}) {
  return (
    <form action={toggleVarietyFlag}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(!on)} />
      <button
        title={`Toggle ${field}`}
        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
          on
            ? field === "featured"
              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
            : "bg-stone-100 text-stone-500 hover:bg-stone-200"
        }`}
      >
        {on ? labels[0] : labels[1]}
      </button>
    </form>
  );
}
