"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader({
  siteName,
  links,
  showContact = true,
}: {
  siteName: string;
  links: { href: string; label: string }[];
  showContact?: boolean;
}) {
  const pathname = usePathname();
  // The menu is "open for a path", so it closes automatically after navigating.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (fn: (o: boolean) => boolean) => setOpenOn(fn(open) ? pathname : null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled || open ? "border-b border-stone-200/70 bg-cream/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-xl tracking-tight text-leaf-900">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isActive(l.href) ? "bg-white text-bract-700 shadow-sm" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {showContact && (
            <Link href="/#contact" className="btn-primary ml-2">
              Hubungi kami
            </Link>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="grid size-10 place-items-center rounded-full text-stone-700 hover:bg-white md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-stone-200/70 px-4 pb-5 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-xl px-3 py-3 text-base ${
                isActive(l.href) ? "bg-white text-bract-700" : "text-stone-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {showContact && (
            <Link href="/#contact" className="btn-primary mt-3 w-full">
              Hubungi kami
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

export function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f472b6" />
          <stop offset="1" stopColor="#a3155f" />
        </linearGradient>
      </defs>
      <g transform="translate(20 21)">
        {[0, 120, 240].map((a) => (
          <path key={a} transform={`rotate(${a})`} d="M0 0 C -9 -4 -11 -16 0 -19 C 11 -16 9 -4 0 0 Z" fill="url(#logo-g)" />
        ))}
        <circle r="2.4" fill="#fef3c7" />
      </g>
    </svg>
  );
}
