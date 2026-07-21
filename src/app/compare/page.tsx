import type { Metadata } from "next";
import Link from "next/link";
import { INDEXABLE_PAIRS, type Pair } from "@/data/pairs";
import { requireTicker } from "@/data/tickers";
import { absoluteUrl, SITE } from "@/lib/site";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd, breadcrumbNode } from "@/lib/jsonld";

const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Compare Stocks" }];

export const metadata: Metadata = {
  title: "Compare Stocks Side by Side — Head-to-Head Stock Comparisons",
  description:
    "Browse head-to-head stock comparisons across sectors — valuation, margins, growth, dividends and returns, side by side. Illustrative data, Q2 2026.",
  alternates: { canonical: absoluteUrl("/compare") },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Compare Stocks Side by Side",
    description: "Head-to-head stock comparisons across sectors.",
    url: absoluteUrl("/compare"),
    type: "website",
    siteName: "Stock Compare",
  },
};

/** Group indexable pairs by the first ticker's sector, sorted for stable output. */
function groupBySector(pairs: Pair[]): [string, Pair[]][] {
  const map = new Map<string, Pair[]>();
  for (const p of pairs) {
    const sector = requireTicker(p.a).sector;
    if (!map.has(sector)) map.set(sector, []);
    map.get(sector)!.push(p);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([s, ps]) => [s, ps.sort((x, y) => x.slug.localeCompare(y.slug))] as [string, Pair[]]);
}

export default function CompareHub() {
  const groups = groupBySector(INDEXABLE_PAIRS);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbNode(crumbs),
            {
              "@type": "CollectionPage",
              "@id": absoluteUrl("/compare"),
              url: absoluteUrl("/compare"),
              name: "Compare Stocks Side by Side",
              inLanguage: "en-US",
            },
          ],
        }}
      />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8">
        <Breadcrumbs items={crumbs} />
        <header className="mt-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Compare Stocks Side by Side
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-2">
            Head-to-head comparisons of {INDEXABLE_PAIRS.length} popular stock pairings —
            valuation, profitability, growth, dividends and returns, laid out for a quick,
            factual read. All figures {SITE.asOfLong}.
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {groups.map(([sector, pairs]) => (
            <section key={sector} aria-labelledby={`sec-${sector.replace(/\s+/g, "-")}`}>
              <h2
                id={`sec-${sector.replace(/\s+/g, "-")}`}
                className="text-sm font-bold uppercase tracking-wide text-ink-3"
              >
                {sector}
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pairs.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/compare/${p.slug}`}
                      className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 font-semibold text-ink hover:border-brand hover:bg-brand-wash hover:text-brand"
                    >
                      Compare {p.a} vs {p.b}
                      <span aria-hidden="true" className="text-ink-3">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
