import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/CtaBanner";
import { FaqAccordion } from "@/components/FaqAccordion";
import { icons } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  PUBLISHED_INDUSTRIES,
  getPublishedIndustry,
  industryPath,
  type PublishedIndustry,
} from "@/lib/industries";
import { pageMetadata } from "@/lib/metadata";
import { formatImpressions, formatPrice, getPackageById, type PackageId } from "@/lib/packages";
import { industryServiceJsonLd } from "@/lib/structured-data";

/*
 * One page per published industry in lib/industries.ts. Only published slugs
 * are prerendered. With Cache Components, `dynamicParams` isn't available, so
 * any other slug (unpublished or made up) hits notFound() and returns 404.
 */
export function generateStaticParams() {
  return PUBLISHED_INDUSTRIES.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const industry = getPublishedIndustry(slug);
  if (!industry) return {};
  return pageMetadata({
    title: industry.content.metaTitle,
    description: industry.content.metaDescription,
    path: industryPath(industry.slug),
  });
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = getPublishedIndustry(slug);
  if (!industry) notFound();

  const { name, content } = industry;
  const path = industryPath(industry.slug);

  return (
    <>
      <JsonLd
        data={industryServiceJsonLd({
          name: `Streaming TV advertising for ${name.toLowerCase()}`,
          description: content.metaDescription,
          path,
          audience: content.audience,
        })}
      />

      <PageHero
        breadcrumbs={[
          { name: "Industries", path: "/industries" },
          { name, path },
        ]}
        eyebrow={name}
        title={content.headline}
        subtitle={content.intro}
      >
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/signup" size="lg">
            Get Started
          </Button>
          <Button href="/pricing" variant="secondary" size="lg">
            See Pricing
          </Button>
        </div>
      </PageHero>

      <WhyItFits industry={industry} />
      <Targeting industry={industry} />
      <Timing industry={industry} />
      <Script industry={industry} />
      <PlanFit industry={industry} />

      <Section containerClassName="max-w-3xl">
        <SectionHeading eyebrow="Questions" title={`${name}: common questions.`} />
        <div className="mt-12">
          <FaqAccordion
            groups={[{ id: industry.slug, title: `${name} questions`, items: content.faqs }]}
            showGroupTitles={false}
          />
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
        title="Put your business on the big screen."
        subtitle="Prices on the page, impressions guaranteed and no contract. We handle the setup."
      >
        <Button href="/signup" size="lg">
          Get Started
        </Button>
      </CtaBanner>
    </>
  );
}

type SectionProps = { industry: PublishedIndustry };

