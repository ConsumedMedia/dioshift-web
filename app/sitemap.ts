import type { MetadataRoute } from "next";
import { PUBLISHED_INDUSTRIES, industryPath } from "@/lib/industries";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/legal";
import { absoluteUrl } from "@/lib/site-config";

type Entry = MetadataRoute.Sitemap[number];

/**
 * Every public page. /signup/success, /signup/resume and /api are left out
 * on purpose: they're noindex and blocked in robots.txt.
 */
const PAGES: Array<{ path: string } & Omit<Entry, "url">> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.8 },
  { path: "/streaming-tv-advertising", changeFrequency: "monthly", priority: 0.8 },
  { path: "/columbus-streaming-tv-advertising", changeFrequency: "monthly", priority: 0.8 },
  { path: "/industries", changeFrequency: "monthly", priority: 0.7 },
  ...PUBLISHED_INDUSTRIES.map((industry) => ({
    path: industryPath(industry.slug),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
  { path: "/signup", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "yearly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_EFFECTIVE_DATE },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_EFFECTIVE_DATE },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, ...rest }) => ({ url: absoluteUrl(path), ...rest }));
}
