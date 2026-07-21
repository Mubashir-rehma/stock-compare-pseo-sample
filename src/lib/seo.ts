/**
 * Per-page SEO helpers: the H1 (varied, angle-aware), the <title> (<=60 chars),
 * and the meta description (<=155 chars, interpolating real data points).
 * The `robots` decision comes from the curation gate, so noindex is driven by
 * exactly the same function the sitemap uses.
 */
import type { Metadata } from "next";
import type { Pair } from "@/data/pairs";
import type { Ticker } from "@/data/tickers";
import { fmtRatio } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";
import { shouldIndex } from "@/lib/curation";

const H1_QUESTIONS = [
  "Which Stock Is the Better Buy in 2026?",
  "Which Is the Better Investment in 2026?",
  "How Do They Compare in 2026?",
  "Which Stock Comes Out Ahead in 2026?",
];

function slugHash(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = (h * 33) ^ slug.charCodeAt(i);
  return Math.abs(h);
}

/** Unique, angle-aware H1. Ticker pair + a varied question phrasing. */
export function buildH1(pair: Pair): string {
  const q = H1_QUESTIONS[slugHash(pair.slug) % H1_QUESTIONS.length];
  return `${pair.a} vs ${pair.b}: ${q}`;
}

/** Capitalized angle used as the dek under the H1. */
export function buildDek(pair: Pair): string {
  const a = pair.angle.trim();
  return a.charAt(0).toUpperCase() + a.slice(1) + ".";
}

/** <=155 char description with one or two concrete data points. */
export function buildDescription(pair: Pair, a: Ticker, b: Ticker): string {
  const peA = a.peRatio !== null ? `${fmtRatio(a.peRatio)}x` : "n/a";
  const peB = b.peRatio !== null ? `${fmtRatio(b.peRatio)}x` : "n/a";
  const d = `Compare ${a.symbol} vs ${b.symbol}: P/E (${peA} vs ${peB}), margins, growth, dividends and returns, side by side. Illustrative data, Q2 2026.`;
  return d.length <= 155 ? d : d.slice(0, 152).trimEnd() + "…";
}

export function buildMetadata(pair: Pair, a: Ticker, b: Ticker): Metadata {
  const path = `/compare/${pair.slug}`;
  const canonical = absoluteUrl(path);
  // Title kept <=60 chars.
  let title = `${a.symbol} vs ${b.symbol} Stock Comparison: P/E, Dividends & More`;
  if (title.length > 60) title = `${a.symbol} vs ${b.symbol}: Stock Comparison (P/E, Dividends)`;
  if (title.length > 60) title = `${a.symbol} vs ${b.symbol} Stock Comparison`;
  const description = buildDescription(pair, a, b);
  const index = shouldIndex(pair.a, pair.b, pair.slug);

  return {
    title,
    description,
    alternates: { canonical },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      siteName: "Stock Compare",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
