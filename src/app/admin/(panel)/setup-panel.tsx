"use client";

import { useActionState } from "react";
import { setupStore } from "../actions";
import { FormMessage, SubmitButton } from "@/components/admin/form-bits";

export function SetupPanel({ sheetsConfigured, sheetId }: { sheetsConfigured: boolean; sheetId: string }) {
  const [state, action] = useActionState(setupStore, undefined);
  return (
    <section className="card p-5">
      <h2 className="font-medium text-stone-900">Data source</h2>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className={`size-2 rounded-full ${sheetsConfigured ? "bg-emerald-500" : "bg-amber-500"}`} />
        {sheetsConfigured ? (
          <span>
            Google Sheets ·{" "}
            <a
              href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bract-700 underline underline-offset-2"
            >
              Open spreadsheet ↗
            </a>
          </span>
        ) : (
          <span className="text-stone-600">Local JSON file — set Google env vars to use Sheets.</span>
        )}
      </div>
      <p className="mt-3 text-sm text-stone-500">
        Creates the <code className="text-xs">Types</code>, <code className="text-xs">Varieties</code>,{" "}
        <code className="text-xs">Pages</code> and <code className="text-xs">Content</code> tabs with headers, and
        refreshes the cache. Safe to run any time.
      </p>
      <form action={action} className="mt-4 space-y-3">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input type="checkbox" name="seed" className="size-4 accent-bract-600" />
          Add sample data to empty tables
        </label>
        <FormMessage state={state} />
        <SubmitButton pendingLabel="Running…" className="btn-dark w-full">
          Run setup &amp; refresh
        </SubmitButton>
      </form>
    </section>
  );
}
