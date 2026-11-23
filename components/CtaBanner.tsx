import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";

type CtaBannerProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Buttons. */
  children: ReactNode;
};

/** Glowing closing call to action, styled to match the homepage's final CTA. */
export function CtaBanner({ title, subtitle, children }: CtaBannerProps) {
  return (
    <Section className="pt-0 sm:pt-0">
      <div className="relative overflow-hidden rounded-3xl border border-border-bright px-6 py-16 text-center sm:py-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(79,142,255,0.22),transparent_70%),radial-gradient(60%_80%_at_100%_100%,rgba(167,139,250,0.14),transparent_70%)]"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-[1.7rem] leading-[1.1] font-extrabold tracking-tight text-balance sm:text-5xl">
            {title}
          </h2>
          {subtitle && <p className="mx-auto mt-5 max-w-md text-text-dim">{subtitle}</p>}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">{children}</div>
        </div>
      </div>
    </Section>
  );
}
