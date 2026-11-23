import type { Metadata } from "next";

/**
 * Per-page metadata. Next.js replaces (not merges) openGraph/twitter objects
 * from the root layout, so the shared fields are repeated here.
 */
export function pageMetadata({ title, description }: { title: string; description: string }): Metadata {
  const fullTitle = `${title} | Dioshift`;
  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "Dioshift",
      locale: "en_US",
      title: fullTitle,
      description,
    },
    twitter: { card: "summary", title: fullTitle, description },
  };
}
