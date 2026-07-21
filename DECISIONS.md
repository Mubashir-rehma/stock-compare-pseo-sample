# DECISIONS

Running log of non-obvious engineering decisions. Each entry: **Decision** · Alternatives · Why.

---

### D1 — Next.js 16 (App Router) instead of "14+"
- **Decision:** Use the current `create-next-app` output (Next 16.2, React 19, Tailwind v4).
- **Alternatives:** Pin to Next 14.
- **Why:** The plan says "14+". Latest is a superset with the same App Router APIs used here (`generateStaticParams`, `generateMetadata`, `ImageResponse`, `middleware`). No feature in the plan requires 14 specifically. Fewer known CVEs.

### D2 — SSG served on Vercel, NOT `output: export` (pure static)
- **Decision:** Fully pre-render every page with `generateStaticParams`, but do not enable static HTML export.
- **Alternatives:** `output: 'export'` for a plain static site.
- **Why:** The plan mandates two features that a pure static export cannot provide: (a) 301 canonical normalization in `middleware.ts`, and (b) dynamic OG images via `next/og` `ImageResponse`. Both need Vercel's runtime. Pages are still statically generated at build time (no runtime data fetching), so CWV benefits are retained.

### D3 — Site base URL via env with a sane default
- **Decision:** `NEXT_PUBLIC_SITE_URL` env var, defaulting to the expected Vercel URL, consumed by canonicals, sitemap, robots, and OG metadata.
- **Alternatives:** Hard-code the domain.
- **Why:** One source of truth for absolute URLs; the real deploy domain is filled in once known without touching multiple files.

### D4 — System font stack, not `next/font/google`
- **Decision:** Ship a native system font stack (`ui-sans-serif, system-ui, …`) defined in CSS tokens; no web font.
- **Alternatives:** `next/font/google` (Geist/Inter), self-hosted variable font file.
- **Why:** Two plan constraints: "no external font CDN" (P5-T1) and "no external API calls at build time — everything self-contained" (§2). `next/font/google` fetches from Google's servers at build time, a fragility the demo can't afford. P5-T1 explicitly permits a system stack. Result: zero font bytes over the wire, zero layout shift from font swap, no build-time network dependency.

### D5 — Ticker count is 40, not "26" (plan self-correction)
- **Decision:** Seed 40 tickers, not the "26" stated in BUILD_PLAN §3.1.
- **Alternatives:** Force the pair list down to 26 tickers.
- **Why:** The 21 indexable pairs in §3.2 reference **38 unique tickers** by enumeration (AAPL, MSFT, NVDA, AMD, GOOGL, META, AMZN, WMT, KO, PEP, V, MA, XOM, CVX, JPM, BAC, TSLA, F, JNJ, PFE, DIS, NFLX, INTC, COST, MCD, SBUX, HD, LOW, UNH, CVS, BA, LMT, T, VZ, NKE, LULU, PG, UL), plus 2 for the noindex thin pair = 40. The concrete pair enumeration is the authoritative spec; "26" is a stale count. Building to the pair list is the non-silent correction.
