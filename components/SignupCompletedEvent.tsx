"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

/**
 * Sends one "signup_completed" Vercel Analytics event. Rendered by
 * /signup/success only after Stripe confirms the payment.
 *
 * Only the package and price are sent. Never the business name, email or
 * any other personal detail.
 *
 * Custom events need a paid Vercel plan (Pro or higher). On the free plan
 * this call does nothing, and the /signup/success page view count works as
 * the conversion metric instead (that page only shows the paid state after
 * a confirmed payment).
 */
export function SignupCompletedEvent({
  sessionId,
  packageId,
  monthlyPrice,
}: {
  /** Only used to avoid double counting on refresh. Not sent to analytics. */
  sessionId: string;
  packageId: string;
  monthlyPrice: number;
}) {
  useEffect(() => {
    const key = `dioshift:signup_completed:${sessionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage blocked (private mode). Send anyway; a rare double count is fine.
    }
    track("signup_completed", { package_id: packageId, monthly_price: monthlyPrice });
  }, [sessionId, packageId, monthlyPrice]);

  return null;
}
