import { PageHero } from "@/components/PageHero";
import { cn } from "@/lib/cn";
import type { LegalDoc } from "@/lib/legal-content";

/**
 * Long-form styles for the rendered markdown, applied by element. Written as
 * Tailwind arbitrary variants so they're generated like any other utility.
 */
const PROSE = cn(
  "text-base leading-[1.75] text-text-dim [overflow-wrap:break-word]",
  "[&>:first-child]:mt-0 [&_p]:mb-[1.1em] [&_ul]:mb-[1.1em] [&_ol]:mb-[1.1em]",
  "[&_h2]:mt-[2.6em] [&_h2]:mb-[0.8em] [&_h2]:border-t [&_h2]:border-border [&_h2]:pt-[1.6em]",
  "[&_h2]:font-display [&_h2]:text-[1.3rem] [&_h2]:font-bold [&_h2]:leading-[1.3] [&_h2]:tracking-[-0.01em] [&_h2]:text-text",
  "[&_h3]:mt-[1.8em] [&_h3]:mb-[0.6em] [&_h3]:font-display [&_h3]:text-[1.08rem] [&_h3]:font-semibold [&_h3]:leading-[1.4] [&_h3]:text-text",
  "[&_strong]:font-semibold [&_strong]:text-text",
  "[&_ul]:list-disc [&_ul]:pl-[1.3em] [&_ol]:list-decimal [&_ol]:pl-[1.4em]",
  "[&_li]:my-[0.45em] [&_li]:pl-[0.2em] [&_li::marker]:text-accent",
  "[&_a]:text-accent-soft [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:decoration-accent-soft/40",
  "[&_a:hover]:text-text [&_a:hover]:decoration-current",
);

/**
 * Long-form layout for the Terms and Privacy pages: a small table of contents,
 * then the document. The HTML comes from our own markdown in content/legal,
 * rendered at build time, never from user input.
 */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={doc.title} />

      <div className="relative mx-auto w-full max-w-[70ch] px-4 pb-20 sm:px-6 sm:pb-28">
        {doc.toc.length > 0 && (
          <nav
            aria-labelledby="legal-toc-heading"
            className="mb-12 rounded-2xl border border-border bg-linear-to-b from-white/[0.035] to-white/[0.01] px-5 py-5 sm:px-6"
          >
            <h2
              id="legal-toc-heading"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft"
            >
              On this page
            </h2>
            <ol className="mt-4 grid gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2">
              {doc.toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-text-dim underline-offset-4 transition-colors hover:text-text hover:underline"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <article className={PROSE} dangerouslySetInnerHTML={{ __html: doc.html }} />
      </div>
    </>
  );
}
