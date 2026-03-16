import * as React from "react";
import { cn } from "../../utils/cn";

export interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Total number of steps. */
  steps: number;
  /**
   * How many steps are complete (0 = none, steps = all).
   * Clamped to [0, steps].
   */
  current: number;
  /** Override the filled-segment colour. Defaults to `hsl(var(--primary))`. */
  color?: string;
  /** Animate the fill on mount and when current changes. Default true. */
  animated?: boolean;
  /** Show "Step X of Y · Z%" label below the bar. Default true. */
  showLabel?: boolean;
  /** Visual height of the bar segments. Default "md". */
  size?: "sm" | "md" | "lg";
}

const HEIGHT: Record<string, string> = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2.5",
};

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  (
    {
      steps,
      current,
      color,
      animated = true,
      showLabel = true,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const safeSteps = Math.max(1, Math.round(steps));
    const safeCurrent = Math.min(Math.max(Math.round(current), 0), safeSteps);
    const percentage = Math.round((safeCurrent / safeSteps) * 100);

    const fillColor = color ?? "hsl(var(--primary))";

    return (
      <div
        ref={ref}
        className={cn("atlas-step-progress w-full", className)}
        role="progressbar"
        aria-valuenow={safeCurrent}
        aria-valuemin={0}
        aria-valuemax={safeSteps}
        aria-label={`Step ${safeCurrent} of ${safeSteps}`}
        {...props}
      >
        {/* Segment track */}
        <div className={cn("flex w-full gap-1", HEIGHT[size])}>
          {Array.from({ length: safeSteps }).map((_, i) => (
            <div
              key={i}
              className="flex-1 overflow-hidden rounded-full bg-secondary"
            >
              <div
                className="h-full w-full origin-left rounded-full"
                style={{
                  background: i < safeCurrent ? fillColor : "transparent",
                  transform: `scaleX(${i < safeCurrent ? 1 : 0})`,
                  transition: animated
                    ? `transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.04}s`
                    : undefined,
                }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Optional label */}
        {showLabel && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Step {safeCurrent} of {safeSteps}
            {" · "}
            {percentage}%
          </p>
        )}
      </div>
    );
  }
);

StepProgress.displayName = "StepProgress";

export { StepProgress };
