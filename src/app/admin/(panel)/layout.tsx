import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "../actions";
import { AdminNav } from "./admin-nav";
import { Logo } from "@/components/site-header";
import { requireAdmin } from "@/lib/auth";
import { sheetsConfigured } from "@/lib/store";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-dvh bg-stone-50 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 z-30 border-b border-stone-200 bg-white lg:h-dvh lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-4 lg:px-5">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="size-7" />
            <span className="font-display text-lg text-leaf-900">Flora Admin</span>
          </Link>
          <Link href="/" target="_blank" className="text-xs text-stone-500 hover:text-stone-900 lg:hidden">
            View site ↗
          </Link>
        </div>
        <AdminNav />
        <div className="hidden px-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block lg:p-4">
          <div className="rounded-xl bg-stone-50 p-3 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${sheetsConfigured ? "bg-emerald-500" : "bg-amber-500"}`} />
              {sheetsConfigured ? "Google Sheets connected" : "Local JSON (dev mode)"}
            </div>
            <div className="mt-2 truncate">Signed in as {session.username}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/" target="_blank" className="btn-ghost flex-1 px-3 py-2 text-xs">
              View site ↗
            </Link>
            <form action={logout} className="flex-1">
              <button className="btn-ghost w-full px-3 py-2 text-xs">Sign out</button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
        <form action={logout} className="mt-12 lg:hidden">
          <button className="text-sm text-stone-500 underline">Sign out</button>
        </form>
      </main>
    </div>
  );
}
