import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AD_SPECS } from "@/components/AdRequirements";
import { CtaBanner } from "@/components/CtaBanner";
import { icons } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { industryPath, PUBLISHED_INDUSTRIES } from "@/lib/industries";
import { contentCategories, devices } from "@/lib/inventory";
import { pageMetadata } from "@/lib/metadata";
import {
  CPM,
  POPULAR_PACKAGE,
  formatImpressions,
  formatPrice,
  getPackageRange,
} from "@/lib/packages";
import { articleJsonLd } from "@/lib/structured-data";

const PATH = "/streaming-tv-advertising";
const HEADLINE = "Streaming TV advertising, explained for local businesses.";
const DESCRIPTION =
  "What streaming TV advertising is, how CTV and OTT differ, how targeting and impressions work, what it costs, and how to make a :30 spot that works.";

/** Update DATE_MODIFIED whenever the guide's content changes. */
const DATE_PUBLISHED = "2026-11-27";
const DATE_MODIFIED = "2026-11-27";

export const metadata: Metadata = pageMetadata({
  title: "Streaming TV Advertising: A Plain-English Guide",
  description: DESCRIPTION,
  path: PATH,
});

/* ---------- Numbers, all from lib/packages.ts ---------- */

const { min, max } = getPackageRange();
const popular = POPULAR_PACKAGE;
const popularImpressions = formatImpressions(popular.impressions);
const popularThousands = formatImpressions(popular.impressions / 1000);

const roofing = PUBLISHED_INDUSTRIES.find((i) => i.slug === "roofing-home-services");
const auto = PUBLISHED_INDUSTRIES.find((i) => i.slug === "auto-dealers");

/* ---------- Small typographic helpers ---------- */

function P({ children }: { children: ReactNode }) {
  return <p className="mt-5 leading-relaxed text-text-dim">{children}</p>;
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-9 font-display text-xl font-semibold text-text">{children}</h3>;
}

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium text-accent-soft underline decoration-accent-soft/30 underline-offset-4 transition-colors hover:text-text hover:decoration-text/40"
    >
      {children}
    </Link>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-5 space-y-3 text-text-dim">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 leading-relaxed">
          <span
            aria-hidden
            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-7 rounded-xl border border-accent/25 bg-accent-glow px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-soft">{label}</p>
      <div className="mt-2 leading-relaxed text-text">{children}</div>
    </div>
  );
}

/** Industry links that only render for published industries. */
function IndustryLink({ industry, children }: { industry?: { slug: string }; children: ReactNode }) {
  return industry ? <A href={industryPath(industry.slug)}>{children}</A> : <>{children}</>;
}

/* ---------- The guide ---------- */

type GuideSection = { id: string; title: string; body: ReactNode };

