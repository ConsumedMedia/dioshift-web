import "server-only";

/**
 * The public URL of this site (for example https://dioshift.com), with no
 * trailing slash. Used to build Stripe Checkout return URLs.
 */
export function getSiteUrl(): string {
  const url = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  if (!url) {
    throw new Error(
      "SITE_URL is not set. Add it to .env.local (see .env.example), " +
        "for example SITE_URL=http://localhost:3000, and restart the server.",
    );
  }
  return url;
}
