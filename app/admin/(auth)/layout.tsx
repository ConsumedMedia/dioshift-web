import Link from "next/link";

/** Centered card for the sign-in screens. No admin chrome: you aren't signed in yet. */
export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative z-10 flex min-h-dvh flex-1 flex-col items-center justify-center px-4 py-12">
      <Link
        href="/admin/login"
        className="mb-8 inline-flex items-center gap-2.5 font-logo text-[19px] font-extrabold tracking-[-0.5px] text-text"
      >
        <span aria-hidden className="size-[9px] rounded-full bg-accent shadow-[0_0_12px_rgba(79,142,255,0.7)]" />
        Dioshift
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
        {children}
      </div>
    </main>
  );
}
