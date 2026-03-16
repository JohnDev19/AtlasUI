import * as React from "react";
import { cn } from "../../utils/cn";

export interface GaugeZone {
  /** Start of zone, expressed in the same units as min/max. */
  from: number;
  /** End of zone, expressed in the same units as min/max. */
  to: number;
  /** Any valid CSS color. */
  color: string;
}

export interface GaugeChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Current reading to display. */
  value: number;
  /** Minimum value on the scale. Default 0. */
  min?: number;
  /** Maximum value on the scale. Default 100. */
  max?: number;
  /**
   * Coloured zones along the arc.
   * Defaults to green → amber → red at 0–60, 60–80, 80–100.
   */
  zones?: GaugeZone[];
  /** Diameter of the gauge in pixels. Default 200. */
  size?: number;
  /** Accessible label shown below the value. */
  label?: string;
  /** Unit string appended to the displayed value. Default "%". */
  unit?: string;
  /** Animate the needle to the value on mount/change. Default true. */
  animated?: boolean;
  /** Arc stroke width in pixels. Default 12. */
  strokeWidth?: number;
}

const DEFAULT_ZONES: GaugeZone[] = [
  { from: 0,  to: 60,  color: "hsl(var(--success))" },
  { from: 60, to: 80,  color: "hsl(var(--warning))" },
  { from: 80, to: 100, color: "hsl(var(--destructive))" },
];

/** Convert polar coords (angle in standard math degrees) to SVG Cartesian. */
function ptc(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad), // SVG y increases downward
  };
}

/**
 * Build an SVG arc path from startDeg to endDeg (standard math degrees,
 * going counterclockwise through the top of the circle).
 * 180° = leftmost point, 0° = rightmost point.
 */
function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string {
  const start = ptc(cx, cy, r, startDeg);
  const end   = ptc(cx, cy, r, endDeg);
  const spanDeg = Math.abs(startDeg - endDeg);
  if (spanDeg < 0.5) return ""; // nothing to draw
  const largeArc = spanDeg > 180 ? 1 : 0;
  // sweep=0 → counterclockwise → upper semicircle going left→right
  return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 0 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

const GaugeChart = React.forwardRef<HTMLDivElement, GaugeChartProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      zones = DEFAULT_ZONES,
      size = 200,
      label,
      unit = "%",
      animated = true,
      strokeWidth = 12,
      className,
      ...props
    },
    ref
  ) => {
    const clamped = Math.min(Math.max(value, min), max);
    const targetT = (clamped - min) / (max - min);

    // Animate t from 0 (or previous value) to targetT using rAF
    const animTRef = React.useRef(animated ? 0 : targetT);
    const [animT, setAnimT] = React.useState(animated ? 0 : targetT);
    const rafRef = React.useRef<number | null>(null);

    React.useEffect(() => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (!animated) {
        animTRef.current = targetT;
        setAnimT(targetT);
        return;
      }

      const from = animTRef.current;
      const startTime = performance.now();
      const dur = 900;

      const tick = (now: number) => {
        const p = Math.min((now - startTime) / dur, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        const current = from + (targetT - from) * eased;
        animTRef.current = current;
        setAnimT(current);
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
    }, [targetT, animated]); // eslint-disable-line react-hooks/exhaustive-deps

    const W = size;
    // Height = half the width + padding for label/needle pivot below arc
    const H = Math.round(size * 0.62);
    const cx = W / 2;
    const cy = H - 20; // needle pivot above bottom edge
    const r = Math.min(cx, cy) - strokeWidth / 2 - 6;

    // Needle: 180° at min, 0° at max
    const needleAngle = 180 - animT * 180;
    const needleLen = r - strokeWidth * 0.6;
    const needleEnd = ptc(cx, cy, needleLen, needleAngle);

    // Zone arcs
    const zoneArcs = zones.map((z) => {
      const fromT = (z.from - min) / (max - min);
      const toT   = (z.to   - min) / (max - min);
      return {
        path:  arcPath(cx, cy, r, 180 - fromT * 180, 180 - toT * 180),
        color: z.color,
      };
    });

    const displayValue = Math.round(value);

    return (
      <div
        ref={ref}
        className={cn("atlas-gauge-chart inline-flex flex-col items-center", className)}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label ?? `${displayValue}${unit}`}
        {...props}
      >
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          overflow="visible"
          aria-hidden="true"
        >
          {/* Background arc */}
          <path
            d={arcPath(cx, cy, r, 180, 0)}
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Zone arcs */}
          {zoneArcs.map((z, i) =>
            z.path ? (
              <path
                key={i}
                d={z.path}
                fill="none"
                stroke={z.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity="0.75"
              />
            ) : null
          )}

          {/* Needle */}
          <line
            x1={cx.toFixed(2)}
            y1={cy.toFixed(2)}
            x2={needleEnd.x.toFixed(2)}
            y2={needleEnd.y.toFixed(2)}
            stroke="hsl(var(--foreground))"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Pivot — outer ring then inner fill for a clean look */}
          <circle cx={cx} cy={cy} r={6} fill="hsl(var(--foreground))" />
          <circle cx={cx} cy={cy} r={3.5} fill="hsl(var(--background))" />

          {/* Value text */}
          <text
            x={cx}
            y={cy - needleLen * 0.35}
            textAnchor="middle"
            fontSize={Math.round(size * 0.11)}
            fontWeight="600"
            fill="hsl(var(--foreground))"
            fontFamily="inherit"
          >
            {displayValue}{unit}
          </text>

          {/* Min label */}
          <text
            x={cx - r - strokeWidth / 2 - 2}
            y={cy + 16}
            textAnchor="middle"
            fontSize="11"
            fill="hsl(var(--muted-foreground))"
            fontFamily="inherit"
          >
            {min}
          </text>

          {/* Max label */}
          <text
            x={cx + r + strokeWidth / 2 + 2}
            y={cy + 16}
            textAnchor="middle"
            fontSize="11"
            fill="hsl(var(--muted-foreground))"
            fontFamily="inherit"
          >
            {max}
          </text>
        </svg>

        {label && (
          <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
        )}
      </div>
    );
  }
);

GaugeChart.displayName = "GaugeChart";

export { GaugeChart };
