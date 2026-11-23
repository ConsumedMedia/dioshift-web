import type { Metadata } from "next";
import { CtaBanner } from "@/components/CtaBanner";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { FAQ_GROUPS, faqJsonLd } from "@/lib/faq";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Straight answers about streaming TV advertising for local businesses: where your ad shows up, targeting, pricing, billing, cancellation and commercial requirements.",
});

export default function FaqPage() {
  // Escape "<" so nothing in the data can close the script tag early.
  const jsonLd = JSON.stringify(faqJsonLd()).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <PageHero
        eyebrow="FAQ"
        title="Questions, answered."
        subtitle="Everything business owners ask us before getting on streaming TV. If yours isn't here, just ask."
      />

      <Section className="pt-4 sm:pt-6" containerClassName="max-w-3xl">
        <FaqAccordion groups={FAQ_GROUPS} />
      </Section>

      <CtaBanner
        title="Still have questions?"
        subtitle="Send us a note and we'll get back to you. Or jump in and pick a plan."
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
