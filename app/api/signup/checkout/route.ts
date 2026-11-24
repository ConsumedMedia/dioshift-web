import { createCheckoutSession } from "@/lib/checkout";
import { missingEnv } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { getSignup, isSignupId } from "@/lib/signups";
import { SUPABASE_ENV } from "@/lib/supabase-admin";

/**
 * POST { signupId } -> starts a new Checkout Session for a saved signup that
 * hasn't paid yet. Used by /signup/resume and by the signup form's retry.
 */

type Body =
  | { ok: true; checkoutUrl: string }
  | { ok: false; alreadyPaid: true; error: string }
  | { ok: false; error: string };

function json(body: Body, status = 200) {
  return Response.json(body, { status });
}

const REQUIRED_ENV = [...SUPABASE_ENV, "STRIPE_SECRET_KEY", "SITE_URL"] as const;
const NOT_FOUND = "We couldn't find that signup. Please start again or contact us.";

export async function POST(request: Request) {
  const limited = await rateLimit(request, "signup");
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }
  const signupId = (body as { signupId?: unknown } | null)?.signupId;
  if (!isSignupId(signupId)) return json({ ok: false, error: NOT_FOUND }, 404);

  const missing = missingEnv(REQUIRED_ENV);
  if (missing.length > 0) {
    console.error(
      `[checkout] Cannot start payment. Missing environment variable(s): ${missing.join(", ")}. ` +
        "Add them to .env.local (see .env.example) and restart the server.",
    );
    return json({ ok: false, error: "Payments are temporarily unavailable. Please try again soon." }, 500);
  }

  try {
    const signup = await getSignup(signupId);
    if (!signup) return json({ ok: false, error: NOT_FOUND }, 404);

    if (signup.status === "active") {
      return json({ ok: false, alreadyPaid: true, error: "This signup is already paid. You're all set." }, 409);
    }
    if (signup.status !== "pending_payment") {
      return json({ ok: false, error: NOT_FOUND }, 404);
    }

    const checkoutUrl = await createCheckoutSession(signup);
    return json({ ok: true, checkoutUrl });
  } catch (err) {
    console.error(`[checkout] Could not start Checkout for signup ${signupId}:`, err);
    return json(
      { ok: false, error: "We couldn't open the payment page. Please try again in a moment." },
      502,
    );
  }
}
