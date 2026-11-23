import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { missingEnv } from "@/lib/env";

/** Env vars the server needs to talk to Supabase. */
export const SUPABASE_ENV = ["SUPABASE_URL", "SUPABASE_SECRET_KEY"] as const;

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the secret key, which bypasses row level
 * security. Never import this from a Client Component.
 *
 * Created on first use so a missing env var fails at request time with a
 * clear message instead of breaking the build.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const missing = missingEnv(SUPABASE_ENV);
  if (missing.length > 0) {
    throw new Error(
      `Supabase is not configured. Missing environment variable(s): ${missing.join(", ")}. ` +
        "Add them to .env.local (see .env.example) and restart the server.",
    );
  }

  client = createClient(process.env.SUPABASE_URL!.trim(), process.env.SUPABASE_SECRET_KEY!.trim(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
