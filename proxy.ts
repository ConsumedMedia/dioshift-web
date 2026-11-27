import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/session-token";
import { getPublishedIndustry } from "@/lib/industries";

export const config = {
  matcher: ["/industries/:slug", "/admin/:path*", "/api/admin/:path*"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/")) {
    return adminGate(request);
  }
  return industry404(request);
}

/*
 * Real 404 status for industry pages that don't exist or aren't published.
 *
 * With Cache Components the page's own notFound() runs after the static
 * shell has started streaming, so the status stays 200 (a "soft 404" with
 * a noindex tag). Checking the slug here, before rendering starts, is the
 * approach the Next.js docs recommend for a true 404. The page still calls
 * notFound() as a backstop.
 */
function industry404(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  if (getPublishedIndustry(decodeURIComponent(slug))) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
}

/** Sign-in pages, open to everyone. */
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/auth/"];

/*
 * First layer only: turns away requests without a validly signed session
 * cookie with a real redirect (or a 401 for API routes) before any
 * rendering. It can't tell whether the admin was removed since signing in;
 * requireAdmin() in every page, Server Action and Route Handler does that.
 */
async function adminGate(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p));

  let response: NextResponse;
  if (isPublic || (await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value))) {
    response = NextResponse.next();
  } else if (pathname.startsWith("/api/")) {
    response = NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  } else {
    response = NextResponse.redirect(new URL("/admin/login", request.url));
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
