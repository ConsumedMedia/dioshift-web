import "server-only";
import { escapeHtml } from "@/lib/email";

/*
 * Shared look for every Dioshift email: a dark header bar over a white card.
 * Inline styles only, because email clients drop <style>.
 */

/** Paragraph style. */
export const P = "margin:0 0 14px;font-size:15px;line-height:1.6;color:#111827;";

/** `heading` is escaped here. `body` and `footer` are HTML: escape anything user supplied before passing it in. */
export function emailLayout({ heading, body, footer }: { heading: string; body: string; footer: string }): string {
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

/** A blue button link, for the one action an email asks for. */
export function emailButton(text: string, href: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#4f8eff;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">${escapeHtml(text)}</a>`;
}
