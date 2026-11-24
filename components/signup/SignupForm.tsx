"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { POPULAR_PACKAGE, getPackageById, type PackageId } from "@/lib/packages";
import {
  HONEYPOT_FIELD,
  STEP_FIELDS,
  fieldErrors,
  signupSchema,
  type SignupField,
} from "@/lib/signup-schema";
import { MobileOrderSummary, OrderSummary } from "./OrderSummary";
import { initialValues, toPayload, type Errors, type FormValues, type StepProps } from "./form-state";
import { AudienceStep, BusinessStep, CommercialStep, PackageStep, ReviewStep } from "./steps";

const STEPS = [
  { short: "Package", title: "Your package", intro: "Pick how many people you want to reach each month. You can change plans later." },
  { short: "Business", title: "Your business", intro: "Tell us who you are and how to reach you." },
  { short: "Audience", title: "Who to reach", intro: "Tell us where your customers are and who they are. We'll aim your ad right at them." },
  { short: "Commercial", title: "Your commercial", intro: "Already have a :30 spot? Send it over. Need one? Let us know." },
  { short: "Review", title: "Review and confirm", intro: "Take a quick look. Tap Edit to change anything." },
] as const;
const LAST_STEP = STEPS.length - 1;

const stepOf = (field: SignupField) => STEP_FIELDS.findIndex((fields) => fields.includes(field));

function validate(values: FormValues): Errors {
  const result = signupSchema.safeParse(toPayload(values));
  return result.success ? {} : fieldErrors(result.error);
}

type Status = "idle" | "sending" | "error";

