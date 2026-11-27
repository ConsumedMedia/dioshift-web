import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** 24px stroke icon wrapper, matching the homepage icon style. Decorative. */
export function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5 shrink-0", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Small icons shared by the newer homepage sections, the final CTA and the sticky bar. */
export const icons = {
  tag: (
    <Icon>
      <path d="M3 12.2V4.5A1.5 1.5 0 0 1 4.5 3h7.7a1.5 1.5 0 0 1 1 .44l7.4 7.4a1.5 1.5 0 0 1 0 2.12l-7.7 7.7a1.5 1.5 0 0 1-2.12 0l-7.4-7.4A1.5 1.5 0 0 1 3 12.2Z" />
      <circle cx="8" cy="8" r="1.5" />
    </Icon>
  ),
  badge: (
    <Icon>
      <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8 7.5 9.5 4.4-1.5 7.5-5.1 7.5-9.5V6L12 3Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </Icon>
  ),
  hand: (
    <Icon>
      <path d="M4 15.5h3l4.5 2a2 2 0 0 0 1.6 0L20 14.4a1.5 1.5 0 0 0-1-2.8l-4.5 1.2" />
      <path d="M4 11h3.5l3.6 1.3a1.4 1.4 0 0 1-.9 2.7H8.5" />
      <path d="M4 10v7.5" />
      <path d="M14 3.5v6M11 6.5h6" />
    </Icon>
  ),
  openLock: (
    <Icon>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.5-2" />
    </Icon>
  ),
  lock: (
    <Icon>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </Icon>
  ),
  pin: (
    <Icon>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </Icon>
  ),
  mail: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </Icon>
  ),
  phone: (
    <Icon>
      <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5A16 16 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4Z" />
    </Icon>
  ),
  check: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  dash: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0" aria-hidden>
      <rect x="5" y="9.25" width="10" height="1.5" rx="0.75" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.6l-3.9-3.7a.75.75 0 1 1 1.04-1.1l5.25 5a.75.75 0 0 1 0 1.1l-5.25 5a.75.75 0 1 1-1.04-1.1l3.9-3.7H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  ),
};
