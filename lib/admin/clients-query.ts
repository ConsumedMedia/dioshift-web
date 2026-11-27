import { z } from "zod";
import { BILLING_KEYS, CAMPAIGN_STATUSES, billingKey, campaignStatus, type BillingKey } from "@/lib/admin/status";
import type { CampaignStatus, SignupRow } from "@/lib/signups";

/*
 * Search, filters and sort for the clients list, read from the URL so links
 * and the back button work. The CSV export reads the same query, so it always
 * downloads exactly what the list shows. Bad values fall back to "all".
 */

export const CLIENT_SORTS = ["newest", "business", "price"] as const;
export type ClientSort = (typeof CLIENT_SORTS)[number];

export const SORT_LABELS: Record<ClientSort, string> = {
  newest: "Newest first",
  business: "Business name",
  price: "Price, high to low",
};

const one = (value: unknown) => (Array.isArray(value) ? value[0] : value);
const optionalEnum = <T extends string>(values: readonly T[]) =>
  z.preprocess(one, z.enum(values as [T, ...T[]]).optional().catch(undefined));

const clientsQuerySchema = z.object({
  q: z.preprocess(one, z.string().trim().max(100).optional().catch(undefined)),
  billing: optionalEnum<BillingKey>(BILLING_KEYS),
  campaign: optionalEnum<CampaignStatus>(CAMPAIGN_STATUSES),
  creative: optionalEnum(["have", "need"] as const),
  sort: optionalEnum(CLIENT_SORTS),
});

export interface ClientsQuery {
  q: string;
  billing?: BillingKey;
  campaign?: CampaignStatus;
  creative?: "have" | "need";
  sort: ClientSort;
}

/** From Next.js searchParams or URLSearchParams. Never throws. */
export function parseClientsQuery(input: Record<string, string | string[] | undefined> | URLSearchParams): ClientsQuery {
  const raw = input instanceof URLSearchParams ? Object.fromEntries(input) : input;
  const parsed = clientsQuerySchema.parse(raw);
  return {
    q: parsed.q ?? "",
    billing: parsed.billing,
    campaign: parsed.campaign,
    creative: parsed.creative,
    sort: parsed.sort ?? "newest",
  };
}

/** The query as a URL search string ("" or "?q=..."), leaving out defaults. */
export function clientsQueryString(query: ClientsQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.billing) params.set("billing", query.billing);
  if (query.campaign) params.set("campaign", query.campaign);
  if (query.creative) params.set("creative", query.creative);
  if (query.sort !== "newest") params.set("sort", query.sort);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function hasFilters(query: ClientsQuery): boolean {
  return Boolean(query.q || query.billing || query.campaign || query.creative);
}

/** Applies search, filters and sort. Rows come in newest first. */
export function filterClients<T extends SignupRow>(rows: T[], query: ClientsQuery, now: Date = new Date()): T[] {
  const needle = query.q.toLowerCase();
  const filtered = rows.filter((row) => {
    if (needle) {
      const haystack = `${row.business_name}\n${row.contact_name}\n${row.email}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    if (query.billing && billingKey(row, now) !== query.billing) return false;
    if (query.campaign && campaignStatus(row) !== query.campaign) return false;
    if (query.creative && row.creative_status !== query.creative) return false;
    return true;
  });

  const newest = (a: T, b: T) => b.created_at.localeCompare(a.created_at);
  if (query.sort === "business") {
    filtered.sort((a, b) => a.business_name.localeCompare(b.business_name, "en", { sensitivity: "base" }) || newest(a, b));
  } else if (query.sort === "price") {
    filtered.sort((a, b) => b.monthly_price_cents - a.monthly_price_cents || newest(a, b));
  } else {
    filtered.sort(newest);
  }
  return filtered;
}
