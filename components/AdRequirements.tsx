import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

/** Commercial specs. Also used by the streaming TV guide. */
export const AD_SPECS: { label: string; value: string; note?: string }[] = [
  { label: "Length", value: ":30 seconds" },
  { label: "Resolution", value: "1080p", note: "1920 × 1080" },
  { label: "File type", value: "MP4", note: "Recommended" },
];

/** Commercial specs block. Shared by the homepage and /how-it-works. */
export function AdRequirements({ className = "pt-0 sm:pt-0" }: { className?: string }) {
  return (
    <Section className={className}>
      <Card className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
            Ad requirements
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            What we need from you
          </h2>
          <p className="mt-4 leading-relaxed text-text-dim">
            Don&apos;t have a commercial? No problem. Just let us know on the signup form.
          </p>
        </div>
        <dl className="grid gap-3 sm:grid-cols-3">
          {AD_SPECS.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-bg/60 p-5">
              <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
                {s.label}
              </dt>
              <dd className="mt-2 font-display text-xl font-bold">{s.value}</dd>
              {s.note && <dd className="mt-0.5 text-xs text-text-dim">{s.note}</dd>}
            </div>
          ))}
        </dl>
      </Card>
    </Section>
  );
}
