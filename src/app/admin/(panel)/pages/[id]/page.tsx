import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageForm } from "../page-form";
import { getPages } from "@/lib/data";

export const metadata: Metadata = { title: "Edit page" };

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = (await getPages()).find((p) => p.id === id);
  if (!page) notFound();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/pages" className="text-sm text-stone-500 hover:text-stone-900">
          ← Pages
        </Link>
        <h1 className="mt-2 font-display text-3xl text-leaf-900">{page.title}</h1>
      </div>
      <PageForm key={page.updatedAt} page={page} />
    </div>
  );
}
