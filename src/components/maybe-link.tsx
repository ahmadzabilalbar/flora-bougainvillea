import Link from "next/link";

/** A Link when `href` is set, otherwise a plain div with the same styling (e.g. when its target page is hidden). */
export function MaybeLink({ href, className, children }: { href?: string; className?: string; children: React.ReactNode }) {
  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}
