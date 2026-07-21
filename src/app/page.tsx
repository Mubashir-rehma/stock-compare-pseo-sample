import type { Metadata } from "next";
import Link from "next/link";
import { FEATURED_SLUGS, INDEXABLE_PAIRS } from "@/data/pairs";
import { absoluteUrl, SITE } from "@/lib/site";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Stock Compare — A Programmatic SEO Work Sample for Wisesheets",
  description:
    "A programmatic-SEO work sample: a scalable stock-vs-stock comparison page system built for Wisesheets. Illustrative data, Q2 2026.",
  alternates: { canonical: absoluteUrl("/") },
  robots: { index: true, follow: true },
};

const featured = FEATURED_SLUGS;

export default function Home() {
  return (
    <>
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-5 pt-16 pb-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3 py-1 text-xs font-semibold text-ink-3">
            Programmatic SEO work sample · not a Wisesheets property
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Stock-vs-stock comparison pages, built to scale.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-2">
            {SITE.tagline} by {SITE.author}. It demonstrates a full programmatic page
            system — templates, metadata, canonicals, schema, sitemaps, internal linking
            and a curation gate against thin content — using {INDEXABLE_PAIRS.length}{" "}
            indexable comparison pages plus one deliberately non-indexed demo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/compare"
              className="rounded-lg bg-brand-btn px-5 py-2.5 font-semibold text-white hover:bg-brand-btn-hover"
            >
              Browse the comparisons
            </Link>
            <a
              href={SITE.repoUrl}
              rel="noopener"
              className="rounded-lg border border-line px-5 py-2.5 font-semibold text-ink-2 hover:border-brand hover:text-brand"
            >
              Read the README on GitHub
            </a>
          </div>
        </section>

        {/* Featured */}
        <section aria-labelledby="featured-heading" className="mx-auto max-w-4xl px-5 py-6">
          <h2 id="featured-heading" className="text-sm font-bold uppercase tracking-wide text-ink-3">
            Featured comparisons
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {featured.map((slug) => {
              const [a, b] = slug.split("-vs-").map((s) => s.toUpperCase());
              return (
                <li key={slug}>
                  <Link
                    href={`/compare/${slug}`}
                    className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 font-semibold text-ink hover:border-brand hover:bg-brand-wash hover:text-brand"
                  >
                    Compare {a} vs {b}
                    <span aria-hidden="true" className="text-ink-3">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Honest framing + noindex demo link */}
        <section aria-labelledby="about-heading" className="mx-auto max-w-4xl px-5 py-10">
          <div className="rounded-2xl border border-line bg-paper-2 p-6">
            <h2 id="about-heading" className="text-lg font-bold text-ink">
              About this demo
            </h2>
            <p className="mt-2 text-ink-2">
              This is a hiring work sample, not a live Wisesheets product. All figures are
              illustrative and labelled {SITE.asOfLong}. The comparison content plugs into
              Wisesheets&rsquo; existing data pipeline in a real deployment; here it runs on
              self-contained seed data so the demo never breaks.
            </p>
            <p className="mt-3 text-ink-2">
              One page is deliberately excluded from search indexing to show the
              anti-thin-content control:{" "}
              <Link href="/compare/cvbf-vs-myrg" className="font-semibold text-brand hover:underline">
                the CVBF vs MYRG demo
              </Link>{" "}
              renders normally but carries a <code className="rounded bg-paper px-1 text-sm">noindex</code>{" "}
              tag and is kept out of the sitemap because it fails the curation gate.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
