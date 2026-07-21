/**
 * The curation gate — encoded as a function, not prose.
 *
 * This is the anti-thin-content control. Editorial curation happens first when a
 * pair is added to `pairs.ts` at all; this automated quality gate then decides
 * which of those pairs are good enough to INDEX. The sitemap and each page's
 * `robots` meta both call `shouldIndex()`, so indexing has exactly one source of
 * truth. A pair that renders but fails the gate is served with `noindex, follow`
 * and kept out of the sitemap (see the noindex demo pair).
 *
 * Rules (all must hold to index):
 *  1. Both tickers exist in the seed data.
 *  2. Same sector OR a documented rivalry (rivals can be cross-sector).
 *  3. Both companies are >= $10B market cap (real comparison demand, not thin).
 *  4. Data completeness >= 90% for each ticker (enough to fill the table).
 *
 * No import of pairs.ts here — keeps the dependency one-directional
 * (pairs.ts -> curation.ts) and avoids a cycle.
 */
import { completenessRatio, getTicker, type Ticker } from "@/data/tickers";

export const MIN_MARKET_CAP_B = 10;
export const MIN_COMPLETENESS = 0.9;

/**
 * Cross-sector pairs with a recognised competitive rivalry, so they pass the
 * "same sector" test on the strength of documented head-to-head search demand.
 * Slugs are always alphabetical (see normalizeSlug).
 */
export const DOCUMENTED_RIVALRIES = new Set<string>([
  "aapl-vs-googl", // mobile platform / ecosystem rivals
  "amzn-vs-wmt", // retail rivals (online vs big-box)
]);

export interface CurationCheck {
  label: string;
  pass: boolean;
  detail: string;
}

export interface CurationReport {
  index: boolean;
  checks: CurationCheck[];
  /** Human-readable reasons a pair failed, for the dev-note and README. */
  failedReasons: string[];
}

/** Evaluate every gate rule and return a full report (used by check:data + dev-note). */
export function curationReport(
  aSym: string,
  bSym: string,
  slug: string,
): CurationReport {
  const a = getTicker(aSym);
  const b = getTicker(bSym);

  const checks: CurationCheck[] = [];

  const bothExist = Boolean(a && b);
  checks.push({
    label: "Both tickers exist",
    pass: bothExist,
    detail: bothExist
      ? `${aSym} and ${bSym} are in the dataset`
      : `Missing: ${[!a && aSym, !b && bSym].filter(Boolean).join(", ")}`,
  });

  if (a && b) {
    const sameSector = a.sector === b.sector;
    const rivalry = DOCUMENTED_RIVALRIES.has(slug);
    checks.push({
      label: "Same sector or documented rivalry",
      pass: sameSector || rivalry,
      detail: sameSector
        ? `both in ${a.sector}`
        : rivalry
          ? "cross-sector but a documented rivalry"
          : `cross-sector (${a.sector} vs ${b.sector}), no documented rivalry`,
    });

    const capOk = a.marketCapB >= MIN_MARKET_CAP_B && b.marketCapB >= MIN_MARKET_CAP_B;
    checks.push({
      label: `Both >= $${MIN_MARKET_CAP_B}B market cap`,
      pass: capOk,
      detail: `${aSym} $${a.marketCapB}B, ${bSym} $${b.marketCapB}B`,
    });

    const compA = completenessRatio(a);
    const compB = completenessRatio(b);
    const compOk = compA >= MIN_COMPLETENESS && compB >= MIN_COMPLETENESS;
    checks.push({
      label: `Data completeness >= ${Math.round(MIN_COMPLETENESS * 100)}%`,
      pass: compOk,
      detail: `${aSym} ${Math.round(compA * 100)}%, ${bSym} ${Math.round(compB * 100)}%`,
    });
  }

  const index = checks.every((c) => c.pass);
  const failedReasons = checks.filter((c) => !c.pass).map((c) => `${c.label} — ${c.detail}`);
  return { index, checks, failedReasons };
}

/** The single boolean the sitemap and per-page robots meta both consume. */
export function shouldIndex(aSym: string, bSym: string, slug: string): boolean {
  return curationReport(aSym, bSym, slug).index;
}

/** Convenience overload for callers that already hold Ticker objects. */
export function shouldIndexTickers(a: Ticker, b: Ticker, slug: string): boolean {
  return shouldIndex(a.symbol, b.symbol, slug);
}
