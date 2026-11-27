import { requireAdmin } from "@/lib/admin/auth";
import { filterClients, parseClientsQuery } from "@/lib/admin/clients-query";
import { listSignups } from "@/lib/admin/data";
import { ymdInNewYork } from "@/lib/admin/format";
import { BILLING, billingKey } from "@/lib/admin/status";

/**
 * GET /api/admin/clients/export?<same query as /admin/clients>
 * Downloads the filtered clients list as CSV, with every signup column.
 */

/** Column order for the known fields; any column added later is appended after these. */
const COLUMNS = [
  "id",
  "created_at",
  "updated_at",
  "status",
  "campaign_status",
  "package_id",
  "impressions",
  "monthly_price_cents",
  "cpm_cents",
  "business_name",
  "contact_name",
  "email",
  "phone",
  "website",
  "business_category",
  "business_city",
  "business_state",
  "business_zip",
  "service_area_type",
  "service_area_details",
  "radius_miles",
  "target_age_ranges",
  "target_gender",
  "target_household_income",
  "target_interests",
  "preferred_start",
  "creative_status",
  "creative_link",
  "creative_specs_confirmed",
  "creative_notes",
  "additional_notes",
  "terms_accepted_at",
  "terms_version",
  "stripe_customer_id",
  "stripe_subscription_id",
  "stripe_checkout_session_id",
  "paid_at",
  "last_payment_failed_at",
  "launched_at",
  "cancel_requested_at",
  "cancel_effective_at",
];

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let text = Array.isArray(value) ? value.join("; ") : typeof value === "object" ? JSON.stringify(value) : String(value);
  // Stop spreadsheet apps from running a value as a formula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET(request: Request) {
  await requireAdmin();

  const query = parseClientsQuery(new URL(request.url).searchParams);
  let rows;
  try {
    rows = await listSignups();
  } catch (err) {
    console.error("[admin] CSV export failed:", err);
    return new Response("Could not load clients. Please try again.", { status: 500 });
  }
  const now = new Date();
  const filtered = filterClients(rows, query, now);

  const extra = new Set<string>();
  for (const row of filtered) for (const key of Object.keys(row)) if (!COLUMNS.includes(key)) extra.add(key);
  const columns = [...COLUMNS, ...[...extra].sort()];

  const lines = [
    [...columns, "billing_display"].join(","),
    ...filtered.map((row) => {
      const record = row as unknown as Record<string, unknown>;
      return [...columns.map((c) => cell(record[c])), cell(BILLING[billingKey(row, now)].label)].join(",");
    }),
  ];

  // BOM so Excel reads UTF-8 correctly.
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dioshift-clients-${ymdInNewYork(now)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
