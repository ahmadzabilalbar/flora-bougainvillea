import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Classic caching model: Sheets reads are cached with unstable_cache + tags (src/lib/data.ts),
  // which persists across deployments and keeps Google Sheets API usage low.
  cacheComponents: false,
  images: {
    // Admins can paste image URLs from anywhere; uploads go to Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: {
      // Image uploads go through Server Actions (Vercel caps request bodies at ~4.5 MB).
      bodySizeLimit: "4.5mb",
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
