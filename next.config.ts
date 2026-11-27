import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * Optional hero video files, detected once at build time (and when the dev
 * server starts). Each value is the public URL if the file exists, or "".
 * Read in components/visuals/HeroMedia.tsx.
 */
const heroMedia = (file: string) =>
  fs.existsSync(path.join(__dirname, "public", "media", file)) ? `/media/${file}` : "";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  env: {
    HERO_VIDEO_MP4: heroMedia("hero-loop.mp4"),
    HERO_VIDEO_WEBM: heroMedia("hero-loop.webm"),
    HERO_POSTER: heroMedia("hero-poster.jpg"),
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
