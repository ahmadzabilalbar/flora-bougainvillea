import type { Metadata } from "next";
import { CollectionBrowser } from "./collection-browser";
import { getTypes, getVarieties, safe } from "@/lib/data";

export const metadata: Metadata = { title: "Collection" };

export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [{ type }, types, varieties] = await Promise.all([searchParams, safe(getTypes(), []), safe(getVarieties(), [])]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-16">
      <p className="text-sm font-medium uppercase tracking-widest text-bract-600">The collection</p>
      <h1 className="mt-2 font-display text-5xl text-leaf-900 sm:text-6xl">Every colour of the tropics</h1>
      <CollectionBrowser
        key={type ?? "all"}
        types={types}
        varieties={varieties.filter((v) => v.published)}
        initialType={type ?? ""}
      />
    </div>
  );
}
