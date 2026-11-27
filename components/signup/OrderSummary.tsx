import { Card } from "@/components/ui/Card";
import { formatImpressions, formatPrice, type Package } from "@/lib/packages";

const TERMS = ["Billed monthly starting today", "Cancel anytime. We ask for 30 days' notice."] as const;

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="mt-0.5 size-4 shrink-0 text-success">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Desktop: sticky card beside the form. */
export function OrderSummary({ pkg }: { pkg: Package }) {
  return (
    <Card highlight className="p-6 sm:p-7">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">Order summary</h2>
      <div aria-live="polite" aria-atomic>
        <p className="mt-5 font-display text-base font-semibold text-text-dim">{pkg.label} plan</p>
        <p className="mt-1 font-display text-3xl font-bold tracking-tight tabular-nums">{formatImpressions(pkg.impressions)}</p>
        <p className="text-sm text-text-dim">impressions per month</p>

        <div className="my-6 h-px bg-border" />

        <p className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-text-dim">Monthly price</span>
          <span>
            <span className="font-display text-3xl font-bold tracking-tight tabular-nums">{formatPrice(pkg.monthlyPrice)}</span>
            <span className="text-sm text-text-dim">/mo</span>
          </span>
        </p>
      </div>
      <ul className="mt-6 space-y-2.5 text-sm text-text-dim">
        {TERMS.map((t) => (
          <li key={t} className="flex gap-2.5">
            <Check />
            {t}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Mobile: compact bar that expands to show the billing terms. */
export function MobileOrderSummary({ pkg }: { pkg: Package }) {
  return (
    <details className="group rounded-xl border border-accent/40 bg-accent/[0.06] lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block text-xs text-text-dim">{pkg.label} plan</span>
          <span className="block text-sm font-medium leading-snug text-text tabular-nums">
            {formatImpressions(pkg.impressions)} impressions
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="font-display text-lg font-bold tabular-nums">
            {formatPrice(pkg.monthlyPrice)}
            <span className="text-xs font-normal text-text-dim">/mo</span>
          </span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
            className="size-4 text-text-muted transition-transform group-open:rotate-180"
          >
            <path
              fillRule="evenodd"
              d="M5.2 7.2a1 1 0 0 1 1.4 0L10 10.6l3.4-3.4a1 1 0 1 1 1.4 1.4l-4.1 4.1a1 1 0 0 1-1.4 0L5.2 8.6a1 1 0 0 1 0-1.4Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Show billing details</span>
        </span>
      </summary>
      <ul className="space-y-2 border-t border-accent/20 px-4 py-3 text-sm text-text-dim">
        {TERMS.map((t) => (
          <li key={t} className="flex gap-2.5">
            <Check />
            {t}
          </li>
        ))}
      </ul>
    </details>
  );
}
