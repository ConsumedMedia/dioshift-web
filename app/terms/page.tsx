import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { getLegalDoc } from "@/lib/legal-content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms for Dioshift streaming TV advertising plans: billing, impressions, cancellation, refunds and your commercial.",
});

export default function TermsPage() {
  return <LegalDocument doc={getLegalDoc("terms")} />;
}
