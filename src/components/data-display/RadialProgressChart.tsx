import * as React from "react";
import { cn } from "../../utils/cn";

export interface RadialProgressSegment {
  /** Numeric value — segments are sized relative to the total of all values. */
  value: number;
  /** Any valid CSS color. Falls back to design-token color when omitted. */
  color?: string;
  /** Legend label shown below the ring. */
  label?: string;
}

export interface RadialProgressChartProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: RadialProgressSegment[];
  /** Diameter of the ring in pixels. Default 120. */
  size?: number;
  /** Stroke width of the ring. Default 10. */
  thickness?: number;
  /** Content rendered in the hollow center. */
  centerLabel?: React.ReactNode;
  /** Show the colour legend below the ring. Default true. */
  showLegend?: boolean;
  /** Animate segments on mount. Default true. */
  animated?: boolean;
}

// Fallback palette using design token colours
const FALLBACK_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--info))",
  "hsl(var(--destructive))",
];

const RadialProgressChart = React.forwardRef<HTMLDivElement, RadialProgressChartProps>(
  (
    {
      segments = [],
      size = 120,
      thickness = 10,
      centerLabel,
      showLegend = true,
      animated = true,
      className,
      ...props
    },
    ref
  ) => {
    const [ready, setReady] = React.useState(!animated);

    React.useEffect(() => {
      if (!animated) return;
      // Small delay so the CSS transition fires after mount
      const t = setTimeout(() => setReady(true), 60);
      return () => clearTimeout(t);
    }, [animated]);

    const r = (size - thickness) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;

    const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    // Gap between segments in circumference units (≈3 px rendered)
    const gapLen = segments.length > 1 ? Math.min(4, circumference * 0.02) : 0;
    const usableLen = circumference - gapLen * segments.length;

    // Pre-compute offsets
    const offsets: number[] = [];
    let acc = 0;
    segments.forEach((seg) => {
      offsets.push(acc);
      const segLen = (seg.value / total) * usableLen;
      acc += segLen + gapLen;
    });

    return (
      <div
        ref={ref}
        className={cn(
          "atlas-radial-chart inline-flex flex-col items-center gap-3",
          className
        )}
        {...props}
      >
        <div
          className="relative inline-block"
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden="true"
          >
            {/* Track */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth={thickness}
            />

            {/* Segments */}
            {segments.map((seg, i) => {
              const segLen = ready ? (seg.value / total) * usableLen : 0;
              const dashGap = circumference - segLen;
              const offset = -(offsets[i]);

              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={seg.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                  strokeWidth={thickness}
                  strokeLinecap="butt"
                  strokeDasharray={`${segLen} ${dashGap}`}
                  strokeDashoffset={offset}
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: `${cx}px ${cy}px`,
                    transition: animated
                      ? `stroke-dasharray 0.75s ease ${i * 0.08}s`
                      : undefined,
                  }}
                />
              );
            })}
          </svg>

          {/* Center label */}
          {centerLabel && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              {centerLabel}
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && segments.some((s) => s.label) && (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {segments.map((seg, i) =>
              seg.label ? (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      background:
                        seg.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                    }}
                    aria-hidden="true"
                  />
                  {seg.label}
                </span>
              ) : null
            )}
          </div>
        )}
      </div>
    );
  }
);

RadialProgressChart.displayName = "RadialProgressChart";

export { RadialProgressChart };
