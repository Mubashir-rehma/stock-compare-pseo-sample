/**
 * Single source of truth for site-wide constants.
 * The base URL is read from NEXT_PUBLIC_SITE_URL so canonicals, the sitemap,
 * robots.txt and OG metadata all agree and can be repointed at the real
 * deploy domain without touching multiple files.
 */
export const SITE = {
  name: "Stock Compare",
  /** Honest framing: this is a work sample, not a Wisesheets property. */
  tagline: "A programmatic SEO work sample built for Wisesheets",
  author: "Mubashir Rehman",
  /** Every page is labelled with this so no figure reads as real-time. */
  asOf: "Q2 2026",
  asOfLong: "as of Q2 2026",
  wisesheetsUrl: "https://wisesheets.io",
  repoUrl: "https://github.com/mubashir-rehman/stock-compare-pseo-sample",
} as const;

/** Absolute base URL, no trailing slash. */
export const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stock-compare-pseo-sample.vercel.app"
).replace(/\/$/, "");

/** Build an absolute URL from a root-relative path. */
export function absoluteUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
