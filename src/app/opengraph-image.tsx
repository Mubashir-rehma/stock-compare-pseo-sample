import { ImageResponse } from "next/og";
import { INDEXABLE_PAIRS } from "@/data/pairs";
import { SITE } from "@/lib/site";

export const alt = "Stock Compare — side-by-side stock comparisons";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#1fb723"; // Wisesheets signature green
const INK = "#0b0f14";

/**
 * Default OG image for the site root and the hub (comparison pages override this
 * with their own pair-specific image). Prerendered at build time.
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#f7f8fa",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 12,
              background: BRAND,
              color: "white",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            vs
          </div>
          STOCK COMPARE
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "white", fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>
            Stock-vs-stock comparison pages, built to scale.
          </div>
          <div style={{ display: "flex", color: "#94a3b8", fontSize: 30, marginTop: 24 }}>
            {`${INDEXABLE_PAIRS.length} head-to-head comparisons · valuation, margins, growth & dividends`}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: 24 }}>
          <span>{SITE.tagline}</span>
          <span>Illustrative data · Q2 2026</span>
        </div>
      </div>
    ),
    size,
  );
}
