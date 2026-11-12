import type { Metadata } from "next";
import { ContentForm } from "./content-form";
import { getContent } from "@/lib/data";

export const metadata: Metadata = { title: "Website content" };

export default async function ContentAdmin() {
  const content = await getContent();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-leaf-900">Website content</h1>
        <p className="mt-1 text-sm text-stone-500">Edit the text and images shown across the public website.</p>
      </div>
      <ContentForm content={content} />
    </div>
  );
}
