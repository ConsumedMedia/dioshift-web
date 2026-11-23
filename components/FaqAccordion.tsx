"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { FaqGroup } from "@/lib/faq";

/**
 * Accessible FAQ accordion. One answer open at a time across all groups.
 * Headers are real buttons (Enter/Space toggle). Up/Down/Home/End move
 * between questions.
 */
export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const buttons = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>("button[data-faq-trigger]") ?? [],
    );
    const i = buttons.indexOf(e.currentTarget);
    const target =
      e.key === "ArrowDown" ? buttons[(i + 1) % buttons.length]
      : e.key === "ArrowUp" ? buttons[(i - 1 + buttons.length) % buttons.length]
      : e.key === "Home" ? buttons[0]
      : e.key === "End" ? buttons[buttons.length - 1]
      : undefined;
    if (target) {
      e.preventDefault();
      target.focus();
    }
  };

  return (
    <div ref={rootRef} className="space-y-14">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`faq-group-${group.id}`}>
          <h2
            id={`faq-group-${group.id}`}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft"
          >
            {group.title}
          </h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-linear-to-b from-white/[0.035] to-white/[0.01]">
            {group.items.map((item) => {
              const open = openId === item.id;
              const triggerId = `faq-q-${item.id}`;
              const panelId = `faq-a-${item.id}`;
              return (
                <div key={item.id}>
                  <h3>
                    <button
                      type="button"
                      id={triggerId}
                      data-faq-trigger
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenId(open ? null : item.id)}
                      onKeyDown={onKeyDown}
                      className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left font-display text-base font-semibold text-text transition-colors hover:bg-white/[0.025] focus-visible:rounded-none focus-visible:outline-offset-[-2px] sm:px-6 sm:text-lg"
                    >
                      {item.question}
                      <span
                        aria-hidden
                        className={cn(
                          "relative flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                          open ? "border-accent/40 bg-accent-glow" : "border-border-bright",
                        )}
                      >
                        <span className="absolute h-[1.5px] w-3 rounded bg-text-dim" />
                        <span
                          className={cn(
                            "absolute h-3 w-[1.5px] rounded bg-text-dim transition-transform duration-200",
                            open && "scale-y-0",
                          )}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    inert={!open}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-6 sm:px-6">
                        <p className="max-w-2xl leading-relaxed text-text-dim">{item.answer}</p>
                        {item.links && (
                          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                            {item.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-accent-soft transition-colors hover:text-text"
                              >
                                {link.label} →
                              </Link>
                            ))}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
