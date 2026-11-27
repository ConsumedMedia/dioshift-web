"use client";

import { useActionState } from "react";
import { requestSignInLink, type RequestLinkState } from "@/app/admin/_actions/auth";
import { adminButton, inputClass } from "@/components/admin/ui";

/** Same message whatever happens, so the form never reveals who is an admin. */
export const SENT_MESSAGE = "If that email has admin access, a sign-in link is on its way. It expires in 15 minutes.";

export function LoginForm() {
  const [state, action, pending] = useActionState<RequestLinkState, FormData>(requestSignInLink, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div role="status">
        <p className="text-sm leading-6 text-text">{SENT_MESSAGE}</p>
        <p className="mt-3 text-sm text-text-dim">You can close this tab and use the link in the email.</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate>
      <label htmlFor="email" className="block text-sm font-medium text-text">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        autoFocus
        aria-invalid={state.status === "invalid" || undefined}
        aria-describedby={state.status === "invalid" ? "email-error" : undefined}
        className={`${inputClass} mt-1.5 h-10`}
      />
      {state.status === "invalid" && (
        <p id="email-error" className="mt-1.5 text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={adminButton("primary", "mt-4 h-10 w-full")}>
        {pending ? "Sending..." : "Email me a sign-in link"}
      </button>
    </form>
  );
}
