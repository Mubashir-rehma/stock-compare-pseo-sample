/**
 * Related-comparisons algorithm (P4-T3). Deterministic: for a given pair it
 * always returns the same ordered list, so the internal link graph is stable
 * across builds. Two layers:
 *
 *   1. Thematic links (shown first, best anchor context):
 *        - pairs sharing a ticker with the current pair
 *        - pairs in the same sector (either ticker's sector)
 *   2. A connectivity "ring": every page also links to its 3 successors in the
 *      slug-sorted list of indexable pairs (wrapping around). This guarantees
 *      each page receives exactly 3 inbound ring links, so NO page can fall
 *      below the >=4 inbound-link floor (3 ring + 1 hub), even a pair that is
 *      the only one in its sector and shares no ticker with any other pair.
 *
 * The noindex pair is never surfaced — only the homepage dev-note links to it.
 */
import { INDEXABLE_PAIRS, type Pair } from "@/data/pairs";
import { requireTicker } from "@/data/tickers";

export interface RelatedLink {
  slug: string;
  label: string; // "AAPL vs GOOGL"
  reason: string; // why it's related (also descriptive anchor context)
}

const RING_SIZE = 3;

function label(p: Pair): string {
  return `${p.a} vs ${p.b}`;
}

/** Indexable pairs sorted by slug — the canonical ring order. */
const RING = [...INDEXABLE_PAIRS].sort((a, b) => a.slug.localeCompare(b.slug));

function ringSuccessors(slug: string): string[] {
  const i = RING.findIndex((p) => p.slug === slug);
  if (i === -1) return [];
  const out: string[] = [];
  for (let k = 1; k <= RING_SIZE; k++) out.push(RING[(i + k) % RING.length].slug);
  return out;
}

export function getRelated(pair: Pair, limit = 6): RelatedLink[] {
  if (!pair.index) return []; // thin pair gets no outbound related links

  const aSector = requireTicker(pair.a).sector;
  const bSector = requireTicker(pair.b).sector;

  // Thematic candidates, scored.
  const thematic = INDEXABLE_PAIRS.filter((p) => p.slug !== pair.slug)
    .map((p) => {
      const sharesTicker =
        p.a === pair.a || p.a === pair.b || p.b === pair.a || p.b === pair.b;
      const pSectors = [requireTicker(p.a).sector, requireTicker(p.b).sector];
      const sharesSector = pSectors.includes(aSector) || pSectors.includes(bSector);
      let score = 0;
      let reason = "";
      if (sharesTicker) {
        score = 3;
        reason = `Also features ${[pair.a, pair.b].find((t) => p.a === t || p.b === t)}`;
      } else if (sharesSector) {
        score = 2;
        reason = "Same sector";
      }
      return { p, score, reason };
    })
    .filter((c) => c.score > 0)
    .sort((x, y) => y.score - x.score || x.p.slug.localeCompare(y.p.slug));

  const ring = ringSuccessors(pair.slug).filter((s) => s !== pair.slug);

  // Reserve slots so the ring is always included, then fill remaining with thematic.
  const ringNotInThematic = ring.filter((s) => !thematic.some((t) => t.p.slug === s));
  const reserve = ringNotInThematic.length;
  const themedTake = thematic.slice(0, Math.max(0, limit - reserve));

  const reasonBySlug = new Map<string, string>();
  for (const t of themedTake) reasonBySlug.set(t.p.slug, t.reason);
  for (const s of ring) if (!reasonBySlug.has(s)) reasonBySlug.set(s, "Popular comparison");

  // themed first (better anchors), then any ring successors not already shown.
  const orderedSlugs: string[] = [];
  for (const t of themedTake) orderedSlugs.push(t.p.slug);
  for (const s of ring) if (!orderedSlugs.includes(s)) orderedSlugs.push(s);

  return orderedSlugs.slice(0, Math.max(limit, ring.length)).map((slug) => {
    const p = INDEXABLE_PAIRS.find((x) => x.slug === slug)!;
    return { slug, label: label(p), reason: reasonBySlug.get(slug) ?? "Popular comparison" };
  });
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
