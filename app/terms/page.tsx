import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { getLegalDoc } from "@/lib/legal-content";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Dioshift's terms for streaming TV ad plans: monthly billing, the impression guarantee, cancellation with 30 days' notice, refunds and commercial rules.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Terms of Service", "/terms")} />
      <LegalDocument doc={getLegalDoc("terms")} />
    </>
  );
}
