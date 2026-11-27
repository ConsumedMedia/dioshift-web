import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  verifySessionToken,
} from "@/lib/admin/session-token";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/*
 * Admin access. The rules:
 * - ADMIN_BOOTSTRAP_EMAIL is always an admin (the "Owner"), even with an
 *   empty admin_users table. It can't be removed.
 * - Anyone else needs an active row in admin_users.
 * - Every admin page, Server Action and admin Route Handler calls
 *   requireAdmin(). proxy.ts is only a first layer.
 */

export interface AdminSession {
  email: string;
}

/** Trimmed and lowercased. Every admin email is compared and stored this way. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** The owner's email (lowercased), or "" if ADMIN_BOOTSTRAP_EMAIL isn't set. */
export function bootstrapEmail(): string {
  return normalizeEmail(process.env.ADMIN_BOOTSTRAP_EMAIL ?? "");
}

export function isOwner(email: string): boolean {
  const owner = bootstrapEmail();
  return owner !== "" && normalizeEmail(email) === owner;
}

/**
 * True for the owner or an active admin_users row. Throws on database errors
 * (the caller fails closed: no access).
 */
export async function isAllowedAdmin(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  if (isOwner(normalized)) return true;

  const { data, error } = await getSupabaseAdmin()
    .from("admin_users")
    .select("id")
    .eq("email", normalized)
    .eq("active", true)
    .maybeSingle();
  if (error) throw new Error(`Could not check admin access: ${error.message}`);
  return data !== null;
}

/**
 * The signed-in admin, or null. Verifies the cookie's signature and expiry,
 * then re-checks isAllowedAdmin, so a removed admin loses access on their
 * next request. Deduplicated per request (layout and page share one check);
 * nothing is cached across requests.
 *
 * connection() first: the check, and every admin read after it, only runs
 * for a real request, never in a prerender or a prefetch (where cookies()
 * can resolve but data fetches are cut off).
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  await connection();
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const email = await verifySessionToken(token);
  if (!email) return null;
  if (!(await isAllowedAdmin(email))) return null;
  return { email: normalizeEmail(email) };
});

/** Use at the top of every admin page, Server Action and Route Handler. Redirects to /admin/login when signed out. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Sets the session cookie. Server Actions and Route Handlers only. */
export async function startAdminSession(email: string): Promise<void> {
  const token = await signSessionToken(normalizeEmail(email));
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/** Clears the session cookie. Server Actions and Route Handlers only. */
export async function endAdminSession(): Promise<void> {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/" });
}
