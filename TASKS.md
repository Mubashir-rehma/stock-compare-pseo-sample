# TASKS — Wisesheets Stock Comparison PSEO Sample

Ledger derived from BUILD_PLAN.md Section 4. Mark `[x]` with an ISO timestamp when done.
Each task requires a verification step before it is ticked.

## Phase 0 — Scaffold
- [x] P0-T1: create-next-app (TS, Tailwind, App Router, ESLint, src dir). Boilerplate cleaned. — 2026-07-22
- [x] P0-T2: Create TASKS.md, empty QA_LOG.md, DECISIONS.md. — 2026-07-22
- [x] P0-T3: /src/data, /src/lib, /src/components structure + commit chore(P0): scaffold. — 2026-07-22

## Phase 1 — Data layer
- [x] P1-T1: tickers.ts — 40 tickers (see D5), all fields, realistic values. — 2026-07-22
- [x] P1-T2: pairs.ts — 22 pairs (21 index + 1 noindex), slug/angle/verdict/FAQs. — 2026-07-22
- [x] P1-T3: curation.ts + npm run check:data assertions (passes). — 2026-07-22

## Phase 2 — Page template
- [x] P2-T1: /compare/[slug]/page.tsx + generateStaticParams + notFound. — 2026-07-22
- [x] P2-T2: Full page layout (breadcrumb → H1 → verdict → table → charts → prose → FAQ → funnel → related → footer). — 2026-07-22
- [x] P2-T3: Component extraction (MetricTable, CompareBars, FaqAccordion, FormulaCard, RelatedLinks, Breadcrumbs). — 2026-07-22

## Phase 3 — SEO infrastructure
- [x] P3-T1: generateMetadata per pair (title/desc/canonical). Verified in built HTML. — 2026-07-22
- [x] P3-T2: Canonical normalization in proxy.ts (see D6). Verified 301 for reversed + uppercase slugs. — 2026-07-22
- [x] P3-T3: Noindex logic via shouldIndex(). Verified index vs noindex meta in HTML. — 2026-07-22
- [x] P3-T4: JSON-LD @graph (BreadcrumbList, FAQPage, WebPage + Corporation). Verified in HTML. — 2026-07-22
- [x] P3-T5: app/sitemap.ts (only indexable pairs). Verified 23 URLs, thin pair excluded. — 2026-07-22
- [x] P3-T6: app/robots.ts. Verified served with sitemap ref. — 2026-07-22
- [x] P3-T7: Dynamic OG images (22 prerendered, 200 image/png) + twitter:card. — 2026-07-22
- [x] P3-T8: Semantic HTML audit pass (one H1, th scope, main/nav/section, details/summary). — 2026-07-22

## Phase 4 — Hub, homepage, internal linking
- [x] P4-T1: /compare hub page (grouped by sector, BreadcrumbList + CollectionPage JSON-LD). — 2026-07-22
- [x] P4-T2: Homepage / (honest framing, featured, noindex-demo link). — 2026-07-22
- [x] P4-T3: related.ts algorithm (thematic + connectivity ring guaranteeing >=4 inbound). — 2026-07-22
- [x] P4-T4: check:links script (passes, min inbound = 4, noindex isolated). — 2026-07-22

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
