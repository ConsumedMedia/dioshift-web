import { icons } from "@/components/icons";

const items = [
  { icon: icons.tag, label: "Prices on the page" },
  { icon: icons.badge, label: "Impressions guaranteed" },
  { icon: icons.hand, label: "We run it for you" },
  { icon: icons.openLock, label: "No contract" },
];

/** Slim row of what sets Dioshift apart. Sits directly under the hero. */
export function PositioningStrip() {
  return (
    <section aria-label="Why Dioshift" className="relative pb-16 sm:pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <ul className="reveal grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 bg-bg px-4 py-4 text-sm font-medium text-text sm:px-5 sm:text-[15px]"
            >
              <span className="text-accent-soft">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
