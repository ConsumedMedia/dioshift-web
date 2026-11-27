"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { endAdminSession, startAdminSession } from "@/lib/admin/auth";
import { consumeSignInToken, sendSignInLinkIfAdmin } from "@/lib/admin/login";
import { clientIp, isWithinRateLimit } from "@/lib/rate-limit";

/*
 * Sign in and sign out. These are the only admin actions that don't call
 * requireAdmin(): you can't be signed in yet when asking for a link, and
 * signing out only clears your own cookie.
 */

export type RequestLinkState = { status: "idle" } | { status: "sent" } | { status: "invalid"; error: string };

const emailSchema = z.object({
  email: z.string().trim().min(1).max(254).pipe(z.email()),
});

/**
 * Always answers "sent" for a well formed email, whether or not it's an
 * admin, and even when rate limited. The lookup and email run after the
 * response (after()), so response time doesn't give it away either.
 */
export async function requestSignInLink(_prev: RequestLinkState, formData: FormData): Promise<RequestLinkState> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { status: "invalid", error: "Enter a valid email address." };

  const allowed = await isWithinRateLimit("adminLogin", clientIp(await headers()));
  if (!allowed) {
    console.warn("[admin] Sign-in link rate limit hit.");
    return { status: "sent" };
  }

  const email = parsed.data.email;
  after(async () => {
    try {
      await sendSignInLinkIfAdmin(email);
    } catch (err) {
      console.error("[admin] Could not send a sign-in link:", err);
    }
  });
  return { status: "sent" };
}

export type ConfirmState = { status: "idle" } | { status: "error"; reason: "expired" | "used" | "invalid" | "unavailable" };

/** The confirm page's POST. Signing in never happens on a GET (email scanners open links). */
export async function confirmSignIn(_prev: ConfirmState, formData: FormData): Promise<ConfirmState> {
  const token = formData.get("token");
  let email: string;
  try {
    const result = await consumeSignInToken(token);
    if (!result.ok) return { status: "error", reason: result.reason };
    email = result.email;
    await startAdminSession(email);
  } catch (err) {
    console.error("[admin] Sign-in failed:", err);
    return { status: "error", reason: "unavailable" };
  }
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  await endAdminSession();
  redirect("/admin/login");
}
