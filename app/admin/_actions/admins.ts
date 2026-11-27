"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { isOwner, normalizeEmail, requireAdmin } from "@/lib/admin/auth";
import { sendAdminAccessGranted } from "@/lib/emails/admin";
import { getSiteUrl } from "@/lib/site-url";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type AdminFormState = { status: "idle" } | { status: "ok"; message: string } | { status: "error"; message: string };

const addSchema = z.object({
  email: z.string().trim().min(1, "Enter an email address.").max(254).pipe(z.email("Enter a valid email address.")),
});

export async function addAdmin(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin();
  const parsed = addSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  }
  const email = normalizeEmail(parsed.data.email);
  if (isOwner(email)) return { status: "error", message: "That email is the owner and already has access." };

  const db = getSupabaseAdmin();
  const { data: existing, error: lookupError } = await db
    .from("admin_users")
    .select("id, active")
    .eq("email", email)
    .maybeSingle();
  if (lookupError) {
    console.error("[admin] Could not look up admin:", lookupError.message);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
  if (existing?.active) return { status: "error", message: `${email} is already an admin.` };

  // A removed admin is turned back on; anyone else gets a new row.
  const { error } = existing
    ? await db.from("admin_users").update({ active: true, added_by: session.email }).eq("id", existing.id)
    : await db.from("admin_users").insert({ email, added_by: session.email });
  if (error) {
    console.error("[admin] Could not add admin:", error.message);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  refresh();
  try {
    await sendAdminAccessGranted(email, session.email, `${getSiteUrl()}/admin/login`);
  } catch (err) {
    console.error("[admin] Could not send the access email:", err);
    return { status: "ok", message: `Added ${email}, but the email to them didn't send. Let them know to sign in at /admin/login.` };
  }
  return { status: "ok", message: `Added ${email}. We emailed them a link to the sign-in page.` };
}

const removeSchema = z.object({ id: z.uuid() });

export async function removeAdmin(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin();
  const parsed = removeSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { status: "error", message: "That admin wasn't found." };

  const db = getSupabaseAdmin();
  const { data: row, error: lookupError } = await db
    .from("admin_users")
    .select("id, email")
    .eq("id", parsed.data.id)
    .maybeSingle();
  if (lookupError) {
    console.error("[admin] Could not look up admin:", lookupError.message);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
  if (!row) return { status: "error", message: "That admin wasn't found." };
  if (isOwner(row.email)) return { status: "error", message: "The owner can't be removed." };
  if (normalizeEmail(row.email) === session.email) return { status: "error", message: "You can't remove yourself." };

  const { error } = await db.from("admin_users").update({ active: false }).eq("id", row.id);
  if (error) {
    console.error("[admin] Could not remove admin:", error.message);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
  refresh();
  return { status: "ok", message: `Removed ${row.email}. They lose access right away.` };
}