const sections: GuideSection[] = [
  {
    id: "what-it-is",
    title: "What streaming TV advertising is",
    body: (
      <>
        <P>
          People still watch plenty of TV. What&apos;s changed is how. Instead of flipping through
          cable channels, they open an app on their TV and pick a show, a movie or a game.
        </P>
        <P>
          Many of those apps have ad breaks, just like regular TV. Streaming TV advertising means
          putting your commercial in those breaks. It plays full screen, on the TV, during
          something the viewer chose to watch.
        </P>
        <P>
          The big difference from traditional TV is how the ad gets placed. On cable or broadcast,
          you buy a time slot on a channel, and everyone tuned in sees your ad. With streaming, the
          ad is delivered over the internet to individual households. That means you can choose
          which households see it.
        </P>
        <P>
          That one change is why streaming TV works for local businesses. You don&apos;t have to
          buy a whole market to reach the few towns you actually serve.
        </P>
      </>
    ),
  },
  {
    id: "ctv-vs-ott",
    title: "CTV vs. OTT, in plain English",
    body: (
      <>
        <P>You&apos;ll hear two terms thrown around, and they get mixed up a lot.</P>
        <P>
          <strong className="font-semibold text-text">OTT</strong> stands for &ldquo;over the
          top.&rdquo; It describes shows and movies delivered over the internet instead of through
          a cable box or an antenna. The content goes over the top of the traditional cable system.
          OTT can be watched on a TV, a laptop, a tablet or a phone.
        </P>
        <P>
          <strong className="font-semibold text-text">CTV</strong> stands for &ldquo;connected
          TV.&rdquo; It means a television that&apos;s connected to the internet, either because
          it&apos;s a smart TV or because a streaming device is plugged into it. CTV is about the
          screen.
        </P>
        <Callout label="The short version">
          OTT is how the show gets delivered. CTV is the TV it plays on. A CTV ad is an OTT ad that
          plays on a television.
        </Callout>
        <P>
          When we say streaming TV advertising, we mean ads on the TV in someone&apos;s living
          room. That&apos;s where your commercial runs.
        </P>
      </>
    ),
  },
  {
    id: "how-its-different",
    title: "How it's different from cable, broadcast and social media ads",
    body: (
      <>
        <H3>Cable and broadcast</H3>
        <P>
          Traditional TV is sold by station, program and time slot. You pay to reach everyone
          watching across the station&apos;s whole coverage area. If you&apos;re a plumber in
          Hilliard, much of that money goes to households that will never call you.
        </P>
        <P>
          Buying it usually means working with station reps, reading rate cards and committing to
          a schedule. Streaming flips that. You pick the area and the audience, your ad is
          delivered to those households, and you pay for the number of times it plays.
        </P>
        <H3>Social media and online video</H3>
        <P>
          Social ads mostly play on a phone, in a feed, with the next post one swipe away. Online
          video ads often come with a skip button a few seconds in.
        </P>
        <P>
          A streaming TV ad plays full screen on the biggest screen in the house. Most can&apos;t
          be skipped, though exact behavior varies by app. And the viewer sat down to watch
          something, so they aren&apos;t scrolling past.
        </P>
        <H3>What stays the same</H3>
        <P>
          It&apos;s still a commercial. You still need a :30 spot that works with sight and sound,
          and repetition still matters. More on that below.
        </P>
      </>
    ),
  },
  {
    id: "where-ads-play",
    title: "Where the ads play",
    body: (
      <>
        <P>
          Your commercial runs in the ad breaks of streaming content across a mix of apps. That
          includes:
        </P>
        <Bullets
          items={contentCategories.map((c) => (
            <>
              <strong className="font-semibold text-text">{c.title}.</strong> {c.description}
            </>
          ))}
        />
        <P>
          It plays on the devices people watch on at home:{" "}
          {devices.map((d) => d.name).join(", ")} and similar.
        </P>
        <P>
          You don&apos;t pick individual apps or shows. You pick who you want to reach, and your ad
          is placed where those households are watching. Exact apps and channels vary by campaign
          and availability.
        </P>
      </>
    ),
  },
  {
    id: "targeting",
    title: "How targeting works",
    body: (
      <>
        <P>
          Targeting is what makes streaming TV useful for a local business. There are three
          pieces, and you can use any mix of them.
        </P>
        <H3>Location</H3>
        <P>This is the big one. You can target by:</P>
        <Bullets
          items={[
            <>
              <strong className="font-semibold text-text">Zip code.</strong> The exact
              neighborhoods you serve.
            </>,
            <>
              <strong className="font-semibold text-text">City.</strong> A whole town, like
              Westerville or Grove City.
            </>,
            <>
              <strong className="font-semibold text-text">County.</strong> Good for businesses
              that cover a wide area.
            </>,
            <>
              <strong className="font-semibold text-text">Radius.</strong> A set distance around
              your shop, office or store.
            </>,
          ]}
        />
        <P>
          Start with location. There&apos;s no point reaching people you can&apos;t serve. If
          you&apos;re in Central Ohio, our{" "}
          <A href="/columbus-streaming-tv-advertising">Columbus page</A> lists the counties and
          communities we target around the city.
        </P>
        <P>
          For example, a landscaper in Powell might target the zip codes within 15 miles of the
          shop, adults 35 to 64, interested in home and garden. That&apos;s one campaign, set up
          once, running all month.
        </P>
        <H3>Age</H3>
        <P>
          You can narrow by age range, like adults 35 to 64. Use the ages of your real customers,
          not a guess. A wider range reaches more households. A narrower one focuses your budget.
        </P>
        <H3>Interests</H3>
        <P>
          Interests let you lean toward households likely to care about what you sell, like home
          improvement for a roofer or autos for a car dealer. Our industry pages show example
          setups for <IndustryLink industry={roofing}>roofing and home services</IndustryLink> and{" "}
          <IndustryLink industry={auto}>auto dealers</IndustryLink>.
        </P>
        <P>
          Every layer you add narrows the audience. That helps relevance, but go too narrow and
          your ad has fewer households to reach. We help you find the balance when we set up your
          campaign.
        </P>
      </>
    ),
  },
  {
    id: "impressions",
    title: "What an impression is",
    body: (
      <>
        <P>An impression is one complete play of your commercial on one screen. That&apos;s it.</P>
        <Callout label={`Example: the ${popular.label} plan`}>
          {popularImpressions} impressions a month means your ad plays in full{" "}
          {popularImpressions} times that month, on TVs in the area and audience you chose.
        </Callout>
        <P>
          Impressions aren&apos;t the same as households. One household can see your ad more than
          once over a month, and that&apos;s a good thing. Repetition is how a name becomes
          familiar.
        </P>
        <P>
          We guarantee your plan&apos;s full impression count every paid month. If delivery falls
          behind, we catch up that month, or deliver the rest the next month at no charge.
        </P>
        <P>
          Delivery is spread across the month, so your ad keeps showing up week after week instead
          of running out in the first few days.
        </P>
      </>
    ),
  },
  {
    id: "cost",
    title: "What it costs",
    body: (
      <>
        <P>
          Streaming TV is priced by CPM, short for &ldquo;cost per mille.&rdquo; Mille is Latin
          for thousand. CPM is simply the price of 1,000 impressions.
        </P>
        <P>
          Our CPM is {formatPrice(CPM)} on every plan. So the math for the {popular.label} plan
          looks like this:
        </P>
        <Callout label="The math">
          {popularImpressions} impressions is {popularThousands} sets of 1,000.{" "}
          {popularThousands} × {formatPrice(CPM)} = {formatPrice(popular.monthlyPrice)} a month.
        </Callout>
        <P>
          Plans run from {formatImpressions(min.impressions)} impressions for{" "}
          {formatPrice(min.monthlyPrice)} a month up to {formatImpressions(max.impressions)}{" "}
          impressions for {formatPrice(max.monthlyPrice)} a month. Because the rate is the same on
          every plan, a bigger plan buys more plays, not a different price per play.
        </P>
        <H3>How to pick a size</H3>
        <P>
          Start with your area. A few zip codes need fewer impressions for your ad to show up often
          than three counties do. A bigger area or a wider audience spreads the same impressions
          across more households, so it usually calls for a bigger plan.
        </P>
        <P>
          If you&apos;re unsure, start smaller. Plans are month to month, and you can move up once
          you see how it feels to be on TV.
        </P>
        <P>
          There&apos;s no setup fee and no long-term contract. Commercial production, if you need a
          spot made, is quoted separately.{" "}
          <A href="/pricing">See every plan and try the calculator on our pricing page.</A>
        </P>
      </>
    ),
  },
  {
    id: "is-it-right",
    title: "Is it right for your business?",
    body: (
      <>
        <P>Streaming TV tends to fit businesses that:</P>
        <Bullets
          items={[
            "Serve a defined local area, like a service radius or a set of towns.",
            "Sell something where trust and familiarity matter before someone buys.",
            "Earn enough from a new customer that a handful of them make a month of advertising worthwhile.",
            "Can keep running for a few months, since familiarity builds over time.",
          ]}
        />
        <P>
          Home services, auto dealers, healthcare, legal, restaurants and retail all fit that
          description in different ways. See how it works for{" "}
          <IndustryLink industry={roofing}>roofing and home services</IndustryLink> and{" "}
          <IndustryLink industry={auto}>auto dealers</IndustryLink>, or{" "}
          <A href="/industries">browse all industries</A>.
        </P>
        <P>
          It&apos;s probably not the right tool if you need to trace every sale back to a click, or
          you want results from a single week of ads. Streaming TV builds recognition. It works
          best as a steady presence.
        </P>
        <P>
          A good gut check: if a customer has ever told you they see your trucks or signs
          everywhere, that kind of recognition is what streaming TV builds. The difference is that
          it happens on the screen in their living room.
        </P>
      </>
    ),
  },
  {
    id: "your-commercial",
    title: "Your commercial",
    body: (
      <>
        <P>Here&apos;s what your spot needs to run:</P>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {AD_SPECS.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-bg/60 p-5">
              <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
                {s.label}
              </dt>
              <dd className="mt-2 font-display text-xl font-bold text-text">{s.value}</dd>
              {s.note && <dd className="mt-0.5 text-xs text-text-dim">{s.note}</dd>}
            </div>
          ))}
        </dl>
        <H3>What makes a :30 spot work on TV</H3>
        <Bullets
          items={[
            <>
              <strong className="font-semibold text-text">One clear message.</strong> Pick the one
              thing you want people to remember. A spot that tries to say five things tends to say
              none of them.
            </>,
            <>
              <strong className="font-semibold text-text">Your business name early.</strong> Put
              your name and logo on screen in the first few seconds, and say it out loud. Not
              everyone is looking at the screen the whole time.
            </>,
            <>
              <strong className="font-semibold text-text">A simple call to action.</strong> Call,
              visit or book. Pick one and say it plainly.
            </>,
            <>
              <strong className="font-semibold text-text">
                Contact info on screen long enough to read.
              </strong>{" "}
              Keep your phone number or web address up for the last several seconds, in large
              type. Give people time to read it from across the room.
            </>,
          ]}
        />
        <P>
          Don&apos;t have a commercial? Mark it on the signup form and we&apos;ll talk through
          options. Production is quoted separately.
        </P>
      </>
    ),
  },
  {
    id: "get-started",
    title: "How to get started",
    body: (
      <>
        <P>
          You don&apos;t need an agency, a media buyer or an ad account. We set up and run the
          campaign. Your part is knowing your customers and having a spot ready to go. With us, it
          takes four steps:
        </P>
        <ol className="mt-5 space-y-3 text-text-dim">
          {[
            "Pick a monthly plan.",
            "Tell us your service area and who you want to reach.",
            "Send your :30 commercial as a share link, or tell us you need one.",
            "We set up your targeting, review your spot and launch it.",
          ].map((step, i) => (
            <li key={step} className="flex gap-4 leading-relaxed">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface font-display text-xs font-bold text-accent-soft">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <P>
          If your commercial meets the requirements, it typically starts running within 2 business
          days of signup. You can read the <A href="/how-it-works">full process</A>, or{" "}
          <A href="/signup">get started now</A>.
        </P>
      </>
    ),
  },
];

/* ---------- Table of contents ---------- */

function TocList({ className }: { className?: string }) {
  return (
    <ol className={className}>
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex gap-3 rounded-lg px-3 py-2 text-sm leading-snug text-text-dim transition-colors hover:bg-white/[0.04] hover:text-text"
          >
            <span className="w-5 shrink-0 font-display text-xs font-bold text-accent-soft tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Page ---------- */

export default function StreamingTvGuidePage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: HEADLINE,
          description: DESCRIPTION,
          path: PATH,
          datePublished: DATE_PUBLISHED,
          dateModified: DATE_MODIFIED,
        })}
      />

      <PageHero
        breadcrumbs={[{ name: "Streaming TV Guide", path: PATH }]}
        eyebrow="The guide"
        title={HEADLINE}
        subtitle="Never bought TV before? Start here. What it is, how it works, what it costs, and how to tell if it's right for your business."
      >
        <p className="mt-6 text-center text-xs text-text-muted">
          Updated{" "}
          <time dateTime={DATE_MODIFIED}>
            {new Date(`${DATE_MODIFIED}T12:00:00Z`).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })}
          </time>
        </p>
      </PageHero>

      <Section className="pt-0 sm:pt-4">
        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          {/* Desktop: sticky contents. */}
          <aside className="hidden lg:block">
            <nav aria-label="Contents" className="sticky top-24">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                Contents
              </p>
              <TocList className="space-y-0.5" />
            </nav>
          </aside>

          <div className="min-w-0">
            {/* Mobile: collapsible contents. */}
            <details className="group mb-10 rounded-2xl border border-border bg-linear-to-b from-white/[0.035] to-white/[0.01] lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display font-semibold [&::-webkit-details-marker]:hidden">
                Contents
                <span
                  aria-hidden
                  className="text-text-dim transition-transform duration-200 group-open:rotate-90"
                >
                  {icons.arrow}
                </span>
              </summary>
              <nav aria-label="Contents" className="border-t border-border px-2 py-3">
                <TocList />
              </nav>
            </details>

            <article className="max-w-2xl text-base sm:text-[17px]">
              {sections.map((s, i) => (
                <section key={s.id} aria-labelledby={s.id} className={i > 0 ? "mt-16" : undefined}>
                  <h2
                    id={s.id}
                    className="font-display text-2xl leading-tight font-bold tracking-tight text-text sm:text-3xl"
                  >
                    <span aria-hidden className="mr-3 text-accent-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </h2>
                  {s.body}
                </section>
              ))}
            </article>
          </div>
        </div>
      </Section>

      <CtaBanner
        title="Ready to see your business on TV?"
        subtitle="Prices are on the page, impressions are guaranteed, and there's no contract."
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
