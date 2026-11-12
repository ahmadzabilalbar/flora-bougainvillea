"use client";

import { saveContent } from "../../actions";
import { FormMessage, ImageField, SubmitButton, Toggle, useFormAction } from "@/components/admin/form-bits";
import { CONTENT_FIELDS, isOn, type ContentKey, type SiteContent } from "@/lib/schema";

const SECTIONS: { title: string; keys: ContentKey[] }[] = [
  {
    title: "Sections — show / hide",
    keys: ["showTypes", "showFeatured", "showAbout", "showContact", "showTypeName", "showEnquiry"],
  },
  { title: "Brand", keys: ["siteName", "tagline", "footerText"] },
  { title: "Home — hero", keys: ["heroTitle", "heroSubtitle", "heroImage"] },
  { title: "Home — about", keys: ["aboutTitle", "aboutBody"] },
  { title: "Contact", keys: ["contactEmail", "contactPhone", "whatsapp", "address"] },
];

export function ContentForm({ content }: { content: SiteContent }) {
  const { state, onSubmit, pending } = useFormAction(saveContent);
  const field = (key: ContentKey) => CONTENT_FIELDS.find((f) => f.key === key)!;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {SECTIONS.map((s) => (
        <fieldset key={s.title} className="card space-y-5 p-5 sm:p-6">
          <legend className="sr-only">{s.title}</legend>
          <h2 className="font-medium text-stone-900">{s.title}</h2>
          {s.keys.map((k) => {
            const f = field(k);
            if (f.type === "toggle")
              return <Toggle key={k} name={k} defaultChecked={isOn(content[k])} label={f.label} />;
            if (f.type === "image")
              return <ImageField key={k} name={k} fileName={`${k}File`} defaultValue={content[k]} label={f.label} />;
            return (
              <div key={k}>
                <label htmlFor={k} className="label">
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea id={k} name={k} rows={4} defaultValue={content[k]} className="input" />
                ) : (
                  <input id={k} name={k} defaultValue={content[k]} className="input" />
                )}
              </div>
            );
          })}
        </fieldset>
      ))}
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl bg-white/90 p-3 shadow-lg ring-1 ring-stone-200 backdrop-blur">
        <SubmitButton busy={pending}>Save content</SubmitButton>
        <div className="min-w-0 flex-1">
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  );
}
