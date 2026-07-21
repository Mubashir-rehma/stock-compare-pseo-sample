import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper/80 backdrop-blur supports-[backdrop-filter]:bg-paper/60 sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-ink">
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-md bg-brand-btn text-sm font-black text-white"
          >
            vs
          </span>
          {SITE.name}
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2 text-sm font-medium sm:gap-4">
          <Link href="/compare" className="rounded-md px-2 py-2 text-ink-2 hover:text-brand">
            Compare stocks
          </Link>
          <a
            href={SITE.wisesheetsUrl}
            rel="noopener"
            className="rounded-md px-2 py-2 text-ink-2 hover:text-brand"
          >
            Wisesheets
          </a>
        </nav>
      </div>
    </header>
  );
}
