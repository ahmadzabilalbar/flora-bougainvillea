import type { Metadata } from "next";
import Link from "next/link";
import { VarietyForm } from "../variety-form";
import { getTypes } from "@/lib/data";

export const metadata: Metadata = { title: "New variety" };

export default async function NewVariety() {
  const types = await getTypes();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/varieties" className="text-sm text-stone-500 hover:text-stone-900">
          ← Varieties
        </Link>
        <h1 className="mt-2 font-display text-3xl text-leaf-900">New variety</h1>
      </div>
      <VarietyForm types={types} />
    </div>
  );
}
