import {
  CPM,
  POPULAR_PACKAGE,
  formatImpressions,
  formatPrice,
  getPackageRange,
} from "@/lib/packages";

export type FaqLink = { href: string; label: string };

export type FaqItem = {
  id: string;
  question: string;
  /** Plain text. Used on the page and in the FAQPage structured data. */
  answer: string;
  /** Optional follow-up links shown under the answer. */
  links?: FaqLink[];
};

export type FaqGroup = { id: string; title: string; items: FaqItem[] };

const { min, max } = getPackageRange();
const popular = formatImpressions(POPULAR_PACKAGE.impressions);

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "streaming-tv",
    title: "About streaming TV",
    items: [
      {
        id: "what-is-streaming-tv-advertising",
        question: "What is streaming TV advertising?",
        answer:
          "It's TV advertising inside streaming apps. When people watch shows and movies through an app on their TV, there are ad breaks, just like regular TV. Your commercial runs in those breaks. You may also hear it called CTV (connected TV) or OTT.",
      },
      {
        id: "where-will-my-ad-show-up",
        question: "Where will my ad show up?",
        answer:
          "Inside streaming apps on smart TVs, Roku, Fire TV, Apple TV and similar devices. Your ad plays during the shows and movies people choose to watch, on the biggest screen in the house.",
      },
      {
        id: "can-people-skip-my-ad",
        question: "Can people skip my ad?",
        answer:
          "Usually not. Streaming TV ads typically play full screen, and most can't be skipped. That's a big part of why the format works: viewers tend to see your whole :30 spot. Exact behavior can vary by app.",
      },
      {
        id: "different-from-regular-tv-or-youtube",
        question: "How is this different from regular TV, YouTube or social media ads?",
        answer:
          "Regular TV sells airtime by station and time slot, so you pay to reach everyone in range, including people who will never be your customers. Streaming lets you aim at the households you actually want. Online video and social media ads mostly play on phones, in a feed, with a skip button or a scroll right behind them. Streaming TV ads play full screen on the TV, during shows people sat down to watch.",
      },
      {
        id: "worth-it-for-small-business",
        question: "Is streaming TV worth it for a small business?",
        answer:
          "It puts your business on the biggest screen in the house, in front of households you choose, at a monthly price you control. It works best as a steady, always-on presence that builds recognition over time.",
      },
    ],
  },
  {
    id: "targeting",
    title: "Targeting",
    items: [
      {
        id: "target-local-area",
        question: "Can I target just my local area?",
        answer:
          "Yes. That's the whole idea. Tell us your service area, whether that's a handful of zip codes, a city, a county or a radius around your business, and we target your ad to households there.",
      },
      {
        id: "audience-targeting",
        question: "What kind of audience targeting is available?",
        answer:
          "Location, age range and interests. For example: adults 35 to 64, within 15 miles of your shop, who are interested in home improvement. Tell us who your best customers are on the signup form and we'll set it up.",
      },
    ],
  },
  {
    id: "pricing-billing",
    title: "Pricing and billing",
    items: [
      {
        id: "how-much-does-it-cost",
        question: "How much does it cost?",
        answer: `Plans run from ${formatPrice(min.monthlyPrice)} to ${formatPrice(max.monthlyPrice)} a month, for ${formatImpressions(min.impressions)} to ${formatImpressions(max.impressions)} impressions. Every plan is priced at the same rate: ${formatPrice(CPM)} per 1,000 impressions.`,
        links: [{ href: "/pricing", label: "See all packages" }],
      },
      {
        id: "do-i-need-a-big-budget",
        question: "Do I need a big budget?",
        answer: `No. Plans start at ${formatPrice(min.monthlyPrice)} a month, with no contract and no setup fee.`,
        links: [{ href: "/pricing", label: "See all packages" }],
      },
      {
        id: "what-is-an-impression",
        question: "What's an impression?",
        answer: `One impression is one complete play of your commercial on one screen. If your plan includes ${popular} impressions, your ad plays in full ${popular} times that month.`,
      },
      {
        id: "when-am-i-charged",
        question: "When am I charged?",
        answer:
          "Your first month is charged when you sign up. After that, you're billed monthly on that same date.",
      },
      {
        id: "is-there-a-contract",
        question: "Is there a contract?",
        answer: "No long-term contract. Plans are month to month.",
      },
      {
        id: "how-do-i-cancel",
        question: "How do I cancel?",
        answer:
          "Email us or reply to any of our emails. We ask for 30 days' notice. If your notice reaches us before your next billing date, we won't charge you again. The month you've already paid for runs in full, and we don't give partial refunds for unused days.",
        links: [
          { href: "/terms#canceling-your-plan", label: "Read the cancellation terms" },
          { href: "/contact", label: "Contact us" },
        ],
      },
      {
        id: "refunds",
        question: "Can I get a refund?",
        answer:
          "If you cancel during your first month before your first ad runs, we refund that month in full. Once ads start running, the month runs to its full impressions and isn't refundable.",
      },
      {
        id: "impression-guarantee",
        question: "Do you guarantee my impressions?",
        answer:
          "Yes. We guarantee your plan's full impression count every paid month. If delivery falls behind, we catch up that month, or deliver the rest the next month at no charge.",
      },
      {
        id: "payment-fails",
        question: "What happens if my payment fails?",
        answer:
          "We pause your campaign and email you a secure link to update your card. Once payment goes through, your campaign picks back up.",
      },
      {
        id: "change-package",
        question: "Can I change my package later?",
        answer: "Yes. Contact us and we'll move you to a different package.",
        links: [{ href: "/contact", label: "Contact us" }],
      },
    ],
  },
  {
    id: "commercial",
    title: "Your commercial",
    items: [
      {
        id: "ad-requirements",
        question: "What are the ad requirements?",
        answer:
          "Your commercial should be :30 seconds long and 1080p (1920 × 1080). MP4 is the recommended file type.",
      },
      {
        id: "no-commercial",
        question: "What if I don't have a commercial?",
        answer:
          "Mark that on the signup form and we'll reach out to talk through options.",
      },
      {
        id: "send-commercial",
        question: "How do I send my commercial?",
        answer:
          "Paste a share link to the file, like a Google Drive or Dropbox link, on the signup form. Make sure anyone with the link can view it.",
      },
    ],
  },
  {
    id: "getting-started",
    title: "Getting started",
    items: [
      {
        id: "how-do-i-get-started",
        question: "How do I get started?",
        answer:
          "Head to the signup page. Pick your package, tell us who you want to reach, and send your commercial or let us know you need one.",
        links: [{ href: "/signup", label: "Get started" }],
      },
      {
        id: "how-soon-will-my-ad-run",
        question: "How soon will my ad start running?",
        answer:
          "If your commercial meets the requirements, typically within 2 business days of signup. If you need a commercial made, we'll set timing together when we reach out.",
      },
    ],
  },
];

/** Every question, by id. */
const FAQ_BY_ID = new Map(FAQ_GROUPS.flatMap((g) => g.items).map((item) => [item.id, item]));

/**
 * Pick questions by id, in the order given. Throws on an unknown id so a
 * renamed question breaks the build instead of quietly disappearing.
 */
export function getFaqItems(ids: readonly string[]): FaqItem[] {
  return ids.map((id) => {
    const item = FAQ_BY_ID.get(id);
    if (!item) throw new Error(`Unknown FAQ id: ${id}`);
    return item;
  });
}

/** schema.org FAQPage data, built from the same questions shown on the page. */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    ),
  };
}
