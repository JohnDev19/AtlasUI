import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// ─── Card ──────────────────────────────────────────────────────────────────

const cardVariants = cva(
  "atlas-card rounded-xl border bg-card text-card-foreground",
  {
    variants: {
      variant: {
        default:  "border-border shadow-sm",
        outline:  "border-border shadow-none",
        elevated: "border-transparent shadow-lg",
        ghost:    "border-transparent shadow-none bg-transparent",
        filled:   "border-transparent bg-muted",
        /**
         * Classic — beveled edges that mimic physical plastic or rubber.
         * A subtle highlight sits on the top-left edge while a deeper
         * shadow falls on the bottom-right, giving the card tactile depth.
         * Use `interactive` together with `classic` for a satisfying press effect.
         */
        classic:  "veloria-classic border border-border/60 bg-card",
      },
      interactive: {
        true: "cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0",
      },
    },
    compoundVariants: [
      // Classic interactive: invert the bevel on press to feel like a physical click
      {
        variant: "classic",
        interactive: true,
        className: "hover:veloria-classic active:veloria-classic-pressed active:shadow-none",
      },
    ],
    defaultVariants: { variant: "default" },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, className }))}
      {...props}
    />
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
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  )
);
TableCaption.displayName = "TableCaption";

// ─── DataTable ─────────────────────────────────────────────────────────────

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
    <div className={cn("atlas-data-table relative w-full overflow-auto", className)}>
      <table className="w-full caption-bottom text-sm">
        {caption && <caption className="mt-4 text-sm text-muted-foreground">{caption}</caption>}
        <thead className="[&_tr]:border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className={cn(
                  "h-10 px-4 text-left align-middle font-medium text-muted-foreground",
                  bordered && "border border-border",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.sortable && "cursor-pointer select-none hover:text-foreground"
                )}
                onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
              >
                <span className="inline-flex items-center gap-1">
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
        <tbody className="[&_tr:last-child]:border-0">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b">
                {columns.map((col) => (
                  <td key={String(col.key)} className="p-4">
                    <div className="h-4 animate-pulse rounded bg-muted" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b transition-colors hover:bg-muted/50",
                  striped && i % 2 === 1 && "bg-muted/30",
                  bordered && "border border-border"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      "p-4 align-middle",
                      bordered && "border border-border",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right"
                    )}
                  >
                    {col.cell
                      ? col.cell(row, i)
                      : (row[col.key as keyof T] as React.ReactNode)}
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

// ─── List ──────────────────────────────────────────────────────────────────

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  divided?: boolean;
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, divided, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(
        "atlas-list w-full",
        divided && "[&>li]:border-b [&>li:last-child]:border-0",
        className
      )}
      {...props}
    />
  )
);
List.displayName = "List";

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, icon, description, action, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("atlas-list-item flex items-center gap-3 px-1 py-3", className)}
      {...props}
    >
      {icon && (
        <span className="shrink-0 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{children}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </li>
  )
);
ListItem.displayName = "ListItem";

// ─── Statistic ─────────────────────────────────────────────────────────────

export interface StatisticProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "prefix"> {
  value: React.ReactNode;
  label: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: { value: number; label?: string };
  loading?: boolean;
}

const Statistic = React.forwardRef<HTMLDivElement, StatisticProps>(
  ({ className, value, label, prefix, suffix, trend, loading, ...props }, ref) => (
    <div ref={ref} className={cn("atlas-statistic", className)} {...props}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        ) : (
          <span className="text-3xl font-bold tracking-tight">{value}</span>
        )}
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {trend && !loading && (
        <p className={cn(
          "mt-1 flex items-center gap-1 text-xs font-medium",
          trend.value > 0 ? "text-success" : trend.value < 0 ? "text-destructive" : "text-muted-foreground"
        )}>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={trend.value > 0 ? "M7 17l9-9M7 7h10v10" : trend.value < 0 ? "M17 7l-9 9M7 7v10h10" : "M5 12h14"}
            />
          </svg>
          {Math.abs(trend.value)}%
          {trend.label && <span className="font-normal text-muted-foreground">{trend.label}</span>}
        </p>
      )}
    </div>
  )
);
Statistic.displayName = "Statistic";

// ─── Timeline ──────────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  date?: React.ReactNode;
  icon?: React.ReactNode;
  color?: "default" | "success" | "warning" | "danger" | "info";
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  events: TimelineEvent[];
}

