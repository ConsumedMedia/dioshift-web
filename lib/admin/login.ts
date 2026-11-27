import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { isAllowedAdmin, normalizeEmail } from "@/lib/admin/auth";
import { sendAdminSignInLink } from "@/lib/emails/admin";
import { getSiteUrl } from "@/lib/site-url";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/*
 * Emailed sign-in links. The raw token only ever exists in the email; the
 * database stores its SHA-256 hash, so a leaked table can't be used to sign in.
 */

const LINK_LIFETIME_MS = 15 * 60 * 1000;
const CLEANUP_AFTER_MS = 24 * 60 * 60 * 1000;

/** 32 random bytes as base64url: 43 characters. */
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function isWellFormedToken(value: unknown): value is string {
  return typeof value === "string" && TOKEN_PATTERN.test(value);
}

/**
 * Emails a sign-in link if `email` is an admin. Does nothing otherwise. The
 * caller shows the same message either way, so this never reveals who is an
 * admin. Throws on database or email errors (the caller logs them).
 */
export async function sendSignInLinkIfAdmin(rawEmail: string): Promise<void> {
  const email = normalizeEmail(rawEmail);
  if (!(await isAllowedAdmin(email))) return;

  const db = getSupabaseAdmin();
  const now = Date.now();

  // Housekeeping: drop links older than a day (used or not).
  const { error: cleanupError } = await db
    .from("admin_login_tokens")
    .delete()
    .lt("created_at", new Date(now - CLEANUP_AFTER_MS).toISOString());
  if (cleanupError) console.error("[admin] Could not clean up old sign-in links:", cleanupError.message);

  const token = randomBytes(32).toString("base64url");
  const { error } = await db.from("admin_login_tokens").insert({
    email,
    token_hash: hashToken(token),
    expires_at: new Date(now + LINK_LIFETIME_MS).toISOString(),
  });
  if (error) throw new Error(`Could not save sign-in link: ${error.message}`);

  const link = `${getSiteUrl()}/admin/auth/confirm?token=${encodeURIComponent(token)}`;
  await sendAdminSignInLink(email, link);
}

export type TokenCheck = { ok: true; email: string } | { ok: false; reason: "invalid" | "expired" | "used" };

/** Looks a token up without using it. For the confirm page's GET, which must never sign anyone in. */
export async function peekSignInToken(token: unknown): Promise<TokenCheck> {
  if (!isWellFormedToken(token)) return { ok: false, reason: "invalid" };
  const { data, error } = await getSupabaseAdmin()
    .from("admin_login_tokens")
    .select("email, expires_at, used_at")
    .eq("token_hash", hashToken(token))
    .maybeSingle();
  if (error) throw new Error(`Could not look up sign-in link: ${error.message}`);
  if (!data) return { ok: false, reason: "invalid" };
  if (data.used_at) return { ok: false, reason: "used" };
  if (new Date(data.expires_at).getTime() <= Date.now()) return { ok: false, reason: "expired" };
  return { ok: true, email: data.email };
}

/**
 * Uses a token: marks it used in one conditional update (so two clicks can't
 * both succeed), then re-checks that the email is still an admin.
 */
export async function consumeSignInToken(token: unknown): Promise<TokenCheck> {
  if (!isWellFormedToken(token)) return { ok: false, reason: "invalid" };
  const nowIso = new Date().toISOString();
  const { data, error } = await getSupabaseAdmin()
    .from("admin_login_tokens")
    .update({ used_at: nowIso })
    .eq("token_hash", hashToken(token))
    .is("used_at", null)
    .gt("expires_at", nowIso)
    .select("email")
    .maybeSingle();
  if (error) throw new Error(`Could not use sign-in link: ${error.message}`);

  if (!data) {
    // Not claimed: say why, if the token exists at all.
    const peek = await peekSignInToken(token);
    return peek.ok ? { ok: false, reason: "invalid" } : peek;
  }
  if (!(await isAllowedAdmin(data.email))) return { ok: false, reason: "invalid" };
  return { ok: true, email: normalizeEmail(data.email) };
}
