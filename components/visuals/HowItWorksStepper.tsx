import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { InView } from "./InView";
import { StepVisual, type StepVisualKind } from "./StepVisuals";

export type StepperStep = {
  title: string;
  body: ReactNode;
  /** Extra content under the body, inside the card. */
  extra?: ReactNode;
  visual: StepVisualKind;
};

/**
 * Numbered steps that light up in order as they scroll into view: the
 * number fills, then the line to the next step, while the step's visual
 * plays to its final state. Step text is always fully visible; only the
 * decoration changes. Under reduced motion everything starts finished.
 */
export function HowItWorksStepper({ steps, className }: { steps: StepperStep[]; className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <InView
            as="li"
            mode="once"
            rootMargin="0px 0px -30% 0px"
            key={step.title}
            className="relative flex gap-4 pb-8 last:pb-0 sm:gap-7"
          >
            {/* Number and connecting line */}
            <div className="relative flex flex-col items-center">
              <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-border-bright bg-surface font-display text-sm font-bold text-text-dim transition-[background-color,border-color,color,box-shadow] duration-500 lit:border-accent lit:bg-accent lit:text-white lit:shadow-[0_0_24px_-2px_rgba(79,142,255,0.7)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {!last && (
                <span
                  aria-hidden
                  className="absolute top-11 -bottom-8 w-px overflow-hidden bg-border-bright"
                >
                  <span className="block size-full origin-top scale-y-0 bg-linear-to-b from-accent to-accent/40 transition-transform delay-500 duration-1000 ease-out lit:scale-y-100" />
                </span>
              )}
            </div>

            <Card className="grid min-w-0 flex-1 gap-6 md:grid-cols-[minmax(0,1fr)_260px] md:items-center md:gap-8">
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-text-dim">{step.body}</p>
                {step.extra}
              </div>
              <div className="min-w-0">
                <StepVisual kind={step.visual} />
              </div>
            </Card>
          </InView>
        );
      })}
    </ol>
  );
}
