import { unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Skeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { countUnreadMessages } from "@/lib/admin/data";

/*
 * Signed-in admin chrome. The session check runs at request time behind the
 * Suspense boundary, so nothing below it is prerendered or cached. Each page
 * also calls requireAdmin() itself: on client navigation this layout isn't
 * re-rendered, and the page check is what protects it.
 */

// Admin pages always wait on the session; don't flag them for instant navigation.
export const instant = false;

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  let unread = 0;
  try {
    unread = await countUnreadMessages();
  } catch (err) {
    unstable_rethrow(err);
    console.error("[admin] Could not count unread messages:", err);
  }

  return (
    <div className="relative z-10 flex min-h-dvh flex-1 flex-col">
      <AdminNav email={session.email} unread={unread} />
      <main className="flex-1 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-5 md:ml-60 md:px-8 md:pb-10 md:pt-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

function ShellFallback() {
  return (
    <div className="relative z-10 flex-1 px-4 pt-5 md:ml-60 md:px-8 md:pt-8">
      <div className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-surface/90 md:block" />
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-28" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
