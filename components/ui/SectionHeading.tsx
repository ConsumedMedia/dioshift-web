import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  /** Render the title as h1 on pages where this is the main heading. */
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
          {eyebrow}
        </p>
      )}
      <Heading className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-balance text-text sm:text-4xl md:text-[2.75rem]">
        {title}
      </Heading>
      {subtitle && (
        <p className="mt-5 text-base leading-relaxed text-pretty text-text-dim sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
