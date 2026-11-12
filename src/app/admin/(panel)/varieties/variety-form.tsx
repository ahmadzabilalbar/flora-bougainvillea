"use client";

import Link from "next/link";
import { deleteVariety, saveVariety } from "../../actions";
import { ConfirmButton, FormMessage, ImageField, SubmitButton, Toggle, useFormAction } from "@/components/admin/form-bits";
import type { BougainvilleaType, Variety } from "@/lib/schema";

const COLOR_SUGGESTIONS = ["Magenta", "Crimson", "Pink", "Purple", "Orange", "Gold", "White", "Coral", "Lavender", "Bicolour"];

export function VarietyForm({ variety, types }: { variety?: Variety; types: BougainvilleaType[] }) {
  const { state, onSubmit, pending } = useFormAction(saveVariety);

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-6">
        {variety && <input type="hidden" name="id" value={variety.id} />}
        <div className="card space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="label">
                Name <span className="text-bract-600">*</span>
              </label>
              <input id="name" name="name" required maxLength={120} defaultValue={variety?.name} className="input" placeholder="e.g. Barbara Karst" />
            </div>
            <div>
              <label htmlFor="typeId" className="label">
                Type
              </label>
              <select id="typeId" name="typeId" defaultValue={variety?.typeId ?? ""} className="input">
                <option value="">— No type —</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {!types.length && (
                <p className="mt-1.5 text-xs text-stone-500">
                  <Link href="/admin/types" className="text-bract-700 underline">
                    Create types
                  </Link>{" "}
                  to categorise varieties.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="color" className="label">
                Bract colour
              </label>
              <input id="color" name="color" list="color-suggestions" defaultValue={variety?.color} className="input" placeholder="e.g. Magenta" />
              <datalist id="color-suggestions">
                {COLOR_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea id="description" name="description" rows={5} defaultValue={variety?.description} className="input" placeholder="Growth habit, flowering, care notes…" />
            </div>
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <ImageField name="imageUrl" fileName="imageFile" defaultValue={variety?.imageUrl} />
        </div>

        <div className="card grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <Toggle name="published" defaultChecked={variety?.published ?? true} label="Published" hint="Visible on the public website" />
          <Toggle name="featured" defaultChecked={variety?.featured} label="Featured" hint="Shown on the home page" />
        </div>

        <FormMessage state={state} />
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton busy={pending}>{variety ? "Save changes" : "Create variety"}</SubmitButton>
          <Link href="/admin/varieties" className="btn-ghost">
            Cancel
          </Link>
          {variety?.published && (
            <Link href={`/koleksi/${variety.id}`} target="_blank" className="ml-auto text-sm text-stone-500 hover:text-stone-900">
              View on site ↗
            </Link>
          )}
        </div>
      </form>

      {variety && (
        <form action={deleteVariety} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50/40 p-5">
          <div>
            <div className="text-sm font-medium text-red-900">Delete this variety</div>
            <div className="text-xs text-red-700/80">This removes the row from the spreadsheet.</div>
          </div>
          <input type="hidden" name="id" value={variety.id} />
          <ConfirmButton message={`Delete “${variety.name}”? This cannot be undone.`}>Delete</ConfirmButton>
        </form>
      )}
    </div>
  );
}
