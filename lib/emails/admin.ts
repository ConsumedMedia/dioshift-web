import "server-only";
import { escapeHtml, getResend } from "@/lib/email";
import { P, emailButton, emailLayout } from "@/lib/emails/layout";
import { missingEnv } from "@/lib/env";

/* Emails sent by the admin dashboard. Same look as every other Dioshift email. */

const EMAIL_ENV = ["RESEND_API_KEY", "CONTACT_FROM_EMAIL"] as const;

async function send(message: { to: string; subject: string; html: string; text: string }) {
  const missing = missingEnv(EMAIL_ENV);
  if (missing.length > 0) {
    throw new Error(`Admin emails are not configured. Missing environment variable(s): ${missing.join(", ")}.`);
  }
  const { error } = await getResend().emails.send({
    from: process.env.CONTACT_FROM_EMAIL!.trim(),
    ...message,
  });
  if (error) throw new Error(`Resend rejected "${message.subject}": ${error.message}`);
}

/** The emailed sign-in link. */
export async function sendAdminSignInLink(to: string, link: string): Promise<void> {
  const lead = "Use the button below to sign in to the Dioshift admin. The link expires in 15 minutes and works once.";
  const ignore = "If you didn't ask to sign in, you can ignore this email. Nobody can sign in without this link.";
  await send({
    to,
    subject: "Your Dioshift admin sign-in link",
    html: emailLayout({
      heading: "Sign in to Dioshift admin",
      body: `
        <div style="padding:8px 12px 4px;">
          <p style="${P}">${escapeHtml(lead)}</p>
          <p style="${P}">${emailButton("Sign in to Dioshift admin", link)}</p>
          <p style="${P}font-size:13px;color:#6b7280;">Or paste this link into your browser:<br><span style="word-break:break-all;">${escapeHtml(link)}</span></p>
        </div>`,
      footer: escapeHtml(ignore),
    }),
    text: ["Sign in to Dioshift admin", "", lead, "", link, "", ignore].join("\n"),
  });
}

/** Tells a newly added admin they have access. */
export async function sendAdminAccessGranted(to: string, addedBy: string, loginUrl: string): Promise<void> {
  const lead = `${addedBy} gave you access to the Dioshift admin.`;
  const how = `To sign in, go to ${loginUrl} and enter this email address (${to}). We'll email you a sign-in link.`;
  await send({
    to,
    subject: "You have access to the Dioshift admin",
    html: emailLayout({
      heading: "You have access to the Dioshift admin",
      body: `
        <div style="padding:8px 12px 4px;">
          <p style="${P}">${escapeHtml(lead)}</p>
          <p style="${P}">To sign in, enter this email address (${escapeHtml(to)}) on the admin sign-in page. We'll email you a sign-in link.</p>
          <p style="${P}">${emailButton("Go to admin sign-in", loginUrl)}</p>
        </div>`,
      footer: `If you weren't expecting this, check with ${escapeHtml(addedBy)}.`,
    }),
    text: ["You have access to the Dioshift admin", "", lead, "", how].join("\n"),
  });
}
