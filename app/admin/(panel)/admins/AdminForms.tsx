"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addAdmin, removeAdmin, type AdminFormState } from "@/app/admin/_actions/admins";
import { adminButton, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

const IDLE: AdminFormState = { status: "idle" };

function Feedback({ state }: { state: AdminFormState }) {
  if (state.status === "idle") return null;
  return (
    <p role={state.status === "error" ? "alert" : "status"} className={cn("mt-2 text-sm", state.status === "error" ? "text-danger" : "text-success")}>
      {state.message}
    </p>
  );
}

export function AddAdminForm() {
  const [state, action, pending] = useActionState(addAdmin, IDLE);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === "ok") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} noValidate>
      <label htmlFor="new-admin-email" className="block text-sm font-medium text-text">
        Email
      </label>
      <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
        <input
          id="new-admin-email"
          name="email"
          type="email"
          required
          autoComplete="off"
          placeholder="name@example.com"
          className={inputClass}
        />
        <button type="submit" disabled={pending} className={adminButton("primary", "shrink-0")}>
          {pending ? "Adding..." : "Add admin"}
        </button>
      </div>
      <Feedback state={state} />
    </form>
  );
}

/** Remove, then a confirm step before anything happens. */
export function RemoveAdminButton({ id, email }: { id: string; email: string }) {
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(removeAdmin, IDLE);

  if (!confirming) {
    return (
      <div className="text-right">
        <button type="button" onClick={() => setConfirming(true)} className={adminButton("ghost", "h-8 text-danger hover:text-danger")}>
          Remove
        </button>
        <Feedback state={state} />
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-wrap items-center justify-end gap-2">
      <input type="hidden" name="id" value={id} />
      <span className="text-sm text-text-dim">Remove {email}?</span>
      <button type="submit" disabled={pending} className={adminButton("danger", "h-8")}>
        {pending ? "Removing..." : "Yes, remove"}
      </button>
      <button type="button" onClick={() => setConfirming(false)} disabled={pending} className={adminButton("ghost", "h-8")}>
        Cancel
      </button>
      <div className="basis-full text-right">
        <Feedback state={state} />
      </div>
    </form>
  );
}
