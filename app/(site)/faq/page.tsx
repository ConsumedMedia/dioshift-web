import type { Metadata } from "next";
import { CtaBanner } from "@/components/CtaBanner";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { FAQ_GROUPS, faqJsonLd } from "@/lib/faq";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Streaming TV Advertising FAQ",
  description:
    "Answers for business owners about streaming TV ads: where your ad runs, local targeting, pricing, billing, cancellation and commercial specs.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <JsonLd data={breadcrumbJsonLd("FAQ", "/faq")} />

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