function WhyItFits({ industry }: SectionProps) {
  return (
    <Section className="pt-4 sm:pt-8">
      <SectionHeading
        eyebrow="Why streaming TV fits"
        title="Why it works for this kind of business."
      />
      <ul className="mt-14 grid gap-4 sm:grid-cols-2">
        {industry.content.whyItFits.map((item) => (
          <li key={item.title}>
            <Card className="h-full">
              <span className="flex size-8 items-center justify-center rounded-full border border-accent/30 bg-accent-glow text-accent-soft">
                {icons.check}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-dim">{item.body}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Targeting({ industry }: SectionProps) {
  const { targeting, targetingIntro } = industry.content;
  return (
    <Section className="border-y border-border bg-surface/40">
      <SectionHeading eyebrow="Who to target" title="Example targeting setups." subtitle={targetingIntro} />
      <ul className="mt-14 grid gap-4 lg:grid-cols-3">
        {targeting.map((setup) => (
          <li key={setup.name}>
            <Card className="flex h-full flex-col">
              <h3 className="font-display text-lg font-semibold">{setup.name}</h3>
              <dl className="mt-5 space-y-4 text-[15px]">
                {[
                  { label: "Location", value: setup.location },
                  { label: "Age range", value: setup.ageRange },
                  { label: "Interests", value: setup.interests },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      {row.label}
                    </dt>
                    <dd className="mt-1 leading-relaxed text-text">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto pt-5">
                <p className="border-t border-border pt-4 text-sm leading-relaxed text-text-dim">
                  {setup.why}
                </p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Timing({ industry }: SectionProps) {
  const { timing, timingIntro, timingNote } = industry.content;
  return (
    <Section>
      <SectionHeading eyebrow="Timing" title="When to push hardest." subtitle={timingIntro} />
      <ol className="mt-14 grid gap-4 md:grid-cols-3">
        {timing.map((t, i) => (
          <li key={t.title}>
            <Card className="h-full">
              <span className="font-display text-sm font-bold text-accent-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{t.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-dim">{t.body}</p>
            </Card>
          </li>
        ))}
      </ol>
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-text-muted">
        {timingNote}
      </p>
    </Section>
  );
}

function Script({ industry }: SectionProps) {
  const { script, scriptIntro, scriptTips } = industry.content;
  return (
    <Section className="border-y border-border bg-surface/40">
      <SectionHeading eyebrow="Your :30 spot" title="What to say in 30 seconds." subtitle={scriptIntro} />

      <div className="mt-14 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-0 sm:p-0">
          <h3 className="sr-only">Example script outline</h3>
          <ol className="divide-y divide-border">
            {script.map((beat) => (
              <li key={beat.label} className="grid gap-3 p-6 sm:grid-cols-[130px_1fr] sm:gap-6 sm:p-7">
                <div>
                  <p className="font-display font-semibold text-text">{beat.label}</p>
                  <p className="mt-0.5 text-xs text-text-muted tabular-nums">{beat.time}</p>
                </div>
                <div>
                  <p className="text-[15px] leading-relaxed text-text-dim">{beat.direction}</p>
                  <p className="mt-3 rounded-xl border border-accent/20 bg-accent-glow/50 px-4 py-3 text-[15px] leading-relaxed text-text italic">
                    &ldquo;{beat.example}&rdquo;
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="h-full">
          <h3 className="font-display text-lg font-semibold">Tips that help on TV</h3>
          <ul className="mt-4 space-y-3 text-[15px] text-text-dim">
            {scriptTips.map((tip) => (
              <li key={tip} className="flex gap-3 leading-relaxed">
                <span
                  aria-hidden
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
                />
                {tip}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-border pt-5 text-sm leading-relaxed text-text-muted">
            Specs: :30 seconds, 1080p, MP4 recommended. No commercial yet? Mark it on the signup
            form and we&apos;ll talk through options.
          </p>
        </Card>
      </div>
    </Section>
  );
}

function PlanFit({ industry }: SectionProps) {
  const { planFit } = industry.content;
  return (
    <Section>
      <SectionHeading
        eyebrow="Which plan fits"
        title="A good place to start."
        subtitle="Every business is different, so treat this as a starting point, not a rule. You can change plans later."
      />
      <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2">
        <PlanCard packageId={planFit.packageId} body={planFit.body} tag="Starting point" highlight />
        <PlanCard packageId={planFit.stepUp.packageId} body={planFit.stepUp.body} tag="When you need more" />
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-soft transition-colors hover:text-text"
        >
          Compare all plans {icons.arrow}
        </Link>
      </div>
    </Section>
  );
}

function PlanCard({
  packageId,
  body,
  tag,
  highlight,
}: {
  packageId: PackageId;
  body: string;
  tag: string;
  highlight?: boolean;
}) {
  const pkg = getPackageById(packageId);
  if (!pkg) throw new Error(`lib/industries.ts: unknown package "${packageId}"`);
  return (
    <Card highlight={highlight} className="flex h-full flex-col">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">{tag}</p>
      <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">{pkg.label} plan</h3>
      <p className="mt-1 text-sm text-text-dim">
        {formatImpressions(pkg.impressions)} impressions for{" "}
        <span className="font-semibold text-text">{formatPrice(pkg.monthlyPrice)}</span> a month
      </p>
      <p className="mt-5 text-[15px] leading-relaxed text-text-dim">{body}</p>
      <div className="mt-auto pt-7">
        <Button
          href={`/signup?package=${pkg.id}`}
          variant={highlight ? "primary" : "secondary"}
          className="w-full"
        >
          Start with {pkg.label}
        </Button>
      </div>
    </Card>
  );
}
