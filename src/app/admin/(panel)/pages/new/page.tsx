import type { Metadata } from "next";
import Link from "next/link";
import { PageForm } from "../page-form";

export const metadata: Metadata = { title: "New page" };

export default function NewPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/pages" className="text-sm text-stone-500 hover:text-stone-900">
          ← Pages
        </Link>
        <h1 className="mt-2 font-display text-3xl text-leaf-900">New page</h1>
      </div>
      <PageForm />
    </div>
  );
}
