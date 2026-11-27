import type { Metadata, Viewport } from "next";
import { Geist, Syne } from "next/font/google";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, TITLE_SUFFIX } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

// One family for headings and body text. Variable font, so every weight is in one file.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

// Only the Dioshift wordmark (components/Logo.tsx) uses Syne, so load just ExtraBold.
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: DEFAULT_TITLE,
    template: `%s${TITLE_SUFFIX}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: siteConfig.name,
  // Only the real domain gets indexed. Previews and local builds stay out.
  // /signup/success and /signup/resume set their own noindex on top of this.
  robots: siteConfig.isProduction ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  ...((googleVerification || bingVerification) && {
    verification: {
      ...(googleVerification && { google: googleVerification }),
      ...(bingVerification && { other: { "msvalidate.01": bingVerification } }),
    },
  }),
};

export const viewport: Viewport = {
  themeColor: "#0a0b0f",
  colorScheme: "dark",
};

/**
 * Shared by the public site and the admin. The public site's navbar, footer
 * and structured data live in app/(site)/layout.tsx; the admin has its own
 * chrome in app/admin and stays out of analytics.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${syne.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
