import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { getContent, safe } from "@/lib/data";
import { CONTENT_FIELDS, type SiteContent } from "@/lib/schema";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

const defaults = Object.fromEntries(CONTENT_FIELDS.map((f) => [f.key, f.default])) as SiteContent;

export async function generateMetadata(): Promise<Metadata> {
  const c = await safe(getContent(), defaults);
  return {
    title: { default: `${c.siteName} — ${c.tagline}`, template: `%s · ${c.siteName}` },
    description: c.heroSubtitle,
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
