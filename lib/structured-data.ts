/**
 * schema.org JSON-LD for the site. Every URL comes from lib/site-config.ts and
 * every price from lib/packages.ts, so nothing here can drift out of date.
 * Rendered with the <JsonLd> component.
 */
import { PACKAGES, formatImpressions, formatPrice, getPackageRange } from "@/lib/packages";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const BUSINESS_ID = `${siteConfig.url}/#business`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/** Square 180x180 PNG generated from app/apple-icon.tsx. */
const LOGO_URL = absoluteUrl("/apple-icon");
/** 1200x630 PNG generated from app/opengraph-image.tsx. */
const SHARE_IMAGE_URL = absoluteUrl("/opengraph-image");

function postalAddress() {
  return { "@type": "PostalAddress", ...siteConfig.address };
}

function areaServed() {
  return siteConfig.areaServed.map((area) => ({ "@type": area.type, name: area.name }));
}

/** Fields shared by the Organization and ProfessionalService nodes. */
function businessDetails() {
  return {
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: LOGO_URL,
    email: siteConfig.email,
    // Left out entirely until a phone number is added to site-config.
    ...(siteConfig.phone && { telephone: siteConfig.phone }),
    address: postalAddress(),
    areaServed: areaServed(),
  };
}

/** Root layout: who we are. Organization, local business and website. */
export function siteJsonLd() {
  const { min, max } = getPackageRange();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        ...businessDetails(),
      },
      {
        "@type": "ProfessionalService",
        "@id": BUSINESS_ID,
        ...businessDetails(),
        image: SHARE_IMAGE_URL,
        description:
          "Streaming TV advertising for local businesses. We run your commercial on smart TVs and streaming apps, targeted to your area.",
        priceRange: `${formatPrice(min.monthlyPrice)} to ${formatPrice(max.monthlyPrice)} per month`,
        parentOrganization: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: siteConfig.name,
        url: siteConfig.url,
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: "en-US",
      },
    ],
  };
}

/** Homepage: the service we sell, with one Offer per package. */
export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.url}/#service`,
    name: "Streaming TV advertising",
    serviceType: "Streaming TV advertising",
    description:
      "Your :30 commercial runs full screen inside streaming apps on smart TVs and streaming devices, targeted to households in your area. Monthly plans with guaranteed impressions and no long-term contract.",
    url: siteConfig.url,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: areaServed(),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Monthly streaming TV plans",
      itemListElement: PACKAGES.map((pkg) => ({
        "@type": "Offer",
        name: `${formatImpressions(pkg.impressions)} impressions per month`,
        description: `${pkg.label} plan: your commercial plays in full ${formatImpressions(pkg.impressions)} times a month.`,
        url: absoluteUrl(`/signup?package=${pkg.id}`),
        price: pkg.monthlyPrice,
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: pkg.monthlyPrice,
          priceCurrency: "USD",
          billingDuration: "P1M",
          unitText: "MONTH",
        },
        availability: "https://schema.org/InStock",
        seller: { "@id": ORGANIZATION_ID },
      })),
    },
  };
}

export type BreadcrumbItem = { name: string; path: string };

/** Any breadcrumb trail, in order, starting with Home. */
export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Inner pages: Home > Page name. */
export function breadcrumbJsonLd(name: string, path: string) {
  return breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name, path },
  ]);
}

/** A reference to the organization, with enough detail to stand on its own. */
function organizationRef() {
  return { "@type": "Organization", "@id": ORGANIZATION_ID, name: siteConfig.name, url: siteConfig.url };
}

/** Long-form guides. Author and publisher are the organization. */
export function articleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  path: string;
  /** ISO date, e.g. "2026-11-27". */
  datePublished: string;
  dateModified: string;
}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: url,
    image: SHARE_IMAGE_URL,
    inLanguage: "en-US",
    datePublished,
    dateModified,
    author: organizationRef(),
    publisher: { ...organizationRef(), logo: { "@type": "ImageObject", url: LOGO_URL } },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** /about: the page is about the organization. */
export function aboutPageJsonLd({ description, path }: { description: string; path: string }) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#webpage`,
    name: `About ${siteConfig.name}`,
    description,
    url,
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    mainEntity: { "@id": ORGANIZATION_ID },
  };
}

/** Streaming TV advertising for one local area, e.g. the Columbus page. */
export function localServiceJsonLd({
  name,
  description,
  path,
  areas,
}: {
  name: string;
  description: string;
  path: string;
  /** Area names, e.g. "Franklin County, Ohio". */
  areas: string[];
}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: "Streaming TV advertising",
    description,
    url,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: areas.map((area) => ({ "@type": "AdministrativeArea", name: area })),
  };
}

/** Streaming TV advertising aimed at one industry. */
export function industryServiceJsonLd({
  name,
  description,
  path,
  audience,
}: {
  name: string;
  description: string;
  path: string;
  /** Who the service is for, e.g. "Auto dealers". */
  audience: string;
}) {
  const { min, max } = getPackageRange();
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: "Streaming TV advertising",
    description,
    url,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: areaServed(),
    audience: { "@type": "BusinessAudience", audienceType: audience },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: min.monthlyPrice,
      highPrice: max.monthlyPrice,
      offerCount: PACKAGES.length,
      url: absoluteUrl("/pricing"),
    },
  };
}
