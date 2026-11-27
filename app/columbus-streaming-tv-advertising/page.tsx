import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/CtaBanner";
import { FaqAccordion } from "@/components/FaqAccordion";
import { icons } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TargetingMap } from "@/components/visuals/TargetingMap";
import type { FaqGroup } from "@/lib/faq";
import { pageMetadata } from "@/lib/metadata";
import { formatPrice, getPackageRange } from "@/lib/packages";
import { siteConfig } from "@/lib/site-config";
import { localServiceJsonLd } from "@/lib/structured-data";

const PATH = "/columbus-streaming-tv-advertising";
const DESCRIPTION =
  "Streaming TV ads for Columbus businesses, targeted down to the zip codes you serve across Central Ohio. Local team, prices on the page, no contract.";

export const metadata: Metadata = pageMetadata({
  title: "Streaming TV Advertising in Columbus, Ohio",
  description: DESCRIPTION,
  path: PATH,
});

const { min, max } = getPackageRange();

const COUNTIES = ["Franklin", "Delaware", "Licking", "Fairfield", "Union", "Madison", "Pickaway"];

const COMMUNITIES = [
  "Dublin",
  "Westerville",
  "Hilliard",
  "Grove City",
  "Gahanna",
  "New Albany",
  "Pickerington",
  "Canal Winchester",
  "Worthington",
  "Upper Arlington",
  "Powell",
  "Lewis Center",
  "Reynoldsburg",
];

const localReasons = [
  {
    title: "We know Central Ohio",
    body: "Dublin and Canal Winchester are different drives, and different customers. We're based here, so we set up your targeting the way you'd describe your own service area.",
  },
  {
    title: "Down to the zip codes you serve",
    body: "Target the exact zip codes, cities or counties you work in, or a radius around your shop. Nothing wasted on the far side of the metro.",
  },
  {
    title: "You can reach us directly",
    body: `We're in ${siteConfig.address.addressLocality}. Email us and a real person on our team answers. No call center, no ticket queue.`,
  },
];

const localFaq: FaqGroup = {
  id: "columbus",
  title: "Columbus questions",
  items: [
    {
      id: "columbus-only-one-suburb",
      question: "Can I target just one suburb, like Dublin or Grove City?",
      answer:
        "Yes. You can target a single city, a handful of zip codes inside it, or a radius around your location. If most of your customers come from two or three suburbs, we can target just those.",
    },
    {
      id: "columbus-several-counties",
      question: "My customers come from all over Central Ohio. Can one campaign cover several counties?",
      answer:
        "Yes. One campaign can combine counties, cities and zip codes, for example Franklin and Delaware counties plus a few zip codes in Licking. A bigger area spreads your impressions further, so you may want a larger plan to keep your ad showing often enough in each place.",
      links: [{ href: "/pricing", label: "Compare plans" }],
    },
    {
      id: "columbus-outside-area",
      question: "Do I have to be in Columbus to work with you?",
      answer:
        "No. We're based in Central Ohio, but we run campaigns anywhere in Ohio and beyond. Tell us your service area on the signup form and we'll target it.",
    },
    {
      id: "columbus-talk-to-someone",
      question: "Can I talk to someone local before I sign up?",
      answer:
        "Yes. Send us a note through the contact page or email us directly. You'll hear back from someone on our team here in Central Ohio.",
      links: [{ href: "/contact", label: "Contact us" }],
    },
  ],
};

export default function ColumbusPage() {
  return (
    <>
      <JsonLd
        data={localServiceJsonLd({
          name: "Streaming TV advertising in Columbus, Ohio",
          description: DESCRIPTION,
          path: PATH,
          areas: COUNTIES.map((county) => `${county} County, Ohio`),
        })}
      />

      <PageHero
        breadcrumbs={[{ name: "Columbus", path: PATH }]}
        eyebrow="Columbus, Ohio"
        title="Streaming TV Advertising in Columbus, Ohio"
        subtitle="Put your business on the TVs of the Central Ohio households you actually serve. A local team does the setup. You run your business."
      >
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/signup" size="lg">
            Get Started
          </Button>
          <Button href="/pricing" variant="secondary" size="lg">
            See Pricing
          </Button>
        </div>
      </PageHero>

      <Section className="pt-4 sm:pt-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why a local team matters"
              title="Your area, set up by people who know it."
            />
            <ul className="mt-10 space-y-6">
              {localReasons.map((r) => (
                <li key={r.title} className="flex gap-4">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-glow text-accent-soft">
                    {icons.check}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-text-dim">{r.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <TargetingMap size="lg" />
        </div>
      </Section>

      <Section className="border-y border-border bg-surface/40">
        <SectionHeading
          eyebrow="Areas we target"
          title="All across Central Ohio."
          subtitle="Pick a whole county, a few communities or just the zip codes around your shop."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Counties
            </h3>
            <TagList items={COUNTIES.map((c) => `${c} County`)} highlight />
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Communities
            </h3>
            <TagList items={COMMUNITIES} />
          </Card>
        </div>
        <p className="mt-6 text-center text-[15px] text-text-dim">
          Not on the list? We can run your campaign anywhere in Ohio and beyond.
        </p>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="flex h-full flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
              How it works
            </p>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">
              Three steps, then you&apos;re on TV.
            </h2>
            <ol className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-text-dim">
              <li>1. Pick a monthly plan.</li>
              <li>2. Tell us your Central Ohio service area and who you want to reach.</li>
              <li>3. Send your :30 commercial. We set up the targeting and launch it.</li>
            </ol>
            <Link
              href="/how-it-works"
              className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-accent-soft transition-colors hover:text-text"
            >
              See the full process {icons.arrow}
            </Link>
          </Card>
          <Card className="flex h-full flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
              Pricing
            </p>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">
              {formatPrice(min.monthlyPrice)} to {formatPrice(max.monthlyPrice)} a month.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-text-dim">
              Same rate on every plan, with guaranteed impressions, setup included and no
              contract. The price is on the page, so there&apos;s nothing to negotiate.
            </p>
            <Link
              href="/pricing"
              className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-accent-soft transition-colors hover:text-text"
            >
              See every plan {icons.arrow}
            </Link>
          </Card>
        </div>
      </Section>

      <Section className="pt-0 sm:pt-0" containerClassName="max-w-3xl">
        <SectionHeading
          eyebrow="Local questions"
          title="Columbus businesses ask us."
        />
        <div className="mt-12">
          <FaqAccordion groups={[localFaq]} showGroupTitles={false} />
        </div>
      </Section>

      <CtaBanner
        title="Get your business on Central Ohio TVs."
        subtitle="Pick a plan, tell us which part of town you serve, and we'll handle the rest."
      >
        <Button href="/signup" size="lg">
          Get Started
        </Button>
      </CtaBanner>
    </>
  );
}

function TagList({ items, highlight }: { items: string[]; highlight?: boolean }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={
            highlight
              ? "rounded-full border border-accent/30 bg-accent-glow px-3.5 py-1.5 text-sm font-medium text-accent-soft"
              : "rounded-full border border-border-bright bg-white/[0.03] px-3.5 py-1.5 text-sm text-text"
          }
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
