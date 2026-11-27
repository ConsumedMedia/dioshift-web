"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/_actions/auth";
import { adminIcons } from "@/components/admin/icons";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Overview", icon: adminIcons.overview },
  { href: "/admin/clients", label: "Clients", icon: adminIcons.clients },
  { href: "/admin/messages", label: "Messages", icon: adminIcons.messages },
  { href: "/admin/admins", label: "Admins", icon: adminIcons.admins },
] as const;

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
}

function UnreadBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold leading-5 text-white",
        className,
      )}
    >
      <span className="sr-only">, </span>
      {count > 99 ? "99+" : count}
      <span className="sr-only"> unread</span>
    </span>
  );
}

export function AdminWordmark() {
  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-2 font-logo text-[17px] font-extrabold tracking-[-0.5px] text-text"
    >
      <span aria-hidden className="size-2 rounded-full bg-accent shadow-[0_0_12px_rgba(79,142,255,0.7)]" />
      Dioshift
      <span className="rounded border border-border-bright px-1 py-px font-sans text-[10px] font-medium uppercase tracking-wider text-text-dim">
        Admin
      </span>
    </Link>
  );
}

/** Desktop sidebar plus the phone top bar and bottom tab bar. */
export function AdminNav({ email, unread }: { email: string; unread: number }) {
  const isActive = useIsActive();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface/90 backdrop-blur md:flex">
        <div className="flex h-16 items-center px-5">
          <AdminWordmark />
        </div>
        <nav aria-label="Admin" className="flex-1 px-3 py-2">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-white/[0.07] text-text" : "text-text-dim hover:bg-white/[0.04] hover:text-text",
                    )}
                  >
                    <span className={active ? "text-accent" : undefined}>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.href === "/admin/messages" && <UnreadBadge count={unread} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border p-4">
          <p className="text-xs text-text-muted">Signed in as</p>
          <p className="mt-0.5 truncate text-sm text-text" title={email}>
            {email}
          </p>
          <form action={signOut} className="mt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-border-bright px-3 py-1.5 text-sm text-text-dim transition-colors hover:border-white/25 hover:text-text"
            >
              {adminIcons.signOut}
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Phone top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <AdminWordmark />
          <form action={signOut}>
            <button
              type="submit"
              aria-label={`Sign out (${email})`}
              title={`Sign out (${email})`}
              className="-mr-2 inline-flex size-10 items-center justify-center rounded-lg text-text-dim hover:text-text"
            >
              {adminIcons.signOut}
            </button>
          </form>
        </div>
      </header>

      {/* Phone bottom tab bar */}
      <nav
        aria-label="Admin"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="grid h-16 grid-cols-4">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium",
                    active ? "text-accent" : "text-text-dim",
                  )}
                >
                  <span className="relative">
                    {item.icon}
                    {item.href === "/admin/messages" && (
                      <UnreadBadge count={unread} className="absolute -top-1.5 left-3.5 min-w-4 px-1 text-[10px] leading-4" />
                    )}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
