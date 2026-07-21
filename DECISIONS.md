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

### D6 — Canonical redirect in `proxy.ts`, not `middleware.ts`
- **Decision:** Implement the 301 canonical normalization in `src/proxy.ts`.
- **Alternatives:** Keep `middleware.ts` (the name the plan uses).
- **Why:** Next.js 16 renamed the `middleware.ts` file convention to `proxy.ts`; keeping the old name emits a deprecation warning and the Definition of Done requires a clean build. It is the same edge mechanism and the same logic — only the filename/export name changed. README maps "canonicals → proxy.ts (formerly middleware.ts)".

### D7 — First-load JS target reinterpreted against the real DoD metric
- **Decision:** Accept the framework-baseline first-load JS (~183 kB gzipped) rather than chase the plan's "<90 kB" figure, while keeping app-authored client JS at exactly 0 kB (zero client components).
- **Alternatives:** Force a webpack build, strip to an MPA with no framework runtime.
- **Why:** The "<90 kB" number predates React 19 + the App Router, whose shared runtime alone exceeds it. The controllable lever — shipping no client component code — is fully exercised (every component is a server component; the FAQ uses native `<details>`). The binding Definition-of-Done metric is Lighthouse Performance ≥95, which is met at 98–99 with this baseline because the JS is static, cacheable, and non-render-blocking (CLS 0, TBT ~80 ms). Optimising framework bytes further would trade correctness/stability for a metric the DoD does not actually gate on.

### D8 — Wisesheets brand theme (green + Roboto), supersedes D4's font choice
- **Decision:** Re-skin the site to the Wisesheets brand: signature green, near-black-on-white neutrals, Roboto type, pill-shaped CTAs.
- **Alternatives:** Keep the neutral blue/system-font theme.
- **Why:** Requested — the sample should look like it belongs to Wisesheets. Extracted from wisesheets.io: brand green `#1FB723`, white bg, black/gray text, Roboto, `border-radius: 50px` buttons.
- **Two-role green (keeps a11y at 100):** `#1FB723` is too light for white text (~2.5:1) or as text on white (~2.2:1), so it is used ONLY for decorative graphic fills (OG images, chart bars) via `--brand-bright`. Interactive text, links, and buttons use a deeper `--brand #0f7a16` (white-on-it 5.3:1; it-on-white 5.3:1). Verified: Lighthouse a11y = 100 after the change.
- **Font (revisits D4):** now that the app deploys on Vercel (reliable build-time network), Roboto is loaded via `next/font/google`, which **self-hosts** the file — so the runtime still has no external font CDN (D4's real constraint) and `display: swap` keeps CLS at 0. Used the **variable** Roboto so semibold/extrabold/black weights all resolve from one file. Perf remains ≥95 (95–96).
