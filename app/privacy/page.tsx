import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { getLegalDoc } from "@/lib/legal-content";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Dioshift collects, uses and protects the information you share on our site and signup form. We don't sell your information or use ad trackers.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Privacy Policy", "/privacy")} />
      <LegalDocument doc={getLegalDoc("privacy")} />
    </>
  );
}
