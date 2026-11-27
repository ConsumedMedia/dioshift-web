"use client";

import { useId, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  CPM,
  PACKAGES,
  POPULAR_PACKAGE,
  formatImpressions,
  formatPrice,
  type Package,
} from "@/lib/packages";

const DEFAULT_INDEX = Math.max(0, PACKAGES.indexOf(POPULAR_PACKAGE));

/** "$125": monthly price over 30 days, rounded to whole dollars. */
const perDay = (pkg: Package) => formatPrice(Math.round(pkg.monthlyPrice / 30));

/** Short slider tick label: 150000 -> "150K". */
const shortImpressions = (n: number) =>
  n >= 1000 && n % 1000 === 0 ? `${n / 1000}K` : formatImpressions(n);

/**
 * Impression calculator plus the plan cards. One client component so moving
 * the slider can highlight the matching card. Every number here comes from
 * lib/packages.ts.
 */
export function PricingCalculator() {
  const [index, setIndex] = useState(DEFAULT_INDEX);
  const pkg = PACKAGES[index];
  const sliderId = useId();
  const max = PACKAGES.length - 1;
  const fill = max === 0 ? 100 : (index / max) * 100;

  return (
    <>
      <Card highlight className="mt-14 p-6 sm:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <label htmlFor={sliderId} className="font-display text-lg font-semibold">
            How many impressions do you want each month?
          </label>
          <p className="text-sm text-text-dim">
            <span className="font-semibold text-accent-soft">{pkg.label}</span> plan
          </p>
        </div>

        <div className="mt-8">
          <input
            id={sliderId}
            type="range"
            min={0}
            max={max}
            step={1}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            aria-valuetext={`${formatImpressions(pkg.impressions)} impressions for ${formatPrice(pkg.monthlyPrice)} a month`}
            className="plan-slider"
            style={{ "--fill": `${fill}%` } as CSSProperties}
          />
          <div aria-hidden className="mt-3 flex justify-between text-xs text-text-muted">
            {PACKAGES.map((p, i) => (
              <span
                key={p.id}
                className={i === index ? "font-semibold text-text" : undefined}
              >
                {shortImpressions(p.impressions)}
              </span>
            ))}
          </div>
        </div>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border grid-cols-2 lg:grid-cols-4">
          <Readout label="Monthly impressions" value={formatImpressions(pkg.impressions)} />
          <Readout label="Monthly price" value={formatPrice(pkg.monthlyPrice)} />
          <Readout label="Per day" value={`About ${perDay(pkg)} a day`} small />
          <Readout label="Rate" value={`${formatPrice(CPM)} per 1,000 views`} small />
        </dl>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-text-dim">
            Same rate on every plan. Billed monthly, no contract.
          </p>
          <Button
            href={`/signup?package=${pkg.id}`}
            size="lg"
            className="w-full sm:w-auto"
            aria-label={`Start with the ${pkg.label} plan, ${formatImpressions(pkg.impressions)} impressions for ${formatPrice(pkg.monthlyPrice)} a month`}
          >
            Start with this plan
          </Button>
        </div>
      </Card>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PACKAGES.map((p) => {
          const selected = p.id === pkg.id;
          return (
            <li key={p.id}>
              <Card
                highlight={selected}
                data-selected={selected || undefined}
                className="flex h-full flex-col transition-[border-color,box-shadow] duration-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-base font-semibold text-text-dim">{p.label}</h3>
                  {p.popular && (
                    <span className="rounded-full border border-accent/30 bg-accent-glow px-2.5 py-1 text-[11px] font-semibold text-accent-soft">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="mt-5 font-display text-3xl font-bold tracking-tight">
                  {formatImpressions(p.impressions)}
                </p>
                <p className="text-sm text-text-dim">impressions per month</p>

                <div className="my-6 h-px bg-border" />

                <p className="flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold tracking-tight">
                    {formatPrice(p.monthlyPrice)}
                  </span>
                  <span className="text-sm text-text-dim">/month</span>
                </p>

                <Button
                  href={`/signup?package=${p.id}`}
                  variant={selected ? "primary" : "secondary"}
                  className="mt-7 w-full"
                  aria-label={`Choose the ${p.label} plan, ${formatImpressions(p.impressions)} impressions`}
                >
                  Choose Plan
                </Button>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Readout({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-bg/90 px-4 py-4 sm:px-5 sm:py-5">
      <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</dt>
      <dd
        className={
          small
            ? "mt-2 font-display text-base font-bold tracking-tight sm:text-xl"
            : "mt-2 font-display text-2xl font-bold tracking-tight sm:text-4xl"
        }
      >
        {value}
      </dd>
    </div>
  );
}
