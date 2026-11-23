import { randomUUID } from "node:crypto";
import { HONEYPOT_FIELD, fieldErrors, signupSchema, type SignupData } from "@/lib/signup-schema";
import { CPM, getPackageById } from "@/lib/packages";
import { missingEnv } from "@/lib/env";
import { SUPABASE_ENV, getSupabaseAdmin } from "@/lib/supabase-admin";

type Body =
  | { ok: true; signupId: string }
  | { ok: false; error: string; fields?: Record<string, string> };

function json(body: Body, status = 200) {
  return Response.json(body, { status });
}

const toCents = (dollars: number) => Math.round(dollars * 100);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot: pretend it worked so bots don't learn anything, but save nothing.
  const trap = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    return json({ ok: true, signupId: randomUUID() });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { ok: false, error: "Please check the form and try again.", fields: fieldErrors(parsed.error) },
      400,
    );
  }
  const data = parsed.data;

  // Price and impressions come only from lib/packages.ts. Anything the
  // browser sent about price is ignored (the schema strips unknown keys).
  const pkg = getPackageById(data.packageId);
  if (!pkg) {
    return json({ ok: false, error: "Please choose a package.", fields: { packageId: "Choose a package." } }, 400);
  }

  const missing = missingEnv(SUPABASE_ENV);
  if (missing.length > 0) {
    console.error(
      `[signup] Cannot save signup. Missing environment variable(s): ${missing.join(", ")}. ` +
        "Add them to .env.local (see .env.example) and restart the server.",
    );
    return json({ ok: false, error: "Signups are temporarily unavailable. Please try again soon." }, 500);
  }

  try {
    const { data: row, error } = await getSupabaseAdmin()
      .from("streaming_signups")
      .insert({
        status: "pending_payment",
        package_id: pkg.id,
        impressions: pkg.impressions,
        monthly_price_cents: toCents(pkg.monthlyPrice),
        cpm_cents: toCents(CPM),
        ...toRow(data),
        terms_accepted_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("[signup] Supabase insert failed:", error);
      return json(
        { ok: false, error: "We couldn't save your signup. Please try again in a moment." },
        500,
      );
    }

    return json({ ok: true, signupId: row.id as string });
  } catch (err) {
    console.error("[signup] Unexpected error saving signup:", err);
    return json({ ok: false, error: "We couldn't save your signup. Please try again in a moment." }, 500);
  }
}

/** Map validated form data to table columns. Blank optional text becomes null. */
function toRow(data: SignupData) {
  const orNull = (v: string) => (v === "" ? null : v);
  const isRadius = data.serviceAreaType === "radius";
  const have = data.creativeStatus === "have";

  return {
    business_name: data.businessName,
    contact_name: data.contactName,
    email: data.email.toLowerCase(),
    phone: data.phone,
    website: orNull(data.website),
    business_category:
      data.businessCategory === "Other" ? `Other: ${data.businessCategoryOther}` : data.businessCategory,
    business_city: data.businessCity,
    business_state: data.businessState,
    business_zip: data.businessZip,

    service_area_type: data.serviceAreaType,
    service_area_details: isRadius
      ? `${data.radiusMiles} miles around ${data.businessCity}, ${data.businessState} ${data.businessZip}`
      : data.serviceAreaDetails,
    radius_miles: isRadius ? data.radiusMiles : null,
    target_age_ranges: data.targetAgeRanges,
    target_gender: data.targetGender,
    target_household_income: orNull(data.targetHouseholdIncome),
    target_interests: orNull(data.targetInterests),
    preferred_start: data.preferredStart,

    creative_status: data.creativeStatus,
    creative_link: have ? data.creativeLink : null,
    creative_specs_confirmed: have ? data.creativeSpecsConfirmed : false,
    creative_notes: have ? null : orNull(data.creativeNotes),
    additional_notes: orNull(data.additionalNotes),
  };
}
