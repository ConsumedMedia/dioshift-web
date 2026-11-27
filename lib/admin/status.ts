import type { CampaignStatus, SignupRow, SignupStatus } from "@/lib/signups";

/*
 * Status labels and badge colors, shared by every admin screen so a status
 * always looks the same. Rendered by components/admin/StatusBadge.tsx.
 */

export type Tone = "gray" | "green" | "red" | "muted" | "amber" | "blue";

/** pending_payment rows older than this show as "Abandoned". */
export const ABANDONED_AFTER_MS = 60 * 60 * 1000;

/** Billing as shown in the admin: Stripe status, with stale pending rows called out. */
export type BillingKey = "pending" | "abandoned" | "active" | "past_due" | "canceled";

export const BILLING: Record<BillingKey, { label: string; tone: Tone }> = {
  pending: { label: "Pending", tone: "gray" },
  abandoned: { label: "Abandoned", tone: "gray" },
  active: { label: "Active", tone: "green" },
  past_due: { label: "Past due", tone: "red" },
  canceled: { label: "Canceled", tone: "muted" },
};

export const CAMPAIGN: Record<CampaignStatus, { label: string; tone: Tone }> = {
  not_started: { label: "Not started", tone: "gray" },
  waiting_on_creative: { label: "Waiting on creative", tone: "amber" },
  ready: { label: "Ready", tone: "blue" },
  live: { label: "Live", tone: "green" },
  paused: { label: "Paused", tone: "amber" },
  ended: { label: "Ended", tone: "muted" },
};

export const CAMPAIGN_STATUSES = Object.keys(CAMPAIGN) as CampaignStatus[];
export const BILLING_KEYS = Object.keys(BILLING) as BillingKey[];

export const CREATIVE = {
  have: { label: "Have", tone: "green" },
  need: { label: "Need", tone: "amber" },
} as const satisfies Record<SignupRow["creative_status"], { label: string; tone: Tone }>;

export function billingKey(row: Pick<SignupRow, "status" | "created_at">, now: Date = new Date()): BillingKey {
  const status: SignupStatus = row.status;
  if (status === "pending_payment") {
    return now.getTime() - new Date(row.created_at).getTime() > ABANDONED_AFTER_MS ? "abandoned" : "pending";
  }
  return status;
}

/** Tolerates rows from before campaign_status existed. */
export function campaignStatus(row: Pick<SignupRow, "campaign_status">): CampaignStatus {
  return row.campaign_status in CAMPAIGN ? row.campaign_status : "not_started";
}
