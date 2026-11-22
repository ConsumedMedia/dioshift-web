import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentProps<"div"> & {
  /** Accent border and glow, for a featured item. */
  highlight?: boolean;
};

export function Card({ highlight, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-6 sm:p-7",
        "bg-linear-to-b from-white/[0.035] to-white/[0.01]",
        highlight
          ? "border-accent/50 shadow-[0_0_0_1px_rgba(79,142,255,0.15),0_20px_60px_-20px_rgba(79,142,255,0.45)]"
          : "border-border",
        className,
      )}
      {...props}
    />
  );
}
