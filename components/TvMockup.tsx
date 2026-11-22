/**
 * Decorative TV with a sample ad playing. Pure CSS, no images.
 */
export function TvMockup() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px] select-none">
      {/* Glow behind the set */}
      <div className="absolute -inset-x-10 top-6 bottom-10 rounded-[50%] bg-[radial-gradient(closest-side,rgba(79,142,255,0.35),rgba(167,139,250,0.12)_55%,transparent)] blur-2xl" />

      {/* Bezel */}
      <div className="relative rounded-[18px] border border-white/10 bg-[#07080b] p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-2.5">
        {/* Screen */}
        <div className="relative aspect-video overflow-hidden rounded-[11px] bg-[#0b1020]">
          {/* Scene */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,rgba(79,142,255,0.55),transparent_55%),radial-gradient(90%_80%_at_100%_100%,rgba(167,139,250,0.45),transparent_60%),linear-gradient(160deg,#0f1a36,#0a0d18_70%)]" />
          <div className="absolute -right-[8%] -bottom-[30%] aspect-square w-[55%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgba(240,192,96,0.55),rgba(240,192,96,0.05)_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" />

          {/* Ad badge */}
          <div className="absolute top-[6%] left-[4.5%] flex items-center gap-1.5 rounded-md bg-black/45 px-2 py-1 text-[9px] font-semibold tracking-wide text-white/90 backdrop-blur sm:text-[11px]">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-gold" />
            AD
          </div>
          <div className="absolute top-[6%] right-[4.5%] rounded-md bg-black/45 px-2 py-1 font-mono text-[9px] text-white/75 backdrop-blur sm:text-[11px]">
            0:30
          </div>

          {/* Ad copy */}
          <div className="absolute bottom-[15%] left-[6%] max-w-[62%]">
            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-accent-soft sm:text-[11px]">
              Now open on Main St.
            </p>
            <p className="mt-1 font-display text-[17px] leading-[1.05] font-bold text-white sm:mt-1.5 sm:text-[30px]">
              Your Business
              <br />
              Here.
            </p>
            <div className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[8px] font-semibold text-[#0a0b0f] sm:mt-3 sm:px-3.5 sm:text-[11px]">
              Visit us today
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute inset-x-[4.5%] bottom-[6%] h-[3px] overflow-hidden rounded-full bg-white/15">
            <div className="h-full origin-left animate-ad-progress rounded-full bg-gold" />
          </div>

          {/* Glass reflection */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_35%)]" />
        </div>
      </div>

      {/* Stand */}
      <div className="relative mx-auto h-5 w-[22%] bg-linear-to-b from-[#15171d] to-[#0c0d11] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
      <div className="relative mx-auto h-1.5 w-[38%] rounded-full bg-[#15171d] shadow-[0_8px_24px_rgba(0,0,0,0.6)]" />
    </div>
  );
}
