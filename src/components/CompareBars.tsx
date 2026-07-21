/**
 * Server-rendered SVG comparison bars. No client JS, no chart library, explicit
 * viewBox + width/height so there is zero layout shift. Two companies share one
 * scale. `signed` renders a diverging chart around a zero baseline so negative
 * values (e.g. 5-year returns) display correctly. Series are distinguished by
 * both color and an always-present text label — never color alone.
 */
export interface Series {
  label: string; // ticker
  value: number;
}

interface CompareBarsProps {
  title: string;
  caption: string;
  a: Series;
  b: Series;
  signed?: boolean;
  format: (v: number) => string;
}

const W = 340;
const ROW_H = 46;
const LABEL_W = 52;
const VALUE_W = 66;
const PAD = 8;

export function CompareBars({ title, caption, a, b, signed = false, format }: CompareBarsProps) {
  const barAreaW = W - LABEL_W - VALUE_W - PAD * 2;
  const barAreaX = LABEL_W + PAD;
  const maxAbs = Math.max(Math.abs(a.value), Math.abs(b.value), 1);
  const H = ROW_H * 2 + PAD * 2;

  const rows = [
    { s: a, fill: "var(--brand)", y: PAD },
    { s: b, fill: "var(--ink-3)", y: PAD + ROW_H },
  ];

  const zeroX = signed ? barAreaX + barAreaW / 2 : barAreaX;
  const scale = signed ? barAreaW / 2 / maxAbs : barAreaW / maxAbs;

  return (
    <figure className="rounded-xl border border-line bg-paper-2/40 p-4">
      <figcaption className="mb-2 text-sm font-semibold text-ink">{title}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label={caption}
        className="block"
      >
        {signed && (
          <line
            x1={zeroX}
            y1={PAD}
            x2={zeroX}
            y2={H - PAD}
            stroke="var(--line-2)"
            strokeWidth={1}
          />
        )}
        {rows.map(({ s, fill, y }) => {
          const len = Math.abs(s.value) * scale;
          const barY = y + 10;
          const barH = ROW_H - 22;
          const x = signed && s.value < 0 ? zeroX - len : zeroX;
          return (
            <g key={s.label}>
              <text
                x={LABEL_W}
                y={y + ROW_H / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={13}
                fontWeight={600}
                fill="var(--ink-2)"
              >
                {s.label}
              </text>
              <rect
                x={x}
                y={barY}
                width={Math.max(len, 2)}
                height={barH}
                rx={3}
                fill={fill}
              />
              <text
                x={W - VALUE_W + PAD}
                y={y + ROW_H / 2}
                textAnchor="start"
                dominantBaseline="middle"
                fontSize={13}
                fontWeight={600}
                fill="var(--ink)"
              >
                {format(s.value)}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
