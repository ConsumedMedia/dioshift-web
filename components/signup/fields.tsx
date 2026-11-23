import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Same input styling as the contact form. */
export function inputClass(error?: string, extra?: string) {
  return cn(
    "w-full rounded-xl border bg-bg/60 px-4 text-[15px] text-text placeholder:text-text-muted transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-accent/40",
    error ? "border-danger/60 focus:border-danger" : "border-border-bright focus:border-accent",
    extra,
  );
}

/** ids for aria-describedby: error first so it's read first. */
export function describedBy(id: string, error?: string, hint?: ReactNode) {
  const ids = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

export function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-text">
      {children}
      {!required && <span className="ml-1.5 font-normal text-text-muted">(optional)</span>}
    </label>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
      {error}
    </p>
  );
}

export function FieldHint({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={`${id}-hint`} className="mt-1.5 text-sm text-text-muted">
      {children}
    </p>
  );
}

type Common = {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
};

type TextFieldProps = Common &
  Omit<ComponentProps<"input">, "id" | "className" | "onChange" | "value"> & {
    value: string;
    onValueChange: (value: string) => void;
    suffix?: string;
  };

export function TextField({
  id,
  label,
  error,
  hint,
  required,
  className,
  value,
  onValueChange,
  suffix,
  ...rest
}: TextFieldProps) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          aria-required={required || undefined}
          className={inputClass(error, cn("h-12", suffix && "pr-16"))}
          {...rest}
        />
        {suffix && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-text-muted"
          >
            {suffix}
          </span>
        )}
      </div>
      <FieldError id={id} error={error} />
      <FieldHint id={id}>{hint}</FieldHint>
    </div>
  );
}

type TextAreaFieldProps = Common &
  Omit<ComponentProps<"textarea">, "id" | "className" | "onChange" | "value"> & {
    value: string;
    onValueChange: (value: string) => void;
  };

export function TextAreaField({
  id,
  label,
  error,
  hint,
  required,
  className,
  value,
  onValueChange,
  ...rest
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={required || undefined}
        className={inputClass(error, "min-h-28 resize-y py-3")}
        {...rest}
      />
      <FieldError id={id} error={error} />
      <FieldHint id={id}>{hint}</FieldHint>
    </div>
  );
}

type SelectFieldProps = Common &
  Omit<ComponentProps<"select">, "id" | "className" | "onChange" | "value"> & {
    value: string;
    onValueChange: (value: string) => void;
    options: ReadonlyArray<{ value: string; label: string }>;
    placeholder?: string;
  };

export function SelectField({
  id,
  label,
  error,
  hint,
  required,
  className,
  value,
  onValueChange,
  options,
  placeholder,
  ...rest
}: SelectFieldProps) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          aria-required={required || undefined}
          className={inputClass(error, cn("h-12 appearance-none pr-10", value === "" && placeholder && "text-text-muted"))}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-text">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-text-muted"
        >
          <path
            fillRule="evenodd"
            d="M5.2 7.2a1 1 0 0 1 1.4 0L10 10.6l3.4-3.4a1 1 0 1 1 1.4 1.4l-4.1 4.1a1 1 0 0 1-1.4 0L5.2 8.6a1 1 0 0 1 0-1.4Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <FieldError id={id} error={error} />
      <FieldHint id={id}>{hint}</FieldHint>
    </div>
  );
}

/** A checkbox with its label to the right. */
export function CheckboxField({
  id,
  checked,
  onCheckedChange,
  error,
  required,
  children,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors",
          error ? "border-danger/60 bg-danger/[0.04]" : "border-border-bright hover:border-white/25",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40",
        )}
      >
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={required || undefined}
          className="mt-0.5 size-4.5 shrink-0 cursor-pointer accent-accent focus-visible:outline-none"
        />
        <span className="text-[15px] leading-relaxed text-text">{children}</span>
      </label>
      <FieldError id={id} error={error} />
    </div>
  );
}

/**
 * Shared look for radio/checkbox "cards", "chips" and segmented options.
 * The real input sits inside the label (visually hidden), so arrow keys,
 * Space and screen readers all work natively.
 */
export const choiceClass = (selected: boolean, error?: boolean) =>
  cn(
    "relative cursor-pointer rounded-xl border transition-colors",
    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-bg",
    selected
      ? "border-accent/70 bg-accent/[0.09] text-text"
      : cn(
          "bg-white/[0.02] text-text-dim hover:border-white/25 hover:text-text",
          error ? "border-danger/60" : "border-border-bright",
        ),
  );

export function Legend({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <legend className="mb-2 text-sm font-medium text-text">
      {children}
      {!required && <span className="ml-1.5 font-normal text-text-muted">(optional)</span>}
    </legend>
  );
}
