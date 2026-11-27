import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, TITLE_SUFFIX } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { siteJsonLd } from "@/lib/structured-data";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col">
        <JsonLd data={siteJsonLd()} />
        <Navbar />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
        {/* Cookieless page views. No ad pixels, per the privacy policy. */}
        <Analytics />
      </body>
    </html>
  );
}
