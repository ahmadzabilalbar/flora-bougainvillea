"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { addGalleryPhoto, deleteGalleryItem, updateGalleryItem, type FormState } from "../../actions";
import { FormMessage } from "@/components/admin/form-bits";
import { GALLERY_SIZE, compressImage } from "@/lib/compress-image";
import { nameKey, suggestName } from "@/lib/gallery-names";
import type { GalleryItem } from "@/lib/schema";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

/** "BOUGAINVILLEA_pink-lady (2).jpg" → "Bougainvillea Pink Lady (2)" */
const fileName = (f: File) =>
  f.name
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/(^|[\s(])\p{L}/gu, (m) => m.toUpperCase());

/** A picked file waiting to upload. `flagged` rows had a name clash and are shown for review. */
type Row = { file: File; name: string; skip: boolean; flagged: boolean; preview?: string };

/** Clash message per row index: name used by an existing photo, or by an earlier photo in the same upload. */
function findClashes(rows: Row[], existing: Map<string, GalleryItem>) {
  const clashes = new Map<number, string>();
  const seen = new Set<string>();
  rows.forEach((r, i) => {
    const key = nameKey(r.name);
    if (r.skip || !key) return;
    const used = existing.get(key);
    if (used) clashes.set(i, `Already used by photo #${used.number}`);
    else if (seen.has(key)) clashes.set(i, "Same name as another photo in this upload");
    seen.add(key);
  });
  return clashes;
}

