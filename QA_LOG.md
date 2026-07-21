# QA LOG

Format: `[Round][Lane-#] severity | file | finding | fix`
Severity: BLOCKER / HIGH / MEDIUM / LOW.

Lanes: 1 UI/UX · 2 Technical SEO · 3 LLM/AEO · 4 FAQ & Schema · 5 Content integrity · 6 Perf & build.

---

## Lighthouse scores

Tooling: Lighthouse 13.4.1, mobile form factor, local `next start` production build, headless Chrome.

### Phase 5 baseline (2026-07-22)
| Page | Perf | A11y | Best Practices | SEO |
|------|------|------|----------------|-----|
| /compare (hub)        | 98 | 100 | 100 | 100 |
| /compare/aapl-vs-msft | 98 | 100 | 100 | 100 |
| /compare/ko-vs-pep    | 99 | 100 | 100 | 100 |
| /compare/cvbf-vs-myrg (noindex) | 99 | 100 | 100 | **66** |

Notes:
- All Definition-of-Done thresholds met on hub + 2 comparison pages (Perf ≥95, SEO =100, A11y ≥95, BP ≥95).
- CLS = 0 on all pages (explicit SVG dimensions, system fonts → no swap shift, no client data pops).
- The noindex demo page scores SEO 66 **by design** — Lighthouse's "Page is blocked from indexing" audit fires because the curation gate applied `noindex`. This confirms the noindex is working, not a defect.
- Initial run showed A11y 95–96 due to dark-mode color-contrast (white on light dark-brand = 2.54:1; code comment slate-500 on dark bg = 4.23:1). Fixed with theme-independent `--brand-btn` token + lighter comment color → A11y 100.
- First-load JS ≈ 183 kB gzipped — above the plan's <90 kB target, but that is a pre-React-19/App-Router figure; **app-authored client JS is 0 kB** (zero client components). Framework baseline does not block Performance (98–99).

---

## Round 1 — breadth (2026-07-22)

Tooling built for this round: `scripts/qa-audit.ts` (parses all 24 built HTML pages) + browser checks at 375px.

Findings (all fixed + verified):
- `[R1][Lane2] HIGH | src/app/page.tsx | homepage had no JSON-LD | added WebSite + Person @graph` ✅
- `[R1][Lane5/1] HIGH | src/lib/prose.ts | shortName produced truncated "JPMorgan Chase &" | strip dangling "&" + leading "The"; now "JPMorgan Chase"` ✅
- `[R1][Lane2] MED | src/app/page.tsx | homepage missing og:/twitter: tags | added openGraph + twitter (twitter auto-derives elsewhere)` ✅
- `[R1][Lane2] MED | src/app/page.tsx | homepage <title> 61 chars > 60 | shortened to 54` ✅
- `[R1][Lane1] LOW | src/components/SiteHeader.tsx | header nav link tap target ~20px | added px-2 py-2` ✅

Passes (verified, no action):
- Lane 1: mobile 375px — no page-level horizontal scroll; table + code block correctly isolated in `overflow-x-auto`; accordion toggles; single H1 per page; disclaimer on every page; dev-note only on the noindex page.
- Lane 6: zero console errors.
- qa-audit (all 24 pages): titles unique & ≤60, descriptions unique & ≤155, canonical correct, robots matches curation gate, one JSON-LD block that parses, FAQPage mirrors on-page FAQs exactly, `<th scope>` present, no forbidden phrases, breadcrumb present, both tickers + year appear early (AEO).

Result: 0 open findings; `npm run check` + `qa-audit` + `lint` + `build` all green.

## Round 2 — depth + adversarial (2026-07-22)

Regression re-verify: all 5 Round-1 fixes intact; `qa-audit` 0 findings, `check` + `lint` + `build` green.

