import "server-only";
import { unstable_cache } from "next/cache";
import { store } from "./store";
import {
  CONTENT_FIELDS,
  type BougainvilleaType,
  type Page,
  type SiteContent,
  type Variety,
} from "./schema";

export const DATA_TAG = "sheets-data";

// Cache Sheets reads (quota-friendly). Admin mutations invalidate DATA_TAG immediately;
// edits made directly in the spreadsheet show up within REVALIDATE seconds.
const REVALIDATE = 60;
const cached = <T>(key: string, fn: () => Promise<T>) =>
  unstable_cache(fn, [key], { tags: [DATA_TAG], revalidate: REVALIDATE });

const bool = (v: string | undefined, fallback = false) =>
  v === undefined || v === "" ? fallback : ["true", "1", "yes", "y"].includes(v.toLowerCase());

export const getTypes = cached("types", async (): Promise<BougainvilleaType[]> => {
  const rows = await store.list("Types");
  return rows
    .map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? "",
      sort: Number(r.sort) || 0,
    }))
    .filter((t) => t.id)
    .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));
});

export const getVarieties = cached("varieties", async (): Promise<Variety[]> => {
  const rows = await store.list("Varieties");
  return rows
    .map((r) => ({
      id: r.id,
      name: r.name,
      typeId: r.typeId ?? "",
      color: r.color ?? "",
      description: r.description ?? "",
      imageUrl: r.imageUrl ?? "",
      featured: bool(r.featured),
      published: bool(r.published, true),
      createdAt: r.createdAt ?? "",
      updatedAt: r.updatedAt ?? "",
    }))
    .filter((v) => v.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});

export const getPages = cached("pages", async (): Promise<Page[]> => {
  const rows = await store.list("Pages");
  return rows
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      body: r.body ?? "",
      published: bool(r.published, true),
      sort: Number(r.sort) || 0,
      updatedAt: r.updatedAt ?? "",
    }))
    .filter((p) => p.id && p.slug)
    .sort((a, b) => a.sort - b.sort || a.title.localeCompare(b.title));
});

export const getContent = cached("content", async (): Promise<SiteContent> => {
  const rows = await store.list("Content");
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(
    CONTENT_FIELDS.map((f) => [f.key, map.get(f.key) || f.default]),
  ) as SiteContent;
});

/** Public-site helper that never throws, so a Sheets outage doesn't white-screen the site. */
export async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch (e) {
    console.error(e);
    return fallback;
  }
}
