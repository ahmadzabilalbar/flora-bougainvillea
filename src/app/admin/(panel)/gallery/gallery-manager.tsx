"use client";

import { useRef, useState, useTransition } from "react";
import { addGalleryPhoto, deleteGalleryItem, updateGalleryItem, type FormState } from "../../actions";
import { FormMessage } from "@/components/admin/form-bits";
import { GALLERY_SIZE, compressImage } from "@/lib/compress-image";
import type { GalleryItem } from "@/lib/schema";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

const fileName = (f: File) =>
  f.name
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();

/** Pick one or more photos; each is compressed in the browser and uploaded on its own request. */
export function GalleryUploader() {
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [state, setState] = useState<FormState>();
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (files: File[]) => {
    if (!files.length) return;
    setState(undefined);
    setProgress({ done: 0, total: files.length });
    const errors: string[] = [];
    for (const [i, original] of files.entries()) {
      try {
        const { file } = await compressImage(original, { square: GALLERY_SIZE });
        const fd = new FormData();
        fd.set("file", file);
        fd.set("name", fileName(original));
        const res = await addGalleryPhoto(fd);
        if (res?.error) errors.push(`${original.name}: ${res.error}`);
      } catch (e) {
        errors.push(`${original.name}: ${e instanceof Error ? e.message : "Upload failed."}`);
      }
      setProgress({ done: i + 1, total: files.length });
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    const added = files.length - errors.length;
    setState(
      errors.length
        ? { error: `${added} of ${files.length} uploaded. ${errors.join(" · ")}` }
        : { ok: `${added} photo${added === 1 ? "" : "s"} added, named from the file names.` },
    );
  };

  const busy = progress !== null;

  return (
    <div className="card space-y-4 p-5">
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white px-4 py-8 text-center transition hover:border-bract-400 hover:bg-bract-50/40 ${
          busy ? "pointer-events-none opacity-70" : ""
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload([...e.dataTransfer.files].filter((f) => f.type.startsWith("image/")));
        }}
      >
        <svg viewBox="0 0 24 24" className="size-7 text-bract-600" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        <span className="mt-2 text-sm font-medium text-stone-800">
          {busy ? `Uploading ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…` : "Upload photos"}
        </span>
        <span className="text-xs text-stone-500">
          Choose or drop several at once · JPG, PNG, WebP · named from the file name · auto-cropped to a centered square, {GALLERY_SIZE}px
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          disabled={busy}
          onChange={(e) => upload([...(e.currentTarget.files ?? [])])}
        />
      </label>
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
      const { file } = await compressImage(original, { square: GALLERY_SIZE });
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
                if (confirm(`Delete photo #${item.number}${item.name ? ` “${item.name}”` : ""}?`)) run(new FormData(), deleteGalleryItem);
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
