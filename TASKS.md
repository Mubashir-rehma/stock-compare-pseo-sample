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
- [x] P5-T1: Font strategy — system stack, no CDN/build fetch (see D4). — 2026-07-22
- [x] P5-T2: Zero layout shift — CLS measured 0 (explicit SVG dims, no font swap, no client pops). — 2026-07-22
- [x] P5-T3: Bundle audit — 0 client components; app client JS = 0 kB; framework baseline ~183 kB gz (see QA_LOG note). — 2026-07-22
- [x] P5-T4: Lighthouse (real, LH 13.4.1 mobile): hub/2 pages Perf 98-99, A11y 100, BP 100, SEO 100. Logged. — 2026-07-22

## Phase 6 — README & workflow doc
- [x] P6-T1: README.md (6 sections + requirement→file mapping table + run instructions). — 2026-07-22
- [x] P6-T2: DECISIONS.md running log (D1–D7, maintained across phases). — 2026-07-22

## Phase 7 — Deploy
- [x] P7-T1: Clean next build, zero type errors, zero warnings, lint clean. — 2026-07-22
- [~] P7-T2: Push to GitHub — OWNER-RUN (no gh CLI / needs owner account). Checklist provided.
- [~] P7-T3: Deploy to Vercel + live verification — OWNER-RUN. Checklist provided.
- [x] P7-T4: Tag v1.0.0 locally (release candidate for owner to push with deploy). — 2026-07-22

## QA
- [x] QA Round 1 (breadth, all lanes). 5 findings fixed; qa-audit 0 open. — 2026-07-22
- [x] QA Round 2 (depth + adversarial). Routing battery + all-page schema + mobile; 1 LOW accepted. — 2026-07-22
- [~] QA Round 3: README read-through + final local verify DONE (2 README fixes); live-URL checks OWNER-RUN post-deploy.

## Blockers
- **P7-T2 / P7-T3 (deploy):** `gh` and `vercel` CLIs are not installed, and both require the user's GitHub/Vercel accounts + interactive auth. Push to public GitHub + Vercel deploy need explicit user go-ahead and credentials. Everything up to deploy is complete, verified against a local production build (`next start`). QA Round 3's live-URL checks depend on the deploy; the README read-through portion of Round 3 can be done locally.
