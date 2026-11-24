import Stripe from "stripe";
import { sendPaymentFailedNotice, sendSignupEmails, sendSubscriptionCanceledNotice } from "@/lib/emails/signup";
import { getSignup, isSignupId, type SignupRow } from "@/lib/signups";
import { idOf, isOurs } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/*
 * Stripe webhook for streaming TV signups.
 *
 * This Stripe account is shared with another app that has its own webhook,
 * so every event whose object doesn't carry metadata.source ===
 * "streaming_signup" is acknowledged with a 200 and otherwise ignored.
 *
 * Not rate limited: Stripe must always be able to reach it.
 */

const ok = () => Response.json({ received: true });

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error(
      "[stripe-webhook] Missing environment variable: STRIPE_WEBHOOK_SECRET. " +
        "Add it to .env.local (see .env.example) and restart the server.",
    );
    return Response.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  // The signature covers the exact bytes Stripe sent, so read the raw body.
  const payload = await request.text();
  if (!signature) return Response.json({ error: "Missing signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.warn("[stripe-webhook] Rejected an event with a bad signature:", (err as Error).message);
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await onCheckoutPaid(event.data.object, event.id);
        break;
      case "customer.subscription.deleted":
        await onSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_failed":
        await onPaymentFailed(event.data.object);
        break;
      default:
        break;
    }
  } catch (err) {
    // Our own processing failed (database, etc). 500 makes Stripe retry.
    console.error(`[stripe-webhook] Failed to process ${event.type} (${event.id}):`, err);
    return Response.json({ error: "Processing failed." }, { status: 500 });
  }

  return ok();
}

/**
 * Marks the signup active and sends the two signup emails.
 *
 * Idempotent: the update only matches a row that is still 'pending_payment',
 * so a retried or duplicate event changes nothing and sends nothing.
 */
async function onCheckoutPaid(session: Stripe.Checkout.Session, eventId: string) {
  if (!isOurs(session.metadata)) return;
  if (session.mode !== "subscription") return;
  // Delayed payment methods complete as "unpaid", then send
  // checkout.session.async_payment_succeeded once the money arrives.
  if (session.payment_status === "unpaid") return;

  const signupId = session.metadata?.signup_id ?? session.client_reference_id;
  if (!isSignupId(signupId)) {
    console.error(`[stripe-webhook] Session ${session.id} (${eventId}) has no valid signup_id. Nothing updated.`);
    return;
  }

  const customerId = idOf(session.customer);
  const subscriptionId = idOf(session.subscription);

  const { data, error } = await getSupabaseAdmin()
    .from("streaming_signups")
    .update({
      status: "active",
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_checkout_session_id: session.id,
      paid_at: new Date().toISOString(),
    })
    .eq("id", signupId)
    .eq("status", "pending_payment")
    .select("*");
  if (error) throw new Error(`Could not activate signup ${signupId}: ${error.message}`);

  const row = (data as SignupRow[] | null)?.[0];
  if (!row) {
    // Already active (a Stripe retry) or the row is gone. Check for the one
    // case that needs a human: a second, different subscription for one signup.
    const existing = await getSignup(signupId);
    if (!existing) {
      console.error(`[stripe-webhook] Session ${session.id} paid for signup ${signupId}, but that row doesn't exist.`);
    } else if (subscriptionId && existing.stripe_subscription_id && existing.stripe_subscription_id !== subscriptionId) {
      console.error(
        `[stripe-webhook] POSSIBLE DOUBLE CHARGE: signup ${signupId} is already on subscription ` +
          `${existing.stripe_subscription_id}, but session ${session.id} created ${subscriptionId}. Check Stripe.`,
      );
    }
    return;
  }

  try {
    await sendSignupEmails(row);
  } catch (err) {
    // The row is already active, so a Stripe retry would skip the emails
    // anyway. Log loudly instead of returning 500.
    console.error(`[stripe-webhook] Signup ${row.id} is active, but sending its emails failed:`, err);
  }
}

/** Subscription ended (canceled in the dashboard or after failed payments). */
async function onSubscriptionDeleted(subscription: Stripe.Subscription) {
  if (!isOurs(subscription.metadata)) return;

  let query = getSupabaseAdmin()
    .from("streaming_signups")
    .update({ status: "canceled" })
    .eq("stripe_subscription_id", subscription.id)
    .neq("status", "canceled");
  const signupId = subscription.metadata.signup_id;
  if (isSignupId(signupId)) query = query.eq("id", signupId);

  const { data, error } = await query.select("*");
  if (error) throw new Error(`Could not cancel signup for ${subscription.id}: ${error.message}`);

  const row = (data as SignupRow[] | null)?.[0];
  // Nothing changed: already canceled (a retry) or no matching signup.
  if (!row) return;

  try {
    await sendSubscriptionCanceledNotice({
      signup: row,
      businessName: row.business_name,
      customerId: idOf(subscription.customer),
      subscriptionId: subscription.id,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : new Date(),
    });
  } catch (err) {
    console.error(`[stripe-webhook] Signup ${row.id} is canceled, but the admin notice failed:`, err);
  }
}

/** A renewal (or first) payment failed. Tell the admins. */
async function onPaymentFailed(invoice: Stripe.Invoice) {
  const details = invoice.parent?.subscription_details;
  if (!isOurs(details?.metadata)) return;

  const signupId = details?.metadata?.signup_id;
  const signup = isSignupId(signupId) ? await getSignup(signupId) : null;

  // No database change here, so if the email fails, throw: a Stripe retry
  // can safely send it.
  await sendPaymentFailedNotice({
    signup,
    businessName: details?.metadata?.business_name || "Unknown business",
    customerId: idOf(invoice.customer),
    subscriptionId: idOf(details?.subscription),
    invoiceId: invoice.id ?? "unknown",
    amountDueCents: invoice.amount_due,
    attemptCount: invoice.attempt_count,
    nextAttempt: invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000) : null,
  });
}
