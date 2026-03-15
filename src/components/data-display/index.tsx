import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// ─── Card ──────────────────────────────────────────────────────────────────

const cardVariants = cva(
  "atlas-card rounded-xl border bg-card text-card-foreground",
  {
    variants: {
      variant: {
        default: "border-border shadow-sm",
        outline: "border-border shadow-none",
        elevated: "border-transparent shadow-lg",
        ghost: "border-transparent shadow-none bg-transparent",
        filled: "border-transparent bg-muted",
      },
      interactive: {
        true: "cursor-pointer transition-shadow hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, interactive, className }))} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold leading-tight tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0 gap-2", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

// ─── Table ─────────────────────────────────────────────────────────────────

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="atlas-table relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn("h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  )
);
TableCaption.displayName = "TableCaption";

// ─── DataTable ────────────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: React.ReactNode;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyText?: string;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  striped?: boolean;
  bordered?: boolean;
  className?: string;
  caption?: string;
}

function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading,
  emptyText = "No data available",
  onSort,
  striped,
  bordered,
  className,
  caption,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    const newDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDir(newDir);
    onSort?.(key, newDir);
  };

  return (
    <div className={cn("atlas-data-table relative w-full overflow-auto rounded-md", bordered && "border border-border", className)}>
      <table className="w-full caption-bottom text-sm">
        {caption && <TableCaption>{caption}</TableCaption>}
        <thead className="border-b bg-muted/50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{ width: col.width }}
                className={cn(
                  "h-10 px-4 font-medium text-muted-foreground",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.sortable && "cursor-pointer select-none hover:text-foreground",
                )}
                onClick={() => col.sortable && handleSort(String(col.key))}
                aria-sort={
                  sortKey === col.key
                    ? sortDir === "asc" ? "ascending" : "descending"
                    : col.sortable ? "none" : undefined
                }
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === String(col.key) && (
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d={sortDir === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                      />
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                <svg className="mx-auto h-5 w-5 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">{emptyText}</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b transition-colors hover:bg-muted/50",
                  striped && i % 2 !== 0 && "bg-muted/20"
                )}
              >
                {columns.map((col, j) => (
                  <td
                    key={j}
                    className={cn(
                      "p-4 align-middle",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                    )}
                  >
                    {col.cell
                      ? col.cell(row, i)
                      : String(row[col.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
DataTable.displayName = "DataTable";

// ─── List & ListItem ─────────────────────────────────────────────────────

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  variant?: "simple" | "bordered" | "divided";
  spacing?: "none" | "sm" | "md" | "lg";
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, variant = "simple", spacing = "none", ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(
        "atlas-list w-full",
        variant === "bordered" && "rounded-md border border-border divide-y divide-border",
        variant === "divided" && "divide-y divide-border",
        spacing === "sm" && "space-y-1",
        spacing === "md" && "space-y-2",
        spacing === "lg" && "space-y-3",
        className
      )}
      {...props}
    />
  )
);
List.displayName = "List";

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  active?: boolean;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, icon, extra, active, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "atlas-list-item flex items-center gap-3 px-4 py-3",
        active && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">{icon}</span>}
      <span className="flex-1 min-w-0">{children}</span>
      {extra && <span className="shrink-0">{extra}</span>}
    </li>
  )
);
ListItem.displayName = "ListItem";

// ─── Statistic ────────────────────────────────────────────────────────────

export interface StatisticProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: { value: number; label?: string };
  loading?: boolean;
}

const Statistic = React.forwardRef<HTMLDivElement, StatisticProps>(
  ({ className, label, value, prefix, suffix, trend, loading, ...props }, ref) => (
    <div ref={ref} className={cn("atlas-statistic", className)} {...props}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight">
          {loading ? (
            <span className="inline-block h-8 w-24 animate-pulse rounded bg-muted" />
          ) : (
            <>{prefix}{value}{suffix}</>
          )}
        </span>
        {trend && !loading && (
          <span className={cn(
            "mb-1 flex items-center gap-0.5 text-sm font-medium",
            trend.value > 0 ? "text-success" : trend.value < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            {trend.value !== 0 && (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={trend.value > 0 ? "M7 17l9-9M7 7h10v10" : "M7 7l9 9M17 7H7v10"}
                />
              </svg>
            )}
            {Math.abs(trend.value)}%
            {trend.label && <span className="font-normal text-muted-foreground ml-1">{trend.label}</span>}
          </span>
        )}
      </div>
    </div>
  )
);
Statistic.displayName = "Statistic";

// ─── Timeline ─────────────────────────────────────────────────────────────

export interface TimelineEvent {
  title: React.ReactNode;
  description?: React.ReactNode;
  time?: React.ReactNode;
  icon?: React.ReactNode;
  color?: "default" | "primary" | "success" | "warning" | "danger";
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  events: TimelineEvent[];
}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, events, ...props }, ref) => (
    <ol ref={ref} className={cn("atlas-timeline relative flex flex-col", className)} {...props}>
      {events.map((event, i) => (
        <li key={i} className="relative flex gap-4 pb-8 last:pb-0">
          <div className="relative flex flex-col items-center">
            <div className={cn(
              "z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0",
              "border-background shadow-sm [&>svg]:h-3.5 [&>svg]:w-3.5",
              event.color === "primary" ? "bg-primary text-primary-foreground" :
              event.color === "success" ? "bg-success text-success-foreground" :
              event.color === "warning" ? "bg-warning text-warning-foreground" :
              event.color === "danger" ? "bg-destructive text-destructive-foreground" :
              "bg-muted text-muted-foreground"
            )}>
              {event.icon ?? <span className="h-2 w-2 rounded-full bg-current" />}
            </div>
            {i < events.length - 1 && (
              <div className="mt-1 w-px flex-1 bg-border" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1 pt-0.5 pb-4 last:pb-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm">{event.title}</p>
              {event.time && <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{event.time}</span>}
            </div>
            {event.description && <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
);
Timeline.displayName = "Timeline";

// ─── Calendar ─────────────────────────────────────────────────────────────

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  highlightedDates?: Date[];
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, value, onChange, minDate, maxDate, highlightedDates = [], ...props }, ref) => {
    const today = new Date();
    const [viewDate, setViewDate] = React.useState(value ?? today);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = Array.from({ length: firstDay }, () => null).concat(
      Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))
    );

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    return (
      <div ref={ref} className={cn("atlas-calendar w-fit rounded-lg border border-border bg-background p-3 shadow-sm", className)} {...props}>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month - 1))}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            aria-label="Previous month"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold">{MONTHS[month]} {year}</span>
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month + 1))}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            aria-label="Next month"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-px">
          {DAYS.map((d) => (
            <div key={d} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">{d}</div>
          ))}
          {cells.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} />;
            const isSelected = value ? isSameDay(date, value) : false;
            const isToday = isSameDay(date, today);
            const isHighlighted = highlightedDates.some((d) => isSameDay(d, date));
            const isDisabled =
              (minDate && date < minDate) || (maxDate && date > maxDate);

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={isDisabled}
                onClick={() => onChange?.(date)}
                aria-label={date.toLocaleDateString()}
                aria-pressed={isSelected}
                className={cn(
                  "h-8 w-8 text-xs rounded-md flex items-center justify-center transition-colors font-medium relative",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-30",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                  !isSelected && isToday && "border border-primary text-primary",
                  !isSelected && !isToday && "hover:bg-accent",
                )}
              >
                {date.getDate()}
                {isHighlighted && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
Calendar.displayName = "Calendar";

// ─── CodeBlock ────────────────────────────────────────────────────────────

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  caption?: string;
  onCopy?: () => void;
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, code, language, showLineNumbers, caption, onCopy, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    };

    const lines = code.split("\n");

    return (
      <div ref={ref} className={cn("atlas-code-block relative rounded-lg border border-border bg-muted/50 overflow-hidden", className)} {...props}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/80">
          {language && <span className="text-xs font-medium text-muted-foreground">{language}</span>}
          {caption && <span className="text-xs text-muted-foreground">{caption}</span>}
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy code"}
            className="ml-auto flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-sm">
          <code className={`language-${language}`}>
            {showLineNumbers
              ? lines.map((line, i) => (
                  <span key={i} className="block">
                    <span className="mr-4 select-none text-muted-foreground/50 text-xs w-5 inline-block text-right">{i + 1}</span>
                    {line}
                  </span>
                ))
              : code}
          </code>
        </pre>
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

// ─── Chart (placeholder - integrates with recharts/chartjs) ───────────────

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  loading?: boolean;
  empty?: boolean;
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, title, description, loading, empty, children, ...props }, ref) => (
    <div ref={ref} className={cn("atlas-chart", className)} {...props}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-base font-semibold">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {loading ? (
        <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />
      ) : empty ? (
        <div className="h-64 w-full flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
          No chart data available
        </div>
      ) : (
        children
      )}
    </div>
  )
);
Chart.displayName = "Chart";

export {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption,
  DataTable,
  List, ListItem,
  Statistic,
  Timeline,
  Calendar,
  CodeBlock,
  Chart,
};
