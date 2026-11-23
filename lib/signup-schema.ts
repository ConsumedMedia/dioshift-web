import { z } from "zod";
import { PACKAGES, type PackageId } from "@/lib/packages";

/**
 * Signup form rules. The form uses this for inline errors on each step, and
 * the API route uses it as the real gatekeeper (the server never trusts the
 * client).
 */

export { HONEYPOT_FIELD } from "@/lib/contact-schema";

export const BUSINESS_CATEGORIES = [
  "Automotive",
  "Home Services",
  "Restaurant / Food",
  "Healthcare / Medical",
  "Legal",
  "Real Estate",
  "Retail",
  "Fitness / Wellness",
  "Financial Services",
  "Beauty / Spa",
  "Entertainment / Events",
  "Professional Services",
  "Other",
] as const;

export const SERVICE_AREA_TYPES = ["radius", "zip_codes", "cities", "counties"] as const;
export type ServiceAreaType = (typeof SERVICE_AREA_TYPES)[number];

export const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

export const GENDERS = ["all", "male", "female"] as const;
export type Gender = (typeof GENDERS)[number];

/** "" means no income targeting ("Any"). */
export const HOUSEHOLD_INCOMES = ["$50K+", "$75K+", "$100K+", "$150K+"] as const;

export const CREATIVE_STATUSES = ["have", "need"] as const;
export type CreativeStatus = (typeof CREATIVE_STATUSES)[number];

export const US_STATES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
  ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"],
  ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"],
  ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"],
  ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
  ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"],
  ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"],
  ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
] as const;
const STATE_CODES = US_STATES.map(([code]) => code) as [string, ...string[]];

const PACKAGE_IDS = PACKAGES.map((p) => p.id) as [PackageId, ...PackageId[]];

export const RADIUS_MIN = 1;
export const RADIUS_MAX = 100;

/** How far ahead a start date can be picked. */
const MAX_START_DAYS_AHEAD = 365;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** YYYY-MM-DD for "today" in the browser's or server's local time zone. */
export function todayLocalISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Earliest start date we accept. The server runs in UTC, which is already
 * "tomorrow" for US customers in the evening, so we measure "today" in the
 * westernmost US time zone (Hawaii). Nobody in the US can be a day behind that.
 */
function earliestStartISO(now = new Date()): string {
  const hawaii = new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Honolulu" }).format(now);
  const local = todayLocalISO(now);
  return hawaii < local ? hawaii : local;
}

function isRealISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function addDaysISO(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const httpUrl = z.url({ protocol: /^https?$/, hostname: z.regexes.domain });

/** Adds https:// when someone types "example.com". Returns "" for blank input. */
export function withProtocol(value: string): string {
  const v = value.trim();
  if (!v) return "";
  return /^[a-z][a-z\d+.-]*:\/\//i.test(v) ? v : `https://${v}`;
}

/** Optional URL field. Blank is allowed; anything else must be a real http(s) URL. */
const optionalUrl = (max: number, message: string) =>
  z
    .string({ error: message })
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .transform(withProtocol)
    .refine((v) => v === "" || httpUrl.safeParse(v).success, message)
    .default("");

const requiredText = (max: number, emptyMessage: string) =>
  z
    .string({ error: emptyMessage })
    .trim()
    .min(1, emptyMessage)
    .max(max, `Keep this under ${max} characters.`);

const optionalText = (max: number) =>
  z.string().trim().max(max, `Keep this under ${max.toLocaleString("en-US")} characters.`).default("");

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

export const signupSchema = z
  .object({
    // Step 1
    packageId: z.enum(PACKAGE_IDS, { error: "Choose a package." }),

    // Step 2
    businessName: requiredText(150, "Please enter your business name."),
    contactName: requiredText(100, "Please enter your name."),
    email: z
      .string({ error: "Please enter your email." })
      .trim()
      .min(1, "Please enter your email.")
      .max(254, "That email is too long.")
      .pipe(z.email("Please enter a valid email address.")),
    phone: z
      .string({ error: "Please enter your phone number." })
      .trim()
      .min(1, "Please enter your phone number.")
      .max(40, "Keep this under 40 characters.")
      .refine((v) => v.replace(/\D/g, "").length >= 10, "Please enter a 10-digit phone number."),
    website: optionalUrl(300, "Enter a valid web address, like yourbusiness.com."),
    businessCategory: z.enum(BUSINESS_CATEGORIES, { error: "Choose your business category." }),
    businessCategoryOther: optionalText(100),
    businessCity: requiredText(100, "Please enter your city."),
    businessState: z
      .string({ error: "Choose your state." })
      .trim()
      .toUpperCase()
      .refine((v) => STATE_CODES.includes(v), "Choose your state."),
    businessZip: z
      .string({ error: "Please enter your zip code." })
      .trim()
      .regex(/^\d{5}$/, "Enter a 5-digit zip code."),

    // Step 3
    serviceAreaType: z.enum(SERVICE_AREA_TYPES, { error: "Choose how to define your area." }),
    serviceAreaDetails: optionalText(1000),
    radiusMiles: z
      .union([z.string().trim(), z.number(), z.null()])
      .optional()
      .transform((v) => (v === "" || v === null || v === undefined ? null : Number(v))),
    targetAgeRanges: z
      .array(z.enum(AGE_RANGES), { error: "Pick at least one age range." })
      .min(1, "Pick at least one age range.")
      .transform((ranges) => AGE_RANGES.filter((r) => ranges.includes(r))),
    targetGender: z.enum(GENDERS, { error: "Choose who to reach." }),
    targetHouseholdIncome: z
      .union([z.literal(""), z.enum(HOUSEHOLD_INCOMES)], { error: "Choose an income level." })
      .default(""),
    targetInterests: optionalText(1000),
    preferredStart: z
      .string({ error: "Choose when you'd like to start." })
      .trim()
      .superRefine((v, ctx) => {
        if (v === "asap") return;
        if (v === "") {
          ctx.addIssue({ code: "custom", message: "Pick a start date." });
          return;
        }
        if (!isRealISODate(v)) {
          ctx.addIssue({ code: "custom", message: "Pick a valid date." });
          return;
        }
        const earliest = earliestStartISO();
        if (v < earliest) {
          ctx.addIssue({ code: "custom", message: "Pick today or a later date." });
        } else if (v > addDaysISO(earliest, MAX_START_DAYS_AHEAD)) {
          ctx.addIssue({ code: "custom", message: "Pick a date within the next year." });
        }
      }),

    // Step 4
    creativeStatus: z.enum(CREATIVE_STATUSES, { error: "Tell us if you have a commercial." }),
    creativeLink: optionalUrl(500, "Enter a valid share link."),
    creativeSpecsConfirmed: z.boolean().default(false),
    creativeNotes: optionalText(2000),
    additionalNotes: optionalText(2000),

    // Step 5
    termsAccepted: z.literal(true, { error: "Please check this box to continue." }),
  })
  .superRefine(
    (data, ctx) => {
      if (data.businessCategory === "Other" && !data.businessCategoryOther) {
        ctx.addIssue({ code: "custom", path: ["businessCategoryOther"], message: "Tell us your business type." });
      }

      if (data.serviceAreaType === "radius") {
        const miles = data.radiusMiles;
        if (miles === null || miles === undefined) {
          ctx.addIssue({ code: "custom", path: ["radiusMiles"], message: "Enter how many miles." });
        } else if (!Number.isInteger(miles) || miles < RADIUS_MIN || miles > RADIUS_MAX) {
          ctx.addIssue({
            code: "custom",
            path: ["radiusMiles"],
            message: `Enter a whole number from ${RADIUS_MIN} to ${RADIUS_MAX}.`,
          });
        }
      } else if (data.serviceAreaType && !data.serviceAreaDetails) {
        const what =
          data.serviceAreaType === "zip_codes" ? "zip codes"
          : data.serviceAreaType === "cities" ? "cities"
          : "counties";
        ctx.addIssue({ code: "custom", path: ["serviceAreaDetails"], message: `List the ${what} you want to reach.` });
      }

      if (data.creativeStatus === "have") {
        if (!data.creativeLink) {
          ctx.addIssue({ code: "custom", path: ["creativeLink"], message: "Paste the link to your commercial." });
        }
        if (data.creativeSpecsConfirmed !== true) {
          ctx.addIssue({
            code: "custom",
            path: ["creativeSpecsConfirmed"],
            message: "Please confirm your commercial is :30 seconds and 1080p.",
          });
        }
      }
    },
    // Run these cross-field checks even when other fields already failed
    // (zod skips them by default), so each step shows every error at once.
    // `data` may be partly invalid here, so every check tolerates missing values.
    { when: () => true },
  );

export type SignupInput = z.input<typeof signupSchema>;
export type SignupData = z.output<typeof signupSchema>;
export type SignupField = keyof SignupInput;

/** Which fields belong to which form step, in on-screen order. */
export const STEP_FIELDS: readonly (readonly SignupField[])[] = [
  ["packageId"],
  [
    "businessName",
    "contactName",
    "email",
    "phone",
    "website",
    "businessCategory",
    "businessCategoryOther",
    "businessCity",
    "businessState",
    "businessZip",
  ],
  [
    "serviceAreaType",
    "radiusMiles",
    "serviceAreaDetails",
    "targetAgeRanges",
    "targetGender",
    "targetHouseholdIncome",
    "targetInterests",
    "preferredStart",
  ],
  ["creativeStatus", "creativeLink", "creativeSpecsConfirmed", "creativeNotes", "additionalNotes"],
  ["termsAccepted"],
];

export const ALL_FIELDS: readonly SignupField[] = STEP_FIELDS.flat();

/** First error message per field, from a failed parse. */
export function fieldErrors(error: z.ZodError): Partial<Record<SignupField, string>> {
  const flat = z.flattenError(error).fieldErrors as Partial<Record<SignupField, string[]>>;
  const out: Partial<Record<SignupField, string>> = {};
  for (const field of ALL_FIELDS) {
    const first = flat[field]?.[0];
    if (first) out[field] = first;
  }
  return out;
}
