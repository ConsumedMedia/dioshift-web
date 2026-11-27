import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { SAMPLE_AD_FRAMES, SAMPLE_AD_FRAME_SECONDS, type SampleAdFrame } from "@/lib/sample-ad";

/**
 * The fictional sample ad, drawn for the inside of a <TvFrame>. Frames
 * crossfade and the progress bar fills while an <InView> ancestor is on
 * screen. Under reduced motion it holds on the first frame.
 *
 * Text is sized in cqw (the screen is a size container), so the same markup
 * works on the hero TV and the small stepper TV. Decorative: the caller
 * hides it from assistive tech.
 */
export function SampleAdScreen({ className }: { className?: string }) {
  const count = SAMPLE_AD_FRAMES.length;
  const cycle = count * SAMPLE_AD_FRAME_SECONDS;

  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{ "--ad-cycle": `${cycle}s` } as CSSProperties}
    >
      {/* Scene */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,rgba(79,142,255,0.5),transparent_55%),radial-gradient(90%_80%_at_100%_100%,rgba(167,139,250,0.4),transparent_60%),linear-gradient(160deg,#0f1a36,#0a0d18_70%)]" />
      <div className="absolute -right-[8%] -bottom-[30%] aspect-square w-[55%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgba(240,192,96,0.5),rgba(240,192,96,0.05)_60%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" />

      {/* Frames. The first one is the resting frame (paused, or reduced motion). */}
      <div className="absolute inset-0">
        {SAMPLE_AD_FRAMES.map((frame, i) => (
          <div
            key={i}
            className="ad-frame anim-loop absolute inset-0"
            style={{ "--ad-delay": `${frameDelay(i, count, cycle)}s` } as CSSProperties}
          >
            <Frame frame={frame} />
          </div>
        ))}
      </div>

      {/* Streaming ad chrome */}
      <div className="absolute top-[6%] left-[4.5%] flex items-center gap-[1.2cqw] rounded-[1cqw] bg-black/50 px-[1.8cqw] py-[0.9cqw] text-[2.3cqw] leading-none font-semibold tracking-wide text-white/90">
        <span className="anim-loop size-[1.2cqw] animate-pulse-dot rounded-full bg-gold" />
        Ad
      </div>
      <div className="absolute top-[6%] right-[4.5%] rounded-[1cqw] border border-white/15 px-[1.6cqw] py-[0.8cqw] text-[1.9cqw] leading-none font-medium tracking-wide text-white/70">
        Sample ad
      </div>
      <div className="absolute inset-x-[4.5%] bottom-[5.5%] h-[max(2px,0.7cqw)] overflow-hidden rounded-full bg-white/15">
        <div
          className="ad-progress anim-loop h-full rounded-full bg-gold"
          style={{ animationDelay: `${-LEAD_IN}s` }}
        />
      </div>
    </div>
  );
}

/**
 * Negative delays put every frame at its own point in the shared cycle, so
 * frame i is on screen during slot i. The small lead-in skips the fade-in at
 * the start of the keyframes, so frame 1 shows fully while paused.
 */
const LEAD_IN = 0.6;
function frameDelay(i: number, count: number, cycle: number) {
  const slot = ((count - i) % count) * (cycle / count);
  return -(LEAD_IN + slot);
}

function Frame({ frame }: { frame: SampleAdFrame }) {
  switch (frame.kind) {
    case "brand":
      return (
        <div className="flex h-full flex-col items-center justify-center pb-[4%] text-center">
          <LogoMark className="w-[13cqw]" />
          <p className="mt-[2.4cqw] font-display text-[7.4cqw] leading-none font-extrabold tracking-[-0.02em] text-white">
            {frame.name}
          </p>
          <p className="mt-[1.8cqw] text-[2.4cqw] font-semibold tracking-[0.22em] text-accent-soft uppercase">
            {frame.tagline}
          </p>
        </div>
      );
    case "service":
    case "area":
      return (
        <div className="absolute bottom-[15%] left-[6%] max-w-[70%]">
          <p className="flex items-center gap-[1.2cqw] text-[2.3cqw] font-semibold tracking-[0.2em] text-accent-soft uppercase">
            <LogoMark className="w-[3.4cqw]" />
            {frame.eyebrow}
          </p>
          <p className="mt-[1.6cqw] font-display text-[6.6cqw] leading-[1.02] font-bold tracking-[-0.02em] text-white">
            {frame.headline}
          </p>
          <p className="mt-[1.6cqw] text-[2.8cqw] text-white/75">{frame.detail}</p>
        </div>
      );
    case "cta":
      return (
        <div className="absolute bottom-[15%] left-[6%] max-w-[80%]">
          <p className="text-[2.3cqw] font-semibold tracking-[0.2em] text-accent-soft uppercase">
            {frame.eyebrow}
          </p>
          <p className="mt-[1.4cqw] font-display text-[7cqw] leading-none font-bold text-white tabular-nums">
            {frame.phone}
          </p>
          <p className="mt-[2.2cqw] inline-flex rounded-full bg-white px-[2.4cqw] py-[1cqw] text-[2.4cqw] font-semibold text-[#0a0b0f]">
            {frame.web}
          </p>
        </div>
      );
  }
}

/** A made-up roofline mark for the sample business. */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("h-auto shrink-0", className)} fill="none">
      <rect width="48" height="48" rx="12" fill="#4f8eff" />      <path
        d="M10 27 24 15l14 12"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M31 18.5V14h4v8" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      <path d="M16 27v8h16v-8" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}
