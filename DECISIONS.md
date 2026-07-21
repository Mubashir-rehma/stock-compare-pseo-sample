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
