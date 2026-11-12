"use server";

import { randomUUID } from "crypto";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkCredentials, endSession, requireAdmin, startSession } from "@/lib/auth";
import { DATA_TAG, getContent, getPages, getTypes, getVarieties } from "@/lib/data";
import { deleteStoredImage, imageFromForm } from "@/lib/images";
import { CONTENT_FIELDS } from "@/lib/schema";
import { store } from "@/lib/store";
import { SAMPLE_PAGES, SAMPLE_TYPES, SAMPLE_VARIETIES } from "@/lib/sample-data";

export type FormState = { error?: string; ok?: string } | undefined;

const str = (fd: FormData, k: string, max = 5000) => String(fd.get(k) ?? "").trim().slice(0, max);
const newId = () => randomUUID().replace(/-/g, "").slice(0, 10);
const now = () => new Date().toISOString();

function refresh() {
  updateTag(DATA_TAG);
  revalidatePath("/", "layout");
}

/** Deletes `oldUrl` from storage if it changed and nothing else still uses it. */
async function cleanupImage(oldUrl: string | undefined, newUrl = "") {
  if (!oldUrl || oldUrl === newUrl) return;
  const [varieties, content] = await Promise.all([store.list("Varieties"), store.list("Content")]);
  const inUse = varieties.some((v) => v.imageUrl === oldUrl) || content.some((c) => c.value === oldUrl);
  if (!inUse) await deleteStoredImage(oldUrl);
}

function fail(e: unknown): FormState {
  console.error(e);
  return { error: e instanceof Error ? e.message : "Something went wrong." };
}

// ---------- Auth ----------

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const username = str(fd, "username", 200);
  const password = String(fd.get("password") ?? "").slice(0, 200);
  if (!checkCredentials(username, password)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: "Invalid username or password." };
  }
  await startSession(username);
  const next = str(fd, "next", 200);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ---------- Varieties ----------

export async function saveVariety(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 50);
  const name = str(fd, "name", 120);
  if (!name) return { error: "Name is required." };
  try {
    const previous = id ? (await store.list("Varieties")).find((v) => v.id === id)?.imageUrl : undefined;
    const row = {
      name,
      typeId: str(fd, "typeId", 50),
      color: str(fd, "color", 60),
      description: str(fd, "description"),
      imageUrl: await imageFromForm(fd, "imageFile", "imageUrl"),
      featured: fd.get("featured") ? "TRUE" : "FALSE",
      published: fd.get("published") ? "TRUE" : "FALSE",
      updatedAt: now(),
    };
    if (id) {
      const found = await store.update("Varieties", "id", id, row);
      if (!found) return { error: "This variety no longer exists." };
      await cleanupImage(previous, row.imageUrl);
    } else {
      await store.insert("Varieties", { id: newId(), createdAt: now(), ...row });
    }
  } catch (e) {
    return fail(e);
  }
  refresh();
  redirect("/admin/varieties?saved=1");
}

export async function deleteVariety(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 50);
  const previous = (await store.list("Varieties")).find((v) => v.id === id)?.imageUrl;
  await store.remove("Varieties", "id", id);
  await cleanupImage(previous);
  refresh();
  redirect("/admin/varieties");
}

export async function toggleVarietyFlag(fd: FormData) {
  await requireAdmin();
  const field = str(fd, "field", 20);
  if (field !== "featured" && field !== "published") return;
  await store.update("Varieties", "id", str(fd, "id", 50), {
    [field]: str(fd, "value", 5) === "true" ? "TRUE" : "FALSE",
    updatedAt: now(),
  });
  refresh();
}

// ---------- Types ----------

export async function saveType(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 50);
  const name = str(fd, "name", 80);
  if (!name) return { error: "Type name is required." };
  const row = { name, description: str(fd, "description", 1000), sort: String(Number(str(fd, "sort", 6)) || 0) };
  try {
    const types = await getTypes();
    if (types.some((t) => t.name.toLowerCase() === name.toLowerCase() && t.id !== id)) {
      return { error: `A type named “${name}” already exists.` };
    }
    if (id) await store.update("Types", "id", id, row);
    else await store.insert("Types", { id: newId(), ...row });
  } catch (e) {
    return fail(e);
  }
  refresh();
  return { ok: id ? "Type updated." : "Type added." };
}

