"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const idSchema = z.uuid();
const formSchema = z.object({ id: z.uuid() });

async function update(id: string, values: Record<string, unknown>, onlyIfUnread = false) {
  let query = getSupabaseAdmin().from("contact_messages").update(values).eq("id", id);
  if (onlyIfUnread) query = query.is("read_at", null);
  const { error } = await query;
  if (error) throw new Error(`Could not update message ${id}: ${error.message}`);
}

/** Called when a message is opened on screen (not on prefetch). */
export async function markMessageRead(id: string): Promise<void> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return;
  await update(parsed.data, { read_at: new Date().toISOString() }, true);
  refresh();
}

function parseForm(formData: FormData): string {
  const parsed = formSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) redirect("/admin/messages");
  return parsed.data.id;
}

export async function markMessageUnread(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseForm(formData);
  await update(id, { read_at: null });
  redirect("/admin/messages");
}

export async function archiveMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseForm(formData);
  await update(id, { archived: true });
  redirect("/admin/messages");
}

export async function unarchiveMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseForm(formData);
  await update(id, { archived: false });
  redirect("/admin/messages?view=archived");
}
