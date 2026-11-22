import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Get Started",
};

export default function Page() {
  return <ComingSoon title="Get Started" />;
}
