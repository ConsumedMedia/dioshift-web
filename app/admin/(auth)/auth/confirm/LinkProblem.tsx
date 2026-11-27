import Link from "next/link";
import { adminButton } from "@/components/admin/ui";

const COPY = {
  expired: {
    title: "This sign-in link has expired",
    body: "Links work for 15 minutes. Ask for a new one and use it right away.",
  },
  used: {
    title: "This sign-in link was already used",
    body: "Each link works once. Ask for a new one to sign in again.",
  },
  invalid: {
    title: "This sign-in link doesn't work",
    body: "It may be incomplete, or the email no longer has admin access. Ask for a new link.",
  },
  unavailable: {
    title: "We couldn't sign you in just now",
    body: "Something went wrong on our side. Ask for a new link and try again in a minute.",
  },
} as const;

export function LinkProblem({ reason }: { reason: keyof typeof COPY }) {
  const { title, body } = COPY[reason];
  return (
    <div role="alert">
      <h1 className="text-lg font-semibold text-text">{title}</h1>
      <p className="mt-1 text-sm text-text-dim">{body}</p>
      <Link href="/admin/login" className={adminButton("primary", "mt-5 h-10 w-full")}>
        Get a new sign-in link
      </Link>
    </div>
  );
}