export function SignupForm({ initialPackageId }: { initialPackageId?: PackageId }) {
  const [values, setValues] = useState<FormValues>(() =>
    initialValues(initialPackageId ?? POPULAR_PACKAGE.id),
  );
  const [step, setStep] = useState(0);
  const [attempted, setAttempted] = useState<boolean[]>(() => STEPS.map(() => false));
  const [touched, setTouched] = useState<Partial<Record<SignupField, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  /**
   * A row saved by a submit whose payment page failed to open. Retrying with
   * the same answers reuses it instead of saving a duplicate signup.
   */
  const savedSignup = useRef<{ id: string; payload: string } | null>(null);
  /** Set when the step changes or a field needs focus; handled after render. */
  const pending = useRef<{ kind: "step" } | { kind: "field"; field: SignupField } | null>(null);

  const errors = useMemo<Errors>(() => ({ ...validate(values), ...serverErrors }), [values, serverErrors]);
  const pkg = getPackageById(values.packageId) ?? POPULAR_PACKAGE;

  useEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    if (p.kind === "step") {
      topRef.current?.scrollIntoView({ block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    } else {
      const el = formRef.current?.querySelector<HTMLElement>(`#${p.field}`);
      el?.focus();
    }
  });

  // Coming back from Stripe with the browser's Back button can restore this
  // page from the back/forward cache mid "sending". Re-enable the form.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setStatus((s) => (s === "sending" ? "idle" : s));
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const errorFor = (field: SignupField) =>
    attempted[stepOf(field)] || touched[field] ? errors[field] : undefined;

  const set: StepProps["set"] = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
    const schemaField = (field === "startMode" || field === "startDate" ? "preferredStart" : field) as SignupField;
    if (serverErrors[schemaField]) {
      setServerErrors((errs) => {
        const rest = { ...errs };
        delete rest[schemaField];
        return rest;
      });
    }
    if (status === "error") setStatus("idle");
  };

  const blur = (field: SignupField) => () => setTouched((t) => (t[field] ? t : { ...t, [field]: true }));

  function goTo(next: number) {
    pending.current = { kind: "step" };
    setStep(next);
  }

  function focusField(field: SignupField) {
    pending.current = { kind: "field", field };
  }

  /** Marks a step as attempted. Returns the first field with an error, if any. */
  function checkStep(index: number, errs: Errors = errors): SignupField | undefined {
    setAttempted((a) => a.map((v, i) => (i === index ? true : v)));
    return STEP_FIELDS[index].find((f) => errs[f]);
  }

  function next() {
    const bad = checkStep(step);
    if (bad) {
      focusField(bad);
      return;
    }
    goTo(step + 1);
  }

  async function submit() {
    setAttempted(STEPS.map(() => true));
    const firstBadStep = STEP_FIELDS.findIndex((fields) => fields.some((f) => errors[f]));
    if (firstBadStep !== -1) {
      const bad = STEP_FIELDS[firstBadStep].find((f) => errors[f])!;
      if (firstBadStep !== step) setStep(firstBadStep);
      focusField(bad);
      return;
    }

    setStatus("sending");
    setErrorMessage("");
    const payload = JSON.stringify(toPayload(values));
    const saved = savedSignup.current?.payload === payload ? savedSignup.current : null;
    try {
      // Same answers as a signup we already saved: just reopen payment for it.
      const res = saved
        ? await fetch("/api/signup/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ signupId: saved.id }),
          })
        : await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...toPayload(values), [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "" }),
          });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; checkoutUrl: string }
        | { ok: false; error?: string; fields?: Errors; signupId?: string }
        | null;

      if (res.ok && data?.ok) {
        // Off to Stripe Checkout. Leave the form in "sending" while the page unloads.
        window.location.assign(data.checkoutUrl);
        return;
      }

      if (data && !data.ok && data.signupId) {
        savedSignup.current = { id: data.signupId, payload };
      }

      const fields = data && !data.ok ? data.fields : undefined;
      if (fields && Object.keys(fields).length > 0) {
        setServerErrors(fields);
        const badStep = STEP_FIELDS.findIndex((fs) => fs.some((f) => fields[f]));
        if (badStep !== -1) {
          const bad = STEP_FIELDS[badStep].find((f) => fields[f])!;
          if (badStep !== step) setStep(badStep);
          focusField(bad);
        }
      }
      setErrorMessage((data && !data.ok && data.error) || "");
      setStatus("error");
    } catch {
      setErrorMessage("");
      setStatus("error");
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    // Enter in a field on steps 1 to 4 means "Next", not submit.
    if (step < LAST_STEP) next();
    else void submit();
  }

  const stepProps: StepProps = { values, set, errorFor, blur };
  const current = STEPS[step];
  const sending = status === "sending";

  return (
    <div className="relative mx-auto grid w-full max-w-6xl items-start gap-8 px-4 pb-20 sm:px-6 sm:pb-28 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10 lg:px-8">
      <div ref={topRef} className="min-w-0 scroll-mt-24">
        <Card className="p-5 sm:p-8">
          <Progress step={step} onJump={goTo} />

          <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-8" aria-labelledby="signup-step-title">
            <div className="mb-7">
              <h2
                id="signup-step-title"
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-2xl font-bold tracking-tight focus:outline-none sm:text-[1.75rem]"
              >
                {current.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-text-dim">{current.intro}</p>
            </div>

            {step === 0 && <PackageStep {...stepProps} />}
            {step === 1 && <BusinessStep {...stepProps} />}
            {step === 2 && <AudienceStep {...stepProps} />}
            {step === 3 && <CommercialStep {...stepProps} />}
            {step === 4 && <ReviewStep {...stepProps} goTo={goTo} />}

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
              <p
                role="alert"
                className="mt-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {errorMessage || "Sorry, that didn't go through. Please try again in a moment."} Your answers are
                still here.
              </p>
            )}

            <div className="mt-8 space-y-4 border-t border-border pt-6">
              <MobileOrderSummary pkg={pkg} />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    disabled={sending}
                    className={buttonClass("secondary", "lg", "w-full sm:w-auto")}
                  >
                    Back
                  </button>
                ) : (
                  <span className="hidden sm:block" />
                )}

                {step < LAST_STEP ? (
                  <button type="submit" className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
                    Next: {STEPS[step + 1].short}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={sending}
                    aria-disabled={sending}
                    className={buttonClass("primary", "lg", "w-full disabled:cursor-wait sm:w-auto")}
                  >
                    {sending && (
                      <span
                        aria-hidden
                        className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                    )}
                    {sending ? "Saving..." : "Continue to Payment"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </Card>
      </div>

      <aside aria-label="Order summary" className="sticky top-24 hidden lg:block">
        <OrderSummary pkg={pkg} />
        <p className="mt-4 px-1 text-sm leading-relaxed text-text-muted">
          No long-term contract. Change or cancel your plan with 30 days&apos; notice.
        </p>
      </aside>
    </div>
  );
}

function Progress({ step, onJump }: { step: number; onJump: (step: number) => void }) {
  return (
    <nav aria-label="Signup progress">
      <p className="text-sm text-text-dim sm:hidden">
        Step {step + 1} of {STEPS.length}: <span className="font-medium text-text">{STEPS[step].short}</span>
      </p>
      <ol className="mt-3 grid grid-cols-5 gap-1.5 sm:mt-0 sm:gap-3">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          const content = (
            <>
              <span
                aria-hidden
                className={cn(
                  "block h-1.5 rounded-full transition-colors",
                  done ? "bg-accent" : active ? "bg-accent-soft" : "bg-white/10",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "mt-2.5 hidden items-center gap-2 text-sm sm:flex",
                  active ? "font-medium text-text" : done ? "text-text-dim" : "text-text-muted",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    done
                      ? "bg-accent text-white"
                      : active
                        ? "border border-accent-soft text-accent-soft"
                        : "border border-border-bright text-text-muted",
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className="truncate">{s.short}</span>
              </span>
              <span className="sr-only">
                {`Step ${i + 1}: ${s.title}${done ? " (done)" : ""}`}
              </span>
            </>
          );
          return (
            <li key={s.short} aria-current={active ? "step" : undefined} className="min-w-0">
              {done ? (
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className="group -my-2 block w-full py-2 text-left hover:[&>span:first-child]:bg-accent-soft"
                >
                  {content}
                </button>
              ) : (
                <div>{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
