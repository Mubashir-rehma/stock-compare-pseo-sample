import { NextResponse, type NextRequest } from "next/server";
import { normalizePairSlug } from "@/lib/slug";

/**
 * Canonical normalization at the routing layer (P3-T2). Any non-canonical
 * comparison slug — reversed order (msft-vs-aapl) or wrong case (AAPL-VS-MSFT)
 * — is 301-redirected to the single canonical alphabetical, lower-case slug.
 * This closes the duplicate-content trap before a page is ever rendered, so
 * only one URL per pair is ever indexed.
 *
 * NOTE: In Next.js 16 the `middleware.ts` convention was renamed to `proxy.ts`
 * (same edge mechanism). See DECISIONS.md D6.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const match = /^\/compare\/([^/]+)\/?$/.exec(pathname);
  if (!match) return NextResponse.next();

  const slug = decodeURIComponent(match[1]);
  const canonical = normalizePairSlug(slug);

  if (canonical && canonical !== slug) {
    const url = req.nextUrl.clone();
    url.pathname = `/compare/${canonical}`;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  // Single-segment compare routes only; leaves the hub and OG image routes alone.
  matcher: "/compare/:slug",
};
