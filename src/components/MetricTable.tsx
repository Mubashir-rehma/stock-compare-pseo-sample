import type { Ticker } from "@/data/tickers";
import { buildRows, type MetricRow } from "@/lib/compare";

/**
 * Head-to-head metric table. The row leader is marked THREE ways so it never
 * relies on color alone: a "Leads" pill, a ▲ glyph, and bold weight, plus a
 * visually-hidden sentence for screen readers. Uses <th scope> for both the
 * column headers and the per-row metric labels.
 */
function LeadPill({ who, means }: { who: string; means?: string }) {
  return (
    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-win-wash px-1.5 py-0.5 text-[11px] font-semibold leading-none text-win">
      <span aria-hidden="true">▲</span> Leads
      <span className="sr-only">
        : {who} leads{means ? ` (${means})` : ""}
      </span>
    </span>
  );
}

function Cell({
  display,
  isLeader,
  symbol,
  means,
}: {
  display: string;
  isLeader: boolean;
  symbol: string;
  means?: string;
}) {
  return (
    <td
      className={`px-3 py-3 text-right align-top tabular-nums sm:px-4 ${
        isLeader ? "font-bold text-ink" : "font-medium text-ink-2"
      }`}
    >
      <div className="flex flex-col items-end">
        <span>{display}</span>
        {isLeader && <LeadPill who={symbol} means={means} />}
      </div>
    </td>
  );
}

export function MetricTable({ a, b }: { a: Ticker; b: Ticker }) {
  const rows: MetricRow[] = buildRows(a, b);
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[20rem] border-collapse text-sm">
        <caption className="sr-only">
          Head-to-head financial metrics for {a.symbol} and {b.symbol}, as of Q2 2026.
          The company leading each metric is marked.
        </caption>
        <thead>
          <tr className="border-b border-line bg-paper-2">
            <th scope="col" className="px-3 py-3 text-left font-semibold text-ink-3 sm:px-4">
              Metric
            </th>
            <th scope="col" className="px-3 py-3 text-right font-bold text-ink sm:px-4">
              {a.symbol}
              <span className="block text-xs font-normal text-ink-3">{a.name}</span>
            </th>
            <th scope="col" className="px-3 py-3 text-right font-bold text-ink sm:px-4">
              {b.symbol}
              <span className="block text-xs font-normal text-ink-3">{b.name}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.def.key as string}
              className={i % 2 === 1 ? "bg-paper-2/40" : undefined}
            >
              <th
                scope="row"
                className="px-3 py-3 text-left align-top font-medium text-ink-2 sm:px-4"
              >
                {r.def.label}
                <span className="block text-xs font-normal text-ink-3">{r.def.unit}</span>
              </th>
              <Cell
                display={r.aDisplay}
                isLeader={r.leader === "a"}
                symbol={a.symbol}
                means={r.def.leadMeans}
              />
              <Cell
                display={r.bDisplay}
                isLeader={r.leader === "b"}
                symbol={b.symbol}
                means={r.def.leadMeans}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
