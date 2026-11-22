import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type SectionProps = ComponentProps<"section"> & {
  /** Classes for the inner max-width container. */
  containerClassName?: string;
};

/** Consistent vertical rhythm and max width for every page section. */
export function Section({ className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section className={cn("relative py-20 sm:py-28", className)} {...props}>
      <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
