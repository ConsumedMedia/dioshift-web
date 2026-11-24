import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

type Tone = "success" | "warn" | "info";

const TONES: Record<Tone, { ring: string; icon: ReactNode }> = {
  success: {
    ring: "border-success/30 bg-success/10 text-success",
    icon: (
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    ),
  },
  warn: {
    ring: "border-gold/30 bg-gold/10 text-gold",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a1 1 0 0 1 1 1v3.5a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm0 8.5a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
        clipRule="evenodd"
      />
    ),
  },
  info: {
    ring: "border-accent/30 bg-accent/10 text-accent-soft",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 5.5a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2ZM9 9.5a1 1 0 1 1 2 0V14a1 1 0 1 1-2 0V9.5Z"
        clipRule="evenodd"
      />
    ),
  },
};

/** Centered card used by the post-signup pages (success, resume). */
export function ResultCard({
  tone,
  title,
  lead,
  children,
}: {
  tone: Tone;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Section className="py-16 sm:py-24" containerClassName="max-w-xl">
      <Card className="p-5 sm:p-10">
        <div className="text-center">
          <span className={cn("mx-auto flex size-12 items-center justify-center rounded-full border", TONES[tone].ring)}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden>
              {TONES[tone].icon}
            </svg>
          </span>
          <h1 className="mt-5 font-display text-[1.75rem] leading-tight font-bold tracking-tight text-balance sm:text-3xl">
            {title}
          </h1>
          {lead && <p className="mx-auto mt-3 max-w-md leading-relaxed text-pretty text-text-dim">{lead}</p>}
        </div>
        {children}
      </Card>
    </Section>
  );
}

/** Label/value rows for a short order summary. */
export function SummaryList({ items }: { items: Array<[label: string, value: ReactNode]> }) {
  return (
    <dl className="mt-8 divide-y divide-border rounded-xl border border-border bg-white/[0.02]">
      {items.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-3 text-[15px]">
          <dt className="text-text-dim">{label}</dt>
          <dd className="min-w-0 text-right font-medium break-words text-text">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Friendly dead end with a way to reach us. */
export function ContactFallback({ title, lead }: { title: string; lead: ReactNode }) {
  return (
    <ResultCard tone="info" title={title} lead={lead}>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href="/contact" size="lg">
          Contact us
        </Button>
        <Button href="/" variant="secondary" size="lg">
          Back to home
        </Button>
      </div>
    </ResultCard>
  );
}

/** Placeholder while the page content streams in. */
export function ResultCardSkeleton() {
  return (
    <Section className="py-16 sm:py-24" containerClassName="max-w-xl">
      <Card className="p-5 sm:p-10" aria-busy>
        <div className="mx-auto size-12 rounded-full bg-white/[0.06]" />
        <div className="mx-auto mt-5 h-8 w-3/4 rounded-lg bg-white/[0.06]" />
        <div className="mx-auto mt-3 h-4 w-2/3 rounded bg-white/[0.04]" />
        <div className="mt-8 h-36 rounded-xl border border-border bg-white/[0.02]" />
        <span className="sr-only">Loading</span>
      </Card>
    </Section>
  );
}
