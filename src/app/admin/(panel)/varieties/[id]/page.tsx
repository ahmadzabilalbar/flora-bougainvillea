import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VarietyForm } from "../variety-form";
import { getTypes, getVarieties } from "@/lib/data";

export const metadata: Metadata = { title: "Edit variety" };

export default async function EditVariety({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [types, varieties] = await Promise.all([getTypes(), getVarieties()]);
  const variety = varieties.find((v) => v.id === id);
  if (!variety) notFound();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/varieties" className="text-sm text-stone-500 hover:text-stone-900">
          ← Varieties
        </Link>
        <h1 className="mt-2 font-display text-3xl text-leaf-900">{variety.name}</h1>
      </div>
      <VarietyForm key={variety.updatedAt} variety={variety} types={types} />
    </div>
  );
}
