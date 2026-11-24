import "server-only";
import { escapeHtml, getResend } from "@/lib/email";
import { missingEnv } from "@/lib/env";
import { formatImpressions, formatPrice, getPackageById } from "@/lib/packages";
import type { SignupRow } from "@/lib/signups";
import { stripeDashboardUrl } from "@/lib/stripe";

/*
 * Signup emails. Same look as the contact form email (app/api/contact/route.ts):
 * a dark header bar over a white card, with label/value rows. Every value that
 * came from a person or from Stripe is escaped before it goes into HTML.
 */

const EMAIL_ENV = ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "SIGNUP_NOTIFY_EMAILS"] as const;

/** Every address in SIGNUP_NOTIFY_EMAILS (comma separated). */
export function notifyEmails(): string[] {
  return (process.env.SIGNUP_NOTIFY_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Throws with a clear message if email isn't configured. */
function assertEmailConfigured() {
  const missing = missingEnv(EMAIL_ENV);
  if (missing.length > 0 || notifyEmails().length === 0) {
    throw new Error(
      `Signup emails are not configured. Missing environment variable(s): ${
        missing.length ? missing.join(", ") : "SIGNUP_NOTIFY_EMAILS (no addresses)"
      }. Add them to .env.local (see .env.example) and restart the server.`,
    );
  }
}

async function send(message: { to: string[]; replyTo: string; subject: string; html: string; text: string }) {
  const { error } = await getResend().emails.send({
    from: process.env.CONTACT_FROM_EMAIL!.trim(),
    ...message,
    // Subjects carry a business name; keep them on one line.
    subject: message.subject.replace(/[\r\n]+/g, " "),
  });
  if (error) throw new Error(`Resend rejected "${message.subject}": ${error.message}`);
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

const AREA_TYPES: Record<string, string> = {
  radius: "Radius around the business",
  zip_codes: "Zip codes",
  cities: "Cities",
  counties: "Counties",
};
const GENDERS: Record<string, string> = { all: "All", male: "Men", female: "Women" };

const money = (cents: number) => formatPrice(cents / 100);
const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;

function longDate(value: string | Date | null | undefined): string {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function dateTime(value: string | Date | null | undefined): string {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  }) + " ET";
}

function preferredStart(value: string): string {
  if (value === "asap") return "As soon as possible";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" });
}

/** "150,000 / $3,750 mo" */
function packageShort(row: Pick<SignupRow, "impressions" | "monthly_price_cents">): string {
  return `${formatImpressions(row.impressions)} / ${money(row.monthly_price_cents)} mo`;
}

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

// ---------------------------------------------------------------------------
// HTML building blocks (inline styles only: email clients drop <style>)
// ---------------------------------------------------------------------------

/** A table cell value: plain text, a link, or a loud flag. */
type Cell = string | { text: string; href: string } | { flag: string };
type Rows = Array<[label: string, value: Cell]>;

const CELL = "padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;vertical-align:top;";
const LINK = "color:#2563eb;text-decoration:underline;word-break:break-word;overflow-wrap:anywhere;";

function cellHtml(value: Cell): string {
  if (typeof value === "string") return escapeHtml(value);
  if ("flag" in value) {
    return `<span style="display:inline-block;padding:2px 8px;border-radius:6px;background:#fef2f2;color:#b91c1c;font-weight:700;letter-spacing:0.02em;">${escapeHtml(value.flag)}</span>`;
  }
  return `<a href="${escapeHtml(value.href)}" style="${LINK}">${escapeHtml(value.text)}</a>`;
}

function cellText(value: Cell): string {
  if (typeof value === "string") return value;
  if ("flag" in value) return `*** ${value.flag} ***`;
  return value.text === value.href ? value.href : `${value.text} (${value.href})`;
}

function tableHtml(rows: Rows): string {
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="${CELL}color:#6b7280;width:36%;">${escapeHtml(label)}</td><td style="${CELL}color:#111827;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;">${cellHtml(value)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" style="width:100%;border-collapse:collapse;">${body}</table>`;
}

function sectionHtml(title: string, rows: Rows): string {
  return `<div style="padding:16px 12px 4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4f8eff;">${escapeHtml(title)}</div>${tableHtml(rows)}`;
}

function sectionText(title: string, rows: Rows): string {
  return [title.toUpperCase(), ...rows.map(([label, value]) => `${label}: ${cellText(value)}`)].join("\n");
}

const P = "margin:0 0 14px;font-size:15px;line-height:1.6;color:#111827;";

function layout({ heading, body, footer }: { heading: string; body: string; footer: string }): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="margin:0;padding:24px;background:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="padding:20px 24px;background:#0a0b0f;color:#f0f0f5;font-size:16px;font-weight:700;">
        ${escapeHtml(heading)}
      </div>
      <div style="padding:16px 12px;">${body}</div>
      <div style="padding:14px 24px;border-top:1px solid #e5e7eb;font-size:12px;line-height:1.6;color:#9ca3af;">
        ${footer}
      </div>
    </div>
  </body>
</html>`;
}

function stripeLinks(ids: { customerId?: string | null; subscriptionId?: string | null; invoiceId?: string | null }): Rows {
  const base = stripeDashboardUrl();
  const rows: Rows = [];
  if (ids.customerId) rows.push(["Customer", { text: ids.customerId, href: `${base}/customers/${ids.customerId}` }]);
  if (ids.subscriptionId) {
    rows.push(["Subscription", { text: ids.subscriptionId, href: `${base}/subscriptions/${ids.subscriptionId}` }]);
  }
  if (ids.invoiceId) rows.push(["Invoice", { text: ids.invoiceId, href: `${base}/invoices/${ids.invoiceId}` }]);
  return rows;
}

// ---------------------------------------------------------------------------
// Client confirmation
// ---------------------------------------------------------------------------

const NEXT_STEPS = [
  "Confirmation. That's this email, so keep it for your records.",
  "We review your commercial and targeting.",
  "We confirm your launch date with you.",
];

function creativeNote(row: SignupRow): string {
  return row.creative_status === "need"
    ? "You told us you need a commercial. We'll reach out soon to talk it through with you."
    : "We'll review the commercial you sent and let you know if anything needs to change.";
}

export function renderClientConfirmation(row: SignupRow) {
  const subject = "You're signed up for Dioshift Streaming TV";
  const startDate = longDate(row.paid_at);
  const summary: Rows = [
    ["Business", row.business_name],
    ["Package", `${formatImpressions(row.impressions)} impressions / month`],
    ["Monthly price", `${money(row.monthly_price_cents)} / month`],
    ["Billing", `Monthly, starting today (${startDate})`],
  ];
  if (row.creative_status === "have" && row.creative_link && isHttpUrl(row.creative_link)) {
    summary.push(["Your commercial", { text: row.creative_link, href: row.creative_link }]);
  }

  const name = firstName(row.contact_name);
  const intro = `Thanks for signing up ${row.business_name} for Dioshift Streaming TV. Your commercial is headed for the biggest screen in your customers' homes.`;
  const help = "Need to make a change or cancel? Reply to this email. Cancellation requires 30 days' notice.";

  const html = layout({
    heading: "You're signed up",
    body: `
      <div style="padding:8px 12px 4px;">
        <p style="${P}">Hi ${escapeHtml(name)},</p>
        <p style="${P}">${escapeHtml(intro)}</p>
      </div>
      ${tableHtml(summary)}
      <div style="padding:20px 12px 4px;">
        <div style="font-size:15px;font-weight:700;color:#111827;margin-bottom:10px;">What happens next</div>
        <ol style="margin:0 0 14px;padding-left:22px;font-size:15px;line-height:1.7;color:#111827;">
          ${NEXT_STEPS.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
        <p style="${P}">${escapeHtml(creativeNote(row))}</p>
        <p style="${P}margin-bottom:0;">${escapeHtml(help)}</p>
      </div>`,
    footer: `You're billed ${escapeHtml(money(row.monthly_price_cents))} each month on the same date you signed up.`,
  });

  const text = [
    `Hi ${name},`,
    "",
    intro,
    "",
    ...summary.map(([label, value]) => `${label}: ${cellText(value)}`),
    "",
    "What happens next",
    ...NEXT_STEPS.map((step, i) => `${i + 1}. ${step}`),
    "",
    creativeNote(row),
    "",
    help,
  ].join("\n");

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Admin notification
// ---------------------------------------------------------------------------

function adminSections(row: SignupRow): Array<[string, Rows]> {
  const pkg = getPackageById(row.package_id);
  const website: Cell = row.website
    ? isHttpUrl(row.website)
      ? { text: row.website, href: row.website }
      : row.website
    : "Not provided";

  const commercial: Rows =
    row.creative_status === "need"
      ? [
          ["Status", { flag: "NEEDS CREATIVE" }],
          ["Notes", row.creative_notes || "None"],
        ]
      : [
          ["Status", "Has a commercial"],
          [
            "Link",
            row.creative_link
              ? isHttpUrl(row.creative_link)
                ? { text: row.creative_link, href: row.creative_link }
                : row.creative_link
              : "Missing",
          ],
          ["Specs confirmed", row.creative_specs_confirmed ? "Yes" : "No"],
        ];

  return [
    [
      "Package",
      [
        ["Package", pkg ? `${pkg.label} (${row.package_id})` : row.package_id],
        ["Impressions", `${formatImpressions(row.impressions)} / month`],
        ["Monthly price", money(row.monthly_price_cents)],
        ["CPM", money(row.cpm_cents)],
        ["Status", row.status],
        ["Paid", dateTime(row.paid_at)],
        ["Signed up", dateTime(row.created_at)],
        ["Terms accepted", dateTime(row.terms_accepted_at)],
        ["Signup ID", row.id],
      ],
    ],
    [
      "Business",
      [
        ["Business name", row.business_name],
        ["Contact", row.contact_name],
        ["Email", { text: row.email, href: `mailto:${row.email}` }],
        ["Phone", { text: row.phone, href: `tel:${row.phone.replace(/[^\d+]/g, "")}` }],
        ["Website", website],
        ["Category", row.business_category],
        ["Location", `${row.business_city}, ${row.business_state} ${row.business_zip}`],
      ],
    ],
    [
      "Targeting",
      [
        ["Area type", AREA_TYPES[row.service_area_type] ?? row.service_area_type],
        ["Area", row.service_area_details],
        ...(row.radius_miles != null ? ([["Radius", `${row.radius_miles} miles`]] as Rows) : []),
        ["Ages", row.target_age_ranges.join(", ")],
        ["Gender", GENDERS[row.target_gender] ?? row.target_gender],
        ["Household income", row.target_household_income || "Any"],
        ["Interests", row.target_interests || "None given"],
        ["Preferred start", preferredStart(row.preferred_start)],
      ],
    ],
    ["Commercial", commercial],
    ["Notes", [["Additional notes", row.additional_notes || "None"]]],
    [
      "Stripe",
      [
        ...stripeLinks({ customerId: row.stripe_customer_id, subscriptionId: row.stripe_subscription_id }),
        ...(row.stripe_checkout_session_id ? ([["Checkout session", row.stripe_checkout_session_id]] as Rows) : []),
      ],
    ],
  ];
}

export function renderAdminNotification(row: SignupRow) {
  const subject = `New Streaming TV signup: ${row.business_name} (${packageShort(row)})`;
  const sections = adminSections(row);
  const needsCreative = row.creative_status === "need";

  const html = layout({
    heading: "New Streaming TV signup",
    body: sections.map(([title, rows]) => sectionHtml(title, rows)).join(""),
    footer: `Reply to this email to reach ${escapeHtml(row.contact_name)} directly.${
      needsCreative ? " <strong style=\"color:#b91c1c;\">This client needs a commercial.</strong>" : ""
    }`,
  });

  const text = [
    "New Streaming TV signup",
    ...(needsCreative ? ["", "*** NEEDS CREATIVE: this client needs a commercial ***"] : []),
    "",
    sections.map(([title, rows]) => sectionText(title, rows)).join("\n\n"),
    "",
    `Reply to this email to reach ${row.contact_name} directly.`,
  ].join("\n");

  return { subject, html, text };
}

/**
 * Sends the client confirmation and the admin notification for a newly paid
 * signup. Each is attempted even if the other fails; throws afterward if
 * either failed.
 */
export async function sendSignupEmails(row: SignupRow): Promise<void> {
  assertEmailConfigured();
  const admins = notifyEmails();
  const client = renderClientConfirmation(row);
  const admin = renderAdminNotification(row);

  const results = await Promise.allSettled([
    send({ to: [row.email], replyTo: admins[0], ...client }),
    send({ to: admins, replyTo: row.email, ...admin }),
  ]);
  const failures = results.flatMap((r, i) =>
    r.status === "rejected" ? [`${i === 0 ? "client confirmation" : "admin notification"}: ${String(r.reason)}`] : [],
  );
  if (failures.length > 0) throw new Error(`Signup ${row.id} email failures. ${failures.join(" | ")}`);
}

// ---------------------------------------------------------------------------
// Admin notices from the webhook
// ---------------------------------------------------------------------------

function notice({ heading, lead, rows, footer }: { heading: string; lead: string; rows: Rows; footer: string }) {
  return {
    html: layout({
      heading,
      body: `<div style="padding:8px 12px 4px;"><p style="${P}">${escapeHtml(lead)}</p></div>${tableHtml(rows)}`,
      footer: escapeHtml(footer),
    }),
    text: [heading, "", lead, "", ...rows.map(([label, value]) => `${label}: ${cellText(value)}`), "", footer].join("\n"),
  };
}

type NoticeSignup = Pick<
  SignupRow,
  "id" | "business_name" | "contact_name" | "email" | "impressions" | "monthly_price_cents"
>;

function signupRows(signup: NoticeSignup | null, businessName: string): Rows {
  if (!signup) return [["Business", businessName]];
  return [
    ["Business", signup.business_name],
    ["Contact", signup.contact_name],
    ["Email", { text: signup.email, href: `mailto:${signup.email}` }],
    ["Package", packageShort(signup)],
    ["Signup ID", signup.id],
  ];
}

export async function sendSubscriptionCanceledNotice(input: {
  signup: NoticeSignup | null;
  businessName: string;
  customerId: string | null;
  subscriptionId: string;
  canceledAt: Date;
}): Promise<void> {
  assertEmailConfigured();
  const business = input.signup?.business_name ?? input.businessName;
  const { html, text } = notice({
    heading: "Subscription canceled",
    lead: `The Streaming TV subscription for ${business} was canceled. The signup is now marked canceled.`,
    rows: [
      ...signupRows(input.signup, business),
      ["Canceled", dateTime(input.canceledAt)],
      ...stripeLinks({ customerId: input.customerId, subscriptionId: input.subscriptionId }),
    ],
    footer: "Sent automatically by the Stripe webhook.",
  });
  const admins = notifyEmails();
  await send({
    to: admins,
    replyTo: input.signup?.email ?? admins[0],
    subject: `Subscription canceled: ${business}`,
    html,
    text,
  });
}

export async function sendPaymentFailedNotice(input: {
  signup: NoticeSignup | null;
  businessName: string;
  customerId: string | null;
  subscriptionId: string | null;
  invoiceId: string;
  amountDueCents: number;
  attemptCount: number;
  nextAttempt: Date | null;
}): Promise<void> {
  assertEmailConfigured();
  const business = input.signup?.business_name ?? input.businessName;
  const { html, text } = notice({
    heading: "Payment failed",
    lead: `A Streaming TV payment for ${business} didn't go through. Stripe will retry on its own schedule. You may want to reach out.`,
    rows: [
      ...signupRows(input.signup, business),
      ["Amount due", money(input.amountDueCents)],
      ["Attempt", String(input.attemptCount)],
      ["Next retry", input.nextAttempt ? dateTime(input.nextAttempt) : "None scheduled"],
      ...stripeLinks({
        customerId: input.customerId,
        subscriptionId: input.subscriptionId,
        invoiceId: input.invoiceId,
      }),
    ],
    footer: "Sent automatically by the Stripe webhook.",
  });
  const admins = notifyEmails();
  await send({
    to: admins,
    replyTo: input.signup?.email ?? admins[0],
    subject: `Payment failed: ${business}`,
    html,
    text,
  });
}
