import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * pending_payment: saved, not paid yet.
 * active: paid, campaign running.
 * past_due: a renewal failed. Campaign is paused until the invoice is paid.
 * canceled: subscription ended.
 */
export type SignupStatus = "pending_payment" | "active" | "past_due" | "canceled";

/** One row of public.streaming_signups (see supabase/streaming_signups.sql). */
export interface SignupRow {
  id: string;
  created_at: string;
  status: SignupStatus;

  package_id: string;
  impressions: number;
  monthly_price_cents: number;
  cpm_cents: number;

  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string | null;
  business_category: string;
  business_city: string;
  business_state: string;
  business_zip: string;

  service_area_type: string;
  service_area_details: string;
  radius_miles: number | null;
  target_age_ranges: string[];
  target_gender: string;
  target_household_income: string | null;
  target_interests: string | null;
  preferred_start: string;

  creative_status: "have" | "need";
  creative_link: string | null;
  creative_specs_confirmed: boolean;
  creative_notes: string | null;
  additional_notes: string | null;

  terms_accepted_at: string;
  /** TERMS_VERSION (lib/legal.ts) the client agreed to. Null on rows from before it was tracked. */
  terms_version: string | null;

  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_checkout_session_id: string | null;
  paid_at: string | null;
  last_payment_failed_at: string | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True for a well formed signup id. Check before querying so bad input never reaches Postgres. */
export function isSignupId(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

/** Loads a signup by id. Returns null when the id is malformed or no row exists. Throws on database errors. */
export async function getSignup(id: unknown): Promise<SignupRow | null> {
  if (!isSignupId(id)) return null;
  const { data, error } = await getSupabaseAdmin()
    .from("streaming_signups")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Could not load signup ${id}: ${error.message}`);
  return (data as SignupRow | null) ?? null;
}
