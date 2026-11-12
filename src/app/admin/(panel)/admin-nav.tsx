"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" },
  { href: "/admin/varieties", label: "Varieties", icon: "M12 21c4-3 7-6 7-10a7 7 0 10-14 0c0 4 3 7 7 10zM12 11a2 2 0 100-4 2 2 0 000 4z" },
  { href: "/admin/types", label: "Types", icon: "M4 6h16M4 12h10M4 18h6" },
  { href: "/admin/content", label: "Website content", icon: "M4 5h16v14H4zM8 9h8M8 13h5" },
  { href: "/admin/pages", label: "Pages", icon: "M7 3h7l5 5v13H7zM14 3v5h5" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] lg:flex-col lg:px-3 lg:pt-4">
      {ITEMS.map((i) => {
        const active = i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              active ? "bg-bract-50 font-medium text-bract-800" : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d={i.icon} />
            </svg>
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
