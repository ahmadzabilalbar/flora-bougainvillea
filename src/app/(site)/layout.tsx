import Link from "next/link";
import { Logo, SiteHeader } from "@/components/site-header";
import { getContent, getPages, safe } from "@/lib/data";
import { CONTENT_FIELDS, type SiteContent } from "@/lib/schema";

const defaults = Object.fromEntries(CONTENT_FIELDS.map((f) => [f.key, f.default])) as SiteContent;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [c, pages] = await Promise.all([safe(getContent(), defaults), safe(getPages(), [])]);
  const published = pages.filter((p) => p.published);
  const links = [
    { href: "/", label: "Home" },
    { href: "/collection", label: "Collection" },
    ...published.slice(0, 3).map((p) => ({ href: `/pages/${p.slug}`, label: p.title })),
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader siteName={c.siteName} links={links} />
      <main className="flex-1">{children}</main>
      <footer className="mt-24 bg-leaf-900 text-leaf-100">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="font-display text-xl text-white">{c.siteName}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-leaf-100/70">{c.footerText}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-leaf-100/50">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {[{ href: "/collection", label: "Collection" }, ...published.map((p) => ({ href: `/pages/${p.slug}`, label: p.title }))].map(
                (l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-leaf-100/50">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {c.contactEmail && (
                <li>
                  <a href={`mailto:${c.contactEmail}`} className="hover:text-white">
                    {c.contactEmail}
                  </a>
                </li>
              )}
              {c.contactPhone && <li>{c.contactPhone}</li>}
              {c.address && <li className="whitespace-pre-line text-leaf-100/70">{c.address}</li>}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 text-xs text-leaf-100/50 sm:px-6">
            <span>
              © {new Date().getFullYear()} {c.siteName}
            </span>
            <Link href="/admin" className="hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
