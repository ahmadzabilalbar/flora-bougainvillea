"use client";

import { useActionState } from "react";
import { toggleVarietyFlag } from "../../actions";

export function FlagButton({
  id,
  field,
  on,
  labels,
}: {
  id: string;
  field: "featured" | "published";
  on: boolean;
  labels: [string, string];
}) {
  const [state, action, pending] = useActionState(toggleVarietyFlag, undefined);
  return (
    <form action={action} className="relative">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(!on)} />
      <button
        title={`Toggle ${field}`}
        disabled={pending}
        className={`rounded-full px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
          on
            ? field === "featured"
              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
            : "bg-stone-100 text-stone-500 hover:bg-stone-200"
        }`}
      >
        {on ? labels[0] : labels[1]}
      </button>
      {state?.error && (
        <p role="alert" className="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg bg-red-50 p-2 text-xs text-red-800 shadow ring-1 ring-red-200">
          {state.error}
        </p>
      )}
    </form>
  );
}
