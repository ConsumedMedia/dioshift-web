import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { missingEnv } from "@/lib/env";

const UPSTASH_ENV = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"] as const;
const PREFIX = "dioshift-web:rl";

/** Limits per route group, per client IP. */
const LIMITS = {
  contact: { requests: 5, window: "10 m" },
  signup: { requests: 10, window: "10 m" },
} as const;

export type RateLimitName = keyof typeof LIMITS;

export const RATE_LIMIT_MESSAGE =
  "You've sent a lot of requests in a short time. Please wait a few minutes and try again.";

let redis: Redis | null = null;
const limiters = new Map<RateLimitName, Ratelimit>();
let warnedMissingEnv = false;

function getLimiter(name: RateLimitName): Ratelimit | null {
  const missing = missingEnv(UPSTASH_ENV);
  if (missing.length > 0) {
    if (!warnedMissingEnv) {
      warnedMissingEnv = true;
      console.warn(
        `[rate-limit] Rate limiting is OFF. Missing environment variable(s): ${missing.join(", ")}. ` +
          "Requests are allowed through. Add them to .env.local (see .env.example) to turn it on.",
      );
    }
    return null;
  }

  let limiter = limiters.get(name);
  if (!limiter) {
    redis ??= new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!.trim(),
      token: process.env.UPSTASH_REDIS_REST_TOKEN!.trim(),
    });
    const { requests, window } = LIMITS[name];
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, window),
      prefix: `${PREFIX}:${name}`,
    });
    limiters.set(name, limiter);
  }
  return limiter;
}

/** Client IP from the first x-forwarded-for value, or "unknown". */
export function clientIp(request: Request): string {
  const first = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/**
 * Checks the limit for this request. Returns a ready-to-send 429 response
 * when the caller is over the limit, or null to let the request through.
 *
 * Fails open: if Upstash isn't configured or can't be reached, the request
 * is allowed so the forms never break.
 */
export async function rateLimit(request: Request, name: RateLimitName): Promise<Response | null> {
  const limiter = getLimiter(name);
  if (!limiter) return null;

  try {
    const { success, reset } = await limiter.limit(clientIp(request));
    if (success) return null;
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    return Response.json(
      { ok: false, error: RATE_LIMIT_MESSAGE },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  } catch (err) {
    console.error(`[rate-limit] Check failed for "${name}", allowing the request:`, err);
    return null;
  }
}
