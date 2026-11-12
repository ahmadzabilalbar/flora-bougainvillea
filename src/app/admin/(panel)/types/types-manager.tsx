"use client";

import { useEffect, useRef, useState } from "react";
import { deleteType, saveType } from "../../actions";
import { FormMessage, SubmitButton, useFormAction } from "@/components/admin/form-bits";
import type { BougainvilleaType } from "@/lib/schema";

export function AddType({ nextSort }: { nextSort: number }) {
  const { state, onSubmit, pending } = useFormAction(saveType);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} onSubmit={onSubmit} className="card space-y-4 p-5">
      <h2 className="font-medium text-stone-900">Add a type</h2>
      <div className="grid gap-3 sm:grid-cols-[1fr_2fr_6rem]">
        <input name="name" required maxLength={80} placeholder="Type name" className="input" aria-label="Type name" />
        <input name="description" maxLength={1000} placeholder="Short description (optional)" className="input" aria-label="Description" />
        <input name="sort" type="number" defaultValue={nextSort} className="input" aria-label="Sort order" />
      </div>
      <FormMessage state={state} />
      <SubmitButton busy={pending} pendingLabel="Adding…">
        Add type
      </SubmitButton>
    </form>
  );
}

export function TypeRow({ type, count }: { type: BougainvilleaType; count: number }) {
  const [editing, setEditing] = useState(false);
  const save = useFormAction(saveType);
  const del = useFormAction(deleteType);
  const state = del.state?.error ? del.state : save.state;

  if (!editing) {
    return (
      <div className="card flex flex-wrap items-center gap-4 p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-stone-100 text-xs font-medium text-stone-500">
          {type.sort}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-stone-900">{type.name}</div>
          <div className="truncate text-sm text-stone-500">{type.description || "No description"}</div>
        </div>
        <span className="rounded-full bg-bract-50 px-2.5 py-1 text-xs text-bract-700">
          {count} variet{count === 1 ? "y" : "ies"}
        </span>
        <button onClick={() => setEditing(true)} className="btn-ghost px-3 py-1.5 text-xs">
          Edit
        </button>
        {state?.error && <div className="w-full"><FormMessage state={state} /></div>}
      </div>
    );
  }

  return (
    <div className="card space-y-3 p-4 ring-2 ring-bract-200">
      <form onSubmit={save.onSubmit} className="space-y-3">
        <input type="hidden" name="id" value={type.id} />
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr_6rem]">
          <input name="name" required maxLength={80} defaultValue={type.name} className="input" aria-label="Type name" />
          <input name="description" maxLength={1000} defaultValue={type.description} className="input" aria-label="Description" />
          <input name="sort" type="number" defaultValue={type.sort} className="input" aria-label="Sort order" />
        </div>
        <FormMessage state={state} />
        <div className="flex flex-wrap gap-2">
          <SubmitButton busy={save.pending}>Save</SubmitButton>
          <button type="button" onClick={() => setEditing(false)} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
      <form
        onSubmit={(e) => {
          if (!confirm(`Delete type “${type.name}”?`)) return e.preventDefault();
          del.onSubmit(e);
        }}
        className="flex justify-end"
      >
        <input type="hidden" name="id" value={type.id} />
        <SubmitButton busy={del.pending} pendingLabel="Deleting…" className="btn-danger">
          Delete type
        </SubmitButton>
      </form>
    </div>
  );
}
