import { SignJWT, jwtVerify } from "jose";

/*
 * The admin session cookie: a signed JWT (HS256, ADMIN_SESSION_SECRET) that
 * holds the admin's email. Kept free of "server-only" and database imports
 * so proxy.ts can check the signature too. Signature checks alone are NOT
 * enough to let someone in: lib/admin/auth.ts also re-checks that the email
 * is still an admin on every request.
 */

export const ADMIN_COOKIE = "ds_admin";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

const ISSUER = "dioshift-admin";
const AUDIENCE = "dioshift-admin";
const MIN_SECRET_LENGTH = 32;

let warnedBadSecret = false;

function secretKey(): Uint8Array | null {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    if (!warnedBadSecret) {
      warnedBadSecret = true;
      console.error(
        `[admin] ADMIN_SESSION_SECRET is ${secret ? `shorter than ${MIN_SECRET_LENGTH} characters` : "not set"}. ` +
          "Admin sign-in is disabled until it is set (see .env.example).",
      );
    }
    return null;
  }
  return new TextEncoder().encode(secret);
}

/** Signs a 30 day session for `email`. Throws if ADMIN_SESSION_SECRET is missing or too short. */
export async function signSessionToken(email: string): Promise<string> {
  const key = secretKey();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is not set or too short. See .env.example.");
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(key);
}

/** The email in a valid, unexpired session token, or null. Never throws. */
export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const key = secretKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return typeof payload.email === "string" && payload.email ? payload.email : null;
  } catch {
    return null;
  }
}
