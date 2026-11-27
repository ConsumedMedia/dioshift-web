import { businessDaysSince, formatDate } from "@/lib/admin/format";
import { campaignStatus } from "@/lib/admin/status";
import type { SignupRow } from "@/lib/signups";

/* Overview numbers and the "Needs attention" list, computed from every signup. */

export interface OverviewStats {
  activeClients: number;
  pastDue: number;
  pendingPayment: number;
  mrrCents: number;
  impressionsOwed: number;
}

export interface AttentionItem {
  key: string;
  signupId: string;
  businessName: string;
  title: string;
  detail?: string;
  /** "critical": past due and still live. "danger": past due. */
  severity: "critical" | "danger" | "warning" | "info";
}

/** Paid at least this many business days ago without going live gets flagged. */
const LAUNCH_GRACE_BUSINESS_DAYS = 2;

export function computeStats(rows: SignupRow[]): OverviewStats {
  const stats: OverviewStats = { activeClients: 0, pastDue: 0, pendingPayment: 0, mrrCents: 0, impressionsOwed: 0 };
  for (const row of rows) {
    if (row.status === "active") {
      stats.activeClients++;
      stats.impressionsOwed += row.impressions;
    }
    if (row.status === "past_due") stats.pastDue++;
    if (row.status === "pending_payment") stats.pendingPayment++;
    if (row.status === "active" || row.status === "past_due") stats.mrrCents += row.monthly_price_cents;
  }
  return stats;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function computeAttention(rows: SignupRow[], now: Date = new Date()): AttentionItem[] {
  const items: AttentionItem[] = [];

  for (const row of rows) {
    const campaign = campaignStatus(row);
    const base = { signupId: row.id, businessName: row.business_name };

    if (row.status === "past_due") {
      const live = campaign === "live";
      items.push({
        ...base,
        key: `past-due-${row.id}`,
        title: live ? "Billing past due, campaign still live" : "Billing past due",
        detail: row.last_payment_failed_at ? `Payment failed ${formatDate(row.last_payment_failed_at)}` : undefined,
        severity: live ? "critical" : "danger",
      });
    }

    if (row.status === "active" && campaign !== "live") {
      const daysSincePaid = row.paid_at ? businessDaysSince(row.paid_at, now) : 0;
      const overdue = daysSincePaid > LAUNCH_GRACE_BUSINESS_DAYS;
      const paidNote = row.paid_at ? `Paid ${plural(daysSincePaid, "business day")} ago` : undefined;

      if (row.creative_status === "need") {
        // One item per client: a client who needs a commercial is also not launched.
        items.push({
          ...base,
          key: `creative-${row.id}`,
          title: "Needs a commercial",
          detail: paidNote,
          severity: overdue ? "warning" : "info",
        });
      } else if (overdue) {
        items.push({
          ...base,
          key: `launch-${row.id}`,
          title: "Paid but not launched",
          detail: paidNote,
          severity: "warning",
        });
      }
    }

    if (row.cancel_effective_at && new Date(row.cancel_effective_at).getTime() > now.getTime()) {
      items.push({
        ...base,
        key: `cancel-${row.id}`,
        title: "Scheduled to cancel",
        detail: `Ends ${formatDate(row.cancel_effective_at)}`,
        severity: "info",
      });
    }
  }

  const order = { critical: 0, danger: 1, warning: 2, info: 3 };
  return items.sort((a, b) => order[a.severity] - order[b.severity]);
}
