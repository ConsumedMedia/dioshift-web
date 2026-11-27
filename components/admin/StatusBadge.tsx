import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BILLING, CAMPAIGN, CREATIVE, billingKey, campaignStatus, type Tone } from "@/lib/admin/status";
import type { SignupRow } from "@/lib/signups";

/** One color per tone, used by every status in the admin. */
const TONES: Record<Tone, string> = {
  gray: "border-white/15 bg-white/[0.06] text-text-dim",
  green: "border-success/30 bg-success/10 text-success",
  red: "border-danger/40 bg-danger/15 text-danger",
  muted: "border-white/[0.07] bg-transparent text-text-muted",
  amber: "border-gold/30 bg-gold/10 text-gold",
  blue: "border-accent/35 bg-accent/12 text-accent-soft",
};

export function Badge({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md border px-1.5 py-0.5 text-xs font-medium leading-4",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function BillingBadge({ row, now }: { row: Pick<SignupRow, "status" | "created_at">; now?: Date }) {
  const { label, tone } = BILLING[billingKey(row, now)];
  return <Badge tone={tone}>{label}</Badge>;
}

export function CampaignBadge({ row }: { row: Pick<SignupRow, "campaign_status"> }) {
  const { label, tone } = CAMPAIGN[campaignStatus(row)];
  return <Badge tone={tone}>{label}</Badge>;
}

export function CreativeBadge({ row }: { row: Pick<SignupRow, "creative_status"> }) {
  const { label, tone } = CREATIVE[row.creative_status] ?? CREATIVE.have;
  return <Badge tone={tone}>{label}</Badge>;
}
