# Stock Compare — a programmatic-SEO work sample for Wisesheets

A production-quality **stock-vs-stock comparison** page system ("AAPL vs MSFT"),
built by **Mubashir Rehman** as a hiring work sample for the Programmatic SEO
Engineer role at [Wisesheets](https://wisesheets.io). It is a self-contained
Next.js app that demonstrates every SEO-engineering skill in the job post on a
real page type, at real scale, with the judgment calls made explicit.

> **Honest framing:** this is a demo, not a Wisesheets property. All figures are
> illustrative and labelled *as of Q2 2026*. In production these pages read live
> data from Wisesheets' existing pipeline; here they run on static seed data so
> the demo never breaks. No Wisesheets branding is copied — the product is
> referenced textually in the funnel block.

---

## 1. What this is

- **21 indexable comparison pages** (e.g. `AAPL vs MSFT`, `NVDA vs AMD`), each
  with a unique H1, verdict, head-to-head table, charts, comparative prose, and
  FAQs — all generated from one template + seed data.
- **1 deliberately non-indexed "thin" pair** (`CVBF vs MYRG`) that renders
  normally but is `noindex, follow` and excluded from the sitemap, to show the
  anti-thin-content control working.
- **A hub page** (`/compare`) and **homepage** (`/`) that form the crawl graph.
- The full SEO-infrastructure surface: metadata, canonical normalization,
  noindex-by-gate, JSON-LD, sitemap, robots, OG images, internal linking, and a
  measured Core Web Vitals pass.

## 2. Why comparison pages

Wisesheets already has per-ticker profit calculators, dividend-yield pages, and a
large standalone calculator suite — but **no stock-vs-stock comparison pages**.
Meanwhile competitors (YCharts, TipRanks, StockAnalysis) rank for exactly this
intent: searches like *"AAPL vs MSFT"*, *"is NVDA more expensive than AMD"*, and
*"KO or PEP better dividend"* are high-volume, high-commercial-intent, and map
directly onto data Wisesheets already owns. Comparison pages are:

- **Scalable** — one template × a curated pair list = thousands of pages.
- **On-strategy** — every page funnels to the core product ("run this comparison
  in your own spreadsheet" with real `=WISE(...)` formulas).
- **A visible gap** — closing a category competitors currently own outright.

## 3. What's demonstrated → where it lives

| Job-post requirement | Where it lives | Verify |
|---|---|---|
| Programmatic page templates | [`src/app/compare/[slug]/page.tsx`](src/app/compare/[slug]/page.tsx) + `generateStaticParams` | 21+1 pages build from one file |
| Metadata (unique title ≤60 / desc ≤155) | [`src/lib/seo.ts`](src/lib/seo.ts) → `generateMetadata` | View source, each page differs |
| Canonical URL | `alternates.canonical` in `seo.ts` | `<link rel="canonical">` in HTML |
| **Canonical normalization (301)** | [`src/proxy.ts`](src/proxy.ts) | `/compare/msft-vs-aapl` → 301 → `/compare/aapl-vs-msft` |
| Noindex logic (thin-content) | [`src/lib/curation.ts`](src/lib/curation.ts) `shouldIndex()` → robots meta | `cvbf-vs-myrg` serves `noindex` |
| Schema markup (JSON-LD) | [`src/lib/jsonld.tsx`](src/lib/jsonld.tsx) | `@graph`: BreadcrumbList + FAQPage + WebPage + Corporation |
| Sitemap | [`src/app/sitemap.ts`](src/app/sitemap.ts) | 23 URLs, thin pair absent |
| robots.txt | [`src/app/robots.ts`](src/app/robots.ts) | allows all + sitemap ref |
| Internal linking | [`src/lib/related.ts`](src/lib/related.ts) + [`scripts/check-links.ts`](scripts/check-links.ts) | every page ≥4 inbound links, no orphans |
| Dynamic OG images | [`src/app/compare/[slug]/opengraph-image.tsx`](src/app/compare/[slug]/opengraph-image.tsx) | `/compare/<slug>/opengraph-image` → PNG |
| Page speed / CWV | [`QA_LOG.md`](QA_LOG.md) Lighthouse table | Perf 98–99, SEO 100, A11y 100 |
| Thin-content prevention at scale | curation gate + noindex demo | `npm run check:data` |
| Deterministic prose (no dupes) | [`src/lib/prose.ts`](src/lib/prose.ts) | 4 sections varied by slug hash |

**One-command checks:** `npm run check` runs both data-integrity and
link-graph gates.

## 4. Key decisions

Full log in [`DECISIONS.md`](DECISIONS.md). Highlights:

- **Curation gate as code, not prose.** `shouldIndex()` encodes the indexing
  rules (same sector *or* documented rivalry; both ≥ $10B; data completeness
  ≥ 90%). The **sitemap and the per-page robots meta consume the same function**,
  so there is exactly one source of truth for "should this be indexed?" The
  `pairs.ts` `index` flag is asserted equal to `shouldIndex()` in CI-style checks
  (`check:data`), so the flag can never silently drift from the gate.
- **Canonical normalization at the routing layer.** Alphabetical slugs
  (`aapl-vs-msft`) are the one canonical form; any reversed or mis-cased slug
  301-redirects in `proxy.ts` *before* a page renders. The duplicate-content trap
  is closed at the edge, not patched with `rel=canonical` alone.
- **Deterministic prose variation.** Section copy is generated from the data with
  sentence structure chosen by a hash of the slug — data-driven *and* varied, so
  no two pages read alike, yet the same slug always produces the same text
  (build-stable, diffable).
- **Static seed data.** No runtime or build-time network calls, so the demo is
  self-contained and can't break. Swapping in the Wisesheets pipeline is a
  data-layer change only.
- **Answer-engine optimization (AEO).** Each verdict is a self-contained answer in
  the first ~80 words (both tickers + timeframe); every FAQ answer restates the
  entities so it's quotable standalone; FAQ text is in the server HTML and mirrored
  exactly in FAQPage JSON-LD.

## 5. How this was built — the Claude Code workflow

The job post requires Claude Code fluency, so the process is part of the sample.

- **A single source-of-truth plan** (`BUILD_PLAN.md`) defined phases, the data
  model, and the Definition of Done up front.
- **A task ledger** ([`TASKS.md`](TASKS.md)) tracked every task with a timestamp;
  nothing was marked done without a verification step (run the script, inspect
  built HTML, run Lighthouse).
- **An execution loop:** re-read the plan → diff it against the ledger *and the
  actual code* → reconcile drift → build the next task → commit with the task ID
  → log any non-obvious choice in `DECISIONS.md`. Deviations from the plan were
  never silent: each is justified in `DECISIONS.md` (e.g. the plan's "26 tickers"
  vs the 40 the pair list actually requires; `middleware.ts` → `proxy.ts` in
  Next 16).
- **Three QA rounds** (breadth → depth/adversarial → live) with findings logged
  and fixed in [`QA_LOG.md`](QA_LOG.md).
- **Conventional commits**, one per task (`feat(P3): …`), so the git history reads
  as the build narrative.

## 6. Scaling plan: 21 → 5,000 pairs

1. **Data.** Wisesheets already has the fundamentals; the `Ticker`/`Pair` seed
   files become a pipeline read. No template changes needed.
2. **Pair mining.** Generate candidate pairs from Search Console queries + keyword
   volume (competitor gap analysis, "X vs Y" mining), not the cartesian product —
   most of the ~N² space has no demand.
3. **Curation gate as the throttle.** `shouldIndex()` thresholds (sector/rivalry,
   market-cap floor, data completeness) decide what gets indexed. Pairs can be
   *generated on demand* but only *indexed* when they clear the gate — the
   `cvbf-vs-myrg` demo is this rule firing.
4. **Index in tranches.** Release in batches while watching GSC coverage,
   impressions, and quality signals; expand thresholds only where demand is real.
5. **Freshness.** Move from full SSG to ISR (`revalidate`) so figures refresh
   without rebuilding thousands of pages.
6. **Crawl-budget hygiene.** Per-sector hub pages, a tiered sitemap index, and the
   canonical/noindex controls keep crawl focused on pages that can rank.
7. **Guardrails.** The `check:data` and `check:links` scripts scale with the data —
   no orphans, no dupes, no thin pages leaking into the index.

---

## Running locally

```bash
npm install
npm run check       # data-integrity + link-graph gates
npm run dev         # http://localhost:3000
npm run build       # production build (fully pre-rendered)
```

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
`next/og` for OG images. Zero client components. Every page — including the OG
images — is prerendered at build time; the only code that runs per-request is
`proxy.ts`, which issues the canonical 301 redirects at the edge.

> **Note on Next 16:** `create-next-app` scaffolds Next 16 (the plan says "14+").
> Two naming changes vs. the plan: the canonical-redirect file is `proxy.ts`
> (Next 16 renamed the `middleware.ts` convention), and the first-load JS reflects
> the React 19 / App Router baseline. See `DECISIONS.md` (D1, D6, D7) for the full
> reasoning. All behavior the plan specifies is implemented and verified.
