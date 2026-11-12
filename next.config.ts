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
      // Images are compressed in the browser and capped at 1.5 MB server-side.
      bodySizeLimit: "2mb",
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
