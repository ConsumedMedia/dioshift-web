import type { MetadataRoute } from "next";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/legal";
import { absoluteUrl } from "@/lib/site-config";

type Entry = MetadataRoute.Sitemap[number];

/**
 * Every public page. /signup/success, /signup/resume and /api are left out
 * on purpose: they're noindex and blocked in robots.txt.
 */
const PAGES: Array<{ path: string } & Omit<Entry, "url">> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.8 },
  { path: "/signup", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_EFFECTIVE_DATE },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_EFFECTIVE_DATE },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, ...rest }) => ({ url: absoluteUrl(path), ...rest }));
}
