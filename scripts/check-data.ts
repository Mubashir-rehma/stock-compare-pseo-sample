/**
 * Data integrity gate. Run with `npm run check:data`.
 * Fails the process (exit 1) on any violation so it can gate CI / commits.
 *
 * Asserts:
 *  - every pair slug is canonical (lower-case, alphabetical)
 *  - a/b match the slug and are in alphabetical order
 *  - no duplicate pairs
 *  - every referenced ticker exists in the seed data
 *  - the pair's `index` flag equals shouldIndex() — no drift from the gate
 *  - all indexable pairs pass the gate; the noindex pair fails it
 *  - no absurd seed values (sanity bounds on the numeric fields)
 */
import { PAIRS } from "../src/data/pairs";
import { TICKERS, getTicker, completenessRatio } from "../src/data/tickers";
import { shouldIndex, curationReport } from "../src/lib/curation";
import { isCanonicalSlug, makePairSlug } from "../src/lib/slug";

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

// --- Pair-level checks ------------------------------------------------------
const seen = new Set<string>();
for (const p of PAIRS) {
  if (!isCanonicalSlug(p.slug)) {
    fail(`Slug not canonical/alphabetical: "${p.slug}" (expected "${makePairSlug(p.a, p.b)}")`);
  }
  if (makePairSlug(p.a, p.b) !== p.slug) {
    fail(`a/b do not match slug for "${p.slug}": a=${p.a} b=${p.b}`);
  }
  if (p.a >= p.b) {
    fail(`a/b not in alphabetical order for "${p.slug}": ${p.a} >= ${p.b}`);
  }
  if (seen.has(p.slug)) fail(`Duplicate pair slug: "${p.slug}"`);
  seen.add(p.slug);

  // reverse-pair duplicate (e.g. both aapl-vs-msft and msft-vs-aapl)
  const rev = makePairSlug(p.b, p.a);
  if (rev !== p.slug && seen.has(rev)) fail(`Reverse-duplicate pair for "${p.slug}"`);

  if (!getTicker(p.a)) fail(`Pair "${p.slug}" references unknown ticker ${p.a}`);
  if (!getTicker(p.b)) fail(`Pair "${p.slug}" references unknown ticker ${p.b}`);

  // index flag must equal the gate decision — one source of truth
  const gate = shouldIndex(p.a, p.b, p.slug);
  if (gate !== p.index) {
    const report = curationReport(p.a, p.b, p.slug);
    fail(
      `index flag drift for "${p.slug}": flag=${p.index} but shouldIndex()=${gate}. ` +
        `Gate reasons: ${report.failedReasons.join("; ") || "(passes all)"}`,
    );
  }

  // FAQ sanity
  if (p.index && (p.faqs.length < 4 || p.faqs.length > 5)) {
    fail(`Indexable pair "${p.slug}" has ${p.faqs.length} FAQs (expected 4-5)`);
  }
  for (const f of p.faqs) {
    if (!f.q.trim() || !f.a.trim()) fail(`Empty FAQ q/a in "${p.slug}"`);
  }
  if (!p.verdictSummary.trim()) fail(`Empty verdictSummary in "${p.slug}"`);
  if (!p.angle.trim()) fail(`Empty angle in "${p.slug}"`);
}

// --- Explicit noindex-demo assertion ---------------------------------------
const thin = PAIRS.filter((p) => !p.index);
if (thin.length !== 1) {
  fail(`Expected exactly 1 noindex demo pair, found ${thin.length}`);
} else {
  const report = curationReport(thin[0].a, thin[0].b, thin[0].slug);
  if (report.index) fail(`Noindex pair "${thin[0].slug}" unexpectedly PASSES the gate`);
}

const indexable = PAIRS.filter((p) => p.index);
if (indexable.length !== 21) {
  fail(`Expected 21 indexable pairs, found ${indexable.length}`);
}

// --- Ticker sanity bounds ---------------------------------------------------
for (const t of TICKERS) {
  const bound = (label: string, v: number | null, lo: number, hi: number) => {
    if (v !== null && (v < lo || v > hi)) {
      fail(`Absurd value ${label}=${v} for ${t.symbol} (expected ${lo}..${hi})`);
    }
  };
  bound("marketCapB", t.marketCapB, 0.1, 5000);
  bound("price", t.price, 0.5, 5000);
  bound("peRatio", t.peRatio, 1, 300);
  bound("dividendYieldPct", t.dividendYieldPct, 0, 20);
  bound("revenueTtmB", t.revenueTtmB, 0.01, 1000);
  bound("grossMarginPct", t.grossMarginPct, 0, 100);
  bound("netMarginPct", t.netMarginPct, -50, 100);
  bound("founded", t.founded, 1600, 2026);
  if (completenessRatio(t) < 0.5) fail(`Ticker ${t.symbol} is severely incomplete`);
  if (t.netIncomeTtmB > t.revenueTtmB) {
    fail(`Net income exceeds revenue for ${t.symbol}`);
  }
}

// --- Report -----------------------------------------------------------------
if (errors.length) {
  console.error(`\n❌ check:data FAILED with ${errors.length} issue(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `✅ check:data passed: ${TICKERS.length} tickers, ${PAIRS.length} pairs ` +
    `(${indexable.length} indexable, ${thin.length} noindex demo). Gate consistent.`,
);