/** Pick one or more photos; each is compressed in the browser and uploaded on its own request. */
export function GalleryUploader({ items }: { items: GalleryItem[] }) {
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [state, setState] = useState<FormState>();
  const [review, setReview] = useState<Row[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const existing = new Map(items.filter((g) => nameKey(g.name)).map((g) => [nameKey(g.name), g]));
  const clashes = review ? findClashes(review, existing) : new Map<number, string>();

  // Free the thumbnail URLs when a review is replaced or closed.
  const previews = review?.map((r) => r.preview).filter(Boolean).join("|") ?? "";
  useEffect(() => () => previews.split("|").forEach((u) => u && URL.revokeObjectURL(u)), [previews]);

  const pick = (files: File[]) => {
    if (inputRef.current) inputRef.current.value = "";
    if (!files.length) return;
    setState(undefined);
    const rows: Row[] = files.map((file) => ({ file, name: fileName(file), skip: false, flagged: false }));
    const found = findClashes(rows, existing);
    if (!found.size) return void upload(rows);
    found.forEach((_, i) => {
      rows[i].flagged = true;
      rows[i].preview = URL.createObjectURL(rows[i].file);
    });
    setReview(rows);
  };

  const edit = (i: number, patch: Partial<Row>) =>
    setReview((rows) => rows && rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  /** Give every clashing row the next free "Name 2", "Name 3", … */
  const renameAll = () =>
    setReview((rows) => {
      if (!rows) return rows;
      const taken = new Set(existing.keys());
      return rows.map((r) => {
        const key = nameKey(r.name);
        if (r.skip || !key) return r;
        const name = taken.has(key) ? suggestName(r.name, taken) : r.name;
        taken.add(nameKey(name));
        return { ...r, name };
      });
    });

  const upload = async (rows: Row[]) => {
    const todo = rows.filter((r) => !r.skip);
    const skipped = rows.length - todo.length;
    setReview(null);
    if (!todo.length) return setState({ ok: "Nothing uploaded — all photos were skipped." });
    setProgress({ done: 0, total: todo.length });
    const errors: string[] = [];
    const moved: string[] = [];
    const withText: string[] = [];
    let unchecked = 0;
    for (const [i, row] of todo.entries()) {
      try {
        const { file, text } = await compressImage(row.file, { square: GALLERY_SIZE, avoidText: true });
        const label = row.name.trim() || row.file.name;
        const fd = new FormData();
        fd.set("file", file);
        fd.set("name", row.name.trim());
        const res = await addGalleryPhoto(fd);
        if (res?.error) errors.push(`${row.file.name}: ${res.error}`);
        else if (text === "avoided") moved.push(label);
        else if (text === "partial") withText.push(label);
        else if (text === "unchecked") unchecked++;
      } catch (e) {
        errors.push(`${row.file.name}: ${e instanceof Error ? e.message : "Upload failed."}`);
      }
      setProgress({ done: i + 1, total: todo.length });
    }
    setProgress(null);
    const added = todo.length - errors.length;
    const skipNote = skipped ? ` ${skipped} skipped.` : "";
    const movedNote = moved.length ? ` Crop moved to leave out text in: ${moved.join(", ")}.` : "";
    const textNote = withText.length
      ? ` Text could not be fully cropped out of: ${withText.join(", ")} — use Replace with an edited photo.`
      : "";
    const uncheckedNote = unchecked ? ` ${unchecked} could not be checked for text (centre crop used).` : "";
    const notes = `${skipNote}${movedNote}${textNote}${uncheckedNote}`;
    setState(
      errors.length || withText.length
        ? { error: `${added} of ${todo.length} uploaded.${notes} ${errors.join(" · ")}`.trim() }
        : { ok: `${added} photo${added === 1 ? "" : "s"} added, named from the file names.${notes}` },
    );
  };

  const busy = progress !== null;
  const locked = busy || review !== null;
  const flaggedCount = review?.filter((r) => r.flagged).length ?? 0;
  const uploadCount = review?.filter((r) => !r.skip).length ?? 0;

  return (
    <div className="card space-y-4 p-5">
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white px-4 py-8 text-center transition hover:border-bract-400 hover:bg-bract-50/40 ${
          locked ? "pointer-events-none opacity-70" : ""
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!locked) pick([...e.dataTransfer.files].filter((f) => f.type.startsWith("image/")));
        }}
      >
        <svg viewBox="0 0 24 24" className="size-7 text-bract-600" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        <span className="mt-2 text-sm font-medium text-stone-800">
          {busy ? `Checking for text & uploading ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…` : "Upload photos"}
        </span>
        <span className="text-xs text-stone-500">
          Choose or drop several at once · JPG, PNG, WebP · named from the file name · cropped to a {GALLERY_SIZE}px square that leaves out text and numbers
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          disabled={locked}
          onChange={(e) => pick([...(e.currentTarget.files ?? [])])}
        />
      </label>

      {review && (
        <div role="alert" className="space-y-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <div>
            <p className="font-medium text-amber-900">
              {flaggedCount === 1 ? "1 photo has" : `${flaggedCount} photos have`} a name that is already taken
            </p>
            <p className="text-sm text-amber-800">Give each one another name, or skip it. Nothing has been uploaded yet.</p>
          </div>
          <ul className="space-y-2">
            {review.map((r, i) =>
              r.flagged ? (
                <li
                  key={i}
                  className={`flex items-center gap-3 rounded-xl bg-white p-2 ring-1 ring-amber-200 ${r.skip ? "opacity-60" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a picked file */}
                  <img src={r.preview} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <input
                      value={r.name}
                      onChange={(e) => edit(i, { name: e.target.value })}
                      disabled={r.skip}
                      maxLength={120}
                      aria-label={`Name for ${r.file.name}`}
                      className={`input py-1.5 ${clashes.has(i) ? "border-red-400" : ""}`}
                    />
                    <p
                      className={`truncate text-xs ${
                        r.skip ? "text-stone-500" : clashes.has(i) ? "text-red-700" : "text-leaf-700"
                      }`}
                    >
                      {r.skip ? `Skipped · ${r.file.name}` : (clashes.get(i) ?? `OK · ${r.file.name}`)}
                    </p>
                  </div>
                  <label className="flex shrink-0 items-center gap-1.5 text-xs text-stone-600">
                    <input type="checkbox" checked={r.skip} onChange={(e) => edit(i, { skip: e.target.checked })} />
                    Skip
                  </label>
                </li>
              ) : null,
            )}
          </ul>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn-primary" disabled={clashes.size > 0} onClick={() => upload(review)}>
              Upload {uploadCount} photo{uploadCount === 1 ? "" : "s"}
            </button>
            {clashes.size > 0 && (
              <button type="button" className="btn-ghost" onClick={renameAll}>
                Add numbers automatically
              </button>
            )}
            <button type="button" className="btn-ghost" onClick={() => setReview(null)}>
              Cancel
            </button>
            {clashes.size > 0 && <span className="text-xs text-amber-800">Fix the names marked in red to continue.</span>}
          </div>
        </div>
      )}

      {busy && (
        <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full bg-bract-600 transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
        </div>
      )}
      <FormMessage state={state} />
    </div>
  );
}

/** One gallery photo: rename / renumber inline, replace the photo, or delete it. */
export function GalleryCard({ item }: { item: GalleryItem }) {
  const [name, setName] = useState(item.name);
  const [number, setNumber] = useState(String(item.number));
  const [state, setState] = useState<FormState>();
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty = name.trim() !== item.name || number !== String(item.number);

  const run = (fd: FormData, action: (fd: FormData) => Promise<FormState>) =>
    start(async () => {
      fd.set("id", item.id);
      setState(await action(fd));
    });

  const save = () => {
    if (!dirty || pending) return;
    const fd = new FormData();
    fd.set("name", name);
    fd.set("number", number);
    run(fd, updateGalleryItem);
  };

  const replace = async (input: HTMLInputElement) => {
    const original = input.files?.[0];
    if (!original) return;
    try {
      const { file } = await compressImage(original, { square: GALLERY_SIZE, avoidText: true });
      const fd = new FormData();
      fd.set("file", file);
      run(fd, updateGalleryItem);
    } catch (e) {
      setState({ error: e instanceof Error ? e.message : "Couldn't process this image." });
    } finally {
      input.value = "";
    }
  };

  return (
    <div className={`card overflow-hidden ${pending ? "opacity-70" : ""}`}>
      <div className="relative aspect-square bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an uploaded / pasted URL */}
        <img src={item.imageUrl} alt={item.name || `Photo ${item.number}`} className="absolute inset-0 h-full w-full object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-leaf-900 backdrop-blur">
          #{item.number}
        </span>
      </div>
      <form
        className="space-y-2 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="flex gap-2">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
            onBlur={save}
            inputMode="numeric"
            className="input w-16 shrink-0 px-2 text-center"
            aria-label="Number"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={save}
            maxLength={120}
            placeholder="Add a name"
            className="input min-w-0"
            aria-label="Name"
          />
        </div>
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className={dirty ? "text-amber-700" : "text-stone-400"}>
            {pending ? "Saving…" : dirty ? "Unsaved — press Enter" : "Saved"}
          </span>
          <div className="flex gap-1">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={pending} className="btn-ghost px-2.5 py-1 text-xs">
              Replace
            </button>
            <button
              type="button"
              disabled={pending}
              className="btn-ghost px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
              onClick={() => {
                if (confirm(`Delete photo #${item.number}${item.name ? ` “${item.name}”` : ""}?\n\nPhotos after it move up one number to fill the gap.`))
                  run(new FormData(), deleteGalleryItem);
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <input ref={fileRef} type="file" accept={ACCEPT} className="sr-only" onChange={(e) => replace(e.currentTarget)} />
        {state?.error && <FormMessage state={state} />}
      </form>
    </div>
  );
}
