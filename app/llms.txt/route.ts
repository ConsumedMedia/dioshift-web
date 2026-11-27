import { FAQ_GROUPS } from "@/lib/faq";
import { PUBLISHED_INDUSTRIES, industryPath } from "@/lib/industries";
import { CPM, PACKAGES, POPULAR_PACKAGE, formatImpressions, formatPrice } from "@/lib/packages";
import { absoluteUrl, formatAddress, siteConfig } from "@/lib/site-config";

/*
 * /llms.txt: a plain-language summary of Dioshift for AI assistants and
 * crawlers (https://llmstxt.org). Built from site-config, packages and the
 * FAQ so prices and answers never go stale.
 *
 * It reads no request data, so with Cache Components it's prerendered at
 * build time as a static file.
 */

/** The FAQ answer with this id. Throws at build time if it's ever removed. */
function faqAnswer(id: string): string {
  for (const group of FAQ_GROUPS) {
    const item = group.items.find((i) => i.id === id);
    if (item) return item.answer;
  }
  throw new Error(`llms.txt: FAQ item "${id}" not found in lib/faq.ts`);
}

function buildLlmsTxt(): string {
  const { name, legalName, email, phone } = siteConfig;
  const popular = formatImpressions(POPULAR_PACKAGE.impressions);

  const plans = PACKAGES.map(
    (p) =>
      `- ${p.label}: ${formatImpressions(p.impressions)} impressions per month, ${formatPrice(p.monthlyPrice)}/month${p.popular ? " (most popular)" : ""}`,
  ).join("\n");

  const faq = FAQ_GROUPS.flatMap((g) => g.items)
    .map((i) => `- ${i.question} ${i.answer}`)
    .join("\n");

  const industryPages = PUBLISHED_INDUSTRIES.map(
    (i) => `- [Streaming TV for ${i.name}](${absoluteUrl(industryPath(i.slug))}): ${i.shortDescription}`,
  ).join("\n");

  const contact = [
    `- Email: ${email}`,
    ...(phone ? [`- Phone: ${phone}`] : []),
    `- Address: ${formatAddress()}, ${siteConfig.address.addressCountry}`,
    `- Contact form: ${absoluteUrl("/contact")}`,
  ].join("\n");

  return `# ${name}

> ${name} (${legalName}) sells streaming TV advertising to local businesses. We run a business's :30 commercial inside streaming apps on smart TVs and streaming devices, targeted to the households in its area, on simple monthly plans with guaranteed impressions and no long-term contract. Based in ${siteConfig.address.addressLocality}, Ohio, serving the Columbus, Ohio metro area and Ohio.

## Who it's for

Local business owners who want to be on TV without buying airtime for a whole market or hiring a media buyer. Ads are targeted by location (zip codes, cities, counties or a radius), age range and interests.

## Plans and prices

Every plan is priced at the same rate: ${formatPrice(CPM)} per 1,000 impressions. Prices are in US dollars, billed monthly.

${plans}

## What an impression is

One impression is one complete play of the commercial on one screen. A plan with ${popular} impressions means the ad plays in full ${popular} times that month. ${faqAnswer("impression-guarantee").replace(/^Yes\.\s*/, "")}

## Ad requirements

- Length: :30 seconds
- Resolution: 1080p (1920 x 1080)
- File type: MP4 recommended
- Send it as a share link (Google Drive, Dropbox or similar) on the signup form.
- No commercial yet? Mark that on the signup form and we'll reach out to talk through options.

## Billing and cancellation

- Your first month is charged when you sign up. Your plan then renews automatically every month on that same date until it's canceled.
- No long-term contract. Plans are month to month.
- Your campaign runs only while your account is paid. If a charge fails, we pause the campaign and email a secure link to update the payment method.
- To cancel, email ${email} or reply to any of our emails. We ask for 30 days' notice.
- If your notice reaches us before your next billing date, we won't charge you again. Your campaign runs through the end of the month you've already paid for.
- If your notice reaches us on or after a billing date, that month has already been charged and will run in full. Your plan ends after it.
- We don't give partial refunds for unused days in a month.
- Refunds: if you cancel during your first month before your first ad runs, we refund that first month in full. Once ads start running, the month is non-refundable.

Full terms: ${absoluteUrl("/terms")}

## How to get started

1. Pick a monthly plan at ${absoluteUrl("/signup")}.
2. Tell us your service area and who you want to reach.
3. Send your commercial, or tell us you need one.
4. Pay for the first month through secure Stripe checkout.

If the commercial meets the requirements, the campaign typically launches within 2 business days of signup.

## Frequently asked questions

${faq}

## Contact

${contact}

## Pages

- [Home](${absoluteUrl("/")}): overview, benefits and pricing
- [How It Works](${absoluteUrl("/how-it-works")}): the four steps from signup to launch
- [Pricing](${absoluteUrl("/pricing")}): all monthly plans, the impression calculator and what every plan includes
- [Streaming TV Advertising Guide](${absoluteUrl("/streaming-tv-advertising")}): plain-English guide to streaming TV ads, CTV vs. OTT, targeting, impressions, cost and commercials
- [Industries](${absoluteUrl("/industries")}): how streaming TV works for different kinds of local businesses
${industryPages}
- [Columbus, Ohio](${absoluteUrl("/columbus-streaming-tv-advertising")}): streaming TV advertising in Columbus and the Central Ohio counties we target
- [About](${absoluteUrl("/about")}): why Dioshift exists and how we work
- [FAQ](${absoluteUrl("/faq")}): answers about targeting, billing and commercials
- [Get Started](${absoluteUrl("/signup")}): sign up and pay for a plan
- [Contact](${absoluteUrl("/contact")}): send us a question
- [Terms of Service](${absoluteUrl("/terms")})
- [Privacy Policy](${absoluteUrl("/privacy")})
`;
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
