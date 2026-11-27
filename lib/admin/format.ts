/*
 * Admin date and number formatting. Every date and time in the admin is shown
 * in America/New_York, whatever the server's or browser's time zone.
 */

export const ADMIN_TIME_ZONE = "America/New_York";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: ADMIN_TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: ADMIN_TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const ymdFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: ADMIN_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const toDate = (value: string | Date) => (value instanceof Date ? value : new Date(value));

/** "Nov 27, 2026" */
export function formatDate(value: string | Date | null | undefined): string {
  return value ? dateFmt.format(toDate(value)) : "";
}

/** "Nov 27, 2026, 3:04 PM ET" */
export function formatDateTime(value: string | Date | null | undefined): string {
  return value ? `${dateTimeFmt.format(toDate(value))} ET` : "";
}

/** "2026-11-27" in New York. */
export function ymdInNewYork(value: string | Date): string {
  return ymdFmt.format(toDate(value));
}

/** "just now", "5m ago", "3h ago", "2d ago", then the date. */
export function timeAgo(value: string | Date, now: Date = new Date()): string {
  const seconds = Math.round((now.getTime() - toDate(value).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

/**
 * Weekdays (Mon to Fri) after `from`'s New York date, up to and including
 * `now`'s. Paid Monday, checked Thursday: 3. Holidays are not skipped.
 */
export function businessDaysSince(from: string | Date, now: Date = new Date()): number {
  const start = new Date(`${ymdInNewYork(from)}T00:00:00Z`);
  const end = new Date(`${ymdInNewYork(now)}T00:00:00Z`);
  let count = 0;
  for (const day = new Date(start); day < end; ) {
    day.setUTCDate(day.getUTCDate() + 1);
    const weekday = day.getUTCDay();
    if (weekday !== 0 && weekday !== 6) count++;
  }
  return count;
}

/** 375000 -> "$3,750". Cents in, whole dollars out when there are no cents. */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** 150000 -> "150,000" */
export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
