import type { Ticker } from "@/data/tickers";
import { SITE } from "@/lib/site";

/**
 * Product-funnel block: shows how to reproduce this comparison in a spreadsheet
 * with Wisesheets formulas. Textual reference to the product only — no logo or
 * branding is copied. The CTA links out to wisesheets.io.
 */
export function FormulaCard({ a, b }: { a: Ticker; b: Ticker }) {
  const lines: { formula: string; note: string }[] = [
    { formula: `=WISE("${a.symbol}", "Revenue", "ttm")`, note: `${a.symbol} trailing revenue` },
    { formula: `=WISE("${b.symbol}", "Revenue", "ttm")`, note: `${b.symbol} trailing revenue` },
    { formula: `=WISE("${a.symbol}", "PE ratio")`, note: `${a.symbol} valuation` },
    { formula: `=WISEPRICE("${b.symbol}", "Price")`, note: `${b.symbol} live price` },
  ];

  return (
    <section
      aria-labelledby="funnel-heading"
      className="rounded-2xl border border-brand/20 bg-brand-wash p-6"
    >
      <h2 id="funnel-heading" className="text-lg font-bold text-ink">
        Run this comparison in your own spreadsheet
      </h2>
      <p className="mt-1 text-sm text-ink-2">
        Pull the same figures — and thousands more — straight into Excel or Google
        Sheets with Wisesheets formulas, then build any comparison you like.
      </p>
      <div className="mt-4 overflow-x-auto rounded-lg bg-[var(--code-bg)] p-4">
        <pre className="text-sm leading-relaxed">
          <code className="font-mono text-[var(--code-ink)]">
            {lines.map((l) => (
              <span key={l.formula} className="block whitespace-pre">
                <span className="text-emerald-400">{l.formula}</span>
                <span className="text-slate-400">{`  // ${l.note}`}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
      <a
        href={SITE.wisesheetsUrl}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-btn px-4 py-2 text-sm font-semibold text-white hover:bg-brand-btn-hover"
        rel="noopener"
      >
        Get Wisesheets
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
