/**
 * Slug utilities. A pair slug is `{a}-vs-{b}` with tickers lower-cased and in
 * ALPHABETICAL order (aapl-vs-msft, never msft-vs-aapl). Alphabetical ordering
 * is what makes canonical normalization possible: any other ordering or casing
 * 301-redirects to the canonical form (see middleware.ts).
 */

export interface ParsedSlug {
  a: string; // upper-case ticker
  b: string; // upper-case ticker
}

/** Parse `xxx-vs-yyy` into upper-case tickers. Returns null if malformed. */
export function parsePairSlug(slug: string): ParsedSlug | null {
  const m = /^([a-z0-9.]+)-vs-([a-z0-9.]+)$/i.exec(slug.trim());
  if (!m) return null;
  const a = m[1].toUpperCase();
  const b = m[2].toUpperCase();
  if (a === b) return null; // a stock cannot be compared with itself
  return { a, b };
}

/** Build the canonical alphabetical slug for two tickers. */
export function makePairSlug(a: string, b: string): string {
  const [x, y] = [a.toUpperCase(), b.toUpperCase()].sort();
  return `${x.toLowerCase()}-vs-${y.toLowerCase()}`;
}

/**
 * Return the canonical slug for any incoming slug, or null if it can't be
 * parsed. If the input is already canonical, the returned string equals it.
 */
export function normalizePairSlug(slug: string): string | null {
  const parsed = parsePairSlug(slug);
  if (!parsed) return null;
  return makePairSlug(parsed.a, parsed.b);
}

/** True when the slug is already in canonical (lower-case, alphabetical) form. */
export function isCanonicalSlug(slug: string): boolean {
  return normalizePairSlug(slug) === slug;
}
