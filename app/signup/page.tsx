import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { SignupForm } from "@/components/signup/SignupForm";
import { Card } from "@/components/ui/Card";
import { getPackageById } from "@/lib/packages";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Get Started",
  description:
    "Pick your monthly reach, tell us about your business and who you want to reach, and get your commercial on streaming TV.",
});

export default function SignupPage({ searchParams }: PageProps<"/signup">) {
  return (
    <>
      <PageHero
        eyebrow="Get started"
        title="Put your business on streaming TV today."
        subtitle="Pick a plan, tell us who to reach, and send your commercial. It takes about five minutes."
      />
      {/*
        The hero above is prerendered. Only the form waits on the URL
        (?package=), so it streams in at request time inside this boundary.
      */}
      <Suspense fallback={<SignupFormFallback />}>
        {searchParams.then(({ package: pkg }) => (
          <SignupForm initialPackageId={getPackageById(typeof pkg === "string" ? pkg : undefined)?.id} />
        ))}
      </Suspense>
    </>
  );
}

function SignupFormFallback() {
  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-8 px-4 pb-20 sm:px-6 sm:pb-28 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10 lg:px-8">
      <Card className="p-5 sm:p-8" aria-busy>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="h-1.5 rounded-full bg-white/10" />
          ))}
        </div>
        <div className="mt-10 h-7 w-48 rounded-lg bg-white/[0.06]" />
        <div className="mt-3 h-4 w-full max-w-md rounded bg-white/[0.04]" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-36 rounded-xl border border-border bg-white/[0.02]" />
          ))}
        </div>
        <span className="sr-only">Loading the signup form</span>
      </Card>
      <div className="hidden h-72 rounded-2xl border border-border bg-white/[0.02] lg:block" />
    </div>
  );
}
