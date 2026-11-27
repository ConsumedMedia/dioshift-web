import type { Metadata } from "next";
import { redirect, unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { getAdminSession } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <>
      <h1 className="text-lg font-semibold text-text">Sign in to Dioshift admin</h1>
      <p className="mb-5 mt-1 text-sm text-text-dim">We&apos;ll email you a link. No password needed.</p>
      <LoginForm />
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
    </>
  );
}

/** Already signed in (and still an admin)? Go straight to the dashboard. */
async function RedirectIfSignedIn() {
  let signedIn = false;
  try {
    signedIn = (await getAdminSession()) !== null;
  } catch (err) {
    unstable_rethrow(err);
    console.error("[admin] Could not check the session on the login page:", err);
  }
  if (signedIn) redirect("/admin");
  return null;
}
