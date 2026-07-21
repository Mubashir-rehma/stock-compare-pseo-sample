/**
 * Deterministic comparative prose. Each section (Valuation, Profitability,
 * Growth, Dividends) is generated from the seed data with sentence structure
 * chosen by a hash of the pair slug — so the copy is data-driven AND varies
 * across pairs, never reading as copy-paste. Same slug always yields the same
 * text (build-stable). All phrasing is factual and comparative; no hype, no
 * investment advice.
 */
import type { Ticker } from "@/data/tickers";
import type { Pair } from "@/data/pairs";
import { fmtMoneyB, fmtPct, fmtPctPlain, fmtRatio } from "@/lib/format";

export interface ProseSection {
  id: string;
  heading: string;
  paragraph: string;
}

/** djb2 string hash — small, deterministic, no runtime randomness. */
function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return Math.abs(h);
}

function pick<T>(variants: T[], seed: number): T {
  return variants[seed % variants.length];
}

/** First word of a company name, for readable prose ("Apple", "Coca-Cola"). */
function shortName(t: Ticker): string {
  return t.name
    .replace(/,? (Inc\.?|Incorporated|Corporation|Corp\.?|Company|PLC|Co\.?|Group|Platforms|Motor)\b.*$/i, "")
    .trim();
}

function higherOf(a: Ticker, b: Ticker, key: keyof Ticker): { win: Ticker; lose: Ticker } {
  const av = a[key] as number;
  const bv = b[key] as number;
  return av >= bv ? { win: a, lose: b } : { win: b, lose: a };
}

