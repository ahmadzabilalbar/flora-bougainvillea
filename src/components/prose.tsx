import { Fragment, type ReactNode } from "react";

/**
 * Minimal, safe Markdown subset for CMS pages: "## heading", "### heading",
 * "- list items", **bold**, [links](https://…) and paragraphs. No raw HTML.
 */
function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|mailto:[^\s)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={m.index}>{m[1]}</strong>);
    else
      parts.push(
        <a key={m.index} href={m[3]} className="text-bract-700 underline underline-offset-4 hover:text-bract-900">
          {m[2]}
        </a>,
      );
    last = re.lastIndex;
  }
  parts.push(text.slice(last));
  return parts;
}

export function Prose({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-5 text-lg leading-relaxed text-stone-700">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter(Boolean);
        if (!lines.length) return null;
        // A heading may be followed by text in the same block.
        const out: ReactNode[] = [];
        let list: string[] = [];
        let para: string[] = [];
        const flush = () => {
          if (list.length) {
            out.push(
              <ul key={`u${out.length}`} className="space-y-2 pl-1">
                {list.map((li, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-3 size-1.5 shrink-0 rounded-full bg-bract-500" />
                    <span>{inline(li)}</span>
                  </li>
                ))}
              </ul>,
            );
            list = [];
          }
          if (para.length) {
            out.push(<p key={`p${out.length}`}>{inline(para.join(" "))}</p>);
            para = [];
          }
        };
        for (const line of lines) {
          const h = /^(#{2,3})\s+(.*)$/.exec(line);
          if (h) {
            flush();
            out.push(
              h[1].length === 2 ? (
                <h2 key={`h${out.length}`} className="pt-4 font-display text-3xl text-leaf-900">
                  {h[2]}
                </h2>
              ) : (
                <h3 key={`h${out.length}`} className="pt-2 font-display text-2xl text-leaf-900">
                  {h[2]}
                </h3>
              ),
            );
          } else if (/^[-*]\s+/.test(line)) {
            if (para.length) flush();
            list.push(line.replace(/^[-*]\s+/, ""));
          } else {
            if (list.length) flush();
            para.push(line);
          }
        }
        flush();
        return <Fragment key={i}>{out}</Fragment>;
      })}
    </div>
  );
}
