import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Text wordmark matching the original Dioshift navbar:
 * a glowing blue dot followed by "Dioshift" in Syne ExtraBold.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Dioshift home"
      className={cn(
        "inline-flex items-center gap-2.5 font-logo text-[19px] font-extrabold tracking-[-0.5px] text-text",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-[9px] rounded-full bg-accent shadow-[0_0_12px_rgba(79,142,255,0.7)]"
      />
      Dioshift
    </Link>
  );
}
