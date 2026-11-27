import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { cn } from "@/lib/cn";
import { breadcrumbListJsonLd, type BreadcrumbItem } from "@/lib/structured-data";

/**
 * Visible breadcrumb trail plus its BreadcrumbList structured data, built
 * from the same list so the two can't disagree. "Home" is added for you.
 * The last item is the current page.
 */
export function Breadcrumbs({
  trail,
  align = "center",
  className,
}: {
  trail: BreadcrumbItem[];
  align?: "center" | "left";
  className?: string;
}) {
  const items: BreadcrumbItem[] = [{ name: "Home", path: "/" }, ...trail];

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(items)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol
          className={cn(
            "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted sm:text-sm",
            align === "center" && "justify-center",
          )}
        >
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-text-dim">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="transition-colors hover:text-text">
                      {item.name}
                    </Link>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5 opacity-60" aria-hidden>
                      <path
                        fillRule="evenodd"
                        d="M7.2 4.2a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06L8.26 15.8a.75.75 0 1 1-1.06-1.06L11.94 10 7.2 5.26a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
