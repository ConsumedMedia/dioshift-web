import Stripe from "stripe";
import {
  sendPaymentFailedEmails,
  sendPaymentRecoveredEmails,
  sendSignupEmails,
  sendSubscriptionCanceledNotice,
} from "@/lib/emails/signup";
import { getSignup, isSignupId, type SignupRow, type SignupStatus } from "@/lib/signups";
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
      case "invoice.paid":
        await onInvoicePaid(event.data.object);
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

/**
 * Subscription ended (canceled in the dashboard or after failed payments).
 * Matches any status except 'canceled', so it works from 'active' and 'past_due'.
 */
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

// ---------------------------------------------------------------------------
// Failed and recovered renewals
//
// Rule: the client pays first. No ads run on an unpaid month.
//   invoice.payment_failed: active -> past_due (pause), emails once.
//   invoice.paid:           past_due -> active (resume), emails once.
// Both updates are conditional on the current status, so a retried or
// repeated event changes nothing and sends nothing.
// ---------------------------------------------------------------------------

type InvoiceRef = { subscriptionId: string; signupId: string | null };

/** The subscription (and signup) behind one of our invoices, or null if it isn't ours. */
function ourInvoice(invoice: Stripe.Invoice): InvoiceRef | null {
  const details = invoice.parent?.subscription_details;
  if (!isOurs(details?.metadata)) return null;
  const subscriptionId = idOf(details?.subscription);
  if (!subscriptionId) return null;
  const signupId = details?.metadata?.signup_id;
  return { subscriptionId, signupId: isSignupId(signupId) ? signupId : null };
}

/**
 * Moves the signup for this subscription from one status to another.
 * Returns the updated row, or null when no row was in the `from` status.
 */
async function moveStatus(
  ref: InvoiceRef,
  from: SignupStatus,
  changes: { status: SignupStatus } & Partial<SignupRow>,
): Promise<SignupRow | null> {
  let query = getSupabaseAdmin()
    .from("streaming_signups")
    .update(changes)
    .eq("stripe_subscription_id", ref.subscriptionId)
    .eq("status", from);
  if (ref.signupId) query = query.eq("id", ref.signupId);

  const { data, error } = await query.select("*");
  if (error) {
    throw new Error(`Could not move signup for ${ref.subscriptionId} from ${from} to ${changes.status}: ${error.message}`);
  }
  return (data as SignupRow[] | null)?.[0] ?? null;
}

/** Current status of the signup on a subscription, for logging. */
async function currentStatus(subscriptionId: string): Promise<{ id: string; status: string } | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("streaming_signups")
    .select("id, status")
    .eq("stripe_subscription_id", subscriptionId)
    .limit(1);
  if (error) throw new Error(`Could not look up signup for ${subscriptionId}: ${error.message}`);
  return (data as Array<{ id: string; status: string }> | null)?.[0] ?? null;
}

/** A charge failed. On the first failure: pause (past_due) and email the client and admins. */
async function onPaymentFailed(invoice: Stripe.Invoice) {
  const ref = ourInvoice(invoice);
  if (!ref) return;

  const row = await moveStatus(ref, "active", {
    status: "past_due",
    last_payment_failed_at: new Date().toISOString(),
  });

  if (!row) {
    // Not a first failure on an active plan: a later retry on a past_due row,
    // a failed first payment during checkout, or a canceled plan. Log only.
    const current = await currentStatus(ref.subscriptionId);
    console.warn(
      current
        ? `[stripe-webhook] Payment failed for signup ${current.id} (status ${current.status}, ` +
            `invoice ${invoice.id}, attempt ${invoice.attempt_count}). No change, no emails.`
        : `[stripe-webhook] Payment failed for subscription ${ref.subscriptionId} (invoice ${invoice.id}), ` +
            "but no signup has that subscription. No change, no emails.",
    );
    return;
  }

  try {
    await sendPaymentFailedEmails(row, {
      invoiceId: invoice.id ?? null,
      amountCents: invoice.amount_due,
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
      attemptCount: invoice.attempt_count,
      nextAttempt: invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000) : null,
    });
  } catch (err) {
    // The row is already past_due, so a Stripe retry would skip the emails.
    // Log loudly instead of returning 500.
    console.error(
      `[stripe-webhook] ACTION NEEDED: signup ${row.id} (${row.business_name}) is now past_due and its campaign ` +
        "must be paused, but sending the payment failed emails failed:",
      err,
    );
  }
}

/** An invoice was paid. If it settles a past_due plan: resume (active) and email the client and admins. */
async function onInvoicePaid(invoice: Stripe.Invoice) {
  const ref = ourInvoice(invoice);
  if (!ref) return;
  // The first invoice is handled by checkout.session.completed.
  if (invoice.billing_reason === "subscription_create") return;

  const row = await moveStatus(ref, "past_due", { status: "active" });
  // Normal renewal on an active plan (or a repeat of this event): nothing to do.
  if (!row) return;

  try {
    await sendPaymentRecoveredEmails(row, {
      invoiceId: invoice.id ?? null,
      amountCents: invoice.amount_paid,
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
    });
  } catch (err) {
    console.error(
      `[stripe-webhook] ACTION NEEDED: signup ${row.id} (${row.business_name}) paid and is active again, so its ` +
        "campaign should resume, but sending the payment recovered emails failed:",
      err,
    );
  }
}
