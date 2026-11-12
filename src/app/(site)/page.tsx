import Link from "next/link";
import { FlowerImage } from "@/components/flower-image";
import { VarietyCard } from "@/components/variety-card";
import { getContent, getTypes, getVarieties, safe } from "@/lib/data";
import { CONTENT_FIELDS, isOn, type SiteContent } from "@/lib/schema";

const defaults = Object.fromEntries(CONTENT_FIELDS.map((f) => [f.key, f.default])) as SiteContent;

export default async function Home() {
  const [c, types, all] = await Promise.all([
    safe(getContent(), defaults),
    safe(getTypes(), []),
    safe(getVarieties(), []),
  ]);
  const varieties = all.filter((v) => v.published);
  const featured = (varieties.some((v) => v.featured) ? varieties.filter((v) => v.featured) : varieties).slice(0, 8);
  const typeName = new Map(isOn(c.showTypeName) ? types.map((t) => [t.id, t.name]) : []);
  const collage = varieties.slice(0, 3);
  const show = {
    types: isOn(c.showTypes),
    featured: isOn(c.showFeatured),
    about: isOn(c.showAbout),
    contact: isOn(c.showContact),
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-bract-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 size-80 rounded-full bg-leaf-100/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 md:pt-16 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-widest text-bract-700 shadow-sm ring-1 ring-bract-100">
              <span className="size-1.5 rounded-full bg-bract-500" />
              {c.tagline}
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-leaf-900 text-balance sm:text-6xl lg:text-7xl">
              {c.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600 text-pretty">{c.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/koleksi" className="btn-primary px-6 py-3 text-base">
                Tengok koleksi
              </Link>
              {show.about && (
                <Link href="#about" className="btn-ghost px-6 py-3 text-base">
                  Kisahnya
                </Link>
              )}
            </div>
            <dl className="mt-12 flex gap-10">
              <div>
                <dt className="text-sm text-stone-500">Varieti</dt>
                <dd className="font-display text-3xl text-leaf-900">{varieties.length}</dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">Jenis</dt>
                <dd className="font-display text-3xl text-leaf-900">{types.length}</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            {c.heroImage ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-bract-900/20">
                <FlowerImage src={c.heroImage} alt={c.siteName} priority sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2].map((i) => {
                  const v = collage[i];
                  return (
                    <div
                      key={i}
                      className={`relative overflow-hidden rounded-[2rem] shadow-xl shadow-bract-900/10 ${
                        i === 0 ? "row-span-2 aspect-[3/5]" : "aspect-square"
                      }`}
                    >
                      <FlowerImage
                        src={v?.imageFlower || v?.imageUrl}
                        alt={v?.name ?? "Bougainvillea"}
                        color={v?.color ?? ["magenta", "gold", "purple"][i]}
                        priority
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Types */}
      {show.types && types.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
            {types.map((t) => (
              <Link
                key={t.id}
                href={`/koleksi?type=${encodeURIComponent(t.id)}`}
                className="shrink-0 rounded-2xl bg-white px-5 py-4 ring-1 ring-stone-200/70 transition hover:ring-bract-300"
              >
                <div className="font-medium text-leaf-900">{t.name}</div>
                <div className="text-sm text-stone-500">
                  {(() => {
                    const n = varieties.filter((v) => v.typeId === t.id).length;
                    return `${n} varieti`;
                  })()}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {show.featured && (
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-bract-600">Kegemaran</p>
              <h2 className="mt-2 font-display text-4xl text-leaf-900">Tengah mekar sekarang</h2>
            </div>
            <Link
              href="/koleksi"
              className="hidden text-sm font-medium text-bract-700 hover:text-bract-900 sm:block"
            >
              Tengok semua →
            </Link>
          </div>
          {featured.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((v, i) => (
                <VarietyCard key={v.id} v={v} typeName={typeName.get(v.typeId)} priority={i < 4} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-3xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
              Koleksi tengah ditanam — singgah lagi nanti ya!
            </p>
          )}
        </section>
      )}

      {/* About */}
      {show.about && (
        <section id="about" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-leaf-900 px-6 py-16 text-white sm:px-14">
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-bract-500/30 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <h2 className="font-display text-4xl leading-tight text-balance sm:text-5xl">{c.aboutTitle}</h2>
              <p className="whitespace-pre-line text-lg leading-relaxed text-leaf-100/85">{c.aboutBody}</p>
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {show.contact && (
        <section id="contact" className="mx-auto mt-28 max-w-3xl scroll-mt-24 px-4 text-center sm:px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-bract-600">Jom sembang</p>
          <h2 className="mt-2 font-display text-4xl text-leaf-900 sm:text-5xl">Sama-sama minat bougainvillea?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600">
            Nak tanya tips jaga pokok, kongsi gambar bunga atau sekadar bersembang? Mesej je — seronok jumpa sesama peminat.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {c.whatsapp && (
              <a
                href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-3 text-base"
              >
                Mesej di WhatsApp
              </a>
            )}
            {c.contactEmail && (
              <a
                href={`mailto:${c.contactEmail}`}
                className={`${c.whatsapp ? "btn-ghost" : "btn-primary"} px-6 py-3 text-base`}
              >
                {c.contactEmail}
              </a>
            )}
            {c.contactPhone && (
              <a href={`tel:${c.contactPhone.replace(/[^\d+]/g, "")}`} className="btn-ghost px-6 py-3 text-base">
                {c.contactPhone}
              </a>
            )}
          </div>
        </section>
      )}
    </>
  );
}
