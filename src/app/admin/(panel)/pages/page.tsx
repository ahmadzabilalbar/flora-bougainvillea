import type { Metadata } from "next";
import Link from "next/link";
import { getPages } from "@/lib/data";

export const metadata: Metadata = { title: "Pages" };

export default async function PagesAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, pages] = await Promise.all([searchParams, getPages()]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-leaf-900">Pages</h1>
          <p className="mt-1 text-sm text-stone-500">Simple content pages like a care guide or delivery info. The first three appear in the menu.</p>
        </div>
        <Link href="/admin/pages/new" className="btn-primary">
          + New page
        </Link>
      </div>
      {saved && (
        <div role="status" className="rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf-700 ring-1 ring-leaf-100">
          Page saved.
        </div>
      )}
      {pages.length ? (
        <div className="card divide-y divide-stone-100">
          {pages.map((p) => (
            <Link key={p.id} href={`/admin/pages/${p.id}`} className="flex items-center gap-4 p-4 hover:bg-stone-50">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-stone-900">{p.title}</div>
                <div className="text-sm text-stone-500">/pages/{p.slug}</div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs ${
                  p.published ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"
                }`}
              >
                {p.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center text-sm text-stone-500">No pages yet.</div>
      )}
    </div>
  );
}
