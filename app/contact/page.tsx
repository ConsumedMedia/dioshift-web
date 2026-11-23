import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Questions about streaming TV advertising for your business? Send Dioshift a note and we'll get back to you by email.",
});

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-30%] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,142,255,0.14),transparent)]"
      />
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
            Contact
          </p>
          <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-[2.75rem]">
            Let&apos;s talk.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-pretty text-text-dim sm:text-lg">
            Questions about streaming TV for your business? Send us a note and we&apos;ll reply
            by email.
          </p>

          <Card className="mt-10">
            <h2 className="font-display text-lg font-semibold">Ready to go?</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-text-dim">
              Already know what you want? Pick a package and get your campaign started.
            </p>
            <Button href="/signup" className="mt-5">
              Get Started
            </Button>
          </Card>

          <p className="mt-6 text-sm text-text-dim">
            Looking for a quick answer?{" "}
            <Link href="/faq" className="font-medium text-accent-soft transition-colors hover:text-text">
              Check the FAQ →
            </Link>
          </p>
        </div>

        <Card className="relative p-6 sm:p-8">
          <ContactForm />
        </Card>
      </div>
    </section>
  );
}
