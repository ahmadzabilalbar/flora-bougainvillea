"use client";

import Link from "next/link";
import { useState } from "react";
import { deletePage, savePage } from "../../actions";
import { ConfirmButton, FormMessage, SubmitButton, Toggle, useFormAction } from "@/components/admin/form-bits";
import { Prose } from "@/components/prose";
import type { Page } from "@/lib/schema";

export function PageForm({ page }: { page?: Page }) {
  const { state, onSubmit, pending } = useFormAction(savePage);
  const [body, setBody] = useState(page?.body ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-6">
        {page && <input type="hidden" name="id" value={page.id} />}
        <div className="card grid gap-5 p-5 sm:grid-cols-[1fr_1fr_6rem] sm:p-6">
          <div>
            <label htmlFor="title" className="label">
              Title <span className="text-bract-600">*</span>
            </label>
            <input id="title" name="title" required maxLength={150} defaultValue={page?.title} className="input" />
          </div>
          <div>
            <label htmlFor="slug" className="label">
              URL slug
            </label>
            <div className="flex items-center rounded-xl border border-stone-300 bg-stone-50 pl-3 text-sm text-stone-500 focus-within:border-bract-500 focus-within:ring-4 focus-within:ring-bract-500/15">
              /pages/
              <input id="slug" name="slug" defaultValue={page?.slug} placeholder="auto from title" className="w-full rounded-r-xl bg-white px-2 py-2.5 text-stone-900 outline-none" />
            </div>
          </div>
          <div>
            <label htmlFor="sort" className="label">
              Order
            </label>
            <input id="sort" name="sort" type="number" defaultValue={page?.sort ?? 0} className="input" />
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="label mb-0">Content</span>
            <div className="flex rounded-full bg-stone-100 p-1 text-xs">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-full px-3 py-1 capitalize ${tab === t ? "bg-white shadow-sm" : "text-stone-500"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <textarea
            name="body"
            rows={16}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`input font-mono text-[13px] leading-relaxed ${tab === "preview" ? "hidden" : ""}`}
          />
          {tab === "preview" && (
            <div className="min-h-64 rounded-xl border border-stone-200 p-5">
              <Prose source={body || "Nothing to preview yet."} />
            </div>
          )}
          <p className="mt-2 text-xs text-stone-500">
            Formatting: <code>## Heading</code>, <code>### Subheading</code>, <code>- list item</code>, <code>**bold**</code>,{" "}
            <code>[link](https://…)</code>. Leave a blank line between paragraphs.
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          <Toggle name="published" defaultChecked={page?.published ?? true} label="Published" hint="Visible on the website and in the menu" />
        </div>

        <FormMessage state={state} />
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton busy={pending}>{page ? "Save page" : "Create page"}</SubmitButton>
          <Link href="/admin/pages" className="btn-ghost">
            Cancel
          </Link>
          {page?.published && (
            <Link href={`/pages/${page.slug}`} target="_blank" className="ml-auto text-sm text-stone-500 hover:text-stone-900">
              View on site ↗
            </Link>
          )}
        </div>
      </form>

      {page && (
        <form action={deletePage} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50/40 p-5">
          <div className="text-sm font-medium text-red-900">Delete this page</div>
          <input type="hidden" name="id" value={page.id} />
          <ConfirmButton message={`Delete “${page.title}”? This cannot be undone.`}>Delete</ConfirmButton>
        </form>
      )}
    </div>
  );
}
