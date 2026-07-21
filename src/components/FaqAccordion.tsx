import type { Faq } from "@/data/pairs";

/**
 * FAQ accordion built on native <details>/<summary> — fully accessible and
 * keyboard-operable with zero client JS, and the answer text is present in the
 * server HTML (critical for answer engines and for the FAQPage JSON-LD to match).
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line rounded-xl border border-line">
      {faqs.map((f) => (
        <details key={f.q} className="group px-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-ink marker:content-none">
            <span>{f.q}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-brand transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-4 text-ink-2">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
