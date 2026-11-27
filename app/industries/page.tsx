import type { Metadata } from "next";
import { CtaBanner } from "@/components/CtaBanner";
import { IndustryGrid, IndustryGridFooter } from "@/components/IndustryGrid";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/industries";

export const metadata: Metadata = pageMetadata({
  title: "Streaming TV Ads by Industry",
  description:
    "How streaming TV advertising works for local businesses like roofers, home service pros and auto dealers: who to target, when to push and what to say.",
  path: PATH,
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Industries", path: PATH }]}
        eyebrow="Industries"
        title="Streaming TV for the business you run."
        subtitle="Who to target, when to push and what to say in your spot, written for your kind of business."
      />

      <Section className="pt-4 sm:pt-6">
        <h2 className="sr-only">All industries</h2>
        <IndustryGrid />
        <IndustryGridFooter />
      </Section>

      <CtaBanner
        title="Ready when you are."
        subtitle="Pick a plan, tell us who your customers are, and we'll set up the rest."
      >
        <Button href="/signup" size="lg">
          Get Started
        </Button>
        <Button href="/pricing" variant="secondary" size="lg">
          See Pricing
        </Button>
      </CtaBanner>
    </>
  );
}
