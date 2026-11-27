import { icons } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

const trustBadges = [
  { icon: icons.lock, label: "Secure checkout with Stripe" },
  { icon: icons.openLock, label: "No contract" },
  { icon: icons.badge, label: "Impressions guaranteed" },
  { icon: icons.pin, label: "Based in Columbus, Ohio" },
];

/** Homepage closing call to action, with trust badges and the local line. */
export function FinalCta() {
  return (
    <Section className="pt-0 sm:pt-0" data-sticky-cta-stop>
      <div className="relative overflow-hidden rounded-3xl border border-border-bright px-6 py-16 text-center sm:py-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(79,142,255,0.22),transparent_70%),radial-gradient(60%_80%_at_100%_100%,rgba(167,139,250,0.14),transparent_70%)]"
        />
        <div className="relative">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
            A Columbus team, not a call center.
          </p>
          <h2 className="mx-auto max-w-2xl font-display text-[1.7rem] leading-[1.1] font-extrabold tracking-tight text-balance sm:text-5xl">
            Your customers are watching. Be on their screen.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-text-dim">
            Pick a plan, send your spot, and we&apos;ll take it from there.
          </p>
          <div className="mt-9 flex justify-center">
            <Button href="/signup" size="lg">
              Get Started
            </Button>
          </div>
          <p className="mt-4 text-sm text-text-dim">
            Cancel anytime. We ask for <span className="whitespace-nowrap">30 days&apos;</span>{" "}
            notice.
          </p>

          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-border pt-8 text-xs text-text-muted sm:text-sm">
            {trustBadges.map((b) => (
              <li key={b.label} className="flex items-center gap-2">
                <span className="text-text-dim [&_svg]:size-4">{b.icon}</span>
                {b.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
