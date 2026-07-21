import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PAIRS, getPair } from "@/data/pairs";
import { requireTicker } from "@/data/tickers";
import { buildRows, scoreLeads } from "@/lib/compare";
import { generateSections } from "@/lib/prose";
import { getRelated } from "@/lib/related";
import { curationReport } from "@/lib/curation";
import { buildDek, buildDescription, buildH1, buildMetadata } from "@/lib/seo";
import { fmtMoneyB, fmtPct } from "@/lib/format";
import { SITE } from "@/lib/site";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { MetricTable } from "@/components/MetricTable";
import { CompareBars } from "@/components/CompareBars";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FormulaCard } from "@/components/FormulaCard";
import { RelatedLinks } from "@/components/RelatedLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd, comparePageGraph } from "@/lib/jsonld";

/** Statically pre-render every pair (including the noindex demo, which renders). */
export function generateStaticParams() {
  return PAIRS.map((p) => ({ slug: p.slug }));
}

function crumbsFor(a: string, b: string): Crumb[] {
  return [
    { name: "Home", href: "/" },
    { name: "Compare Stocks", href: "/compare" },
    { name: `${a} vs ${b}` },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pair = getPair(slug);
  if (!pair) return {};
  const a = requireTicker(pair.a);
  const b = requireTicker(pair.b);
  return buildMetadata(pair, a, b);
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = getPair(slug);
  if (!pair) notFound();

  const a = requireTicker(pair.a);
  const b = requireTicker(pair.b);
  const crumbs = crumbsFor(a.symbol, b.symbol);
  const h1 = buildH1(pair);
  const dek = buildDek(pair);
  const description = buildDescription(pair, a, b);
  const rows = buildRows(a, b);
  const score = scoreLeads(rows);
  const sections = generateSections(pair, a, b);
  const related = getRelated(pair);
  const report = curationReport(pair.a, pair.b, pair.slug);

  return (
    <>
      <JsonLd data={comparePageGraph(pair, a, b, crumbs, h1, description)} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8">
        <Breadcrumbs items={crumbs} />

        {/* Signature vs-header */}
        <header className="mt-6">
          <div className="flex items-stretch gap-3">
            <TickerBadge symbol={a.symbol} name={a.name} side="a" />
            <div
              aria-hidden="true"
              className="grid shrink-0 place-items-center rounded-xl border border-line bg-paper-2 px-3 text-sm font-black text-ink-3"
            >
              VS
            </div>
            <TickerBadge symbol={b.symbol} name={b.name} side="b" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {h1}
          </h1>
          <p className="mt-3 text-lg text-ink-2">{dek}</p>
        </header>

        {/* Verdict — self-contained answer in the first ~80 words (AEO) */}
        <section aria-labelledby="verdict-heading" className="mt-8">
          <h2 id="verdict-heading" className="sr-only">
            Verdict
          </h2>
          <div className="rounded-2xl border border-brand/20 bg-brand-wash p-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wide text-brand">
                The verdict
              </span>
              <span className="text-xs text-ink-3">{SITE.asOfLong}</span>
            </div>
            <p className="text-ink">{pair.verdictSummary}</p>
            <p className="mt-3 text-sm text-ink-3">
              Across {rows.length} metrics, {a.symbol} leads {score.a} and {b.symbol} leads{" "}
              {score.b}; the remaining rows are size measures with no better/worse direction.
            </p>
          </div>
        </section>

        {/* Head-to-head table */}
        <section aria-labelledby="table-heading" className="mt-10">
          <h2 id="table-heading" className="text-xl font-bold text-ink">
            {a.symbol} vs {b.symbol}: the numbers side by side
          </h2>
          <p className="mt-1 text-sm text-ink-3">
            All figures {SITE.asOfLong}. Units are labelled per row; ▲ marks the leader
            where a metric has a clear better direction.
          </p>
          <div className="mt-4">
            <MetricTable a={a} b={b} />
          </div>
        </section>

        {/* Charts */}
        <section aria-labelledby="charts-heading" className="mt-10">
          <h2 id="charts-heading" className="text-xl font-bold text-ink">
            Visual comparison
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CompareBars
              title="Revenue (TTM)"
              caption={`Trailing revenue: ${a.symbol} ${fmtMoneyB(a.revenueTtmB)}, ${b.symbol} ${fmtMoneyB(b.revenueTtmB)}.`}
              a={{ label: a.symbol, value: a.revenueTtmB }}
              b={{ label: b.symbol, value: b.revenueTtmB }}
              format={fmtMoneyB}
            />
            <CompareBars
              title="5-year price return"
              caption={`Five-year return: ${a.symbol} ${fmtPct(a.return5yPct)}, ${b.symbol} ${fmtPct(b.return5yPct)}.`}
              a={{ label: a.symbol, value: a.return5yPct }}
              b={{ label: b.symbol, value: b.return5yPct }}
              signed
              format={fmtPct}
            />
          </div>
        </section>

        {/* Comparative prose sections */}
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.id} aria-labelledby={`${s.id}-heading`}>
              <h2 id={`${s.id}-heading`} className="text-xl font-bold text-ink">
                {s.heading}
              </h2>
              <p className="mt-2 leading-relaxed text-ink-2">{s.paragraph}</p>
            </section>
          ))}
        </div>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mt-12">
          <h2 id="faq-heading" className="text-xl font-bold text-ink">
            Frequently asked questions
          </h2>
          <div className="mt-4">
            <FaqAccordion faqs={pair.faqs} />
          </div>
        </section>

        {/* Product funnel */}
        <div className="mt-12">
          <FormulaCard a={a} b={b} />
        </div>

        {/* Related */}
        <div className="mt-12">
          <RelatedLinks links={related} />
        </div>
      </main>

      <SiteFooter
        devNote={
          pair.index
            ? undefined
            : `This pair fails the curation gate, so it is served with robots "noindex, follow" and left out of the sitemap. Reasons: ${report.failedReasons.join("; ")}. In production, pairs like this can be generated on demand but are never indexed — this is the anti-thin-content control in action.`
        }
      />
    </>
  );
}

function TickerBadge({
  symbol,
  name,
  side,
}: {
  symbol: string;
  name: string;
  side: "a" | "b";
}) {
  return (
    <div
      className={`flex-1 rounded-xl border p-4 ${
        side === "a"
          ? "border-brand/30 bg-brand-wash"
          : "border-line bg-paper-2"
      }`}
    >
      <div className="text-2xl font-extrabold text-ink">{symbol}</div>
      <div className="mt-0.5 line-clamp-1 text-sm text-ink-3">{name}</div>
    </div>
  );
}
