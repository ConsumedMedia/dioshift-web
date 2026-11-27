import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { icons } from "@/components/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFaqItems, type FaqGroup } from "@/lib/faq";

/** The questions shown on the homepage, by id from lib/faq.ts. */
const PREVIEW_IDS = [
  "worth-it-for-small-business",
  "do-i-need-a-big-budget",
  "target-local-area",
  "impression-guarantee",
  "how-do-i-cancel",
] as const;

const previewGroup: FaqGroup = {
  id: "home-preview",
  title: "Common questions",
  items: getFaqItems(PREVIEW_IDS),
};

/**
 * A few FAQ answers on the homepage. FAQPage structured data stays on /faq
 * only, so none is added here.
 */
export function FaqPreview() {
  return (
    <Section containerClassName="max-w-3xl">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions we hear a lot."
        subtitle="Straight answers about cost, targeting and what you're signing up for."
      />
      <div className="reveal mt-12">
        <FaqAccordion groups={[previewGroup]} showGroupTitles={false} />
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
  );
}
