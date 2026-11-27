import Link from "next/link";
import type { ReactNode } from "react";
import { AdRequirements } from "@/components/AdRequirements";
import { TvMockup } from "@/components/TvMockup";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PACKAGES, formatImpressions, formatPrice } from "@/lib/packages";

/* ---------- Icons (inline, 24px, stroke) ---------- */

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const icons = {
  pin: (
    <Icon>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </Icon>
  ),
  screen: (
    <Icon>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </Icon>
  ),
  star: (
    <Icon>
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    </Icon>
  ),
  calendar: (
    <Icon>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 3v3M16 3v3" />
    </Icon>
  ),
  unlock: (
    <Icon>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.5-2" />
    </Icon>
  ),
  eye: (
    <Icon>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  ),
  check: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.6l-3.9-3.7a.75.75 0 1 1 1.04-1.1l5.25 5a.75.75 0 0 1 0 1.1l-5.25 5a.75.75 0 1 1-1.04-1.1l3.9-3.7H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

/* ---------- Content ---------- */

const devices = [
  { name: "Smart TVs", detail: "The apps built right into the TV" },
  { name: "Streaming devices", detail: "Roku, Fire TV, Apple TV and the like" },
  { name: "Streaming apps", detail: "Free and paid services with ad breaks" },
];

const benefits = [
  {
    icon: icons.pin,
    title: "Your area. Your audience.",
    body: "Your ad shows to households in the places you serve. Narrow it further by audience so you reach people who could actually become customers.",
  },
  {
    icon: icons.screen,
    title: "Full screen. Full attention.",
    body: "Your commercial fills the biggest screen in the house. Most streaming ads can't be skipped, so people see the whole spot.",
  },
  {
    icon: icons.star,
    title: "Big-screen credibility",
    body: "Being on TV still says something about a business. Now you can get there without paying big-network prices.",
  },
  {
    icon: icons.calendar,
    title: "One simple monthly plan",
    body: "Pick how many impressions you want each month. One price. No rate cards, no media math.",
  },
  {
    icon: icons.unlock,
    title: "No long-term contract",
    body: "Stay because it's working, not because you signed for a year. Cancel anytime. We ask for 30 days' notice.",
  },
  {
    icon: icons.eye,
    title: "Real viewers, not scrolling thumbs",
    body: "People sit down to watch streaming TV. Your ad plays during the show they picked, not between swipes on a phone.",
  },
];

const steps = [
  {
    title: "Pick your package",
    body: "Choose a monthly impression level that fits your budget.",
  },
  {
    title: "Send your commercial",
    body: "Upload your :30 spot. No commercial yet? Tell us and we'll talk through options.",
  },
  {
    title: "We target and launch",
    body: "We set up your targeting, place your ad across streaming apps and devices, and get it running.",
  },
];

/* ---------- Page ---------- */

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatIsStreaming />
      <Benefits />
      <HowItWorks />
      <Pricing />
      <AdRequirements />
      <FinalCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-20%] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,142,255,0.16),transparent)]"
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8">
        <div className="text-center lg:text-left">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-glow px-3 py-1 text-xs font-medium text-accent-soft lg:mx-0">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
            Streaming TV ads for local businesses
          </p>
          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance sm:text-6xl lg:text-[4.25rem]">
            Put your business on the{" "}
            <span className="bg-linear-to-r from-accent-soft via-accent to-accent-2 bg-clip-text text-transparent">
              big screen.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-text-dim lg:mx-0">
            Streaming TV ads put your commercial in front of people watching on smart TVs and
            streaming apps. We target your area and the customers you want, for a fraction of what
            traditional TV costs.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button href="/signup" size="lg">
              Get Started
            </Button>
            <Button href="/#pricing" variant="secondary" size="lg">
              See Pricing
            </Button>
          </div>
          <p className="mt-6 text-sm text-text-muted">
            Monthly plans. No long-term contract.
          </p>
        </div>

        <TvMockup />
      </div>
    </section>
  );
}

