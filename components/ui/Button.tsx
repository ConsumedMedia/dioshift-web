import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_0_0_1px_rgba(79,142,255,0.5),0_8px_24px_-6px_rgba(79,142,255,0.55)] hover:bg-[#6a9fff] hover:shadow-[0_0_0_1px_rgba(126,179,255,0.7),0_10px_32px_-6px_rgba(79,142,255,0.7)]",
  secondary:
    "border border-border-bright bg-white/[0.03] text-text hover:border-white/25 hover:bg-white/[0.07]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-12 px-7 text-base",
};

/** Button classes, for real <button> elements that should match the link buttons. */
export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string): string {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

/** A link styled as a button. Every CTA on the marketing site navigates somewhere. */
export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
