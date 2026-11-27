import { icons } from "@/components/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

type Mark = "yes" | "no";
type Cell = { text: string; mark?: Mark };

type ComparisonRow = {
  label: string;
  dioshift: Cell;
  selfServe: Cell;
  localTv: Cell;
};

const COLUMNS = [
  { key: "dioshift", label: "Dioshift" },
  { key: "selfServe", label: "Self-serve streaming platforms" },
  { key: "localTv", label: "Traditional local TV" },
] as const;

const ROWS: ComparisonRow[] = [
  {
    label: "Who sets it up",
    dioshift: { text: "We do", mark: "yes" },
    selfServe: { text: "You do" },
    localTv: { text: "You and a station rep" },
  },
  {
    label: "Price on the website",
    dioshift: { text: "Yes, every plan", mark: "yes" },
    selfServe: { text: "Sometimes" },
    localTv: { text: "Rarely", mark: "no" },
  },
  {
    label: "Guaranteed impressions",
    dioshift: { text: "Yes, every month", mark: "yes" },
    selfServe: { text: "Usually not", mark: "no" },
    localTv: { text: "Based on ratings estimates" },
  },
  {
    label: "Contract",
    dioshift: { text: "None. Cancel anytime", mark: "yes" },
    selfServe: { text: "Varies" },
    localTv: { text: "Often required" },
  },
  {
    label: "Target by zip code or radius",
    dioshift: { text: "Yes", mark: "yes" },
    selfServe: { text: "Yes" },
    localTv: { text: "Usually the whole market", mark: "no" },
  },
  {
    label: "Help with your commercial",
    dioshift: { text: "Yes, we can make one", mark: "yes" },
    selfServe: { text: "Some offer tools" },
    localTv: { text: "Usually extra" },
  },
];

function Value({ cell, highlight }: { cell: Cell; highlight?: boolean }) {
  return (
    <span className="inline-flex items-start gap-2">
      {cell.mark && (
        <span
          className={cn(
            "mt-0.5",
            cell.mark === "yes" ? "text-accent-soft" : "text-text-muted",
          )}
        >
          {cell.mark === "yes" ? icons.check : icons.dash}
        </span>
      )}
      <span className={highlight ? "font-medium text-text" : "text-text-dim"}>{cell.text}</span>
    </span>
  );
}

/** Dioshift vs. the two usual alternatives. Table on md and up, stacked cards on phones. */
export function ComparisonTable() {
  return (
    <Section className="border-t border-border">
      <SectionHeading
        eyebrow="Compare"
        title="How Dioshift compares."
        subtitle="There are a few ways to get your business on TV. Here's how they usually stack up for a local business."
      />

      {/* Desktop and tablet: a real table. */}
      <div className="reveal mt-14 hidden md:block">
        <table className="w-full table-fixed border-separate border-spacing-0 text-left text-[15px]">
          <caption className="sr-only">
            Dioshift compared with self-serve streaming platforms and traditional local TV
          </caption>
          <colgroup>
            <col className="w-[28%]" />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <td className="p-0" />
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-5 pt-5 pb-4 align-bottom font-display text-base font-semibold",
                    col.key === "dioshift"
                      ? "rounded-t-2xl border-x border-t border-accent/50 bg-accent-glow/50 text-text"
                      : "text-text-dim",
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => {
              const last = i === ROWS.length - 1;
              return (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="border-t border-border py-4 pr-5 align-top font-medium text-text"
                  >
                    {row.label}
                  </th>
                  {COLUMNS.map((col) => {
                    const isDioshift = col.key === "dioshift";
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          "border-t px-5 py-4 align-top",
                          isDioshift
                            ? "border-x border-x-accent/50 border-t-accent/20 bg-accent-glow/50"
                            : "border-border",
                          isDioshift && last && "rounded-b-2xl border-b border-b-accent/50",
                        )}
                      >
                        <Value cell={row[col.key]} highlight={isDioshift} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Phones: one card per row, three values each. */}
      <ul className="reveal mt-12 space-y-4 md:hidden">
        {ROWS.map((row) => (
          <li
            key={row.label}
            className="rounded-2xl border border-border bg-linear-to-b from-white/[0.035] to-white/[0.01] p-5"
          >
            <h3 className="font-display text-base font-semibold">{row.label}</h3>
            <dl className="mt-4 space-y-3 text-[15px]">
              {COLUMNS.map((col) => {
                const isDioshift = col.key === "dioshift";
                return (
                  <div
                    key={col.key}
                    className={cn(
                      "rounded-xl px-4 py-3",
                      isDioshift ? "border border-accent/40 bg-accent-glow/50" : "bg-white/[0.02]",
                    )}
                  >
                    <dt
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wider",
                        isDioshift ? "text-accent-soft" : "text-text-muted",
                      )}
                    >
                      {col.label}
                    </dt>
                    <dd className="mt-1">
                      <Value cell={row[col.key]} highlight={isDioshift} />
                    </dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ul>
    </Section>
  );
}
