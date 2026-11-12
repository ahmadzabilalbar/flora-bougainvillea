import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Classic caching model: Sheets reads are cached with unstable_cache + tags (src/lib/data.ts),
  // which persists across deployments and keeps Google Sheets API usage low.
  cacheComponents: false,
  // Public URLs are in Bahasa Melayu; keep the old English URLs working.
  async redirects() {
    return [
      { source: "/collection", destination: "/koleksi", permanent: true },
      { source: "/collection/:id", destination: "/koleksi/:id", permanent: true },
      { source: "/pages/:slug", destination: "/halaman/:slug", permanent: true },
      // Sample "ordering" page was replaced by the hobby story page.
      { source: "/halaman/tempahan", destination: "/halaman/kisah", permanent: true },
    ];
  },
  images: {
    // Admins can paste image URLs from anywhere; uploads go to Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: {
      // Images are compressed in the browser (~500 KB) and capped at 1.2 MB each; a variety saves up to 3.
      bodySizeLimit: "4mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
