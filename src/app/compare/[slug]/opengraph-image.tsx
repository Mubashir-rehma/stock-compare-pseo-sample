import { ImageResponse } from "next/og";
import { PAIRS, getPair } from "@/data/pairs";
import { getTicker } from "@/data/tickers";
import { fmtMoneyB } from "@/lib/format";

export const alt = "Stock comparison — head to head";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Prerender an OG image for every pair (including the noindex demo). */
export function generateStaticParams() {
  return PAIRS.map((p) => ({ slug: p.slug }));
}

const BRAND = "#1d4ed8";
const INK = "#0b1120";
const PAPER = "#f7f8fa";

function Card({
  symbol,
  name,
  stat,
  accent,
}: {
  symbol: string;
  name: string;
  stat: string;
  accent: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 400,
        padding: "40px 36px",
        borderRadius: 24,
        background: accent ? BRAND : "#1e293b",
        color: "white",
      }}
    >
      <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1 }}>{symbol}</div>
      <div style={{ fontSize: 24, opacity: 0.8, marginTop: 12 }}>{name}</div>
      <div style={{ fontSize: 22, opacity: 0.7, marginTop: 28 }}>Market cap</div>
      <div style={{ fontSize: 44, fontWeight: 700, marginTop: 4 }}>{stat}</div>
    </div>
  );
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = getPair(slug);
  const a = pair ? getTicker(pair.a) : undefined;
  const b = pair ? getTicker(pair.b) : undefined;

  if (!pair || !a || !b) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: INK,
            color: "white",
            fontSize: 64,
            fontWeight: 800,
          }}
        >
          Stock Compare
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: INK,
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: PAPER,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 10,
              background: BRAND,
              color: "white",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            vs
          </div>
          STOCK COMPARE
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            flex: 1,
          }}
        >
          <Card symbol={a.symbol} name={a.name} stat={fmtMoneyB(a.marketCapB)} accent />
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, color: "#64748b" }}>
            VS
          </div>
          <Card symbol={b.symbol} name={b.name} stat={fmtMoneyB(b.marketCapB)} accent={false} />
        </div>

        <div style={{ display: "flex", color: "#94a3b8", fontSize: 24 }}>
          {a.symbol} vs {b.symbol} · P/E, margins, growth &amp; dividends · Illustrative data,
          as of Q2 2026
        </div>
      </div>
    ),
    size,
  );
}