Adversarial routing (all correct):
| Input | Result |
|---|---|
| `/compare/msft-vs-aapl` | 301 → `/compare/aapl-vs-msft` (1 hop) |
| `/compare/AAPL-VS-MSFT` | 301 → canonical (1 hop) |
| `/compare/aapl-vs-aapl` (self) | 404 |
| `/compare/fake-vs-fake` | 404 |
| `/compare/aapl-vs-fake` (unknown ticker) | 404 |
| `/compare/aapl-vs-msft-vs-googl` (3 tickers) | 404 |
| `/compare/aapl-vs-` (malformed) | 404 |
| `/compare/msft-vs-aapl` chain-follow | 200, exactly 1 redirect (no chain) |

Findings:
- `[R2][Lane2] LOW | src/proxy.ts | trailing slash + reversed slug = 2-hop 308→301 | ACCEPTED` — `/compare/msft-vs-aapl/` takes Next's built-in trailing-slash 308 (strip slash) then the proxy 301 (normalize order). Investigated: Next's 308 pre-empts the proxy, and disabling `skipTrailingSlashRedirect` globally would risk duplicate content on other routes. The combination is never produced by an internal link, both hops are permanent, and the destination is the correct canonical. Documented in `proxy.ts`; left as-is.

Schema depth (all 24 pages, via enhanced `qa-audit`):
- FAQPage `mainEntity` count + text mirrors on-page FAQs exactly on every comparison page.
- BreadcrumbList positions are sequential from 1 with names present on every page.
- Exactly one JSON-LD block per page; all parse.

Mobile-only pass: hub (8 sector groups, 21 links) and comparison pages — no page-level horizontal scroll at 375px; table/code isolated in scroll containers.

Result: 0 open HIGH/MEDIUM findings.

## Round 3 — production reality (2026-07-22)

Split into (a) README/repo read-through + final local verify — DONE here; and (b) live-URL
checks on Vercel — to be run by the repo owner post-deploy (deploy is owner-credentialed;
see Blockers in TASKS.md). Because the local server runs the true production build
(`next start`), the (b) checks were already exercised locally in R1–R3 against that build;
what remains is confirming they hold on the Vercel platform + the real domain.

README-as-Guillermo read-through (findings fixed):
- `[R3][README] LOW | README.md | claimed OG image route is runtime server code | it is prerendered (SSG); reworded: only per-request code is proxy.ts` ✅
- `[R3][README] LOW | README.md | plan-vs-implementation naming (proxy vs middleware, Next 16, JS baseline) not surfaced | added a "Note on Next 16" pointing to DECISIONS D1/D6/D7` ✅
- Verified: all 14 file paths cited in the requirement→file mapping table exist; every mapped claim is true in code; counts (21 indexable + 1 noindex, sitemap 23 URLs, ≥4 inbound) match reality; Lighthouse numbers match the table above.

Final local verify (all green): `check:data` ✅ · `check:links` ✅ (min inbound 4) · `lint` clean (0 problems) · `build` clean (0 warnings) · `qa-audit` 0 findings across 24 pages.

Live-URL verification (https://stock-compare-pseo-sample.vercel.app/) — ALL PASS:
- `/compare/msft-vs-aapl` → 301 → `/compare/aapl-vs-msft` on the real domain ✅
- `sitemap.xml` = 23 `<loc>`, `cvbf-vs-myrg` absent ✅
- `robots.txt` allows all + correct sitemap/host ✅
- noindex page serves `<meta name="robots" content="noindex, follow">` ✅
- unknown slug → 404 ✅
- OG images live: home `/opengraph-image`, hub `/compare/opengraph-image`, pair `/compare/<slug>/opengraph-image` all 200 image/png ✅
- Home canonical = bare origin (trailingSlash:false) ✅
- Live Lighthouse (mobile, LH 13.4.1):

| Live page | Perf | A11y | BP | SEO |
|-----------|------|------|----|-----|
| `/` (home)            | 98 | 100 | 100 | 100 |
| `/compare` (hub)      | 98 | 100 | 100 | 100 |
| `/compare/aapl-vs-msft` | 99 | 100 | 100 | 100 |

`NEXT_PUBLIC_SITE_URL` note: the live domain equals the built-in default, so canonicals/sitemap/OG URLs are already correct without setting the env var.

Round 3 result: 0 open findings; Definition of Done met on the live deployment.
