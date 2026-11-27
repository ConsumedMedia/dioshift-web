import "server-only";
import { bootstrapEmail } from "@/lib/admin/auth";
import type { SignupRow } from "@/lib/signups";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/*
 * Admin reads. Nothing here is cached: every admin page shows fresh data.
 * Callers must have called requireAdmin() first.
 */

/**
 * Upper bound on rows the admin loads at once. Dioshift has far fewer clients
 * than this; if that ever changes, move filtering into the query.
 */
const MAX_SIGNUPS = 5000;
const MAX_MESSAGES = 500;

/** Every signup, newest first. Search, filters and the overview run on this in memory. */
export async function listSignups(): Promise<SignupRow[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("streaming_signups")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(MAX_SIGNUPS);
  if (error) throw new Error(`Could not load signups: ${error.message}`);
  return (data ?? []) as SignupRow[];
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  business_name: string;
  email: string;
  phone: string | null;
  message: string;
  read_at: string | null;
  archived: boolean;
}

export type MessageView = "inbox" | "archived";

export async function listMessages(view: MessageView): Promise<ContactMessage[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("contact_messages")
    .select("*")
    .eq("archived", view === "archived")
    .order("created_at", { ascending: false })
    .limit(MAX_MESSAGES);
  if (error) throw new Error(`Could not load messages: ${error.message}`);
  return (data ?? []) as ContactMessage[];
}

export async function getMessage(id: string): Promise<ContactMessage | null> {
  const { data, error } = await getSupabaseAdmin().from("contact_messages").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not load message ${id}: ${error.message}`);
  return (data as ContactMessage | null) ?? null;
}

/** Unread messages in the inbox (archived ones don't count). */
export async function countUnreadMessages(): Promise<number> {
  const { count, error } = await getSupabaseAdmin()
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .is("read_at", null)
    .eq("archived", false);
  if (error) throw new Error(`Could not count unread messages: ${error.message}`);
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Admins
// ---------------------------------------------------------------------------

export interface AdminUserRow {
  id: string;
  email: string;
  created_at: string;
  added_by: string | null;
  active: boolean;
}

export interface AdminListEntry {
  id: string | null;
  email: string;
  owner: boolean;
  addedBy: string | null;
  createdAt: string | null;
}

/** The owner first, then active admins oldest first. An admin_users row for the owner's email is folded into the owner. */
export async function listAdmins(): Promise<AdminListEntry[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("admin_users")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Could not load admins: ${error.message}`);

  const owner = bootstrapEmail();
  const rows = (data ?? []) as AdminUserRow[];
  const entries: AdminListEntry[] = owner ? [{ id: null, email: owner, owner: true, addedBy: null, createdAt: null }] : [];
  for (const row of rows) {
    if (row.email === owner) continue;
    entries.push({ id: row.id, email: row.email, owner: false, addedBy: row.added_by, createdAt: row.created_at });
  }
  return entries;
}
