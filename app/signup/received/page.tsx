import type { Metadata } from "next";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/metadata";

/*
 * TODO(stripe): Temporary stand-in for the payment step. The next prompt sends
 * people to Stripe Checkout after /api/signup instead of here. Delete this
 * page (app/signup/received) once Checkout is wired up.
 */

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Signup Received",
    description: "We have your signup. Payment setup is next.",
  }),
  robots: { index: false, follow: false },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function SignupReceivedPage({ searchParams }: PageProps<"/signup/received">) {
  return (
    <Section className="flex min-h-[60vh] items-center" containerClassName="max-w-xl">
      <Card className="p-6 text-center sm:p-10">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success">
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden>
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">Got it. Payment setup is next.</h1>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-text-dim">
          Your signup is saved. We&apos;ll be in touch at the email you gave us.
        </p>
        <Suspense fallback={null}>
          {searchParams.then(({ id }) =>
            typeof id === "string" && UUID.test(id) ? (
              <p className="mt-6 text-sm text-text-muted">
                Reference: <span className="font-mono text-text-dim">{id.slice(0, 8).toUpperCase()}</span>
              </p>
            ) : null,
          )}
        </Suspense>
        <div className="mt-8 flex justify-center">
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </Card>
    </Section>
  );
}
