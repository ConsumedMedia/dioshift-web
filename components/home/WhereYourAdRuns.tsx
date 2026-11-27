import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  contentCategories,
  devices,
  type ContentCategoryIcon,
  type DeviceIcon,
} from "@/lib/inventory";

/* Our own simple line icons. No brand logos. */

const categoryIcons: Record<ContentCategoryIcon, ReactNode> = {
  sports: (
    <Icon>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m12 7.5 3.4 2.5-1.3 4h-4.2l-1.3-4L12 7.5Z" />
      <path d="M12 3.5v4M15.4 10l4.3-1.4M14.1 14l2.6 3.6M9.9 14l-2.6 3.6M8.6 10 4.3 8.6" />
    </Icon>
  ),
  news: (
    <Icon>
      <rect x="3" y="4.5" width="15" height="15" rx="2" />
      <path d="M18 8.5h1.5A1.5 1.5 0 0 1 21 10v7.5a2 2 0 0 1-2 2H5" />
      <path d="M6.5 8.5h8M6.5 12h8M6.5 15.5h5" />
    </Icon>
  ),
  movies: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" />
      <path d="m10.5 10 3.5 2-3.5 2v-4Z" />
    </Icon>
  ),
  channels: (
    <Icon>
      <rect x="2.5" y="6.5" width="19" height="13" rx="2" />
      <path d="m8 2.5 4 4 4-4" />
      <path d="M6 10.5h5M6 13h5M6 15.5h5M14 10.5h4v5h-4z" />
    </Icon>
  ),
};

const deviceIcons: Record<DeviceIcon, ReactNode> = {
  "smart-tv": (
    <Icon className="size-7">
      <rect x="2" y="4" width="20" height="13" rx="1.5" />
      <path d="M8.5 20.5h7M12 17v3.5" />
    </Icon>
  ),
  box: (
    <Icon className="size-7">
      <rect x="3" y="9" width="18" height="7" rx="2" />
      <path d="M6.5 12.5h1.5" />
      <path d="M5 16v1.5M19 16v1.5" />
    </Icon>
  ),
  stick: (
    <Icon className="size-7">
      <rect x="8" y="3" width="8" height="14" rx="2" />
      <path d="M10.5 17v2.5a1.5 1.5 0 0 0 3 0V17" />
      <path d="M11 7h2" />
    </Icon>
  ),
  puck: (
    <Icon className="size-7">
      <rect x="4" y="8" width="16" height="8" rx="3" />
      <path d="M4 13h16" />
    </Icon>
  ),
};

/** Where Dioshift ads run: content categories and devices, from lib/inventory.ts. */
export function WhereYourAdRuns() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Where your ad runs"
        title="On the shows people actually sit down for."
        subtitle="Your commercial plays in the ad breaks of the streaming content your customers already watch, on the TV in their living room."
      />

      <ul className="reveal mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contentCategories.map((c) => (
          <li key={c.id}>
            <Card className="h-full">
              <span className="flex size-10 items-center justify-center rounded-xl border border-accent/25 bg-accent-glow text-accent-soft">
                {categoryIcons[c.icon]}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-text-dim">{c.description}</p>
            </Card>
          </li>
        ))}
      </ul>

      <div className="reveal mt-10">
        <h3 className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          On the devices in their homes
        </h3>
        <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {devices.map((d) => (
            <li
              key={d.id}
              className="flex flex-col items-center gap-2.5 bg-bg px-4 py-6 text-center"
            >
              <span className="text-text-dim">{deviceIcons[d.icon]}</span>
              <span className="text-sm font-medium text-text">{d.name}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center text-sm text-text-muted">
          Exact apps and channels vary by campaign and availability.
        </p>
      </div>
    </Section>
  );
}
