import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* Small building blocks for admin screens: denser than the marketing site, same palette. */

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-text md:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-dim">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("rounded-xl border border-border bg-surface/70", className)} {...props} />;
}

export function PanelHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
      <h2 className="text-sm font-semibold text-text">{title}</h2>
      {actions}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-4 py-10 text-center">
      <p className="text-sm font-medium text-text">{title}</p>
      {children && <div className="mt-1 text-sm text-text-dim">{children}</div>}
    </div>
  );
}

/** Shown when the database can't be reached. */
export function LoadError({ what }: { what: string }) {
  return (
    <Panel className="border-danger/30 px-4 py-6">
      <p className="text-sm font-medium text-danger">Couldn&apos;t load {what}.</p>
      <p className="mt-1 text-sm text-text-dim">Refresh the page to try again. If it keeps happening, check the server logs.</p>
    </Panel>
  );
}

export const inputClass =
  "h-9 w-full rounded-lg border border-border-bright bg-bg/60 px-3 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none";

export const selectClass =
  "h-9 rounded-lg border border-border-bright bg-bg/60 px-2.5 text-sm text-text focus:border-accent focus:outline-none";

const BUTTONS = {
  primary: "bg-accent text-white hover:bg-[#6a9fff]",
  secondary: "border border-border-bright bg-white/[0.03] text-text hover:border-white/25 hover:bg-white/[0.07]",
  danger: "border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
  ghost: "text-text-dim hover:bg-white/[0.05] hover:text-text",
} as const;

export function adminButton(variant: keyof typeof BUTTONS = "secondary", className?: string): string {
  return cn(
    "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    BUTTONS[variant],
    className,
  );
}

/** Grey skeleton block for loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/[0.05]", className)} />;
}
