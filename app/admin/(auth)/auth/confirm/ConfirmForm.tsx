"use client";

import { useActionState } from "react";
import { confirmSignIn, type ConfirmState } from "@/app/admin/_actions/auth";
import { adminButton } from "@/components/admin/ui";
import { LinkProblem } from "./LinkProblem";

/** The button posts the token. Only that POST signs you in. */
export function ConfirmForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ConfirmState, FormData>(confirmSignIn, { status: "idle" });

  if (state.status === "error") return <LinkProblem reason={state.reason} />;

  return (
    <form action={action}>
      <input type="hidden" name="token" value={token} />
      <button type="submit" disabled={pending} className={adminButton("primary", "h-10 w-full")}>
        {pending ? "Signing in..." : "Sign in to Dioshift admin"}
      </button>
    </form>
  );
}
