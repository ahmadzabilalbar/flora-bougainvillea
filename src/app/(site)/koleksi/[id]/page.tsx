import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VarietyGallery } from "@/components/variety-gallery";
import { VarietyCard } from "@/components/variety-card";
import { getContent, getTypes, getVarieties } from "@/lib/data";
import { VARIETY_PHOTOS, isOn } from "@/lib/schema";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  const v = (await getVarieties()).find((x) => x.id === id && x.published);
  return v;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = await load((await params).id);
  return v ? { title: v.name, description: v.description.slice(0, 160) } : {};
}

export default async function VarietyPage({ params }: Props) {
  const { id } = await params;
  const [v, types, all, c] = await Promise.all([load(id), getTypes(), getVarieties(), getContent()]);
  if (!v) notFound();
  // Treat the type as unknown when type names are hidden: hides the tag, "Tentang …" box and card labels.
  const type = isOn(c.showTypeName) ? types.find((t) => t.id === v.typeId) : undefined;
  const showEnquiry = isOn(c.showEnquiry);
  const related = all.filter((x) => x.published && x.id !== v.id && x.typeId === v.typeId).slice(0, 4); // same type, even if its name is hidden
  const enquiry = encodeURIComponent(`Hai! Saya pun minat bougainvillea "${v.name}". Boleh kongsi tips jaga?`);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <Link href="/koleksi" className="text-sm text-stone-500 hover:text-stone-900">
        ← Balik ke koleksi
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <VarietyGallery
          name={v.name}
          color={v.color}
          shots={VARIETY_PHOTOS.map((p) => ({ label: p.labelBm, src: v[p.field] }))}
        />
        <div className="lg:py-8">
          {type && (
            <Link
              href={`/koleksi?type=${type.id}`}
              className="inline-block rounded-full bg-leaf-50 px-3 py-1 text-sm font-medium text-leaf-700 ring-1 ring-leaf-100"
            >
              {type.name}
            </Link>
          )}
          <h1 className="mt-4 font-display text-5xl leading-tight text-leaf-900 sm:text-6xl">{v.name}</h1>
          {v.color && (
            <p className="mt-3 text-lg text-stone-500">
              Warna brakta: <span className="text-stone-800">{v.color}</span>
            </p>
          )}
          {v.description && (
            <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-stone-700">{v.description}</p>
          )}
          {type?.description && (
            <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-stone-200/70">
              <div className="text-sm font-medium text-leaf-900">Tentang {type.name}</div>
              <p className="mt-1 text-sm text-stone-600">{type.description}</p>
            </div>
          )}
          {showEnquiry && (c.whatsapp || c.contactEmail) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {c.whatsapp && (
                <a
                  href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}?text=${enquiry}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-3 text-base"
                >
                  Sembang pasal varieti ni
                </a>
              )}
              {c.contactEmail && (
                <a
                  href={`mailto:${c.contactEmail}?subject=${encodeURIComponent(v.name)}&body=${enquiry}`}
                  className={`${c.whatsapp ? "btn-ghost" : "btn-primary"} px-6 py-3 text-base`}
                >
                  Hantar e-mel
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl text-leaf-900">
            {type ? `Lagi ${type.name} dalam koleksi` : "Varieti lain"}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <VarietyCard key={r.id} v={r} typeName={type?.name} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
