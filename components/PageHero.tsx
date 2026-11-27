import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BreadcrumbItem } from "@/lib/structured-data";

/** Top-of-page heading for inner pages, with the same soft glow as the homepage hero. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /**
   * Trail after "Home", ending with this page. Renders the visible
   * breadcrumbs and their BreadcrumbList structured data.
   */
  breadcrumbs?: BreadcrumbItem[];
  /** Extra content under the heading, such as buttons. */
  children?: ReactNode;
}) {
  return (
    <section data-sticky-cta-start className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-30%] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,142,255,0.14),transparent)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {breadcrumbs && <Breadcrumbs trail={breadcrumbs} className="mb-8" />}
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} subtitle={subtitle} />
        {children}
      </div>
    </section>
  );
}
