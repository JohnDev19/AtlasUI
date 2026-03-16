import * as React from "react";
import { cn } from "../../utils/cn";

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange" | "size"
  > {
  /** Controlled value. If omitted the component manages its own state. */
  value?: number;
  /** Called with the new numeric value whenever it changes. */
  onChange?: (value: number) => void;
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /** Step amount for increment/decrement. Default 1. */
  step?: number;
  /** Visual size variant. Default "md". */
  size?: "xs" | "sm" | "md" | "lg";
  /** Marks the input as invalid (red border). */
  invalid?: boolean;
}

// ── size maps ─────────────────────────────────────────────────────────────

const INPUT_SIZE: Record<string, string> = {
  xs: "h-6  text-xs",
  sm: "h-8  text-sm",
  md: "h-9  text-sm",
  lg: "h-10 text-base",
};

const BTN_SIZE: Record<string, string> = {
  xs: "w-6  h-6",
  sm: "w-8  h-8",
  md: "w-9  h-9",
  lg: "w-10 h-10",
};

// ── component ─────────────────────────────────────────────────────────────

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value: controlledValue,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      size = "md",
      invalid = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    // If uncontrolled, maintain internal state
    const [internal, setInternal] = React.useState<number>(0);
    const isControlled = controlledValue !== undefined;
    const current = isControlled ? controlledValue : internal;

    const update = React.useCallback(
      (next: number) => {
        const clamped = Number(
          Math.min(Math.max(next, min === -Infinity ? -1e15 : min), max === Infinity ? 1e15 : max)
            .toFixed(10) // avoid float drift
        );
        const rounded = parseFloat(clamped.toPrecision(15));
        if (!isControlled) setInternal(rounded);
        onChange?.(rounded);
      },
      [min, max, isControlled, onChange]
    );

    const decrement = () => update(current - step);
    const increment = () => update(current + step);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp")   { e.preventDefault(); increment(); }
      if (e.key === "ArrowDown") { e.preventDefault(); decrement(); }
    };

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      // Only scroll-adjust when the input is focused
      if (document.activeElement !== e.currentTarget) return;
      e.preventDefault();
      if (e.deltaY < 0) increment();
      else decrement();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFloat(e.target.value);
      if (!isNaN(parsed)) update(parsed);
    };

    const atMin = min !== -Infinity && current <= min;
    const atMax = max !== Infinity  && current >= max;

    const btnBase = cn(
      "shrink-0 flex items-center justify-center",
      "text-muted-foreground transition-colors duration-100",
      "hover:bg-accent hover:text-accent-foreground",
      "disabled:pointer-events-none disabled:opacity-40",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
      BTN_SIZE[size]
    );

    return (
      <div
        className={cn(
          "atlas-number-input inline-flex items-center overflow-hidden",
          "rounded-md border border-input bg-background",
          "ring-offset-background transition-shadow",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          invalid && "border-destructive focus-within:ring-destructive",
          disabled && "pointer-events-none opacity-50",
          className
        )}
      >
        {/* Decrement */}
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || atMin}
          aria-label="Decrease"
          tabIndex={-1}
          className={cn(btnBase, "border-r border-input")}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14" />
          </svg>
        </button>

        {/* Input */}
        <input
          ref={ref}
          type="number"
          value={current}
          min={min === -Infinity ? undefined : min}
          max={max === Infinity  ? undefined : max}
          step={step}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          aria-invalid={invalid}
          className={cn(
            "w-14 border-none bg-transparent text-center font-medium text-foreground outline-none",
            "tabular-nums",
            // Hide the browser's native number spinners
            "[appearance:textfield]",
            "[&::-webkit-outer-spin-button]:appearance-none",
            "[&::-webkit-inner-spin-button]:appearance-none",
            INPUT_SIZE[size]
          )}
          {...props}
        />

        {/* Increment */}
        <button
          type="button"
          onClick={increment}
          disabled={disabled || atMax}
          aria-label="Increase"
          tabIndex={-1}
          className={cn(btnBase, "border-l border-input")}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
