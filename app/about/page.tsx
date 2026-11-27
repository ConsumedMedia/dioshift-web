import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CtaBanner } from "@/components/CtaBanner";
import { icons } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/metadata";
import { formatAddress, siteConfig } from "@/lib/site-config";
import { aboutPageJsonLd } from "@/lib/structured-data";

const PATH = "/about";
const DESCRIPTION =
  "Dioshift puts local businesses on streaming TV without station reps, rate cards or contracts. Prices on the page and a real Columbus team you can reach.";

export const metadata: Metadata = pageMetadata({
  title: "About Us: Columbus Streaming TV Team",
  description: DESCRIPTION,
  path: PATH,
});

/*
 * ---------------------------------------------------------------------------
 * FOUNDER BLOCK (hidden until filled in)
 * ---------------------------------------------------------------------------
 * The founder section stays off the page until `name` and `bio` both have
 * text. To turn it on:
 *   1. Put a square photo in /public, for example /public/about/founder.jpg
 *      (at least 400 x 400), and set `photo` to "/about/founder.jpg".
 *      Leave `photo` as null to show the block without a photo.
 *   2. Fill in `name`, `role` and a short `bio` (2 to 4 sentences, plain
 *      language, no em dashes).
 * Nothing else needs to change.
 * ---------------------------------------------------------------------------
 */
type Founder = { name: string; role: string; bio: string; photo: string | null };

const FOUNDER: Founder = {
  name: "",
  role: "Founder",
  bio: "",
  photo: null,
};

const hasFounder = FOUNDER.name.trim() !== "" && FOUNDER.bio.trim() !== "";

/* ---------- Content ---------- */

const contactLine = siteConfig.phone ? "call or email" : "email";

const principles: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: icons.tag,
    title: "Prices on the page",
    body: "Every plan and price is right on our site. No rate cards, no quotes that depend on who's asking.",
  },
  {
    icon: icons.lock,
    title: "No surprise bills",
    body: "Your campaign only runs in months you've paid for. If a payment doesn't go through, we pause, and nothing runs up a tab.",
  },
  {
    icon: icons.badge,
    title: "Impressions guaranteed",
    body: "You get your plan's full impression count every paid month. If delivery falls behind, we make it up.",
  },
  {
    icon: icons.pin,
    title: "A real Columbus team",
    body: `We're based in ${siteConfig.address.addressLocality}, just outside Columbus. You can ${contactLine} us directly, and a real person answers.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutPageJsonLd({ description: DESCRIPTION, path: PATH })} />

      <PageHero
        breadcrumbs={[{ name: "About", path: PATH }]}
        eyebrow="About Dioshift"
        title="TV used to be for big budgets. Not anymore."
        subtitle="We put local businesses on streaming TV, with simple monthly plans and a team that does the work for you."
      />

      <Section className="pt-4 sm:pt-6" containerClassName="max-w-3xl">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Why Dioshift exists
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-text-dim sm:text-lg">
          <p>
            For a long time, getting a local business on TV meant calling a station, sitting
            through a pitch from a rep, decoding a rate card and signing a contract for a schedule
            you couldn&apos;t change. Plenty of business owners took one look and walked away.
          </p>
          <p>
            Streaming changed that. Ads can now go to the specific households a business serves.
            A roofer in Grove City or a dentist in Westerville can be on TV without paying to reach
            the whole market.
          </p>
          <p>
            But the tools to buy it were still built for agencies. So we built Dioshift for
            everyone else. Local businesses deserve TV too, without station reps, rate cards or
            contracts. You pick a plan, tell us who to reach and send your commercial. We do the
            rest.
          </p>
        </div>
      </Section>

      <Section className="border-y border-border bg-surface/40">
        <SectionHeading
          eyebrow="How we work"
          title="Four promises we actually keep."
          subtitle="Simple rules that make streaming TV easy to say yes to."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <li key={p.title}>
              <Card className="h-full">
                <span className="flex size-10 items-center justify-center rounded-xl border border-accent/25 bg-accent-glow text-accent-soft">
                  {p.icon}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-text-dim">{p.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {hasFounder && <FounderBlock founder={FOUNDER} />}

      <Section containerClassName="max-w-4xl">
        <Card className="grid gap-8 p-7 sm:p-10 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
              Where we are
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Right here in Central Ohio.
            </h2>
            <p className="mt-4 leading-relaxed text-text-dim">
              We work with businesses across{" "}
              <Link
                href="/columbus-streaming-tv-advertising"
                className="font-medium text-accent-soft transition-colors hover:text-text"
              >
                Columbus and Central Ohio
              </Link>
              , and we can run your campaign anywhere in Ohio and beyond.
            </p>
          </div>
          <address className="space-y-3 text-[15px] not-italic text-text-dim">
            <p className="flex items-start gap-3">
              <span className="mt-0.5 text-text-muted">{icons.pin}</span>
              {formatAddress()}
            </p>
            <p className="flex items-start gap-3">
              <span className="mt-0.5 text-text-muted">{icons.mail}</span>
              <a
                href={`mailto:${siteConfig.email}`}
                className="break-all transition-colors hover:text-text"
              >
                {siteConfig.email}
              </a>
            </p>
            {siteConfig.phone && (
              <p className="flex items-start gap-3">
                <span className="mt-0.5 text-text-muted">{icons.phone}</span>
                <a
                  href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                  className="transition-colors hover:text-text"
                >
                  {siteConfig.phone}
                </a>
              </p>
            )}
          </address>
        </Card>
      </Section>

      <CtaBanner
        title="Let's get your business on TV."
        subtitle="Pick a plan with the price right on the page. We'll handle setup, targeting and launch."
      >
        <Button href="/signup" size="lg">
          Get Started
        </Button>
        <Button href="/contact" variant="secondary" size="lg">
          Contact Us
        </Button>
      </CtaBanner>
    </>
  );
}

/** Founder photo, name and bio. Only rendered when FOUNDER is filled in above. */
function FounderBlock({ founder }: { founder: Founder }) {
  return (
    <Section containerClassName="max-w-4xl">
      <Card className="flex flex-col gap-8 p-7 sm:flex-row sm:items-center sm:p-10">
        {founder.photo && (
          <Image
            src={founder.photo}
            alt={founder.name}
            width={160}
            height={160}
            className="size-32 shrink-0 rounded-full border border-border-bright object-cover sm:size-40"
          />
        )}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
            {founder.role}
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight">{founder.name}</h2>
          <p className="mt-3 leading-relaxed text-text-dim">{founder.bio}</p>
        </div>
      </Card>
    </Section>
  );
}
