"use client";

import { useEffect, useRef, type ComponentProps, type ElementType } from "react";

type InViewProps<T extends ElementType> = {
  as?: T;
  /**
   * "play": toggles data-playing while on screen, so looping CSS animations
   * run only when visible.
   * "once": sets data-lit the first time it enters view, and leaves it set.
   */
  mode?: "play" | "once";
  rootMargin?: string;
  threshold?: number;
} & Omit<ComponentProps<T>, "as">;

/**
 * Marks an element with a data attribute while it's on screen. All motion
 * lives in CSS (see app/visuals.css), keyed off data-playing and data-lit, so
 * this is the only JavaScript the visuals need.
 */
export function InView<T extends ElementType = "div">({
  as,
  mode = "play",
  rootMargin,
  threshold = 0,
  ...props
}: InViewProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag: ElementType = as ?? "div";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const attr = mode === "once" ? "data-lit" : "data-playing";

    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute(attr, "");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute(attr, "");
          if (mode === "once") observer.disconnect();
        } else if (mode === "play") {
          el.removeAttribute(attr);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, rootMargin, threshold]);

  return <Tag ref={ref} {...props} />;
}
