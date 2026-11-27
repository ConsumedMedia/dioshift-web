import type { Metadata } from "next";
import { Suspense } from "react";
import { ContinueToPayment } from "@/components/signup/ContinueToPayment";
import { ContactFallback, ResultCard, ResultCardSkeleton, SummaryList } from "@/components/signup/ResultCard";
import { pageMetadata } from "@/lib/metadata";
import { formatImpressions, formatPrice } from "@/lib/packages";
import { getSignup, type SignupRow } from "@/lib/signups";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Finish Your Signup",
    description: "Your details are saved. Finish payment to get your commercial on streaming TV.",
  }),
  robots: { index: false, follow: false },
};

/** Where Stripe Checkout sends people who back out before paying. */
export default function SignupResumePage({ searchParams }: PageProps<"/signup/resume">) {
  return (
    <Suspense fallback={<ResultCardSkeleton />}>
      {searchParams.then(({ id }) => (
        <Resume id={typeof id === "string" ? id : undefined} />
      ))}
    </Suspense>
  );
}

async function Resume({ id }: { id: string | undefined }) {
  let signup: SignupRow | null = null;
  try {
    signup = await getSignup(id);
  } catch (err) {
    console.error("[resume] Could not load signup:", err);
    return (
      <ContactFallback
        title="We hit a snag."
        lead="We couldn't load your signup just now. Please try again in a minute, or contact us and we'll sort it out."
      />
    );
  }

  if (signup?.status === "active" || signup?.status === "past_due") {
    return (
      <ContactFallback
        title="You're already all set."
        lead="This signup is paid and on its way. Questions or changes? Get in touch."
      />
    );
  }

  if (!signup || signup.status !== "pending_payment") {
    return (
      <ContactFallback
        title="We couldn't find that signup."
        lead="The link may be incomplete or out of date. Contact us and we'll help you pick up where you left off."
      />
    );
  }

  // Only these three fields leave the server. Never email, phone or anything else.
  return (
    <ResultCard
      tone="warn"
      title="Payment wasn't completed."
      lead="Your details are saved. Pick up right where you left off."
    >
      <SummaryList
        items={[
          ["Business", signup.business_name],
          ["Package", `${formatImpressions(signup.impressions)} impressions / mo`],
          ["Monthly price", formatPrice(signup.monthly_price_cents / 100)],
        ]}
      />
      <ContinueToPayment signupId={signup.id} />
    </ResultCard>
  );
}
