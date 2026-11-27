"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { getPackageRange, formatPrice } from "@/lib/packages";

/** Pages that never get the bar: the signup flow and the legal pages. */
const EXCLUDED = ["/signup", "/terms", "/privacy"];

const isExcluded = (pathname: string) =>
  EXCLUDED.some((p) => pathname === p || pathname.startsWith(`${p}/`));

const startingPrice = formatPrice(getPackageRange().min.monthlyPrice);

/**
 * Small "Get Started" bar pinned to the bottom of the screen on phones
 * (hidden from md up). It appears once the visitor scrolls past the element
 * marked data-sticky-cta-start (the hero) and hides while any element marked
 * data-sticky-cta-stop (the final CTA, the footer) is on screen. Pages
 * without a start marker never show it.
 */
export function StickyMobileCta() {
  const pathname = usePathname();
  const excluded = isExcluded(pathname);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (excluded) return;

    const start = document.querySelector("[data-sticky-cta-start]");
    const stops = Array.from(document.querySelectorAll("[data-sticky-cta-stop]"));
    if (!start) return;

    let pastStart = false;
    const stopsInView = new Set<Element>();
    const update = () => setVisible(pastStart && stopsInView.size === 0);

    const startObserver = new IntersectionObserver(([entry]) => {
      pastStart = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    startObserver.observe(start);

    const stopObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) stopsInView.add(entry.target);
        else stopsInView.delete(entry.target);
      }
      update();
    });
    stops.forEach((el) => stopObserver.observe(el));

    // Reserve room at the bottom of the page (phones only, see globals.css)
    // so the bar never covers the last bit of content.
    document.documentElement.dataset.stickyCta = "";

    return () => {
      startObserver.disconnect();
      stopObserver.disconnect();
      delete document.documentElement.dataset.stickyCta;
      setVisible(false);
    };
  }, [excluded, pathname]);

  if (excluded) return null;

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border-bright bg-bg/90 backdrop-blur-xl backdrop-saturate-150 transition-[translate,opacity] duration-300 md:hidden",
        "pb-[env(safe-area-inset-bottom)]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <p className="text-sm text-text-dim">
          From <span className="font-display font-bold text-text tabular-nums">{startingPrice}</span>/mo
        </p>
        <Button href="/signup" size="sm" className="h-10 px-5">
          Get Started
        </Button>
      </div>
    </div>
  );
}
