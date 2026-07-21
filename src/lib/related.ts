/**
 * Related-comparisons algorithm (P4-T3). Deterministic: for a given pair it
 * always returns the same ordered list, so the internal link graph is stable
 * across builds. Priority:
 *   1. pairs sharing a ticker with the current pair
 *   2. pairs in the same sector (either ticker's sector)
 *   3. other indexable pairs, to guarantee a minimum count
 * The noindex pair is never surfaced (no internal links into it from content
 * pages — only the homepage dev-note links to it).
 */
import { INDEXABLE_PAIRS, type Pair } from "@/data/pairs";
import { requireTicker } from "@/data/tickers";

export interface RelatedLink {
  slug: string;
  label: string; // "AAPL vs GOOGL"
  reason: string; // why it's related (also used as descriptive context)
}

function label(p: Pair): string {
  return `${p.a} vs ${p.b}`;
}

export function getRelated(pair: Pair, limit = 6): RelatedLink[] {
  if (!pair.index) return []; // thin pair gets no outbound related links

  const aSector = requireTicker(pair.a).sector;
  const bSector = requireTicker(pair.b).sector;

  const candidates = INDEXABLE_PAIRS.filter((p) => p.slug !== pair.slug);

  const scored = candidates.map((p) => {
    const sharesTicker = p.a === pair.a || p.a === pair.b || p.b === pair.a || p.b === pair.b;
    const pSectors = [requireTicker(p.a).sector, requireTicker(p.b).sector];
    const sharesSector = pSectors.includes(aSector) || pSectors.includes(bSector);

    let score = 0;
    let reason = "Another popular comparison";
    if (sharesTicker) {
      score = 3;
      const shared = [pair.a, pair.b].find((t) => p.a === t || p.b === t);
      reason = `Also features ${shared}`;
    } else if (sharesSector) {
      score = 2;
      reason = `Same sector`;
    }
    return { p, score, reason };
  });

  // Sort by score desc, then slug asc for deterministic tie-breaking.
  scored.sort((x, y) => (y.score - x.score) || x.p.slug.localeCompare(y.p.slug));

  return scored.slice(0, limit).map(({ p, reason }) => ({
    slug: p.slug,
    label: label(p),
    reason,
  }));
}

/**
 * Build the full inbound link graph across indexable pairs (used by check:links
 * to prove no orphans). Returns a map of slug -> set of slugs linking to it.
 */
export function buildInboundGraph(): Map<string, Set<string>> {
  const inbound = new Map<string, Set<string>>();
  for (const p of INDEXABLE_PAIRS) inbound.set(p.slug, new Set());
  for (const p of INDEXABLE_PAIRS) {
    for (const rel of getRelated(p)) {
      inbound.get(rel.slug)?.add(p.slug);
    }
  }
  return inbound;
}
