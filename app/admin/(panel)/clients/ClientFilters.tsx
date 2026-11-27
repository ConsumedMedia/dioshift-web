"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminIcons } from "@/components/admin/icons";
import { adminButton, inputClass, selectClass } from "@/components/admin/ui";
import {
  CLIENT_SORTS,
  SORT_LABELS,
  clientsQueryString,
  parseClientsQuery,
  type ClientsQuery,
} from "@/lib/admin/clients-query";
import { BILLING, BILLING_KEYS, CAMPAIGN, CAMPAIGN_STATUSES } from "@/lib/admin/status";

/**
 * Search, filters and sort as a GET form, so everything lives in the URL.
 * With JavaScript, submits become client-side navigations with empty fields
 * left out of the URL; without it, the form still works as a plain GET.
 * Selects apply as soon as they change; search applies on Enter or Search.
 */
export function ClientFilters({ query, filtered }: { query: ClientsQuery; filtered: boolean }) {
  const router = useRouter();
  const submit = (e: React.ChangeEvent<HTMLSelectElement>) => e.currentTarget.form?.requestSubmit();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(e.currentTarget)) {
      if (typeof value === "string" && value.trim()) params.set(key, value);
    }
    router.push(`/admin/clients${clientsQueryString(parseClientsQuery(params))}`);
  };

  return (
    <form action="/admin/clients" method="get" onSubmit={onSubmit} className="mb-4 space-y-2.5" role="search">
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted">
            {adminIcons.search}
          </span>
          <input
            type="search"
            name="q"
            defaultValue={query.q}
            placeholder="Search business, contact or email"
            aria-label="Search clients"
            maxLength={100}
            className={`${inputClass} pl-9`}
          />
        </div>
        <button type="submit" className={adminButton("secondary")}>
          Search
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <select name="billing" defaultValue={query.billing ?? ""} onChange={submit} aria-label="Billing status" className={selectClass}>
          <option value="">All billing</option>
          {BILLING_KEYS.map((key) => (
            <option key={key} value={key}>
              {BILLING[key].label}
            </option>
          ))}
        </select>
        <select name="campaign" defaultValue={query.campaign ?? ""} onChange={submit} aria-label="Campaign status" className={selectClass}>
          <option value="">All campaigns</option>
          {CAMPAIGN_STATUSES.map((key) => (
            <option key={key} value={key}>
              {CAMPAIGN[key].label}
            </option>
          ))}
        </select>
        <select name="creative" defaultValue={query.creative ?? ""} onChange={submit} aria-label="Creative" className={selectClass}>
          <option value="">All creative</option>
          <option value="have">Has commercial</option>
          <option value="need">Needs commercial</option>
        </select>
        <select name="sort" defaultValue={query.sort} onChange={submit} aria-label="Sort" className={selectClass}>
          {CLIENT_SORTS.map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
        {filtered && (
          <Link href="/admin/clients" className={adminButton("ghost", "col-span-2 sm:col-span-1")}>
            Clear filters
          </Link>
        )}
      </div>
    </form>
  );
}
