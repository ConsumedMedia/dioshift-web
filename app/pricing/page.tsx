import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/CtaBanner";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PricingCalculator } from "@/components/home/PricingCalculator";
import { icons } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ_GROUPS, type FaqGroup } from "@/lib/faq";
import { pageMetadata } from "@/lib/metadata";
import { CPM, formatPrice, getPackageRange } from "@/lib/packages";
import { serviceJsonLd } from "@/lib/structured-data";

const PATH = "/pricing";
const { min, max } = getPackageRange();

export const metadata: Metadata = pageMetadata({
  title: "Streaming TV Advertising Pricing",
  description: `Streaming TV ad plans from ${formatPrice(min.monthlyPrice)} to ${formatPrice(max.monthlyPrice)} a month at one flat rate. Guaranteed impressions, setup included, no contract. See every plan.`,
  path: PATH,
});

const included = [
  { title: "Campaign setup", body: "We build and launch your campaign. You don't touch an ad platform." },
  {
    title: "Targeting by location, age and interests",
    body: "Zip codes, cities, counties or a radius, narrowed to the customers you want.",
  },
  {
    title: "Commercial review",
    body: "We check your spot against the specs before it runs and flag anything that needs fixing.",
  },
  {
    title: "Guaranteed impressions every month",
    body: "Your plan's full count, every paid month. If delivery falls behind, we make it up.",
  },
  {
    title: "Month-to-month billing",
    body: "No long-term contract. Cancel anytime. We ask for 30 days' notice.",
  },
  {
    title: "A real person to talk to",
    body: "A Columbus team that answers your emails. No ticket queue, no call center.",
  },
];

/** "Pricing and billing" from lib/faq.ts, minus links back to this page. */
const pricingFaq = FAQ_GROUPS.find((g) => g.id === "pricing-billing");
if (!pricingFaq) throw new Error('lib/faq.ts: "pricing-billing" group not found');
const pricingGroup: FaqGroup = {
  ...pricingFaq,
  items: pricingFaq.items.map((item) => ({
    ...item,
    links: item.links?.filter((link) => link.href !== PATH),
  })),
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd()} />

      <PageHero
        breadcrumbs={[{ name: "Pricing", path: PATH }]}
        eyebrow="Pricing"
        title="Simple monthly pricing. No surprises."
        subtitle={`Every plan is the same rate: ${formatPrice(CPM)} per 1,000 impressions. Pick how many you want each month. We do the rest, and we guarantee the count.`}
      />

      <Section className="pt-0 sm:pt-0">
        <h2 className="sr-only">Plans and calculator</h2>
        <div className="-mt-14">
          <PricingCalculator />
        </div>
        <p className="mt-10 text-center text-sm text-text-dim">
          All plans billed monthly. No long-term contract. Cancel anytime. We ask for{" "}
          <span className="whitespace-nowrap">30 days&apos;</span> notice.
        </p>
      </Section>

      <Section className="border-y border-border bg-surface/40">
        <SectionHeading
          eyebrow="What every plan includes"
          title="One price covers the whole job."
          subtitle="Bigger plans buy more impressions, not extra features. Every plan gets the same service."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.map((item) => (
            <li key={item.title}>
              <Card className="h-full">
                <span className="flex size-8 items-center justify-center rounded-full border border-accent/30 bg-accent-glow text-accent-soft">
                  {icons.check}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-text-dim">{item.body}</p>
              </Card>
            </li>
          ))}
        </ul>

        <Card className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">What&apos;s not included</h3>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-text-dim">
              Commercial production. If you need a :30 spot made, mark it on the signup form and
              we&apos;ll quote it separately, so you know the cost before anything is made.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-soft transition-colors hover:text-text"
          >
            See the ad specs {icons.arrow}
          </Link>
        </Card>
      </Section>

      <Section containerClassName="max-w-3xl">
        <SectionHeading
          eyebrow="Pricing questions"
          title="Billing, in plain English."
          subtitle="How you're charged, what's guaranteed and how canceling works."
        />
        <div className="mt-12">
          <FaqAccordion groups={[pricingGroup]} showGroupTitles={false} />
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-soft transition-colors hover:text-text"
          >
            See all questions {icons.arrow}
          </Link>
        </div>
      </Section>

      <CtaBanner
        title="Pick a plan and get on TV."
        subtitle="Choose your impressions, tell us who to reach, and send your spot. We'll handle the rest."
      >
        <Button href="/signup" size="lg">
          Get Started
        </Button>
      </CtaBanner>
    </>
  );
}
