"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/Button";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string } | { kind: "paid" };

/** Starts a fresh Stripe Checkout for a saved, unpaid signup. */
export function ContinueToPayment({ signupId }: { signupId: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });

  // Coming back from Stripe with Back can restore this page mid "sending".
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setState((s) => (s.kind === "sending" ? { kind: "idle" } : s));
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  async function go() {
    if (state.kind === "sending") return;
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/signup/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupId }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; checkoutUrl: string }
        | { ok: false; alreadyPaid?: boolean; error?: string }
        | null;

      if (res.ok && data?.ok) {
        window.location.assign(data.checkoutUrl);
        return;
      }
      if (data && !data.ok && data.alreadyPaid) {
        setState({ kind: "paid" });
        return;
      }
      setState({
        kind: "error",
        message: (data && !data.ok && data.error) || "We couldn't open the payment page. Please try again in a moment.",
      });
    } catch {
      setState({ kind: "error", message: "We couldn't open the payment page. Please try again in a moment." });
    }
  }

  if (state.kind === "paid") {
    return (
      <p role="status" className="mt-8 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        Good news: this signup is already paid, so you&apos;re all set. Questions?{" "}
        <Link href="/contact" className="underline underline-offset-2">
          Contact us
        </Link>
        .
      </p>
    );
  }

  const sending = state.kind === "sending";
  return (
    <>
      {state.kind === "error" && (
        <p role="alert" className="mt-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.message}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-center">
        <button
          type="button"
          onClick={go}
          disabled={sending}
          aria-disabled={sending}
          className={buttonClass("primary", "lg", "w-full disabled:cursor-wait sm:w-auto")}
        >
          {sending && (
            <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {sending ? "Opening payment..." : "Continue to Payment"}
        </button>
        <Link href="/signup" className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
          Start over
        </Link>
      </div>
    </>
  );
}
