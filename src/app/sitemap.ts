import type { MetadataRoute } from "next";
import { INDEXABLE_PAIRS } from "@/data/pairs";
import { shouldIndex } from "@/lib/curation";
import { absoluteUrl, SITE } from "@/lib/site";

/**
 * Sitemap (P3-T5). Includes the homepage, the hub, and ONLY pairs that pass the
 * curation gate — the same shouldIndex() the page's robots meta uses. The thin
 * noindex pair is therefore absent by construction, not by a hand-maintained
 * exclusion list.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(SITE.lastModified);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/compare"), lastModified, changeFrequency: "weekly", priority: 0.9 },
  ];

  const pairRoutes: MetadataRoute.Sitemap = INDEXABLE_PAIRS.filter((p) =>
    shouldIndex(p.a, p.b, p.slug),
  ).map((p) => ({
    url: absoluteUrl(`/compare/${p.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...pairRoutes];
}
