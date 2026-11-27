import type { Metadata } from "next";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { archiveMessage, markMessageUnread, unarchiveMessage } from "@/app/admin/_actions/messages";
import { adminIcons } from "@/components/admin/icons";
import { EmptyState, LoadError, PageHeader, Panel, adminButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getMessage, listMessages, type ContactMessage, type MessageView } from "@/lib/admin/data";
import { formatDateTime, timeAgo } from "@/lib/admin/format";
import { cn } from "@/lib/cn";
import { MarkRead } from "./MarkRead";

export const metadata: Metadata = { title: "Messages" };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function href(view: MessageView, id?: string) {
  const params = new URLSearchParams();
  if (view === "archived") params.set("view", "archived");
  if (id) params.set("id", id);
  const s = params.toString();
  return `/admin/messages${s ? `?${s}` : ""}`;
}

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireAdmin();
  const sp = await searchParams;
  const view: MessageView = one(sp.view) === "archived" ? "archived" : "inbox";
  const idParse = z.uuid().safeParse(one(sp.id));
  const selectedId = idParse.success ? idParse.data : undefined;

  let messages: ContactMessage[];
  let selected: ContactMessage | null = null;
  try {
    [messages, selected] = await Promise.all([
      listMessages(view),
      selectedId ? getMessage(selectedId) : Promise.resolve(null),
    ]);
  } catch (err) {
    unstable_rethrow(err);
    console.error("[admin] Messages failed to load:", err);
    return (
      <>
        <PageHeader title="Messages" />
        <LoadError what="messages" />
      </>
    );
  }

  const now = new Date();
  const open = Boolean(selectedId);

  return (
    <>
      <div className={cn(open && "hidden lg:block")}>
        <PageHeader title="Messages" description="From the contact form" />
        <nav aria-label="Folders" className="mb-4 inline-flex rounded-lg border border-border bg-surface/70 p-0.5 text-sm">
          {(["inbox", "archived"] as const).map((v) => (
            <Link
              key={v}
              href={href(v)}
              aria-current={view === v ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5",
                view === v ? "bg-white/[0.08] text-text" : "text-text-dim hover:text-text",
              )}
            >
              {v === "inbox" ? "Inbox" : "Archived"}
            </Link>
          ))}
        </nav>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-5">
        <Panel className={cn("self-start overflow-hidden", open && "hidden lg:block")}>
          {messages.length === 0 ? (
            <EmptyState title={view === "inbox" ? "Inbox is empty" : "No archived messages"} />
          ) : (
            <ul className="divide-y divide-border">
              {messages.map((m) => {
                const unread = !m.read_at;
                const active = m.id === selectedId;
                return (
                  <li key={m.id}>
                    <Link
                      href={href(view, m.id)}
                      prefetch={false}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "block px-4 py-3 hover:bg-white/[0.03]",
                        active && "bg-white/[0.06] hover:bg-white/[0.06]",
                      )}
                    >
                      <div className="flex items-baseline gap-2">
                        {unread && <span aria-hidden className="size-2 shrink-0 self-center rounded-full bg-accent" />}
                        <p className={cn("min-w-0 flex-1 truncate text-sm", unread ? "font-semibold text-text" : "text-text-dim")}>
                          {m.name}
                          <span className="font-normal text-text-muted"> · {m.business_name}</span>
                        </p>
                        <span className="shrink-0 text-xs text-text-muted">{timeAgo(m.created_at, now)}</span>
                      </div>
                      <p className={cn("mt-0.5 truncate text-xs", unread ? "text-text-dim" : "text-text-muted")}>{m.email}</p>
                      <p className={cn("mt-1 line-clamp-2 text-sm", unread ? "font-medium text-text" : "text-text-dim")}>
                        {unread && <span className="sr-only">Unread. </span>}
                        {m.message}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className={cn(!open && "hidden lg:block")}>
          {selected ? (
            <MessagePane message={selected} view={view} />
          ) : open ? (
            <Panel>
              <BackLink view={view} />
              <EmptyState title="Message not found">It may have been deleted.</EmptyState>
            </Panel>
          ) : (
            <Panel className="hidden lg:block">
              <EmptyState title="Select a message to read it" />
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}

function BackLink({ view }: { view: MessageView }) {
  return (
    <Link
      href={href(view)}
      className="flex items-center gap-1 border-b border-border px-3 py-2.5 text-sm text-text-dim hover:text-text lg:hidden"
    >
      <span className="[&_svg]:size-4">{adminIcons.back}</span>
      {view === "inbox" ? "Inbox" : "Archived"}
    </Link>
  );
}

function MessagePane({ message: m, view }: { message: ContactMessage; view: MessageView }) {
  const mailto = `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent("Re: Your message to Dioshift")}`;
  return (
    <Panel className="overflow-hidden">
      {!m.read_at && <MarkRead id={m.id} />}
      <BackLink view={view} />
      <div className="border-b border-border px-4 py-4">
        <h2 className="text-lg font-semibold text-text">{m.name}</h2>
        <p className="text-sm text-text-dim">{m.business_name}</p>
        <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
          <dt className="text-text-muted">Email</dt>
          <dd className="truncate">
            <a href={`mailto:${encodeURIComponent(m.email)}`} className="text-accent-soft hover:text-accent">
              {m.email}
            </a>
          </dd>
          <dt className="text-text-muted">Phone</dt>
          <dd>
            {m.phone ? (
              <a href={`tel:${m.phone.replace(/[^\d+]/g, "")}`} className="text-accent-soft hover:text-accent">
                {m.phone}
              </a>
            ) : (
              <span className="text-text-muted">Not provided</span>
            )}
          </dd>
          <dt className="text-text-muted">Sent</dt>
          <dd className="text-text-dim">{formatDateTime(m.created_at)}</dd>
        </dl>
      </div>
      <p className="whitespace-pre-wrap break-words px-4 py-4 text-[15px] leading-relaxed text-text">{m.message}</p>
      <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
        <a href={mailto} className={adminButton("primary")}>
          Reply by email
        </a>
        <form action={markMessageUnread}>
          <input type="hidden" name="id" value={m.id} />
          <button type="submit" className={adminButton("secondary")}>
            Mark unread
          </button>
        </form>
        <form action={m.archived ? unarchiveMessage : archiveMessage}>
          <input type="hidden" name="id" value={m.id} />
          <button type="submit" className={adminButton("secondary")}>
            {m.archived ? "Move to inbox" : "Archive"}
          </button>
        </form>
      </div>
    </Panel>
  );
}
