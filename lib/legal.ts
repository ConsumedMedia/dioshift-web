/**
 * Version of the Terms of Service and Privacy Policy (content/legal/*.md).
 *
 * BUMP THIS DATE WHENEVER EITHER DOCUMENT CHANGES, even for a small wording
 * fix. It is shown as the effective date on both pages and saved with every
 * signup (streaming_signups.terms_version), so we can always tell which
 * version a client agreed to.
 */
const LEGAL_VERSION_DATE = "2026-11-25";

/** Effective date of both documents, as YYYY-MM-DD. */
export const LEGAL_EFFECTIVE_DATE = LEGAL_VERSION_DATE;

/** Saved on each signup row as the version of the Terms the client accepted. */
export const TERMS_VERSION = LEGAL_VERSION_DATE;

/** "2026-11-25" -> "November 25, 2026" */
export function formatLegalDate(isoDate: string = LEGAL_EFFECTIVE_DATE): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
