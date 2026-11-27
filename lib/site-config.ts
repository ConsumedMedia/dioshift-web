/**
 * Single source of truth for Dioshift's business details. Metadata, the
 * sitemap, robots.txt, structured data and llms.txt all read from here.
 *
 * Server side only in practice: SITE_URL isn't exposed to the browser.
 */

const PRODUCTION_URL = "https://dioshift.com";

/** SITE_URL with any trailing slash removed ("" if unset). */
const envUrl = process.env.SITE_URL?.trim().replace(/\/+$/, "") ?? "";

/** Used to build every absolute URL. Falls back to the production URL. */
const url = envUrl || PRODUCTION_URL;

export const siteConfig = {
  name: "Dioshift",
  legalName: "Dioshift LLC",
  url,
  email: "support@dioshift.com",
  // TODO: add the business phone number (for example "+1-614-555-0100").
  // While this is null it's left out of structured data and llms.txt.
  phone: null as string | null,
  address: {
    streetAddress: "3148 Broadway, Suite 300",
    addressLocality: "Grove City",
    addressRegion: "OH",
    postalCode: "43123",
    addressCountry: "US",
  },
  areaServed: [
    { type: "AdministrativeArea", name: "Columbus, Ohio metro area" },
    { type: "State", name: "Ohio" },
  ],
  /**
   * True only when SITE_URL is explicitly "https://dioshift.com". Everything
   * else (localhost, vercel.app previews, SITE_URL unset) is kept out of
   * search engines by robots.txt and the robots meta tag. Checked against the
   * env value, not the fallback, so a build that forgets SITE_URL stays
   * noindex instead of getting indexed by accident.
   */
  isProduction: envUrl === PRODUCTION_URL,
} as const;

/** "/faq" -> "https://dioshift.com/faq". "/" -> "https://dioshift.com". */
export function absoluteUrl(path: string = "/"): string {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}

/** "3148 Broadway, Suite 300, Grove City, OH 43123" */
export function formatAddress(): string {
  const a = siteConfig.address;
  return `${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`;
}