const colorDot: Record<NonNullable<TimelineEvent["color"]>, string> = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-destructive",
  info:    "bg-info",
};

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, events, ...props }, ref) => (
    <ol ref={ref} className={cn("atlas-timeline relative space-y-0", className)} {...props}>
      {events.map((event, i) => (
        <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
          <div className="flex flex-col items-center">
            <span className={cn("mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-background", colorDot[event.color ?? "default"])}>
              {event.icon
                ? <span className="text-white [&>svg]:h-3 [&>svg]:w-3">{event.icon}</span>
                : <span className="h-2 w-2 rounded-full bg-white" />
              }
            </span>
            {i < events.length - 1 && (
              <span className="mt-1 flex-1 w-px bg-border" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{event.title}</p>
              {event.date && <span className="shrink-0 text-xs text-muted-foreground">{event.date}</span>}
            </div>
            {event.description && (
              <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
);
Timeline.displayName = "Timeline";

// ─── Calendar ──────────────────────────────────────────────────────────────

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, value, onChange, minDate, maxDate, disabledDates = [], ...props }, ref) => {
    const today = new Date();
    const [view, setView] = React.useState(value ?? today);

    const year = view.getFullYear();
    const month = view.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const isDisabled = (d: Date) => {
      if (minDate && d < minDate) return true;
      if (maxDate && d > maxDate) return true;
      return disabledDates.some(
        (dd) => dd.toDateString() === d.toDateString()
      );
    };

    const prev = () => setView(new Date(year, month - 1, 1));
    const next = () => setView(new Date(year, month + 1, 1));

    return (
      <div
        ref={ref}
        className={cn("atlas-calendar inline-block select-none rounded-lg border border-border bg-background p-4 shadow-sm", className)}
        {...props}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            className="rounded p-1 hover:bg-accent transition-colors"
            aria-label="Previous month"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold">{MONTHS[month]} {year}</span>
          <button
            type="button"
            onClick={next}
            className="rounded p-1 hover:bg-accent transition-colors"
            aria-label="Next month"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {/* Day labels */}
        <div className="mb-1 grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <span key={d} className="text-center text-[11px] font-medium text-muted-foreground">
              {d}
            </span>
          ))}
        </div>
        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <span key={`e-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const isSelected = value?.toDateString() === date.toDateString();
            const isToday = today.toDateString() === date.toDateString();
            const disabled = isDisabled(date);

            return (
              <button
                key={day}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onChange?.(date)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors",
                  "disabled:pointer-events-none disabled:opacity-40",
                  isSelected && "bg-primary text-primary-foreground font-semibold",
                  !isSelected && isToday && "border border-primary text-primary font-semibold",
                  !isSelected && !isToday && "hover:bg-accent"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
Calendar.displayName = "Calendar";

// ─── CodeBlock ─────────────────────────────────────────────────────────────

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  filename?: string;
}

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ className, code, language, showLineNumbers, filename, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const copy = () => {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <div className="atlas-code-block relative overflow-hidden rounded-lg border border-border bg-muted/50">
        {(filename || language) && (
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {filename ?? language}
            </span>
            <button
              type="button"
              onClick={copy}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
        {!filename && !language && (
          <button
            type="button"
            onClick={copy}
            className="absolute right-3 top-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
        <pre
          ref={ref}
          className={cn(
            "overflow-x-auto p-4 text-sm font-mono leading-relaxed",
            className
          )}
          {...props}
        >
          {showLineNumbers ? (
            <code>
              {code.split("\n").map((line, i) => (
                <span key={i} className="flex">
                  <span className="mr-4 w-6 shrink-0 select-none text-right text-muted-foreground/50">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </span>
              ))}
            </code>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

// ─── Chart (thin wrapper — consumers bring their own chart lib) ─────────────

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  loading?: boolean;
  height?: number | string;
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, title, description, loading, height = 300, children, ...props }, ref) => (
    <div ref={ref} className={cn("atlas-chart", className)} {...props}>
      {(title || description) && (
        <div className="mb-3">
          {title && <p className="text-sm font-semibold">{title}</p>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
      <div style={{ height }} className="relative w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
);
Chart.displayName = "Chart";

// ─── StatsCard ─────────────────────────────────────────────────────────────

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label?: string };
  loading?: boolean;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, description, icon, trend, loading, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "atlas-stats-card rounded-xl border border-border bg-card p-5 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-muted" />
          ) : (
            <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
          )}
          {trend && !loading && (
            <p className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              trend.value > 0
                ? "text-success"
                : trend.value < 0
                  ? "text-destructive"
                  : "text-muted-foreground"
            )}>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={trend.value > 0 ? "M7 17l9-9M7 7h10v10" : trend.value < 0 ? "M17 7l-9 9M7 7v10h10" : "M5 12h14"}
                />
              </svg>
              {Math.abs(trend.value)}%
              {trend.label && <span className="font-normal text-muted-foreground">{trend.label}</span>}
            </p>
          )}
          {description && !loading && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&>svg]:h-6 [&>svg]:w-6">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
);
StatsCard.displayName = "StatsCard";

// ─── TreeView ──────────────────────────────────────────────────────────────

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeViewProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "size"> {
  nodes: TreeNode[];
  selected?: string;
  onSelect?: (id: string) => void;
  defaultExpanded?: string[];
  size?: "sm" | "md";
}

interface TreeItemProps {
  node: TreeNode;
  depth: number;
  selected?: string;
  onSelect?: (id: string) => void;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  size: "sm" | "md";
}

const TreeItem = ({ node, depth, selected, onSelect, expanded, onToggle, size }: TreeItemProps) => {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;

  return (
    <li role="treeitem" aria-selected={isSelected} aria-expanded={hasChildren ? isExpanded : undefined}>
      <button
        type="button"
        disabled={node.disabled}
        onClick={() => {
          if (hasChildren) onToggle(node.id);
          if (!node.disabled) onSelect?.(node.id);
        }}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        className={cn(
          "flex w-full items-center gap-2 rounded-md pr-3 text-left transition-colors",
          size === "sm" ? "py-1 text-xs" : "py-1.5 text-sm",
          isSelected
            ? "bg-accent text-accent-foreground font-medium"
            : "hover:bg-accent/50 text-foreground",
          node.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          {hasChildren ? (
            <svg
              className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-90")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : node.icon ? null : (
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          )}
        </span>
        {node.icon && (
          <span className="shrink-0 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
            {node.icon}
          </span>
        )}
        {node.label}
      </button>
      {hasChildren && isExpanded && (
        <ul role="group">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
              size={size}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  ({ className, nodes, selected, onSelect, defaultExpanded = [], size = "md", ...props }, ref) => {
    const [expanded, setExpanded] = React.useState<Set<string>>(new Set(defaultExpanded));

    const toggle = (id: string) =>
      setExpanded((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });

    return (
      <div ref={ref} className={cn("atlas-tree-view", className)} {...props}>
        <ul role="tree">
          {nodes.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              depth={0}
              selected={selected}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={toggle}
              size={size}
            />
          ))}
        </ul>
      </div>
    );
  }
);
TreeView.displayName = "TreeView";

// ─── JsonViewer ────────────────────────────────────────────────────────────

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface JsonViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: JsonValue;
  maxDepth?: number;
  initialDepth?: number;
}

interface JsonNodeProps {
  value: JsonValue;
  depth: number;
  maxDepth: number;
  label?: string;
}

const JsonNode = ({ value, depth, maxDepth, label }: JsonNodeProps) => {
  const [open, setOpen] = React.useState(depth < maxDepth);
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const entries = isObject ? (isArray ? value : Object.entries(value as Record<string, JsonValue>)) : [];
  const count = Array.isArray(entries) ? entries.length : 0;

  if (!isObject) {
    return (
      <span>
        {label && <span className="text-muted-foreground">{label}: </span>}
        <span className={cn(
          typeof value === "string" && "text-success",
          typeof value === "number" && "text-info",
          typeof value === "boolean" && "text-warning",
          value === null && "text-muted-foreground italic"
        )}>
          {JSON.stringify(value)}
        </span>
      </span>
    );
  }

  return (
    <span>
      {label && <span className="text-muted-foreground">{label}: </span>}
      <button
        type="button"
        className="font-mono text-foreground hover:underline"
        onClick={() => setOpen((o) => !o)}
      >
        {isArray ? "[" : "{"}
        {!open && <span className="text-muted-foreground"> {count} {isArray ? "items" : "keys"} </span>}
        {!open && (isArray ? "]" : "}")}
      </button>
      {open && (
        <span className="block pl-4">
          {(isArray
            ? (value as JsonValue[]).map((v, i) => ({ key: String(i), val: v }))
            : Object.entries(value as Record<string, JsonValue>).map(([k, v]) => ({ key: k, val: v }))
          ).map(({ key, val }) => (
            <span key={key} className="block">
              <JsonNode value={val} depth={depth + 1} maxDepth={maxDepth} label={isArray ? undefined : key} />
              <span className="text-muted-foreground">,</span>
            </span>
          ))}
          <span>{isArray ? "]" : "}"}</span>
        </span>
      )}
    </span>
  );
};

const JsonViewer = React.forwardRef<HTMLDivElement, JsonViewerProps>(
  ({ className, data, maxDepth = 3, initialDepth, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "atlas-json-viewer overflow-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm",
        className
      )}
      {...props}
    >
      <JsonNode value={data} depth={0} maxDepth={initialDepth ?? maxDepth} />
    </div>
  )
);
JsonViewer.displayName = "JsonViewer";

// ─── Heatmap ───────────────────────────────────────────────────────────────

export interface HeatmapCell {
  date: string;
  value: number;
}

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: HeatmapCell[];
  maxValue?: number;
  color?: string;
  tooltipFormat?: (cell: HeatmapCell) => string;
}

const HEAT_LEVELS = 5;

const Heatmap = React.forwardRef<HTMLDivElement, HeatmapProps>(
  ({ className, data, maxValue, tooltipFormat, ...props }, ref) => {
    const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
    const byDate = Object.fromEntries(data.map((d) => [d.date, d]));

    // Build a 53-week grid
    const today = new Date();
    const cells: (HeatmapCell | null)[] = [];
    for (let w = 52; w >= 0; w--) {
      for (let d = 6; d >= 0; d--) {
        const dt = new Date(today);
        dt.setDate(today.getDate() - w * 7 - d);
        const key = dt.toISOString().slice(0, 10);
        cells.push(byDate[key] ?? { date: key, value: 0 });
      }
    }

    const intensity = (v: number) => Math.ceil((v / max) * HEAT_LEVELS);

    const bgClass = (level: number) => {
      if (level === 0) return "bg-muted";
      if (level === 1) return "bg-primary/20";
      if (level === 2) return "bg-primary/40";
      if (level === 3) return "bg-primary/60";
      if (level === 4) return "bg-primary/80";
      return "bg-primary";
    };

    return (
      <div ref={ref} className={cn("atlas-heatmap overflow-x-auto", className)} {...props}>
        <div
          className="inline-grid gap-[3px]"
          style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))", gridAutoFlow: "column" }}
        >
          {cells.map((cell, i) =>
            cell ? (
              <span
                key={i}
                title={tooltipFormat ? tooltipFormat(cell) : `${cell.date}: ${cell.value}`}
                className={cn(
                  "h-[10px] w-[10px] rounded-sm transition-colors",
                  bgClass(intensity(cell.value))
                )}
              />
            ) : (
              <span key={i} className="h-[10px] w-[10px]" />
            )
          )}
        </div>
      </div>
    );
  }
);
Heatmap.displayName = "Heatmap";

// ─── KanbanBoard ───────────────────────────────────────────────────────────

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  assignee?: React.ReactNode;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  limit?: number;
  color?: string;
}

export interface KanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: KanbanColumn[];
  onCardMove?: (cardId: string, fromColId: string, toColId: string) => void;
  renderCard?: (card: KanbanCard, columnId: string) => React.ReactNode;
}

const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ className, columns, onCardMove, renderCard, ...props }, ref) => {
    const [dragging, setDragging] = React.useState<{ cardId: string; colId: string } | null>(null);

    const handleDragStart = (cardId: string, colId: string) =>
      setDragging({ cardId, colId });

    const handleDrop = (toColId: string) => {
      if (dragging && dragging.colId !== toColId) {
        onCardMove?.(dragging.cardId, dragging.colId, toColId);
      }
      setDragging(null);
    };

    return (
      <div
        ref={ref}
        className={cn("atlas-kanban flex gap-4 overflow-x-auto pb-2", className)}
        {...props}
      >
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-muted/40 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold">
                {col.color && (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: col.color }}
                  />
                )}
                {col.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {col.cards.length}{col.limit ? `/${col.limit}` : ""}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => handleDragStart(card.id, col.id)}
                  className={cn(
                    "rounded-lg border border-border bg-background p-3 shadow-sm cursor-grab active:cursor-grabbing",
                    "transition-opacity hover:shadow-md",
                    dragging?.cardId === card.id && "opacity-40"
                  )}
                >
                  {renderCard ? renderCard(card, col.id) : (
                    <>
                      <p className="text-sm font-medium leading-snug">{card.title}</p>
                      {card.description && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {card.description}
                        </p>
                      )}
                      {(card.tags?.length || card.assignee) && (
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1">
                            {card.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {card.assignee && <div className="shrink-0">{card.assignee}</div>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
KanbanBoard.displayName = "KanbanBoard";

// ─── Exports ───────────────────────────────────────────────────────────────

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
  StatsCard, TreeView, JsonViewer, Heatmap, KanbanBoard,
};