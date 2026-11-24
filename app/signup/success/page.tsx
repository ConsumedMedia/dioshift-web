import type { Metadata } from "next";
import type Stripe from "stripe";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { ContactFallback, ResultCard, ResultCardSkeleton, SummaryList } from "@/components/signup/ResultCard";
import { pageMetadata } from "@/lib/metadata";
import { formatImpressions, formatPrice, getPackageById } from "@/lib/packages";
import { getSignup, type SignupRow } from "@/lib/signups";
import { getStripe, isOurs } from "@/lib/stripe";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "You're Signed Up",
    description: "Your streaming TV campaign is confirmed.",
  }),
  robots: { index: false, follow: false },
};

/** Stripe Checkout Session ids look like cs_test_a1B2c3... or cs_live_... */
const SESSION_ID = /^cs_[A-Za-z0-9_]{8,250}$/;

/** Where Stripe Checkout sends people after they pay. */
export default function SignupSuccessPage({ searchParams }: PageProps<"/signup/success">) {
  return (
    <Suspense fallback={<ResultCardSkeleton />}>
      {searchParams.then(({ session_id }) => (
        <Success sessionId={typeof session_id === "string" ? session_id : undefined} />
      ))}
    </Suspense>
  );
}

const NOT_FOUND = (
  <ContactFallback
    title="We couldn't confirm that payment."
    lead="This link doesn't match a completed signup. If you just paid, check your email for a confirmation, or contact us and we'll look it up."
  />
);

async function Success({ sessionId }: { sessionId: string | undefined }) {
  if (!sessionId || !SESSION_ID.test(sessionId)) return NOT_FOUND;

  // Ask Stripe directly. The webhook may not have run yet, so the database
  // can't be the source of truth for "did they pay" on this page.
  let session: Stripe.Checkout.Session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.error(`[success] Could not retrieve Checkout Session ${sessionId}:`, err);
    return NOT_FOUND;
  }

  // Only sessions this site created. The Stripe account is shared.
  if (!isOurs(session.metadata)) return NOT_FOUND;

  if (session.payment_status !== "paid") {
    if (session.status === "complete") {
      return (
        <ContactFallback
          title="Your payment is processing."
          lead="Some payment methods take a few days to clear. We'll email you as soon as it does. Questions? Contact us."
        />
      );
    }
    return NOT_FOUND;
  }

  // Details come from the saved signup. If the database is unreachable, fall
  // back to what we stored on the Stripe session.
  let signup: SignupRow | null = null;
  try {
    signup = await getSignup(session.metadata?.signup_id);
  } catch (err) {
    console.error(`[success] Could not load signup for session ${sessionId}:`, err);
  }

  const pkg = getPackageById(signup?.package_id ?? session.metadata?.package_id);
  const businessName = signup?.business_name ?? session.metadata?.business_name ?? "Your business";
  const impressions = signup?.impressions ?? pkg?.impressions;
  const monthlyCents = signup?.monthly_price_cents ?? session.amount_total ?? (pkg ? pkg.monthlyPrice * 100 : null);
  const monthly = monthlyCents != null ? formatPrice(monthlyCents / 100) : null;
  const billingDay = billingDayOf(new Date(session.created * 1000));

  const summary: Array<[string, string]> = [["Business", businessName]];
  if (impressions) summary.push(["Package", `${formatImpressions(impressions)} impressions / mo`]);
  if (monthly) summary.push(["Monthly price", monthly]);

  return (
    <ResultCard
      tone="success"
      title="Your ad is headed to TV."
      lead={
        <>
          You&apos;re in, <span className="font-medium text-text">{businessName}</span>. Your commercial is on its way
          to the biggest screen in your customers&apos; homes.
        </>
      }
    >
      <SummaryList items={summary} />

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold tracking-tight">What happens next</h2>
        <ol className="mt-4 space-y-3">
          {[
            "Your confirmation email is on its way.",
            "We review your commercial and targeting.",
            "We confirm your launch date with you.",
          ].map((step, i) => (
            <li key={step} className="flex gap-3 text-[15px] leading-relaxed text-text-dim">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-xs font-semibold text-accent-soft">
                {i + 1}
              </span>
              <span className="pt-px">{step}</span>
            </li>
          ))}
        </ol>
        {signup?.creative_status === "need" && (
          <p className="mt-5 rounded-xl border border-accent/25 bg-accent/[0.07] px-4 py-3 text-[15px] leading-relaxed text-text">
            We&apos;ll reach out to talk through your commercial.
          </p>
        )}
      </div>

      <p className="mt-8 border-t border-border pt-6 text-sm leading-relaxed text-text-muted">
        {monthly ? `You're billed ${monthly} monthly` : "You're billed monthly"} on the {billingDay}. Need to
        cancel? Just give us 30 days&apos; notice.
      </p>

      <div className="mt-8 flex justify-center">
        <Button href="/" variant="secondary" size="lg" className="w-full sm:w-auto">
          Back to home
        </Button>
      </div>
    </ResultCard>
  );
}

/** "24th of each month" (with a note for days some months don't have). */
function billingDayOf(date: Date): string {
  const day = Number(date.toLocaleDateString("en-US", { timeZone: "America/New_York", day: "numeric" }));
  const suffix =
    day % 100 >= 11 && day % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] ?? "th";
  return `${day}${suffix} of each month${day > 28 ? " (or the last day of shorter months)" : ""}`;
}