export function generateSections(pair: Pair, a: Ticker, b: Ticker): ProseSection[] {
  const base = hash(pair.slug);
  const an = shortName(a);
  const bn = shortName(b);
  const sections: ProseSection[] = [];

  // --- Valuation -----------------------------------------------------------
  {
    const seed = base + 1;
    const cheaper = a.peRatio !== null && b.peRatio !== null
      ? (a.peRatio <= b.peRatio ? a : b)
      : null;
    const pricier = cheaper ? (cheaper === a ? b : a) : null;
    const bigger = higherOf(a, b, "marketCapB").win;
    let p: string;
    if (cheaper && pricier) {
      const cn = shortName(cheaper);
      const pn = shortName(pricier);
      p = pick(
        [
          `On valuation, ${cn} (${cheaper.symbol}) trades at the lower multiple — about ${fmtRatio(cheaper.peRatio)}x trailing earnings versus roughly ${fmtRatio(pricier.peRatio)}x for ${pn} (${pricier.symbol}). ${shortName(bigger)} is the larger company by market cap at ${fmtMoneyB(bigger.marketCapB)}. A lower P/E is not automatically "better" — it can signal either a bargain or slower expected growth.`,
          `${cn} (${cheaper.symbol}) is the cheaper of the two on earnings, priced near ${fmtRatio(cheaper.peRatio)}x versus about ${fmtRatio(pricier.peRatio)}x for ${pn} (${pricier.symbol}). The gap reflects how the market weighs each company's growth and risk rather than any fixed sense of fair value. By size, ${shortName(bigger)} leads at ${fmtMoneyB(bigger.marketCapB)}.`,
          `The two carry different valuations: ${pn} (${pricier.symbol}) commands roughly ${fmtRatio(pricier.peRatio)}x trailing earnings against ${cn}'s (${cheaper.symbol}) ${fmtRatio(cheaper.peRatio)}x. ${shortName(bigger)} is the bigger business at ${fmtMoneyB(bigger.marketCapB)} in market value. Whether the premium is justified depends on which growth path you find more credible.`,
        ],
        seed,
      );
    } else {
      p = `${shortName(bigger)} (${bigger.symbol}) is the larger company at ${fmtMoneyB(bigger.marketCapB)}. A trailing P/E is unavailable for at least one of these companies as of Q2 2026, so the pair is best compared on growth, margins, and cash returns rather than on an earnings multiple.`;
    }
    sections.push({ id: "valuation", heading: "Valuation", paragraph: p });
  }

  // --- Profitability -------------------------------------------------------
  {
    const seed = base + 2;
    const netWin = higherOf(a, b, "netMarginPct").win;
    const netLose = netWin === a ? b : a;
    const grossWin = higherOf(a, b, "grossMarginPct").win;
    const p = pick(
      [
        `${shortName(netWin)} (${netWin.symbol}) converts more of each sales dollar into profit, with a net margin near ${fmtPctPlain(netWin.netMarginPct)} against ${shortName(netLose)}'s (${netLose.symbol}) ${fmtPctPlain(netLose.netMarginPct)}. ${shortName(grossWin)} also carries the higher gross margin at ${fmtPctPlain(grossWin.grossMarginPct)}. In dollar terms, ${an} posted ${fmtMoneyB(a.netIncomeTtmB)} of net income over the trailing year versus ${fmtMoneyB(b.netIncomeTtmB)} for ${bn}.`,
        `Profitability favors ${shortName(netWin)} (${netWin.symbol}), whose ${fmtPctPlain(netWin.netMarginPct)} net margin tops ${shortName(netLose)}'s (${netLose.symbol}) ${fmtPctPlain(netLose.netMarginPct)}. That efficiency shows up in trailing net income of ${fmtMoneyB(netWin.netIncomeTtmB)} versus ${fmtMoneyB(netLose.netIncomeTtmB)}. Gross margins tell a similar story, with ${shortName(grossWin)} ahead at ${fmtPctPlain(grossWin.grossMarginPct)}.`,
        `Measured by margin, ${shortName(netWin)} (${netWin.symbol}) is the more profitable business — roughly ${fmtPctPlain(netWin.netMarginPct)} net versus ${fmtPctPlain(netLose.netMarginPct)} for ${shortName(netLose)} (${netLose.symbol}) — and it earned ${fmtMoneyB(netWin.netIncomeTtmB)} in trailing net income. ${shortName(grossWin)} leads on gross margin at ${fmtPctPlain(grossWin.grossMarginPct)}, a reminder that cost structures differ sharply between the two.`,
      ],
      seed,
    );
    sections.push({ id: "profitability", heading: "Profitability", paragraph: p });
  }

  // --- Growth --------------------------------------------------------------
  {
    const seed = base + 3;
    const growWin = higherOf(a, b, "revenueGrowth5yCagrPct").win;
    const growLose = growWin === a ? b : a;
    const ret5Win = higherOf(a, b, "return5yPct").win;
    const p = pick(
      [
        `${shortName(growWin)} (${growWin.symbol}) has expanded revenue faster over the past five years — about ${fmtPct(growWin.revenueGrowth5yCagrPct)} compound annual growth versus ${fmtPct(growLose.revenueGrowth5yCagrPct)} for ${shortName(growLose)} (${growLose.symbol}). Shareholder returns have tracked that gap: ${shortName(ret5Win)} led on five-year price return (${fmtPct(ret5Win.return5yPct)}).`,
        `On growth, ${shortName(growWin)} (${growWin.symbol}) is ahead, compounding revenue at roughly ${fmtPct(growWin.revenueGrowth5yCagrPct)} a year against ${shortName(growLose)}'s (${growLose.symbol}) ${fmtPct(growLose.revenueGrowth5yCagrPct)}. Over five years the stronger operator, ${shortName(ret5Win)}, also delivered the better price return at ${fmtPct(ret5Win.return5yPct)}.`,
        `${shortName(growWin)} (${growWin.symbol}) has grown the top line more quickly — near ${fmtPct(growWin.revenueGrowth5yCagrPct)} five-year CAGR versus ${fmtPct(growLose.revenueGrowth5yCagrPct)} at ${shortName(growLose)} (${growLose.symbol}). Longer-term price performance echoes it, with ${shortName(ret5Win)} up ${fmtPct(ret5Win.return5yPct)} over five years. Past growth, of course, does not guarantee future results.`,
      ],
      seed,
    );
    sections.push({ id: "growth", heading: "Growth", paragraph: p });
  }

  // --- Dividends -----------------------------------------------------------
  {
    const seed = base + 4;
    const aDiv = a.dividendYieldPct;
    const bDiv = b.dividendYieldPct;
    let p: string;
    if (aDiv === null && bDiv === null) {
      p = `Neither ${an} (${a.symbol}) nor ${bn} (${b.symbol}) pays a dividend as of Q2 2026; both reinvest cash into growth and, in some periods, share buybacks. Income-focused investors would look elsewhere, while these two are held primarily for capital appreciation.`;
    } else if (aDiv === null || bDiv === null) {
      const payer = aDiv !== null ? a : b;
      const nonPayer = aDiv !== null ? b : a;
      p = pick(
        [
          `${shortName(payer)} (${payer.symbol}) pays a dividend yielding about ${fmtPctPlain(payer.dividendYieldPct, 2)}, while ${shortName(nonPayer)} (${nonPayer.symbol}) pays none as of Q2 2026. For income, ${shortName(payer)} is the only option of the two; ${shortName(nonPayer)} returns cash, if at all, through reinvestment and buybacks.`,
          `On dividends the pair splits cleanly: ${shortName(payer)} (${payer.symbol}) yields roughly ${fmtPctPlain(payer.dividendYieldPct, 2)}, whereas ${shortName(nonPayer)} (${nonPayer.symbol}) does not pay one. Income investors get nothing from ${shortName(nonPayer)} today, so the choice hinges on growth versus yield.`,
        ],
        seed,
      );
    } else {
      const hiWin = higherOf(a, b, "dividendYieldPct").win;
      const hiLose = hiWin === a ? b : a;
      p = pick(
        [
          `For dividend income, ${shortName(hiWin)} (${hiWin.symbol}) offers the higher yield at about ${fmtPctPlain(hiWin.dividendYieldPct, 2)}, versus ${fmtPctPlain(hiLose.dividendYieldPct, 2)} for ${shortName(hiLose)} (${hiLose.symbol}). Both return cash to shareholders, but ${shortName(hiWin)} currently pays out more relative to its share price.`,
          `${shortName(hiWin)} (${hiWin.symbol}) is the stronger income pick of the two, yielding roughly ${fmtPctPlain(hiWin.dividendYieldPct, 2)} against ${shortName(hiLose)}'s (${hiLose.symbol}) ${fmtPctPlain(hiLose.dividendYieldPct, 2)}. A higher yield can reflect either a generous payout or a weaker share price, so it is worth reading alongside the growth and margin picture above.`,
        ],
        seed,
      );
    }
    sections.push({ id: "dividends", heading: "Dividends", paragraph: p });
  }

  return sections;
}
