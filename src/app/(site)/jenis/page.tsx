import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, getTypes, getVarieties } from "@/lib/data";
import { isOn } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Jenis Bougainvillea",
  description: "Kenali jenis-jenis bougainvillea — spesies, hibrid dan kategori taman.",
};

export default async function TypesPage() {
  const [types, varieties, c] = await Promise.all([getTypes(), getVarieties(), getContent()]);
  if (!isOn(c.showTypeName)) notFound();
  const count = (id: string) => varieties.filter((v) => v.published && v.typeId === id).length;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-16">
      <p className="text-sm font-medium uppercase tracking-widest text-bract-600">Jenis</p>
      <h1 className="mt-2 font-display text-5xl text-leaf-900 sm:text-6xl">Kenali jenis bougainvillea</h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-600">
        Ada spesies asli, ada hibrid kacukan, dan ada juga kategori ikut rupa pokok. Ini ringkasan setiap satu.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((t) => {
          const n = count(t.id);
          return (
            <Link
              key={t.id}
              href={`/koleksi?type=${encodeURIComponent(t.id)}`}
              className="group flex flex-col rounded-3xl bg-white p-6 ring-1 ring-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bract-900/5 hover:ring-bract-200"
            >
              <h2 className="font-display text-2xl text-leaf-900">{t.name}</h2>
              <p className="mt-3 flex-1 leading-relaxed text-stone-600">{t.description || "Tiada penerangan lagi."}</p>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-stone-500">{n ? `${n} varieti dalam koleksi` : "Belum ada dalam koleksi"}</span>
                {n > 0 && <span className="font-medium text-bract-700 group-hover:text-bract-900">Tengok →</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
