import Link from "next/link";
import { SetupPanel } from "./setup-panel";
import { FlowerImage } from "@/components/flower-image";
import { getPages, getTypes, getVarieties } from "@/lib/data";
import { sheetsConfigured } from "@/lib/store";

export default async function Dashboard() {
  const result = await Promise.all([getTypes(), getVarieties(), getPages()]).then(
    (data) => ({ data, error: "" }),
    (e: unknown) => ({ data: [[], [], []] as const, error: e instanceof Error ? e.message : String(e) }),
  );
  const [types, varieties, pages] = result.data;
  const { error } = result;

  const stats = [
    { label: "Varieties", value: varieties.length, href: "/admin/varieties" },
    { label: "Published", value: varieties.filter((v) => v.published).length, href: "/admin/varieties" },
    { label: "Types", value: types.length, href: "/admin/types" },
    { label: "Pages", value: pages.length, href: "/admin/pages" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-leaf-900">Dashboard</h1>
          <p className="mt-1 text-sm text-stone-500">Manage your bougainvillea collection and website.</p>
        </div>
        <Link href="/admin/varieties/new" className="btn-primary">
          + New variety
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
          <strong>Couldn&apos;t read data.</strong> {error}
          <p className="mt-1 text-red-700">
            Check that the spreadsheet is shared with the service account as <em>Editor</em>, then run setup below.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 transition hover:shadow-md">
            <div className="text-sm text-stone-500">{s.label}</div>
            <div className="mt-1 font-display text-4xl text-leaf-900">{s.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-stone-900">Recently added</h2>
            <Link href="/admin/varieties" className="text-sm text-bract-700 hover:text-bract-900">
              View all
            </Link>
          </div>
          {varieties.length ? (
            <ul className="mt-4 divide-y divide-stone-100">
              {varieties.slice(0, 5).map((v) => (
                <li key={v.id}>
                  <Link href={`/admin/varieties/${v.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      <FlowerImage src={v.imageUrl} alt={v.name} color={v.color} sizes="44px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-stone-900">{v.name}</div>
                      <div className="text-xs text-stone-500">
                        {types.find((t) => t.id === v.typeId)?.name ?? "No type"} · {v.color || "—"}
                      </div>
                    </div>
                    {!v.published && <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">Draft</span>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-stone-500">No varieties yet. Run setup with sample data, or add your first one.</p>
          )}
        </section>

        <SetupPanel sheetsConfigured={sheetsConfigured} sheetId={process.env.GOOGLE_SHEET_ID ?? ""} />
      </div>
    </div>
  );
}
