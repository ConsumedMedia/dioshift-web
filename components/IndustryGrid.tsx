import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, icons } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { INDUSTRIES, industryPath } from "@/lib/industries";

/* Simple line icons, one per industry. Unknown slugs fall back to a TV. */
const industryIcons: Record<string, ReactNode> = {
  "roofing-home-services": (
    <Icon>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5.5h4V20" />
    </Icon>
  ),
  "auto-dealers": (
    <Icon>
      <path d="M4 16.5V12l2-5h12l2 5v4.5" />
      <path d="M3 16.5h18v2H3z" />
      <path d="M4 12h16" />
      <circle cx="7.5" cy="14.3" r="0.6" />
      <circle cx="16.5" cy="14.3" r="0.6" />
    </Icon>
  ),
  restaurants: (
    <Icon>
      <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10" />
      <path d="M17 21V3c-2 1.5-3 4-3 7v3h3" />
    </Icon>
  ),
  "healthcare-med-spas": (
    <Icon>
      <path d="M12 20.5s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7.3 4.5 4.5 0 0 1 20 10c0 5.9-8 10.5-8 10.5Z" />
      <path d="M12 10.5v5M9.5 13h5" />
    </Icon>
  ),
  legal: (
    <Icon>
      <path d="M12 4v16M8 20h8" />
      <path d="M5 7h14" />
      <path d="m5 7-2.5 6a2.5 2.5 0 0 0 5 0L5 7ZM19 7l-2.5 6a2.5 2.5 0 0 0 5 0L19 7Z" />
    </Icon>
  ),
  retail: (
    <Icon>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </Icon>
  ),
};

const fallbackIcon = (
  <Icon>
    <rect x="2.5" y="4" width="19" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </Icon>
);

/**
 * Every industry from lib/industries.ts as a tile. Published industries link
 * to their page. Unpublished ones show the name and description only.
 */
export function IndustryGrid({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {INDUSTRIES.map((industry) => {
        const body = (
          <>
            <span
              className={
                industry.published
                  ? "flex size-10 items-center justify-center rounded-xl border border-accent/25 bg-accent-glow text-accent-soft"
                  : "flex size-10 items-center justify-center rounded-xl border border-border-bright bg-surface-2 text-text-dim"
              }
            >
              {industryIcons[industry.slug] ?? fallbackIcon}
            </span>
            <Heading className="mt-5 font-display text-lg font-semibold">{industry.name}</Heading>
            <p className="mt-1.5 text-[15px] leading-relaxed text-text-dim">
              {industry.shortDescription}
            </p>
          </>
        );

        return (
          <li key={industry.slug}>
            {industry.published ? (
              <Link
                href={industryPath(industry.slug)}
                className="group block h-full rounded-2xl focus-visible:rounded-2xl"
              >
                <Card className="flex h-full flex-col transition-colors group-hover:border-border-bright">
                  {body}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-accent-soft transition-colors group-hover:text-text">
                    See how it works {icons.arrow}
                  </span>
                </Card>
              </Link>
            ) : (
              <Card className="h-full">{body}</Card>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** The line under the grid, pointing everyone else to the contact page. */
export function IndustryGridFooter() {
  return (
    <p className="mt-10 text-center text-[15px] text-text-dim">
      Don&apos;t see your industry? Streaming TV works for most local businesses.{" "}
      <Link
        href="/contact"
        className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap text-accent-soft transition-colors hover:text-text"
      >
        Tell us about yours {icons.arrow}
      </Link>
    </p>
  );
}
