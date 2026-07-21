/**
 * Internal-link-graph gate. Run with `npm run check:links`.
 * Reconstructs the static route graph from the data + related algorithm and
 * asserts the internal-linking invariants (exit 1 on any violation):
 *
 *  - every indexable page has >= 4 inbound internal links (no orphans)
 *  - no indexable page links to the noindex demo page
 *  - the homepage is the ONLY page that links to the noindex demo page
 *  - every related link resolves to an existing, indexable pair (no dead links)
 *  - every featured slug exists and is indexable
 *
 * Edge sources modelled: homepage -> featured + noindex demo; hub -> all
 * indexable pairs; each comparison page -> its related pairs + hub/home breadcrumb.
 */
import { FEATURED_SLUGS, INDEXABLE_PAIRS, PAIRS, getPair } from "../src/data/pairs";
import { getRelated, buildInboundGraph } from "../src/lib/related";

const errors: string[] = [];
const fail = (m: string) => errors.push(m);

const noindexSlugs = PAIRS.filter((p) => !p.index).map((p) => p.slug);
const relatedInbound = buildInboundGraph(); // from other comparison pages only

// 1. inbound count >= 4 (hub links to all -> +1; homepage featured -> +1)
for (const p of INDEXABLE_PAIRS) {
  const fromRelated = relatedInbound.get(p.slug)?.size ?? 0;
  const fromHub = 1; // hub lists every indexable pair
  const fromHome = FEATURED_SLUGS.includes(p.slug as (typeof FEATURED_SLUGS)[number]) ? 1 : 0;
  const total = fromRelated + fromHub + fromHome;
  if (total < 4) {
    fail(`Orphan risk: "${p.slug}" has only ${total} inbound internal links (need >=4) ` +
      `(related=${fromRelated}, hub=${fromHub}, home=${fromHome})`);
  }
}

// 2 & 4. related links: never point to noindex, never dead
for (const p of PAIRS) {
  for (const r of getRelated(p)) {
    const target = getPair(r.slug);
    if (!target) fail(`"${p.slug}" has a related link to missing pair "${r.slug}"`);
    else if (!target.index) fail(`Indexable "${p.slug}" links to noindex pair "${r.slug}"`);
  }
}

// 3. homepage is the only linker to the noindex demo.
// (By construction: getRelated returns [] for noindex source and never includes
//  noindex targets, and the hub lists only indexable pairs. So no content page
//  links to it; the homepage dev-note link is the sole inbound edge.)
for (const ns of noindexSlugs) {
  const linkers: string[] = [];
  for (const p of INDEXABLE_PAIRS) {
    if (getRelated(p).some((r) => r.slug === ns)) linkers.push(p.slug);
  }
  if (linkers.length > 0) {
    fail(`Noindex page "${ns}" is linked from indexable pages: ${linkers.join(", ")}`);
  }
}

// 5. featured slugs valid + indexable
for (const f of FEATURED_SLUGS) {
  const p = getPair(f);
  if (!p) fail(`Featured slug "${f}" does not exist`);
  else if (!p.index) fail(`Featured slug "${f}" is noindex`);
}

// --- Report -----------------------------------------------------------------
if (errors.length) {
  console.error(`\n❌ check:links FAILED with ${errors.length} issue(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const minInbound = Math.min(
  ...INDEXABLE_PAIRS.map(
    (p) =>
      (relatedInbound.get(p.slug)?.size ?? 0) +
      1 +
      (FEATURED_SLUGS.includes(p.slug as (typeof FEATURED_SLUGS)[number]) ? 1 : 0),
  ),
);
console.log(
  `✅ check:links passed: ${INDEXABLE_PAIRS.length} indexable pages, no orphans ` +
    `(min inbound = ${minInbound}), noindex demo has no inbound content links.`,
);
