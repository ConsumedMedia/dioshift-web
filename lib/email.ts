import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

/**
 * Shared Resend client. Created on first use so a missing key fails at
 * send time with a clear error instead of breaking the build.
 */
export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  client ??= new Resend(apiKey);
  return client;
}

/** Returns the names of any env vars in `names` that are missing or blank. */
export function missingEnv(names: readonly string[]): string[] {
  return names.filter((name) => !process.env[name]?.trim());
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape user input before placing it in an HTML email body. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}
