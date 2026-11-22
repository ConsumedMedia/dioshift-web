import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function Page() {
  return <ComingSoon title="Frequently Asked Questions" />;
}