function WhatIsStreaming() {
  return (
    <Section className="border-t border-border">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="What is streaming TV advertising?"
          title="TV ads, without buying the whole city."
        />
        <div className="space-y-5 text-base leading-relaxed text-text-dim sm:text-lg">
          <p>
            People still watch plenty of TV. They just watch it through apps now. Streaming TV
            advertising puts your commercial inside those apps, in the ad breaks of the shows and
            movies people choose to watch.
          </p>
          <p>
            With cable or broadcast, you pay to reach everyone in range, whether they could ever be
            a customer or not. Streaming works differently. Your ad shows to households in the area
            you serve, and nobody else.
          </p>
          <p className="text-sm text-text-muted">
            You might hear it called CTV (connected TV) or OTT. Same idea.
          </p>
        </div>
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-3">
        {devices.map((d) => (
          <li key={d.name}>
            <Card className="h-full">
              <span className="flex size-10 items-center justify-center rounded-xl border border-border-bright bg-surface-2 text-accent-soft">
                {icons.screen}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{d.name}</h3>
              <p className="mt-1.5 text-sm text-text-dim">{d.detail}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Benefits() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why it works"
        title="Built for business owners, not ad agencies."
        subtitle="You don't need a media buyer or a six-figure budget. You need your ad in front of the right people, on a screen they actually pay attention to."
      />
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <li key={b.title}>
            <Card className="h-full transition-colors hover:border-border-bright">
              <span className="flex size-10 items-center justify-center rounded-xl border border-accent/25 bg-accent-glow text-accent-soft">
                {b.icon}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-dim">{b.body}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function HowItWorks() {
  return (
    <Section className="border-y border-border bg-surface/40">
      <SectionHeading
        eyebrow="How it works"
        title="Three steps. Then you're on TV."
        subtitle="We handle the targeting and placement. You run your business."
      />
      <ol className="mt-14 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title}>
            <Card className="h-full">
              <span className="font-display text-sm font-bold text-accent-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-dim">{s.body}</p>
            </Card>
          </li>
        ))}
      </ol>
      <div className="mt-10 text-center">
        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-soft transition-colors hover:text-text"
        >
          See the full process {icons.arrow}
        </Link>
      </div>
    </Section>
  );
}

function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="Pick your monthly reach."
        subtitle="Every plan runs your :30 commercial across streaming apps and devices in your area. An impression is one showing of your ad on a screen."
      />
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <li key={pkg.id}>
            <Card highlight={pkg.popular} className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-base font-semibold text-text-dim">{pkg.label}</h3>
                {pkg.popular && (
                  <span className="rounded-full border border-accent/30 bg-accent-glow px-2.5 py-1 text-[11px] font-semibold text-accent-soft">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="mt-5 font-display text-3xl font-bold tracking-tight">
                {formatImpressions(pkg.impressions)}
              </p>
              <p className="text-sm text-text-dim">impressions per month</p>

              <div className="my-6 h-px bg-border" />

              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-bold tracking-tight">
                  {formatPrice(pkg.monthlyPrice)}
                </span>
                <span className="text-sm text-text-dim">/month</span>
              </p>

              <Button
                href={`/signup?package=${pkg.id}`}
                variant={pkg.popular ? "primary" : "secondary"}
                className="mt-7 w-full"
                aria-label={`Choose the ${pkg.label} plan, ${formatImpressions(pkg.impressions)} impressions`}
              >
                Choose Plan
              </Button>
            </Card>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-center text-sm text-text-dim">
        All plans billed monthly. No long-term contract. Cancel anytime. We ask for{" "}
        <span className="whitespace-nowrap">30 days&apos;</span> notice.
      </p>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section className="pt-0 sm:pt-0">
      <div className="relative overflow-hidden rounded-3xl border border-border-bright px-6 py-16 text-center sm:py-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(79,142,255,0.22),transparent_70%),radial-gradient(60%_80%_at_100%_100%,rgba(167,139,250,0.14),transparent_70%)]"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-[1.7rem] leading-[1.1] font-extrabold tracking-tight text-balance sm:text-5xl">
            Your customers are watching. Be on their screen.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-text-dim">
            Pick a plan, send your spot, and we&apos;ll take it from there.
          </p>
          <div className="mt-9 flex justify-center">
            <Button href="/signup" size="lg">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
