import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prose } from "@/components/prose";
import { getPages } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

const load = async (slug: string) => (await getPages()).find((p) => p.slug === slug && p.published);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load((await params).slug);
  return p ? { title: p.title } : {};
}

export default async function CmsPage({ params }: Props) {
  const page = await load((await params).slug);
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 md:pt-20">
      <h1 className="font-display text-5xl leading-tight text-leaf-900 sm:text-6xl">{page.title}</h1>
      <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-bract-400 to-bract-700" />
      <div className="mt-10">
        <Prose source={page.body} />
      </div>
    </article>
  );
}
