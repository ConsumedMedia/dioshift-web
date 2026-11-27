import type { Metadata } from "next";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { adminIcons } from "@/components/admin/icons";
import { BillingBadge } from "@/components/admin/StatusBadge";
import { EmptyState, LoadError, PageHeader, Panel, PanelHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { countUnreadMessages, listSignups } from "@/lib/admin/data";
import { formatCents, formatCount, timeAgo } from "@/lib/admin/format";
import { computeAttention, computeStats, type AttentionItem } from "@/lib/admin/overview";
import { cn } from "@/lib/cn";
import { getPackageById } from "@/lib/packages";
import type { SignupRow } from "@/lib/signups";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  await requireAdmin();

  let rows: SignupRow[];
  let unread: number;
  try {
    [rows, unread] = await Promise.all([listSignups(), countUnreadMessages()]);
  } catch (err) {
    unstable_rethrow(err);
    console.error("[admin] Overview failed to load:", err);
    return (
      <>
        <PageHeader title="Overview" />
        <LoadError what="the overview" />
      </>
    );
  }

  const now = new Date();
  const stats = computeStats(rows);
  const attention = computeAttention(rows, now);
  const recent = rows.slice(0, 5);

  return (
    <>
      <PageHeader title="Overview" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Active clients" value={formatCount(stats.activeClients)} />
        <Stat label="Past due" value={formatCount(stats.pastDue)} danger={stats.pastDue > 0} />
        <Stat label="Pending payment" value={formatCount(stats.pendingPayment)} hint="Never finished checkout" />
        <Stat label="Monthly recurring" value={formatCents(stats.mrrCents)} hint="Active and past due" />
        <Stat
          label="Impressions owed this month"
          value={formatCount(stats.impressionsOwed)}
          hint="Active clients"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel>
          <PanelHeader title="Needs attention" />
          {attention.length === 0 && unread === 0 ? (
            <div className="flex items-center gap-3 px-4 py-8">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-success/10 text-success">
                {adminIcons.check}
              </span>
              <div>
                <p className="text-sm font-medium text-text">All clear</p>
                <p className="text-sm text-text-dim">Nothing needs you right now.</p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {attention.map((item) => (
                <AttentionRow key={item.key} item={item} />
              ))}
              {unread > 0 && (
                <li>
                  <Link href="/admin/messages" className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03]">
                    <Dot severity="info" />
                    <span className="min-w-0 flex-1 text-sm text-text">
                      {unread} unread {unread === 1 ? "message" : "messages"}
                    </span>
                    <span className="text-text-muted">{adminIcons.chevron}</span>
                  </Link>
                </li>
              )}
            </ul>
          )}
        </Panel>

        <Panel>
          <PanelHeader
            title="Recent signups"
            actions={
              <Link href="/admin/clients" className="text-xs text-accent-soft hover:text-accent">
                All clients
              </Link>
            }
          />
          {recent.length === 0 ? (
            <EmptyState title="No signups yet" />
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((row) => (
                <li key={row.id}>
                  <Link href={`/admin/clients/${row.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03]">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">{row.business_name}</p>
                      <p className="truncate text-xs text-text-dim">
                        {getPackageById(row.package_id)?.label ?? row.package_id} · {formatCount(row.impressions)} ·{" "}
                        {timeAgo(row.created_at, now)}
                      </p>
                    </div>
                    <BillingBadge row={row} now={now} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  hint,
  danger,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  danger?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-surface/70 px-4 py-3.5",
        danger ? "border-danger/40 bg-danger/[0.07]" : "border-border",
        className,
      )}
    >
      <p className={cn("text-xs", danger ? "text-danger" : "text-text-dim")}>{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold tabular-nums tracking-tight", danger ? "text-danger" : "text-text")}>
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-text-muted">{hint}</p>}
    </div>
  );
}

const DOT: Record<AttentionItem["severity"], string> = {
  critical: "bg-danger shadow-[0_0_10px_rgba(248,113,113,0.8)]",
  danger: "bg-danger",
  warning: "bg-gold",
  info: "bg-accent",
};

function Dot({ severity }: { severity: AttentionItem["severity"] }) {
  return <span aria-hidden className={cn("size-2 shrink-0 rounded-full", DOT[severity])} />;
}

function AttentionRow({ item }: { item: AttentionItem }) {
  const red = item.severity === "critical" || item.severity === "danger";
  return (
    <li className={cn(item.severity === "critical" && "bg-danger/[0.08]")}>
      <Link href={`/admin/clients/${item.signupId}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03]">
        <Dot severity={item.severity} />
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-medium", red ? "text-danger" : "text-text")}>{item.title}</p>
          <p className="truncate text-xs text-text-dim">
            {item.businessName}
            {item.detail && ` · ${item.detail}`}
          </p>
        </div>
        <span className="text-text-muted">{adminIcons.chevron}</span>
      </Link>
    </li>
  );
}
