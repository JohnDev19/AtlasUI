import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../utils/cn";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  numberOfMonths?: 1 | 2;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  format?: (range: DateRange) => string;
  disabled?: boolean;
  className?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(date: Date, from: Date | null, to: Date | null) {
  if (!from || !to) return false;
  const t = date.getTime();
  return t > from.getTime() && t < to.getTime();
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function addMonths(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DEFAULT_FORMAT = (range: DateRange) => {
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  if (!range.from && !range.to) return "";
  if (range.from && !range.to) return fmt(range.from);
  if (range.from && range.to) return `${fmt(range.from)} – ${fmt(range.to)}`;
  return "";
};

// ─── MonthGrid ─────────────────────────────────────────────────────────────

interface MonthGridProps {
  year: number;
  month: number;
  range: DateRange;
  hovered: Date | null;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date | null) => void;
}

function MonthGrid({
  year,
  month,
  range,
  hovered,
  minDate,
  maxDate,
  disabledDates,
  onDayClick,
  onDayHover,
}: MonthGridProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const monthName = new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const previewTo = range.from && !range.to && hovered ? hovered : range.to;

  const cells: React.ReactNode[] = [];

  // empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isFrom = range.from ? isSameDay(date, range.from) : false;
    const isTo = previewTo ? isSameDay(date, previewTo) : false;
    const inRange = isInRange(date, range.from, previewTo);
    const isPreview =
      range.from && !range.to && hovered && isInRange(date, range.from, hovered);

    let isDisabled = false;
    if (minDate && date < minDate) isDisabled = true;
    if (maxDate && date > maxDate) isDisabled = true;
    if (disabledDates?.(date)) isDisabled = true;

    cells.push(
      <button
        key={d}
        type="button"
        disabled={isDisabled}
        onClick={() => !isDisabled && onDayClick(date)}
        onMouseEnter={() => !isDisabled && onDayHover(date)}
        onMouseLeave={() => onDayHover(null)}
        className={cn(
          "relative h-8 w-8 text-xs font-medium rounded-none transition-colors select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isDisabled && "opacity-30 cursor-not-allowed",
          !isDisabled && !isFrom && !isTo && "hover:bg-muted cursor-pointer",
          // in-range strip
          (inRange || isPreview) &&
            !isFrom &&
            !isTo &&
            "bg-primary/15 rounded-none",
          // from pill
          isFrom &&
            "bg-primary text-primary-foreground rounded-l-full",
          // to pill
          isTo && previewTo &&
            "bg-primary text-primary-foreground rounded-r-full",
          // single selected (from === to)
          isFrom && isTo && "rounded-full",
          // range strip edges
          isFrom && !isTo && inRange === false && "rounded-full",
        )}
        aria-label={date.toDateString()}
        aria-pressed={isFrom || isTo}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="w-[224px] select-none">
      <p className="text-sm font-semibold text-center text-foreground mb-2">{monthName}</p>
      <div className="grid grid-cols-7 gap-y-0.5 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="h-7 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {cells}
      </div>
    </div>
  );
}

// ─── DateRangePicker ───────────────────────────────────────────────────────

const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select date range",
      numberOfMonths = 2,
      minDate,
      maxDate,
      disabledDates,
      format = DEFAULT_FORMAT,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [range, setRange] = React.useState<DateRange>(
      value ?? { from: null, to: null }
    );
    const [hovered, setHovered] = React.useState<Date | null>(null);
    const [viewMonth, setViewMonth] = React.useState<Date>(
      value?.from ? startOfMonth(value.from) : startOfMonth(new Date())
    );

    // sync controlled value
    React.useEffect(() => {
      if (value !== undefined) setRange(value);
    }, [value]);

    const handleDayClick = (date: Date) => {
      let next: DateRange;
      if (!range.from || (range.from && range.to)) {
        // start new selection
        next = { from: date, to: null };
      } else {
        // second click — set end, ensure from <= to
        if (date < range.from) {
          next = { from: date, to: range.from };
        } else {
          next = { from: range.from, to: date };
        }
        setOpen(false);
      }
      setRange(next);
      onChange?.(next);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      const empty: DateRange = { from: null, to: null };
      setRange(empty);
      onChange?.(empty);
    };

    const label = range.from || range.to ? format(range) : "";
    const secondMonth = addMonths(viewMonth, 1);

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-input bg-background",
              "px-3 py-2 text-sm text-left shadow-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "hover:bg-muted/50",
              disabled && "opacity-50 cursor-not-allowed",
              !label && "text-muted-foreground",
              className
            )}
          >
            {/* Calendar icon */}
            <svg
              className="h-4 w-4 shrink-0 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" />
              <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="1.5" />
            </svg>

            <span className="flex-1 truncate">{label || placeholder}</span>

            {(range.from || range.to) && !disabled && (
              <span
                role="button"
                aria-label="Clear"
                onClick={handleClear}
                className="ml-1 shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            className={cn(
              "z-50 rounded-xl border border-border bg-popover p-4 shadow-lg",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            )}
          >
            {/* Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setViewMonth((m) => addMonths(m, -1))}
                className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Previous month"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setViewMonth((m) => addMonths(m, 1))}
                className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Next month"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Grids */}
            <div className={cn("flex gap-6", numberOfMonths === 1 && "gap-0")}>
              <MonthGrid
                year={viewMonth.getFullYear()}
                month={viewMonth.getMonth()}
                range={range}
                hovered={hovered}
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={disabledDates}
                onDayClick={handleDayClick}
                onDayHover={setHovered}
              />
              {numberOfMonths === 2 && (
                <MonthGrid
                  year={secondMonth.getFullYear()}
                  month={secondMonth.getMonth()}
                  range={range}
                  hovered={hovered}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabledDates={disabledDates}
                  onDayClick={handleDayClick}
                  onDayHover={setHovered}
                />
              )}
            </div>

            {/* Footer hint */}
            <p className="mt-3 text-[11px] text-muted-foreground text-center">
              {!range.from
                ? "Click to select start date"
                : !range.to
                ? "Click to select end date"
                : `${DEFAULT_FORMAT(range)}`}
            </p>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };