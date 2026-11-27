import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

/**
 * Only https://dioshift.com is crawlable. Previews, local builds and any
 * build without SITE_URL=https://dioshift.com block every crawler.
 */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/signup/success", "/signup/resume"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
