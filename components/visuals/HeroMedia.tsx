import { HeroVideo } from "./HeroVideo";
import { InView } from "./InView";
import { SampleAdScreen } from "./SampleAdScreen";
import { TvFrame } from "./TvFrame";

/**
 * Set at build time in next.config.ts from what's in public/media.
 * Drop in public/media/hero-loop.mp4 (and optionally hero-loop.webm and
 * hero-poster.jpg) and rebuild to switch the hero to video mode.
 */
const HERO_VIDEO = {
  mp4: process.env.HERO_VIDEO_MP4 ?? "",
  webm: process.env.HERO_VIDEO_WEBM ?? "",
  poster: process.env.HERO_POSTER ?? "",
};

/**
 * The hero TV in a hint of a living room. Plays the hero video if one was
 * found at build time, otherwise the animated sample ad. Decorative.
 */
export function HeroMedia() {
  return (
    <div
      aria-hidden
      data-hero-mode={HERO_VIDEO.mp4 ? "video" : "animated"}
      className="relative mx-auto w-full max-w-[560px] select-none"
    >
      {/* Warm lamp light on the wall */}
      <div className="absolute top-[-6%] right-[-6%] aspect-square w-[46%] rounded-full bg-[radial-gradient(closest-side,rgba(240,192,96,0.16),transparent)]" />
      {/* Screen glow */}
      <div className="absolute -inset-x-6 top-6 bottom-16 rounded-[50%] bg-[radial-gradient(closest-side,rgba(79,142,255,0.32),rgba(167,139,250,0.1)_55%,transparent)] blur-2xl sm:-inset-x-10" />

      <div className="relative flex items-end gap-[4%]">
        <TvFrame className="w-[86%]">
          {HERO_VIDEO.mp4 ? (
            <HeroVideo
              mp4={HERO_VIDEO.mp4}
              webm={HERO_VIDEO.webm || undefined}
              poster={HERO_VIDEO.poster || undefined}
            />
          ) : (
            <InView className="absolute inset-0">
              <SampleAdScreen />
            </InView>
          )}
        </TvFrame>
        <FloorLamp className="w-[10%]" />
      </div>

      {/* Low console the TV sits on */}
      <div className="relative mt-[-1px] h-[7px] w-[74%] translate-x-[2%] rounded-full bg-linear-to-b from-[#1a1d24] to-[#0e1015] shadow-[0_10px_30px_rgba(0,0,0,0.6)]" />

      <Couch className="relative mt-[7%]" />
    </div>
  );
}

/** A thin floor lamp. Sized by width; the viewBox fixes its height. */
function FloorLamp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 260" className={className} fill="none">
      <defs>
        <linearGradient id="hero-lamp-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c060" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f0c060" stopOpacity="0.18" />
        </linearGradient>
        <radialGradient id="hero-lamp-light" cx="50%" cy="0%" r="100%">
          <stop offset="0" stopColor="#f0c060" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f0c060" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="60" rx="20" ry="34" fill="url(#hero-lamp-light)" />
      <path d="M9 12h22l7 34H2L9 12Z" fill="url(#hero-lamp-shade)" stroke="#f0c060" strokeOpacity="0.35" />
      <path d="M20 46v206" stroke="#2a2e38" strokeWidth="2" />
      <ellipse cx="20" cy="254" rx="12" ry="3" fill="#1a1d24" />
    </svg>
  );
}

/** The back of a couch in the foreground, fading into the floor. */
function Couch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 70" className={className} fill="none" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="hero-couch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1f28" />
          <stop offset="1" stopColor="#0a0b0f" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="4" y="8" width="64" height="70" rx="22" fill="url(#hero-couch)" stroke="rgba(255,255,255,0.06)" />
      <rect x="492" y="8" width="64" height="70" rx="22" fill="url(#hero-couch)" stroke="rgba(255,255,255,0.06)" />
      <rect x="52" y="20" width="456" height="60" rx="20" fill="url(#hero-couch)" stroke="rgba(255,255,255,0.07)" />
      <path d="M280 26v44" stroke="rgba(255,255,255,0.05)" />
    </svg>
  );
}
