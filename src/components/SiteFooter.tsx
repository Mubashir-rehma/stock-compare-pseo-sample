import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * Site footer. Carries the "Illustrative data" disclaimer on every page. The
 * optional `devNote` renders only on the noindex demo page, explaining why that
 * page is deliberately excluded from indexing.
 */
export function SiteFooter({ devNote }: { devNote?: string }) {
  return (
    <footer className="mt-16 border-t border-line bg-paper-2">
      <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-ink-3">
        {devNote && (
          <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-ink-2">
            <p className="font-semibold text-ink">Developer note — why this page is noindex</p>
            <p className="mt-1">{devNote}</p>
          </div>
        )}
        <p className="max-w-3xl">
          <strong className="font-semibold text-ink-2">Illustrative data for demo purposes,
          as of {SITE.asOf}.</strong>{" "}
          Figures are approximate and are not investment advice. This is a
          programmatic-SEO work sample built by {SITE.author} for Wisesheets — not
          a Wisesheets property. In production these pages read live figures from
          the Wisesheets data pipeline.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/" className="hover:text-brand">Home</Link>
          <Link href="/compare" className="hover:text-brand">All comparisons</Link>
          <a href={SITE.wisesheetsUrl} rel="noopener" className="hover:text-brand">wisesheets.io</a>
          <a href={SITE.repoUrl} rel="noopener" className="hover:text-brand">Source &amp; README</a>
        </div>
      </div>
    </footer>
  );
}
