import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TvFrameProps = {
  children: ReactNode;
  size?: "lg" | "sm";
  /** Draw the stand and foot under the set. */
  stand?: boolean;
  className?: string;
};

/**
 * A flat-screen TV: bezel, 16:9 screen and stand. The screen is a size
 * container, so anything inside can size itself with cqw units.
 */
export function TvFrame({ children, size = "lg", stand = true, className }: TvFrameProps) {
  const lg = size === "lg";
  return (
    <div className={cn("relative select-none", className)}>
      <div
        className={cn(
          "relative border border-white/10 bg-[#07080b] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]",
          lg ? "rounded-[18px] p-2 sm:p-2.5" : "rounded-[10px] p-1.5",
        )}
      >
        <div
          className={cn(
            "@container relative aspect-video overflow-hidden bg-[#0b1020]",
            lg ? "rounded-[11px]" : "rounded-[6px]",
          )}
        >
          {children}
          {/* Glass reflection */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_35%)]" />
        </div>
      </div>
      {stand && (
        <>
          <div
            className={cn(
              "relative mx-auto w-[22%] bg-linear-to-b from-[#15171d] to-[#0c0d11] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]",
              lg ? "h-5" : "h-2.5",
            )}
          />
          <div
            className={cn(
              "relative mx-auto w-[38%] rounded-full bg-[#15171d] shadow-[0_8px_24px_rgba(0,0,0,0.6)]",
              lg ? "h-1.5" : "h-1",
            )}
          />
        </>
      )}
    </div>
  );
}
