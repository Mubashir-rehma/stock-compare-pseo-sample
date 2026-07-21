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

## Round 2 — depth + adversarial
(pending)

## Round 3 — live deploy
(pending)
