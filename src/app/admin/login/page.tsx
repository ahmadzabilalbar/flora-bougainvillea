import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { Logo } from "@/components/site-header";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
      <div className="pointer-events-none absolute -right-32 -top-32 size-[30rem] rounded-full bg-bract-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-leaf-100 blur-3xl" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="size-12" />
          <h1 className="mt-4 font-display text-3xl text-leaf-900">Welcome back</h1>
          <p className="mt-1 text-sm text-stone-500">Sign in to manage your collection</p>
        </div>
        <div className="card p-6 shadow-xl shadow-bract-900/5">
          <LoginForm next={next ?? ""} />
        </div>
      </div>
    </div>
  );
}
