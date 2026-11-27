import { formatImpressions, formatPrice, POPULAR_PACKAGE } from "@/lib/packages";
import { InView } from "./InView";
import { SampleAdScreen } from "./SampleAdScreen";
import { TargetingMap } from "./TargetingMap";
import { TvFrame } from "./TvFrame";

/*
 * Small visuals for the "How it works" stepper. Each one shows a "before"
 * state and moves to its final state with the lit: variant, which applies
 * once the step has scrolled into view (and immediately under reduced
 * motion). See the lit variant in app/globals.css.
 */

export type StepVisualKind = "plan" | "target" | "upload" | "launch";

export function StepVisual({ kind }: { kind: StepVisualKind }) {
  switch (kind) {
    case "plan":
      return <PlanVisual />;
    case "target":
      return <TargetingMap size="sm" />;
    case "upload":
      return <UploadVisual />;
    case "launch":
      return <LaunchVisual />;
  }
}

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** The popular plan, getting selected. */
function PlanVisual() {
  const pkg = POPULAR_PACKAGE;
  return (
    <div aria-hidden className="mx-auto w-full max-w-[260px] select-none">
      <div className="rounded-xl border border-border-bright bg-surface p-4 transition-[border-color,box-shadow] delay-200 duration-500 lit:border-accent/60 lit:shadow-[0_0_0_1px_rgba(79,142,255,0.15),0_16px_40px_-16px_rgba(79,142,255,0.55)]">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-gold uppercase">
            Most popular
          </span>
          <span className="relative flex size-6 items-center justify-center rounded-full border border-border-bright text-white transition-colors delay-300 duration-300 lit:border-accent lit:bg-accent">
            <Check className="size-3.5 scale-0 opacity-0 transition delay-500 duration-300 lit:scale-100 lit:opacity-100" />
          </span>
        </div>
        <p className="mt-3 font-display text-lg font-bold">{pkg.label}</p>
        <p className="text-sm text-text-dim tabular-nums">{formatImpressions(pkg.impressions)} impressions</p>
        <div className="mt-3 flex items-baseline gap-1 border-t border-border pt-3">
          <span className="font-display text-xl font-bold tabular-nums">{formatPrice(pkg.monthlyPrice)}</span>
          <span className="text-xs text-text-muted">/ month</span>
        </div>
      </div>
    </div>
  );
}

/** A commercial file uploading. */
function UploadVisual() {
  return (
    <div aria-hidden className="mx-auto w-full max-w-[260px] select-none">
      <div className="rounded-xl border border-border-bright bg-surface p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent-glow text-accent-soft">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m10 9.5 4.5 2.5-4.5 2.5v-5Z" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold break-all">your-commercial.mp4</p>
            <p className="text-xs text-text-muted">:30 · 1080p</p>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full origin-left scale-x-0 rounded-full bg-linear-to-r from-accent to-accent-soft transition-transform delay-300 duration-[1600ms] ease-out lit:scale-x-100" />
        </div>
        <div className="relative mt-2 h-4 text-xs">
          <span className="absolute inset-0 text-text-muted transition-opacity delay-[1900ms] duration-300 lit:opacity-0">
            Uploading
          </span>
          <span className="absolute inset-0 flex items-center gap-1.5 text-success opacity-0 transition-opacity delay-[1900ms] duration-300 lit:opacity-100">
            <Check className="size-3.5" />
            Ready for review
          </span>
        </div>
      </div>
    </div>
  );
}

/** A small TV playing the sample ad. */
function LaunchVisual() {
  return (
    <div aria-hidden className="mx-auto w-full max-w-[240px]">
      <TvFrame size="sm">
        <InView className="absolute inset-0">
          <SampleAdScreen />
        </InView>
      </TvFrame>
    </div>
  );
}
