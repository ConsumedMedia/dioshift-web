import type { Metadata } from "next";
import Link from "next/link";
import { notFound, unstable_rethrow } from "next/navigation";
import { adminIcons } from "@/components/admin/icons";
import { BillingBadge, CampaignBadge, CreativeBadge } from "@/components/admin/StatusBadge";
import { LoadError, PageHeader, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { formatCents, formatCount, formatDateTime } from "@/lib/admin/format";
import { getSignup, type SignupRow } from "@/lib/signups";

export const metadata: Metadata = { title: "Client" };

/** Placeholder until the full client detail page (prompt 2). */
export default async function ClientPage({ params }: PageProps<"/admin/clients/[id]">) {
  await requireAdmin();
  const { id } = await params;

  let row: SignupRow | null;
  try {
    row = await getSignup(id);
  } catch (err) {
    unstable_rethrow(err);
    console.error("[admin] Client failed to load:", err);
    return <LoadError what="this client" />;
  }
  if (!row) notFound();

  return (
    <>
      <Link href="/admin/clients" className="mb-3 inline-flex items-center gap-1 text-sm text-text-dim hover:text-text">
        <span className="[&_svg]:size-4">{adminIcons.back}</span>
        Clients
      </Link>
      <PageHeader title={row.business_name} description={`${row.contact_name} · ${row.email}`} />
      <Panel className="space-y-3 px-4 py-4 text-sm">
        <div className="flex flex-wrap gap-1.5">
          <BillingBadge row={row} />
          <CampaignBadge row={row} />
          <span className="inline-flex items-center gap-1 text-xs text-text-muted">
            Creative <CreativeBadge row={row} />
          </span>
        </div>
        <p className="text-text-dim">
          {formatCount(row.impressions)} impressions · {formatCents(row.monthly_price_cents)} / month · signed up{" "}
          {formatDateTime(row.created_at)}
        </p>
        <p className="text-text-muted">The full client page, with notes, activity and actions, is coming next.</p>
      </Panel>
    </>
  );
}
