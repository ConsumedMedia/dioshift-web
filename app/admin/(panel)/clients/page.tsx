import type { Metadata } from "next";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { adminIcons } from "@/components/admin/icons";
import { BillingBadge, CampaignBadge, CreativeBadge } from "@/components/admin/StatusBadge";
import { EmptyState, LoadError, PageHeader, Panel, adminButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { clientsQueryString, filterClients, hasFilters, parseClientsQuery } from "@/lib/admin/clients-query";
import { listSignups } from "@/lib/admin/data";
import { formatCents, formatCount, formatDate } from "@/lib/admin/format";
import type { SignupRow } from "@/lib/signups";
import { ClientFilters } from "./ClientFilters";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage({ searchParams }: PageProps<"/admin/clients">) {
  await requireAdmin();
  const query = parseClientsQuery(await searchParams);
  const qs = clientsQueryString(query);
  const filtered = hasFilters(query);

  let all: SignupRow[];
  try {
    all = await listSignups();
  } catch (err) {
    unstable_rethrow(err);
    console.error("[admin] Clients failed to load:", err);
    return (
      <>
        <PageHeader title="Clients" />
        <LoadError what="clients" />
      </>
    );
  }

  const now = new Date();
  const rows = filterClients(all, query, now);

  return (
    <>
      <PageHeader
        title="Clients"
        description={filtered ? `${rows.length} of ${all.length} signups` : `${all.length} signups`}
        actions={
          <a href={`/api/admin/clients/export${qs}`} download className={adminButton("secondary")}>
            {adminIcons.download}
            Export CSV
          </a>
        }
      />

      {/* key: reset the inputs when the URL changes (back button, Clear filters). */}
      <ClientFilters key={qs} query={query} filtered={filtered} />

      {rows.length === 0 ? (
        <Panel>
          <EmptyState title={filtered ? "No clients match" : "No signups yet"}>
            {filtered && (
              <Link href="/admin/clients" className="text-accent-soft hover:text-accent">
                Clear filters
              </Link>
            )}
          </EmptyState>
        </Panel>
      ) : (
        <>
          {/* Desktop: table */}
          <Panel className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Business</th>
                  <th className="px-3 py-2.5 font-medium">Contact</th>
                  <th className="px-3 py-2.5 text-right font-medium">Plan</th>
                  <th className="px-3 py-2.5 text-right font-medium">Monthly</th>
                  <th className="px-3 py-2.5 font-medium">Billing</th>
                  <th className="px-3 py-2.5 font-medium">Campaign</th>
                  <th className="px-3 py-2.5 font-medium">Creative</th>
                  <th className="px-4 py-2.5 text-right font-medium">Signed up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={row.id} className="relative hover:bg-white/[0.03]">
                    <td className="max-w-64 px-4 py-2.5">
                      {/* The link covers the whole row. */}
                      <Link
                        href={`/admin/clients/${row.id}`}
                        className="block truncate font-medium text-text after:absolute after:inset-0"
                      >
                        {row.business_name}
                      </Link>
                    </td>
                    <td className="max-w-48 truncate px-3 py-2.5 text-text-dim">{row.contact_name}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-text-dim">{formatCount(row.impressions)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-text">{formatCents(row.monthly_price_cents)}</td>
                    <td className="px-3 py-2.5">
                      <BillingBadge row={row} now={now} />
                    </td>
                    <td className="px-3 py-2.5">
                      <CampaignBadge row={row} />
                    </td>
                    <td className="px-3 py-2.5">
                      <CreativeBadge row={row} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right text-text-dim">{formatDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          {/* Phone and tablet: cards */}
          <ul className="space-y-2 lg:hidden">
            {rows.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/admin/clients/${row.id}`}
                  className="block rounded-xl border border-border bg-surface/70 px-4 py-3 active:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate text-[15px] font-semibold text-text">{row.business_name}</p>
                    <p className="shrink-0 text-sm tabular-nums text-text">{formatCents(row.monthly_price_cents)}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <BillingBadge row={row} now={now} />
                    <CampaignBadge row={row} />
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                      Creative <CreativeBadge row={row} />
                    </span>
                  </div>
                  <p className="mt-2 truncate text-xs text-text-dim">
                    {row.contact_name} · {formatCount(row.impressions)} impressions · {formatDate(row.created_at)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
