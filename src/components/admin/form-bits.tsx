"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/admin/actions";

/**
 * useActionState wired through onSubmit, so React doesn't reset the form's fields
 * after the action runs (keeps the admin's input when validation fails).
 */
export function useFormAction(fn: (state: FormState, fd: FormData) => Promise<FormState>) {
  const [state, action, pending] = useActionState(fn, undefined);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  };
  return { state, onSubmit, pending };
}

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  busy,
  className = "btn-primary",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  /** Pass when the form uses useFormAction (useFormStatus can't see onSubmit transitions). */
  busy?: boolean;
  className?: string;
}) {
  const status = useFormStatus();
  const pending = busy ?? status.pending;
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending && (
        <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
          <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" />
        </svg>
      )}
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state?.error && !state?.ok) return null;
  return (
    <div
      role={state.error ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm ${
        state.error ? "bg-red-50 text-red-800 ring-1 ring-red-200" : "bg-leaf-50 text-leaf-700 ring-1 ring-leaf-100"
      }`}
    >
      {state.error ?? state.ok}
    </div>
  );
}

/** Image picker: upload a file (with preview) or paste a URL. */
export function ImageField({
  name,
  fileName,
  defaultValue = "",
  label = "Image",
}: {
  name: string;
  fileName: string;
  defaultValue?: string;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const shown = preview ?? url;

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative grid aspect-[4/5] w-full shrink-0 place-items-center overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200 sm:w-40">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin URLs / blob previews
            <img src={shown} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="px-4 text-center text-xs text-stone-400">No image</span>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white px-4 py-6 text-center transition hover:border-bract-400 hover:bg-bract-50/40">
            <svg viewBox="0 0 24 24" className="size-6 text-bract-600" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            <span className="mt-2 text-sm font-medium text-stone-800">
              {preview ? "Change selected image" : "Upload an image"}
            </span>
            <span className="text-xs text-stone-500">JPG, PNG, WebP · max 4 MB</span>
            <input
              ref={fileRef}
              type="file"
              name={fileName}
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setPreview(f ? URL.createObjectURL(f) : null);
              }}
            />
          </label>
          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span className="h-px flex-1 bg-stone-200" /> or paste a URL <span className="h-px flex-1 bg-stone-200" />
          </div>
          <div className="flex gap-2">
            <input
              name={name}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className="input"
              disabled={!!preview}
            />
            {(url || preview) && (
              <button
                type="button"
                className="btn-ghost shrink-0"
                onClick={() => {
                  setUrl("");
                  setPreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConfirmButton({
  children,
  message,
  className = "btn-danger",
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

export function Toggle({ name, defaultChecked, label, hint }: { name: string; defaultChecked?: boolean; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-stone-300 transition peer-checked:bg-bract-600 peer-focus-visible:ring-4 peer-focus-visible:ring-bract-500/20 after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
      <span>
        <span className="block text-sm font-medium text-stone-800">{label}</span>
        {hint && <span className="block text-xs text-stone-500">{hint}</span>}
      </span>
    </label>
  );
}
