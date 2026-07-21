import Link from "next/link";

export interface Crumb {
  name: string;
  href?: string; // last crumb has no href (current page)
}

/** Accessible breadcrumb trail. Mirrors the BreadcrumbList JSON-LD exactly. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.name} className="flex items-center gap-x-2">
              {c.href && !last ? (
                <Link href={c.href} className="hover:text-brand hover:underline">
                  {c.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-ink-2">
                  {c.name}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-ink-3">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
