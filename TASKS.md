# TASKS — Wisesheets Stock Comparison PSEO Sample

Ledger derived from BUILD_PLAN.md Section 4. Mark `[x]` with an ISO timestamp when done.
Each task requires a verification step before it is ticked.

## Phase 0 — Scaffold
- [x] P0-T1: create-next-app (TS, Tailwind, App Router, ESLint, src dir). Boilerplate cleaned. — 2026-07-22
- [x] P0-T2: Create TASKS.md, empty QA_LOG.md, DECISIONS.md. — 2026-07-22
- [x] P0-T3: /src/data, /src/lib, /src/components structure + commit chore(P0): scaffold. — 2026-07-22

## Phase 1 — Data layer
- [ ] P1-T1: tickers.ts — all 26 tickers, all fields, realistic values.
- [ ] P1-T2: pairs.ts — 22 pairs (21 index + 1 noindex), slug/angle/verdict/FAQs.
- [ ] P1-T3: curation.ts + npm run check:data assertions.

## Phase 2 — Page template
- [ ] P2-T1: /compare/[slug]/page.tsx + generateStaticParams + notFound.
- [ ] P2-T2: Full page layout (breadcrumb → H1 → verdict → table → charts → prose → FAQ → funnel → related → footer).
- [ ] P2-T3: Component extraction (MetricTable, CompareBars, FaqAccordion, FormulaCard, RelatedLinks, Breadcrumbs).

## Phase 3 — SEO infrastructure
- [ ] P3-T1: generateMetadata per pair (title/desc/canonical).
- [ ] P3-T2: Canonical normalization middleware (301 msft-vs-aapl → aapl-vs-msft).
- [ ] P3-T3: Noindex logic via shouldIndex().
- [ ] P3-T4: JSON-LD @graph (BreadcrumbList, FAQPage, WebPage + Corporation).
- [ ] P3-T5: app/sitemap.ts (only indexable pairs).
- [ ] P3-T6: app/robots.ts.
- [ ] P3-T7: Dynamic OG images + twitter:card.
- [ ] P3-T8: Semantic HTML audit pass.

## Phase 4 — Hub, homepage, internal linking
- [ ] P4-T1: /compare hub page.
- [ ] P4-T2: Homepage /.
- [ ] P4-T3: related.ts algorithm.
- [ ] P4-T4: check:links script.

## Phase 5 — Performance & CWV
- [ ] P5-T1: Font strategy (next/font, swap, subset).
- [ ] P5-T2: Zero layout shift.
- [ ] P5-T3: Bundle audit (<90 kB first-load target).
- [ ] P5-T4: Lighthouse / self-audit → QA_LOG.md.

## Phase 6 — README & workflow doc
- [ ] P6-T1: README.md (6 sections).
- [ ] P6-T2: DECISIONS.md running log.

## Phase 7 — Deploy
- [ ] P7-T1: Clean next build, zero type errors.
- [ ] P7-T2: Push to GitHub (public). [REQUIRES USER GO-AHEAD]
- [ ] P7-T3: Deploy to Vercel + live verification. [REQUIRES USER GO-AHEAD]
- [ ] P7-T4: Final commit + tag v1.0.0.

## QA
- [ ] QA Round 1 (breadth, all lanes).
- [ ] QA Round 2 (depth + adversarial).
- [ ] QA Round 3 (live deploy + README read-through).

## Blockers
(none yet)
