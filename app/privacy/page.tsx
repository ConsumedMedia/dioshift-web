import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { getLegalDoc } from "@/lib/legal-content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What information Dioshift collects through dioshift.com, how we use it and who we share it with. We don't sell your information.",
});

export default function PrivacyPage() {
  return <LegalDocument doc={getLegalDoc("privacy")} />;
}
