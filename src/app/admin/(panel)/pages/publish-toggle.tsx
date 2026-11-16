"use client";

import { useState, useTransition } from "react";
import { setPagePublished } from "../../actions";

/** Switch that publishes / unpublishes a page straight from the list. */
export function PublishToggle({ id, title, published }: { id: string; title: string; published: boolean }) {
  const [on, setOn] = useState(published);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const toggle = () =>
    start(async () => {
      const next = !on;
      setOn(next); // optimistic
      setError("");
      const res = await setPagePublished(id, next);
      if (res?.error) {
        setOn(!next);
        setError(res.error);
      }
    });

  return (
    <div className="relative flex items-center gap-2.5">
      <span className={`w-16 text-right text-xs ${on ? "text-emerald-700" : "text-stone-500"}`}>{on ? "Published" : "Draft"}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`Publish “${title}”`}
        title={on ? "Click to unpublish" : "Click to publish"}
        disabled={pending}
        onClick={toggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bract-500/20 disabled:opacity-60 ${
          on ? "bg-emerald-600" : "bg-stone-300"
        }`}
      >
        <span className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition ${on ? "translate-x-5" : ""}`} />
      </button>
      {error && (
        <p role="alert" className="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg bg-red-50 p-2 text-xs text-red-800 shadow ring-1 ring-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
