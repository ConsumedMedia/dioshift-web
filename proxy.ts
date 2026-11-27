import { NextResponse, type NextRequest } from "next/server";
import { getPublishedIndustry } from "@/lib/industries";

/*
 * Real 404 status for industry pages that don't exist or aren't published.
 *
 * With Cache Components the page's own notFound() runs after the static
 * shell has started streaming, so the status stays 200 (a "soft 404" with
 * a noindex tag). Checking the slug here, before rendering starts, is the
 * approach the Next.js docs recommend for a true 404. The page still calls
 * notFound() as a backstop.
 */
export const config = {
  matcher: "/industries/:slug",
};

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  if (getPublishedIndustry(decodeURIComponent(slug))) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
}
