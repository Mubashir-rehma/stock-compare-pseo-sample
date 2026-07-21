import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * robots.txt (P3-T6). Allows all crawlers and points to the sitemap. Per-page
 * noindex is handled by the robots meta tag from the curation gate, not here,
 * so thin pages are still crawlable-and-followable but excluded from the index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
