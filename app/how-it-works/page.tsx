import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "How It Works",
};

export default function Page() {
  return <ComingSoon title="How It Works" />;
}