export async function deleteType(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 50);
  try {
    const used = (await getVarieties()).filter((v) => v.typeId === id).length;
    if (used) return { error: `Can't delete: ${used} variet${used === 1 ? "y uses" : "ies use"} this type.` };
    await store.remove("Types", "id", id);
  } catch (e) {
    return fail(e);
  }
  refresh();
  return { ok: "Type deleted." };
}

// ---------- Site content ----------

export async function saveContent(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const before = new Map((await store.list("Content")).map((r) => [r.key, r.value]));
    const rows = [];
    for (const f of CONTENT_FIELDS) {
      const value =
        f.type === "image"
          ? await imageFromForm(fd, `${f.key}File`, f.key)
          : f.type === "toggle"
            ? fd.get(f.key) ? "true" : "false"
            : str(fd, f.key, 5000);
      rows.push({ key: f.key, value });
    }
    await store.upsertMany("Content", "key", rows);
    for (const f of CONTENT_FIELDS.filter((x) => x.type === "image")) {
      await cleanupImage(before.get(f.key), rows.find((r) => r.key === f.key)?.value);
    }
  } catch (e) {
    return fail(e);
  }
  refresh();
  return { ok: "Website content saved." };
}

// ---------- Pages ----------

export async function savePage(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 50);
  const title = str(fd, "title", 150);
  const slug = (str(fd, "slug", 80) || title)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!title) return { error: "Title is required." };
  if (!slug) return { error: "Slug is required." };
  try {
    const pages = await getPages();
    if (pages.some((p) => p.slug === slug && p.id !== id)) {
      return { error: `Another page already uses the URL /pages/${slug}.` };
    }
    const row = {
      slug,
      title,
      body: str(fd, "body", 45000), // Sheets cell limit is 50k chars
      published: fd.get("published") ? "TRUE" : "FALSE",
      sort: String(Number(str(fd, "sort", 6)) || 0),
      updatedAt: now(),
    };
    if (id) await store.update("Pages", "id", id, row);
    else await store.insert("Pages", { id: newId(), ...row });
  } catch (e) {
    return fail(e);
  }
  refresh();
  redirect("/admin/pages?saved=1");
}

export async function deletePage(fd: FormData) {
  await requireAdmin();
  await store.remove("Pages", "id", str(fd, "id", 50));
  refresh();
  redirect("/admin/pages");
}

// ---------- Setup ----------

export async function setupStore(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const created = await store.ensureSchema();
    let seeded = "";
    if (fd.get("seed")) {
      const [types, varieties, pages, content] = await Promise.all([
        getTypes(),
        getVarieties(),
        getPages(),
        getContent(),
      ]);
      // Add any sample rows whose id doesn't exist yet (never overwrites existing rows).
      const missing = <T extends { id: string }>(sample: T[], existing: { id: string }[]) =>
        sample.filter((r) => !existing.some((e) => e.id === r.id));
      const newTypes = missing(SAMPLE_TYPES, types);
      const newVarieties = missing(SAMPLE_VARIETIES, varieties);
      const newPages = missing(SAMPLE_PAGES, pages);
      if (newTypes.length) await store.upsertMany("Types", "id", newTypes);
      if (newVarieties.length)
        await store.upsertMany(
          "Varieties",
          "id",
          newVarieties.map((v, i) => ({
            ...v,
            createdAt: new Date(Date.now() - i * 60000).toISOString(),
            updatedAt: now(),
          })),
        );
      if (newPages.length) await store.upsertMany("Pages", "id", newPages.map((p) => ({ ...p, updatedAt: now() })));
      await store.upsertMany(
        "Content",
        "key",
        CONTENT_FIELDS.map((f) => ({ key: f.key, value: content[f.key] })),
      );
      seeded = ` Sample data added: ${newTypes.length} types, ${newVarieties.length} varieties, ${newPages.length} pages.`;
    }
    refresh();
    return {
      ok: (created.length ? `Created tabs: ${created.join(", ")}.` : "All tabs already exist.") + seeded,
    };
  } catch (e) {
    return fail(e);
  }
}
