import "server-only";
import { formatImpressions, formatPrice, getPackageById } from "@/lib/packages";
import type { SignupRow } from "@/lib/signups";
import { getSiteUrl } from "@/lib/site-url";
import { STRIPE_SOURCE, getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type CheckoutSignup = Pick<
  SignupRow,
  "id" | "email" | "business_name" | "package_id" | "impressions" | "monthly_price_cents" | "stripe_checkout_session_id"
>;

/**
 * Creates a Stripe Checkout Session (subscription mode) for a saved signup
 * and records its id on the row. Returns the hosted Checkout URL.
 *
 * The price comes from the row, which the server computed from
 * lib/packages.ts. Nothing about price is ever taken from the browser.
 */
export async function createCheckoutSession(signup: CheckoutSignup): Promise<string> {
  const stripe = getStripe();
  const siteUrl = getSiteUrl();

  // Close the previous session, if it's still open, so one signup can't end
  // up paid twice from two tabs. Best effort: it may already be expired.
  if (signup.stripe_checkout_session_id) {
    await stripe.checkout.sessions.expire(signup.stripe_checkout_session_id).catch(() => undefined);
  }

  const impressions = formatImpressions(signup.impressions);
  const label = getPackageById(signup.package_id)?.label;
  const metadata = {
    source: STRIPE_SOURCE,
    signup_id: signup.id,
    package_id: signup.package_id,
    // Stripe caps metadata values at 500 characters.
    business_name: signup.business_name.slice(0, 500),
  };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: signup.monthly_price_cents,
          recurring: { interval: "month" },
          product_data: {
            name: `Dioshift Streaming TV: ${impressions} Impressions / Month`,
            metadata: { source: STRIPE_SOURCE, package_id: signup.package_id },
          },
        },
      },
    ],
    customer_email: signup.email,
    client_reference_id: signup.id,
    metadata,
    subscription_data: {
      metadata,
      description:
        `${signup.business_name}: ${label ? `${label}, ` : ""}${impressions} impressions / month ` +
        `(${formatPrice(signup.monthly_price_cents / 100)}/mo)`,
    },
    billing_address_collection: "auto",
    success_url: `${siteUrl}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/signup/resume?id=${encodeURIComponent(signup.id)}`,
  });

  if (!session.url) throw new Error(`Stripe returned no Checkout URL for session ${session.id}`);

  const { error } = await getSupabaseAdmin()
    .from("streaming_signups")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", signup.id);
  if (error) {
    // The session is still valid and the webhook finds the row by signup_id,
    // so the customer can keep going. Just note it.
    console.error(`[checkout] Saved session ${session.id} to Stripe but not to signup ${signup.id}:`, error);
  }

  return session.url;
}
