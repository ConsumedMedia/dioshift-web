import type { Metadata } from "next";
import Link from "next/link";
import { AdRequirements } from "@/components/AdRequirements";
import { CtaBanner } from "@/components/CtaBanner";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HowItWorksStepper, type StepperStep } from "@/components/visuals/HowItWorksStepper";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import {
  POPULAR_PACKAGE,
  formatImpressions,
  formatPrice,
  getPackageRange,
} from "@/lib/packages";

export const metadata: Metadata = pageMetadata({
  title: "How Streaming TV Ads Work",
  description:
    "Pick a monthly plan, tell us who to reach, send your :30 commercial, and we launch it. See how Dioshift gets local businesses on streaming TV.",
  path: "/how-it-works",
});

const { min, max } = getPackageRange();
const popularImpressions = formatImpressions(POPULAR_PACKAGE.impressions);

const steps: StepperStep[] = [
  {
    title: "Choose your monthly package",
    visual: "plan",
    body: "Pick an impression level that fits your budget. Bigger plans put your ad in front of more screens each month.",
    extra: (
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-bg/60 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-text-muted">Impressions</p>
          <p className="mt-1 font-display font-bold">
            {formatImpressions(min.impressions)} to {formatImpressions(max.impressions)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-text-muted">Per month</p>
          <p className="mt-1 font-display font-bold">
            {formatPrice(min.monthlyPrice)} to {formatPrice(max.monthlyPrice)}
          </p>
        </div>
        <Link
          href="/pricing"
          className="text-sm font-medium text-accent-soft transition-colors hover:text-text sm:ml-auto"
        >
          Compare packages →
        </Link>
      </div>
    ),
  },
  {
    title: "Tell us who to reach",
    visual: "target",
    body: "Share your service area and the kind of customers you want. We aim your ad at the households that matter to your business.",
    extra: (
      <ul className="mt-5 grid gap-2 sm:grid-cols-3">
        {[
          { label: "Location", detail: "Zip codes, cities or a radius" },
          { label: "Age range", detail: "Who you usually sell to" },
          { label: "Interests", detail: "What your customers care about" },
        ].map((t) => (
          <li key={t.label} className="rounded-xl border border-border bg-bg/60 px-4 py-3">
            <p className="font-display text-sm font-semibold">{t.label}</p>
            <p className="mt-0.5 text-xs text-text-dim">{t.detail}</p>
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "Send your commercial",
    visual: "upload",
    body: (
      <>
        A :30 second, 1080p spot. MP4 recommended. Don&apos;t have one? Check the box on the
        signup form and we&apos;ll follow up.
      </>
    ),
  },
  {
    title: "We launch and run it",
    visual: "launch",
    body: "Your ad plays full screen inside streaming apps on smart TVs and streaming devices, delivered to the audience you chose.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("How It Works", "/how-it-works")} />
      <PageHero
        eyebrow="How it works"
        title="Streaming TV, minus the runaround."
        subtitle="No rate cards. No station reps. No paying for a whole market to reach a few neighborhoods. Here's exactly how your business gets on TV."
      />

      <Section className="pt-4 sm:pt-8" containerClassName="max-w-5xl">
        <h2 className="sr-only">The four steps</h2>
        <HowItWorksStepper steps={steps} />
      </Section>

      <Section className="pt-0 sm:pt-4">
        <SectionHeading eyebrow="The details" title="Two things worth knowing." />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Card className="h-full">
            <h3 className="font-display text-xl font-semibold">What&apos;s an impression?</h3>
            <p className="mt-3 leading-relaxed text-text-dim">
              One impression is one complete play of your commercial on one screen.
            </p>
            <div className="mt-6 rounded-xl border border-accent/25 bg-accent-glow px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-soft">
                Example: our most popular plan
              </p>
              <p className="mt-2 leading-relaxed text-text">
                {popularImpressions} impressions means your ad plays in full {popularImpressions}{" "}
                times this month.
              </p>
            </div>
          </Card>

          <Card className="h-full">
            <h3 className="font-display text-xl font-semibold">How billing works</h3>
            <ul className="mt-4 space-y-3 text-text-dim">
              {[
                "Billed monthly, starting the day you sign up.",
                "No long-term contract. Month to month.",
                "Cancel anytime. We ask for 30 days' notice.",
              ].map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed">
                  <span
                    aria-hidden
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <AdRequirements />

      <CtaBanner
        title="Ready to get on TV?"
        subtitle="Pick a package, tell us who to reach, and we'll handle the rest."
      >
        <Button href="/signup" size="lg">
          Get Started
        </Button>
      </CtaBanner>
    </>
  );
}
