/** Presentation formatters. Units are always explicit for answer-engine clarity. */

export function fmtMoneyB(v: number | null): string {
  if (v === null) return "—";
  if (v >= 1000) return `$${(v / 1000).toFixed(v >= 10000 ? 1 : 2)}T`;
  if (v >= 10) return `$${v.toFixed(0)}B`;
  return `$${v.toFixed(1)}B`;
}

export function fmtPrice(v: number | null): string {
  if (v === null) return "—";
  return `$${v.toFixed(2)}`;
}

export function fmtPct(v: number | null, digits = 1): string {
  if (v === null) return "—";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(digits)}%`;
}

/** Percentage with no leading + (for margins/yields, where sign is not meaningful). */
export function fmtPctPlain(v: number | null, digits = 1): string {
  if (v === null) return "—";
  return `${v.toFixed(digits)}%`;
}

export function fmtRatio(v: number | null): string {
  if (v === null) return "—";
  return v.toFixed(1);
}

export function fmtInt(v: number | null): string {
  if (v === null) return "—";
  return v.toLocaleString("en-US");
}
