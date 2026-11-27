import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { StickyMobileCta } from "@/components/StickyMobileCta";
import { siteJsonLd } from "@/lib/structured-data";

/** Chrome for every public page. The URL paths are unchanged: (site) is a route group. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={siteJsonLd()} />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
      <StickyMobileCta />
      {/* Cookieless page views. No ad pixels, per the privacy policy. */}
      <Analytics />
    </>
  );
}
