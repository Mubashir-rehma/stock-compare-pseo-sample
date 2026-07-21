import Link from "next/link";
import type { RelatedLink } from "@/lib/related";

/**
 * Internal-linking block. Anchor text is descriptive ("Compare AAPL vs GOOGL"),
 * never "click here", and each link carries a short reason for context.
 */
export function RelatedLinks({ links }: { links: RelatedLink[] }) {
  if (links.length === 0) return null;
  return (
    <nav aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-lg font-bold text-ink">
        Related comparisons
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.slug}>
            <Link
              href={`/compare/${l.slug}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 hover:border-brand hover:bg-brand-wash"
            >
              <span className="font-semibold text-ink group-hover:text-brand">
                Compare {l.label}
              </span>
              <span className="text-xs text-ink-3">{l.reason}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
