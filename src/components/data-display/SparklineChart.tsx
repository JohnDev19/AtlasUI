import * as React from "react";
import { cn } from "../../utils/cn";

export interface SparklineChartProps
  extends Omit<React.SVGProps<SVGSVGElement>, "viewBox" | "children"> {
  /** Array of numeric data points — at least 2 required to draw a line. */
  data: number[];
  /** CSS color string — defaults to currentColor (inherits from parent). */
  color?: string;
  /** Fill the area under the line with a gradient. Default true. */
  fill?: boolean;
  /** Show a dot at the last data point. Default true. */
  dotOnEnd?: boolean;
  /** Stroke width in SVG units. Default 1.5. */
  strokeWidth?: number;
  /** Rendered pixel height. Default 40. */
  height?: number;
}

const SparklineChart = React.forwardRef<SVGSVGElement, SparklineChartProps>(
  (
    {
      data = [],
      color = "currentColor",
      fill = true,
      dotOnEnd = true,
      strokeWidth = 1.5,
      height = 40,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const uid = React.useId().replace(/:/g, "");

    // Need at least 2 points for a line
    if (data.length < 2) {
      return (
        <svg
          ref={ref}
          width="100%"
          height={height}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={cn("atlas-sparkline", className)}
          style={style}
          {...props}
        >
          <line
            x1="0" y1="50" x2="100" y2="50"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );
    }

    const W = 100;
    const H = 100;
    const PAD = 8;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = (W - PAD * 2) / (data.length - 1);

    const pts = data.map((v, i) => ({
      x: PAD + i * step,
      y: PAD + (1 - (v - min) / range) * (H - PAD * 2),
    }));

    const linePath = pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ");

    const areaPath =
      linePath +
      ` L ${pts[pts.length - 1].x.toFixed(2)} ${H} L ${pts[0].x.toFixed(2)} ${H} Z`;

    const last = pts[pts.length - 1];

    return (
      <svg
        ref={ref}
        width="100%"
        height={height}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className={cn("atlas-sparkline overflow-visible", className)}
        style={{ color, ...style }}
        aria-hidden="true"
        {...props}
      >
        <defs>
          <linearGradient id={`sp-grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {fill && (
          <path
            d={areaPath}
            fill={`url(#sp-grad-${uid})`}
            stroke="none"
          />
        )}

        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {dotOnEnd && (
          <circle
            cx={last.x}
            cy={last.y}
            r="3"
            fill="currentColor"
            stroke="hsl(var(--background))"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    );
  }
);

SparklineChart.displayName = "SparklineChart";

export { SparklineChart };
