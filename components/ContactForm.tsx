"use client";

import { useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { cn } from "@/lib/cn";
import { HONEYPOT_FIELD, contactSchema, type ContactField } from "@/lib/contact-schema";

type Values = Record<ContactField, string>;
type Errors = Partial<Record<ContactField, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: Values = { name: "", businessName: "", email: "", phone: "", message: "" };
const FIELD_ORDER: ContactField[] = ["name", "businessName", "email", "phone", "message"];

function validate(values: Values): Errors {
  const result = contactSchema.safeParse(values);
  if (result.success) return {};
  const fieldErrors = z.flattenError(result.error).fieldErrors as Partial<Record<ContactField, string[]>>;
  const errors: Errors = {};
  for (const field of FIELD_ORDER) {
    const first = fieldErrors[field]?.[0];
    if (first) errors[field] = first;
  }
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [sentName, setSentName] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = validate(values);
  const visibleError = (field: ContactField) =>
    (submitted || touched[field]) ? errors[field] : undefined;

  const update = (field: ContactField) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (status === "error") setStatus("idle");
  };
  const blur = (field: ContactField) => () => setTouched((t) => ({ ...t, [field]: true }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "" }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || !data?.ok) throw new Error("Request failed");
      setSentName(values.name.trim());
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="py-6 text-center sm:py-10">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success">
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden>
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold">Thanks, {sentName}.</h2>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-text-dim">
          Your message is in. We&apos;ll get back to you at the email you gave us.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name" label="Name" autoComplete="name" required
          value={values.name} onChange={update("name")} onBlur={blur("name")}
          error={visibleError("name")}
        />
        <Field
          id="businessName" label="Business name" autoComplete="organization" required
          value={values.businessName} onChange={update("businessName")} onBlur={blur("businessName")}
          error={visibleError("businessName")}
        />
        <Field
          id="email" label="Email" type="email" autoComplete="email" inputMode="email" required
          value={values.email} onChange={update("email")} onBlur={blur("email")}
          error={visibleError("email")}
        />
        <Field
          id="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel"
          value={values.phone} onChange={update("phone")} onBlur={blur("phone")}
          error={visibleError("phone")}
        />
      </div>
      <Field
        id="message" label="Message" multiline required
        value={values.message} onChange={update("message")} onBlur={blur("message")}
        error={visibleError("message")}
        placeholder="Tell us about your business and what you'd like to know."
      />

      {/* Spam trap. Hidden from people and screen readers; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input
          ref={honeypotRef}
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          Sorry, your message didn&apos;t go through. Please try again in a moment. Your text is
          still here.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        aria-disabled={sending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-7 text-base font-medium text-white shadow-[0_0_0_1px_rgba(79,142,255,0.5),0_8px_24px_-6px_rgba(79,142,255,0.55)] transition-all duration-200 hover:bg-[#6a9fff] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {sending && (
          <span
            aria-hidden
            className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
        )}
        {sending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}

type FieldProps = {
  id: ContactField;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  placeholder?: string;
};

function Field({ id, label, value, onChange, onBlur, error, required, multiline, ...rest }: FieldProps) {
  const errorId = `${id}-error`;
  const className = cn(
    "w-full rounded-xl border bg-bg/60 px-4 text-[15px] text-text placeholder:text-text-muted transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-accent/40",
    error ? "border-danger/60 focus:border-danger" : "border-border-bright focus:border-accent",
    multiline ? "min-h-36 resize-y py-3" : "h-12",
  );
  const shared = {
    id,
    name: id,
    value,
    onBlur,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    "aria-required": required || undefined,
    className,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-text">
        {label}
        {!required && <span className="ml-1.5 font-normal text-text-muted">(optional)</span>}
      </label>
      {multiline ? (
        <textarea {...shared} placeholder={rest.placeholder} maxLength={5000} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          {...shared}
          type={rest.type ?? "text"}
          autoComplete={rest.autoComplete}
          inputMode={rest.inputMode}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
