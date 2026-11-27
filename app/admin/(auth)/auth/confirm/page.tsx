import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/admin/ui";
import { peekSignInToken, type TokenCheck } from "@/lib/admin/login";
import { ConfirmForm } from "./ConfirmForm";
import { LinkProblem } from "./LinkProblem";

export const metadata: Metadata = { title: "Sign in" };

/**
 * Where the emailed link lands. The GET only looks the token up (to show a
 * friendly message for a dead link) and never uses it: email security
 * scanners open links automatically. Signing in takes the button's POST.
 */
export default function ConfirmPage({ searchParams }: PageProps<"/admin/auth/confirm">) {
  return (
    <Suspense fallback={<Skeleton className="h-24" />}>
      {searchParams.then(({ token }) => (
        <Confirm token={typeof token === "string" ? token : ""} />
      ))}
    </Suspense>
  );
}

async function Confirm({ token }: { token: string }) {
  await connection(); // look the token up on real requests only, never in a prefetch
  let check: TokenCheck;
  try {
    check = await peekSignInToken(token);
  } catch (err) {
    unstable_rethrow(err);
    console.error("[admin] Could not check a sign-in link:", err);
    return <LinkProblem reason="unavailable" />;
  }
  if (!check.ok) return <LinkProblem reason={check.reason} />;

  return (
    <>
      <h1 className="text-lg font-semibold text-text">Sign in to Dioshift admin</h1>
      <p className="mb-5 mt-1 text-sm text-text-dim">
        Signing in as <span className="text-text">{check.email}</span>.
      </p>
      <ConfirmForm token={token} />
    </>
  );
}
