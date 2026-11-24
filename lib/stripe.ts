import "server-only";
import Stripe from "stripe";

/**
 * This Stripe account is shared with another app that has its own webhook.
 * Every object this site creates carries `metadata.source` set to this value,
 * so each app can ignore the other's objects.
 */
export const STRIPE_SOURCE = "streaming_signup";

let client: Stripe | null = null;

/**
 * Server-only Stripe client. Created on first use so a missing key fails at
 * request time with a clear message instead of breaking the build.
 */
export function getStripe(): Stripe {
  if (client) return client;

  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error(
      "Stripe is not configured. Missing environment variable: STRIPE_SECRET_KEY. " +
        "Add it to .env.local (see .env.example) and restart the server.",
    );
  }

  client = new Stripe(key, { appInfo: { name: "dioshift-web" } });
  return client;
}

/** True when the metadata on a Stripe object marks it as ours. */
export function isOurs(metadata: Stripe.Metadata | null | undefined): boolean {
  return metadata?.source === STRIPE_SOURCE;
}

/** Stripe dashboard base URL, with /test when using a test mode key. */
export function stripeDashboardUrl(): string {
  const testMode = process.env.STRIPE_SECRET_KEY?.trim().startsWith("sk_test_") ?? false;
  return testMode ? "https://dashboard.stripe.com/test" : "https://dashboard.stripe.com";
}

/** Returns the id whether Stripe gave us an id string or an expanded object. */
export function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}
