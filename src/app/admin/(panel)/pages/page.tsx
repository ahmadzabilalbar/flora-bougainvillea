import type { Metadata } from "next";
import Link from "next/link";
import { PublishToggle } from "./publish-toggle";
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
            <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-stone-50">
              <Link href={`/admin/pages/${p.id}`} className="min-w-0 flex-1">
                <div className="font-medium text-stone-900">{p.title}</div>
                <div className="text-sm text-stone-500">/halaman/{p.slug}</div>
              </Link>
              <PublishToggle key={String(p.published)} id={p.id} title={p.title} published={p.published} />
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center text-sm text-stone-500">No pages yet.</div>
      )}
    </div>
  );
}
