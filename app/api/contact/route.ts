import { z } from "zod";
import { HONEYPOT_FIELD, contactSchema, type ContactData } from "@/lib/contact-schema";
import { escapeHtml, getResend, missingEnv } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const REQUIRED_ENV = ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"] as const;

function json(body: { ok: true } | { ok: false; error: string; fields?: Record<string, string[]> }, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const limited = await rateLimit(request, "contact");
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }
  if (!body || typeof body !== "object") {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot: pretend it worked so bots don't learn anything, but send nothing.
  const trap = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    return json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "Please check the form and try again.",
        fields: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
      },
      400,
    );
  }

  const missing = missingEnv(REQUIRED_ENV);
  if (missing.length > 0) {
    console.error(
      `[contact] Cannot send contact email. Missing environment variable(s): ${missing.join(", ")}. ` +
        "Add them to .env.local (see .env.example) and restart the server.",
    );
    return json({ ok: false, error: "Our contact form is temporarily unavailable." }, 500);
  }

  const data = parsed.data;
  try {
    const { error } = await getResend().emails.send({
      from: process.env.CONTACT_FROM_EMAIL!,
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: data.email,
      subject: `New contact form message from ${data.businessName}`,
      html: renderHtml(data),
      text: renderText(data),
    });
    if (error) {
      console.error("[contact] Resend rejected the email:", error);
      return json({ ok: false, error: "We couldn't send your message. Please try again." }, 502);
    }
  } catch (err) {
    console.error("[contact] Failed to send contact email:", err);
    return json({ ok: false, error: "We couldn't send your message. Please try again." }, 500);
  }

  return json({ ok: true });
}

function rows(data: ContactData): Array<[string, string]> {
  return [
    ["Name", data.name],
    ["Business name", data.businessName],
    ["Email", data.email],
    ["Phone", data.phone || "Not provided"],
  ];
}

function renderText(data: ContactData): string {
  return [
    "New contact form message",
    "",
    ...rows(data).map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    data.message,
  ].join("\n");
}

function renderHtml(data: ContactData): string {
  const cell = "padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;vertical-align:top;";
  const tableRows = rows(data)
    .map(
      ([label, value]) =>
        `<tr><td style="${cell}color:#6b7280;width:140px;">${escapeHtml(label)}</td><td style="${cell}color:#111827;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="padding:20px 24px;background:#0a0b0f;color:#f0f0f5;font-size:16px;font-weight:700;">
        New contact form message
      </div>
      <div style="padding:16px 12px;">
        <table role="presentation" style="width:100%;border-collapse:collapse;">${tableRows}</table>
        <div style="padding:16px 12px 4px;">
          <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">Message</div>
          <div style="font-size:15px;line-height:1.6;color:#111827;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
        </div>
      </div>
      <div style="padding:14px 24px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
        Reply to this email to respond to ${escapeHtml(data.name)} directly.
      </div>
    </div>
  </body>
</html>`;
}
