import type { Metadata, Viewport } from "next";

/** Everything under /admin: private, never indexed, never in the sitemap. */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Dioshift admin" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

/** viewport-fit=cover so the phone tab bar can respect the iOS safe area. */
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0a0b0f",
  colorScheme: "dark",
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
