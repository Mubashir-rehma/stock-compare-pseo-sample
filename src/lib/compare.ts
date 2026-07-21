/**
 * Head-to-head metric model. Defines the comparable rows once and computes the
 * "leader" per row. `preferred` encodes whether a higher or lower value leads;
 * size metrics (market cap, price, headcount) are neutral and never marked, so
 * the page never implies that "bigger = better".
 */
import type { Ticker } from "@/data/tickers";
import {
  fmtInt,
  fmtMoneyB,
  fmtPct,
  fmtPctPlain,
  fmtPrice,
  fmtRatio,
} from "@/lib/format";

export type Preferred = "higher" | "lower" | "neutral";
export type Leader = "a" | "b" | "tie" | "none";

export interface MetricDef {
  key: keyof Ticker;
  label: string;
  /** Short unit/qualifier shown under the label. */
  unit: string;
  preferred: Preferred;
  format: (v: number | null) => string;
  /** Plain-language note on what "leads" means, for the row's screen-reader text. */
  leadMeans?: string;
}

export const METRICS: MetricDef[] = [
  { key: "marketCapB", label: "Market cap", unit: "USD", preferred: "neutral", format: fmtMoneyB },
  { key: "price", label: "Share price", unit: "USD", preferred: "neutral", format: fmtPrice },
  {
    key: "peRatio",
    label: "P/E ratio",
    unit: "trailing",
    preferred: "lower",
    format: fmtRatio,
    leadMeans: "lower / cheaper on earnings",
  },
  {
    key: "dividendYieldPct",
    label: "Dividend yield",
    unit: "%",
    preferred: "higher",
    format: (v) => fmtPctPlain(v, 2),
    leadMeans: "higher income yield",
  },
  { key: "revenueTtmB", label: "Revenue", unit: "TTM, USD", preferred: "neutral", format: fmtMoneyB },
  { key: "netIncomeTtmB", label: "Net income", unit: "TTM, USD", preferred: "neutral", format: fmtMoneyB },
  {
    key: "grossMarginPct",
    label: "Gross margin",
    unit: "%",
    preferred: "higher",
    format: (v) => fmtPctPlain(v),
    leadMeans: "higher gross margin",
  },
  {
    key: "netMarginPct",
    label: "Net margin",
    unit: "%",
    preferred: "higher",
    format: (v) => fmtPctPlain(v),
    leadMeans: "higher net margin",
  },
  {
    key: "revenueGrowth5yCagrPct",
    label: "Revenue growth",
    unit: "5Y CAGR",
    preferred: "higher",
    format: (v) => fmtPct(v),
    leadMeans: "faster revenue growth",
  },
  {
    key: "return1yPct",
    label: "1-year return",
    unit: "price",
    preferred: "higher",
    format: (v) => fmtPct(v),
    leadMeans: "stronger 1-year return",
  },
  {
    key: "return5yPct",
    label: "5-year return",
    unit: "price",
    preferred: "higher",
    format: (v) => fmtPct(v),
    leadMeans: "stronger 5-year return",
  },
  { key: "employees", label: "Employees", unit: "count", preferred: "neutral", format: fmtInt },
  { key: "founded", label: "Founded", unit: "year", preferred: "neutral", format: (v) => (v === null ? "—" : String(v)) },
];

export interface MetricRow {
  def: MetricDef;
  aValue: number | null;
  bValue: number | null;
  aDisplay: string;
  bDisplay: string;
  leader: Leader;
}

function decideLeader(a: number | null, b: number | null, preferred: Preferred): Leader {
  if (preferred === "neutral") return "none";
  if (a === null || b === null) return "none";
  if (a === b) return "tie";
  if (preferred === "higher") return a > b ? "a" : "b";
  return a < b ? "a" : "b"; // lower preferred
}

export function buildRows(a: Ticker, b: Ticker): MetricRow[] {
  return METRICS.map((def) => {
    const aValue = a[def.key] as number | null;
    const bValue = b[def.key] as number | null;
    return {
      def,
      aValue,
      bValue,
      aDisplay: def.format(aValue),
      bDisplay: def.format(bValue),
      leader: decideLeader(aValue, bValue, def.preferred),
    };
  });
}

/** Count of rows each side leads (for the verdict scoreboard). */
export function scoreLeads(rows: MetricRow[]): { a: number; b: number } {
  return rows.reduce(
    (acc, r) => {
      if (r.leader === "a") acc.a += 1;
      else if (r.leader === "b") acc.b += 1;
      return acc;
    },
    { a: 0, b: 0 },
  );
}
