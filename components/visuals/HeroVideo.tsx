"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = { mp4: string; webm?: string; poster?: string };

/**
 * Muted looping hero video. Playback is started from here rather than with
 * the autoplay attribute, so it can wait for the video to be on screen,
 * pause when it scrolls away, and never start for visitors who prefer
 * reduced motion (they see the poster, or the first frame).
 */
export function HeroVideo({ mp4, webm, poster }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React doesn't reliably set the muted attribute, and browsers only
    // allow unprompted playback when muted.
    video.muted = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const sync = () => {
      if (visible && !reduce.matches) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    reduce.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      reduce.removeEventListener("change", sync);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster || undefined}
      tabIndex={-1}
    >
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
