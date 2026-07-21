/**
 * JSON-LD builders. One <script type="application/ld+json"> per page holding an
 * @graph with BreadcrumbList, FAQPage, and WebPage (whose `about` references two
 * Corporation entities with tickerSymbol). The FAQPage mirrors the on-page FAQs
 * EXACTLY — same source array — which Google requires for rich-result eligibility.
 */
import type { Pair } from "@/data/pairs";
import type { Ticker } from "@/data/tickers";
import { absoluteUrl } from "@/lib/site";
import type { Crumb } from "@/components/Breadcrumbs";

export function corporationNode(t: Ticker) {
  return {
    "@type": "Corporation",
    name: t.name,
    tickerSymbol: t.symbol,
    description: t.description,
  };
}

export function breadcrumbNode(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };
}

export function faqNode(pair: Pair) {
  return {
    "@type": "FAQPage",
    mainEntity: pair.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function comparePageGraph(
  pair: Pair,
  a: Ticker,
  b: Ticker,
  crumbs: Crumb[],
  h1: string,
  description: string,
) {
  const url = absoluteUrl(`/compare/${pair.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbNode(crumbs),
      faqNode(pair),
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: h1,
        description,
        inLanguage: "en-US",
        isPartOf: { "@type": "WebSite", name: "Stock Compare", url: absoluteUrl("/") },
        about: [corporationNode(a), corporationNode(b)],
      },
    ],
  };
}

/** Renders a JSON-LD script tag. Content is server-generated, not user input. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
