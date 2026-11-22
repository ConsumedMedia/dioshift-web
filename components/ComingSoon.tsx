import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Temporary page body so nav links resolve while real pages are built. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <Section className="flex min-h-[60vh] items-center" containerClassName="text-center">
      <SectionHeading as="h1" eyebrow="Coming soon" title={title} subtitle="We're still building this page. Check back shortly." />
      <div className="mt-10 flex justify-center">
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </Section>
  );
}
