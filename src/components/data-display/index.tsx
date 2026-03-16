import * as React from "react";
import { cn } from "../../utils/cn";
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants } from "./Card";
export type { CardProps } from "./Card";

// ─── Table ─────────────────────────────────────────────────────────────────

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="veloria-table relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn("h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)} {...props} />
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)} {...props} />
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
);
TableCaption.displayName = "TableCaption";

// ─── DataTable ─────────────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  keyExtractor?: (row: T, i: number) => string | number;
}

function DataTable<T>({ columns, data, loading, emptyText = "No data.", keyExtractor, className, ...props }: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div className={cn("veloria-data-table", className)} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)} style={{ width: col.width }}>
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(String(col.key))}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    {col.header}
                    {sortKey === String(col.key)
                      ? <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDir === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} /></svg>
                      : <svg className="h-3.5 w-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></svg>
                    }
                  </button>
                ) : col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : sorted.length === 0
            ? <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">{emptyText}</TableCell></TableRow>
            : sorted.map((row, i) => (
                <TableRow key={keyExtractor ? keyExtractor(row, i) : i}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.cell ? col.cell(row) : String((row as Record<string, unknown>)[String(col.key)] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
          }
        </TableBody>
      </Table>
    </div>
  );
}

// ─── List / ListItem ───────────────────────────────────────────────────────

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  variant?: "simple" | "bordered" | "divided";
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, variant = "simple", ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(
        "veloria-list",
        variant === "bordered" && "rounded-lg border border-border",
        variant === "divided" && "divide-y divide-border",
        className
      )}
      {...props}
    />
  )
);
List.displayName = "List";

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  description?: string;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, leading, trailing, description, children, ...props }, ref) => (
    <li ref={ref} className={cn("veloria-list-item flex items-center gap-3 px-4 py-3", className)} {...props}>
      {leading && <span className="shrink-0">{leading}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{children}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      {trailing && <span className="shrink-0 text-muted-foreground">{trailing}</span>}
    </li>
  )
);
ListItem.displayName = "ListItem";

// ─── Statistic ─────────────────────────────────────────────────────────────

export interface StatisticProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  value: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: { value: number; label?: string };
  loading?: boolean;
}

const Statistic = React.forwardRef<HTMLDivElement, StatisticProps>(
  ({ className, title, value, prefix, suffix, trend, loading, ...props }, ref) => (
    <div ref={ref} className={cn("veloria-statistic", className)} {...props}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 flex items-baseline gap-1 text-3xl font-bold tabular-nums">
        {prefix && <span className="text-xl">{prefix}</span>}
        {loading ? <span className="inline-block h-8 w-24 animate-pulse rounded bg-muted" /> : value}
        {suffix && <span className="text-xl">{suffix}</span>}
      </p>
      {trend && !loading && (
        <p className={cn("mt-1 flex items-center gap-1 text-sm font-medium", trend.value > 0 ? "text-green-600 dark:text-green-400" : trend.value < 0 ? "text-destructive" : "text-muted-foreground")}>
          {trend.value > 0 ? "↑" : trend.value < 0 ? "↓" : "→"}
          {Math.abs(trend.value)}%
          {trend.label && <span className="text-muted-foreground font-normal">{trend.label}</span>}
        </p>
      )}
    </div>
  )
);
Statistic.displayName = "Statistic";

// ─── Timeline ──────────────────────────────────────────────────────────────

export interface TimelineItem {
  title: React.ReactNode;
  description?: React.ReactNode;
  time?: React.ReactNode;
  icon?: React.ReactNode;
  color?: "default" | "primary" | "success" | "warning" | "danger";
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
}

const dotColors = { default: "bg-muted-foreground", primary: "bg-primary", success: "bg-green-500", warning: "bg-yellow-500", danger: "bg-destructive" };

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, items, ...props }, ref) => (
    <div ref={ref} className={cn("veloria-timeline flex flex-col", className)} {...props}>
      {items.map((item, i) => (
        <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
          <div className="flex flex-col items-center">
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background z-10", item.color ? dotColors[item.color] : "bg-primary")}>
              {item.icon ?? <div className="h-2 w-2 rounded-full bg-white/80" />}
            </div>
            {i < items.length - 1 && <div className="mt-1 w-0.5 flex-1 bg-border" />}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{item.title}</p>
              {item.time && <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>}
            </div>
            {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
);
Timeline.displayName = "Timeline";

// ─── Calendar ──────────────────────────────────────────────────────────────

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: Date;
  onChange?: (date: Date) => void;
  highlightedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, value, onChange, highlightedDates = [], minDate, maxDate, ...props }, ref) => {
    const today = new Date();
    const [view, setView] = React.useState(new Date(value ?? today.getFullYear(), today.getMonth(), 1));

    const year = view.getFullYear();
    const month = view.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

    const isHighlighted = (d: number) => highlightedDates.some((h) => h.getFullYear() === year && h.getMonth() === month && h.getDate() === d);
    const isSelected = (d: number) => value && value.getFullYear() === year && value.getMonth() === month && value.getDate() === d;
    const isToday = (d: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const isDisabled = (d: number) => {
      const date = new Date(year, month, d);
      return (minDate && date < minDate) || (maxDate && date > maxDate) || false;
    };

    return (
      <div ref={ref} className={cn("veloria-calendar w-full select-none rounded-xl border border-border bg-background p-4 shadow-sm", className)} {...props}>
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={() => setView(new Date(year, month - 1, 1))} className="rounded-md p-1.5 hover:bg-accent transition-colors" aria-label="Previous month">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-sm font-semibold">{MONTHS[month]} {year}</span>
          <button type="button" onClick={() => setView(new Date(year, month + 1, 1))} className="rounded-md p-1.5 hover:bg-accent transition-colors" aria-label="Next month">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d) => <div key={d} className="py-1 text-center text-xs font-medium text-muted-foreground">{d}</div>)}
          {cells.map((d, i) => d === null
            ? <div key={i} />
            : (
              <button
                key={i}
                type="button"
                disabled={isDisabled(d)}
                onClick={() => !isDisabled(d) && onChange?.(new Date(year, month, d))}
                className={cn(
                  "relative flex h-8 w-8 mx-auto items-center justify-center rounded-full text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-30",
                  isSelected(d) && "bg-primary text-primary-foreground font-semibold",
                  !isSelected(d) && isToday(d) && "border border-primary text-primary font-semibold",
                  !isSelected(d) && !isToday(d) && "hover:bg-accent"
                )}
              >
                {d}
                {isHighlighted(d) && !isSelected(d) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                )}
              </button>
            )
          )}
        </div>
      </div>
    );
  }
);
Calendar.displayName = "Calendar";

// ─── CodeBlock ─────────────────────────────────────────────────────────────

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  filename?: string;
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, code, language = "text", showLineNumbers = true, showCopyButton = true, filename, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);
    const lines = code.split("\n");

    const copy = () => {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <div ref={ref} className={cn("veloria-code-block rounded-xl border border-border bg-zinc-950 dark:bg-zinc-900 overflow-hidden text-sm", className)} {...props}>
        {(filename || showCopyButton) && (
          <div className="flex items-center justify-between border-b border-border/50 bg-zinc-900 dark:bg-zinc-800 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              {filename && <span className="text-xs text-zinc-400">{filename}</span>}
              {language !== "text" && !filename && <span className="rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] font-mono text-zinc-300 uppercase tracking-wider">{language}</span>}
            </div>
            {showCopyButton && (
              <button type="button" onClick={copy} className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors" aria-label="Copy code">
                {copied
                  ? <><svg className="h-3.5 w-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg><span className="text-green-400">Copied!</span></>
                  : <><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><span>Copy</span></>
                }
              </button>
            )}
          </div>
        )}
        <pre className="overflow-auto p-4 font-mono text-zinc-100 leading-relaxed">
          {showLineNumbers
            ? lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 select-none w-8 text-right shrink-0 text-zinc-600 tabular-nums">{i + 1}</span>
                  <span>{line || " "}</span>
                </div>
              ))
            : <code>{code}</code>
          }
        </pre>
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

// ─── Chart wrapper ─────────────────────────────────────────────────────────

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  loading?: boolean;
  empty?: boolean;
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, title, description, loading, empty, children, ...props }, ref) => (
    <div ref={ref} className={cn("veloria-chart", className)} {...props}>
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
      ) : children}
    </div>
  )
);
Chart.displayName = "Chart";

// ─── StatsCard ─────────────────────────────────────────────────────────────

export interface StatsCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: { value: number; label?: string };
  description?: React.ReactNode;
  loading?: boolean;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, icon, trend, description, loading, ...props }, ref) => (
    <div ref={ref} className={cn("veloria-stats-card rounded-xl border border-border bg-card p-6 shadow-sm", className)} {...props}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {loading ? <span className="inline-block h-8 w-28 animate-pulse rounded bg-muted" /> : value}
          </p>
          {trend && !loading && (
            <p className={cn("mt-1 flex items-center gap-1 text-sm font-medium", trend.value > 0 ? "text-green-600 dark:text-green-400" : trend.value < 0 ? "text-destructive" : "text-muted-foreground")}>
              {trend.value > 0 ? "↑" : trend.value < 0 ? "↓" : "→"}
              {Math.abs(trend.value)}%
              {trend.label && <span className="font-normal text-muted-foreground">{trend.label}</span>}
            </p>
          )}
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {icon && <div className="shrink-0 rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>}
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

export interface TreeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: TreeNode[];
  defaultExpanded?: string[];
  onSelect?: (id: string) => void;
  selectedId?: string;
}

const TreeNodeItem: React.FC<{ node: TreeNode; level: number; expanded: Set<string>; toggle: (id: string) => void; onSelect?: (id: string) => void; selectedId?: string }> = ({ node, level, expanded, toggle, onSelect, selectedId }) => {
  const isExpanded = expanded.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div>
      <div
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={selectedId === node.id}
        aria-disabled={node.disabled}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
          "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          selectedId === node.id && "bg-primary/10 text-primary font-medium",
          node.disabled && "opacity-50 pointer-events-none"
        )}
        style={{ paddingLeft: `${(level * 16) + 8}px` }}
        onClick={() => { if (hasChildren) toggle(node.id); onSelect?.(node.id); }}
        tabIndex={node.disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { if (hasChildren) toggle(node.id); onSelect?.(node.id); } }}
      >
        {hasChildren ? (
          <svg className={cn("h-4 w-4 shrink-0 transition-transform text-muted-foreground", isExpanded && "rotate-90")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        ) : <span className="h-4 w-4 shrink-0" />}
        {node.icon && <span className="shrink-0">{node.icon}</span>}
        <span className="flex-1 truncate">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <div role="group">
          {node.children!.map((child) => (
            <TreeNodeItem key={child.id} node={child} level={level + 1} expanded={expanded} toggle={toggle} onSelect={onSelect} selectedId={selectedId} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  ({ className, nodes, defaultExpanded = [], onSelect, selectedId, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState(new Set(defaultExpanded));
    const toggle = (id: string) => setExpanded((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    return (
      <div ref={ref} role="tree" className={cn("veloria-tree-view", className)} {...props}>
        {nodes.map((node) => <TreeNodeItem key={node.id} node={node} level={0} expanded={expanded} toggle={toggle} onSelect={onSelect} selectedId={selectedId} />)}
      </div>
    );
  }
);
TreeView.displayName = "TreeView";

// ─── JsonViewer ────────────────────────────────────────────────────────────

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface JsonViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: JsonValue;
  maxDepth?: number;
  initialDepth?: number;
  rootName?: string;
}

const JsonNode: React.FC<{ data: JsonValue; depth: number; maxDepth: number; name?: string }> = ({ data, depth, maxDepth, name }) => {
  const [collapsed, setCollapsed] = React.useState(depth >= maxDepth);
  const isObj = data !== null && typeof data === "object";
  const isArr = Array.isArray(data);
  const entries = isObj ? (isArr ? (data as JsonValue[]).map((v, i) => [String(i), v] as [string, JsonValue]) : Object.entries(data as { [k: string]: JsonValue })) : [];
  const typeColor = typeof data === "string" ? "text-green-400" : typeof data === "number" ? "text-blue-400" : typeof data === "boolean" ? "text-orange-400" : data === null ? "text-zinc-400" : "text-zinc-100";

  return (
    <div className="font-mono text-xs leading-relaxed" style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      <span className="text-zinc-400">{name !== undefined && <><span className="text-violet-300">"{name}"</span><span className="text-zinc-400">: </span></>}</span>
      {isObj ? (
        <>
          <button type="button" onClick={() => setCollapsed(!collapsed)} className="text-zinc-300 hover:text-white transition-colors">
            {collapsed ? (isArr ? `[…${entries.length}]` : `{…${entries.length}}`) : (isArr ? "[" : "{")}
          </button>
          {!collapsed && (
            <>
              {entries.map(([k, v]) => <JsonNode key={k} data={v} depth={depth + 1} maxDepth={maxDepth} name={isArr ? undefined : k} />)}
              <span className="text-zinc-300">{isArr ? "]" : "}"}</span>
            </>
          )}
        </>
      ) : (
        <span className={typeColor}>{JSON.stringify(data)}</span>
      )}
    </div>
  );
};

const JsonViewer = React.forwardRef<HTMLDivElement, JsonViewerProps>(
  ({ className, data, maxDepth = 2, rootName = "root", ...props }, ref) => (
    <div ref={ref} className={cn("veloria-json-viewer rounded-xl border border-border bg-zinc-950 p-4 overflow-auto", className)} {...props}>
      <JsonNode data={data} depth={0} maxDepth={maxDepth} name={rootName} />
    </div>
  )
);
JsonViewer.displayName = "JsonViewer";

// ─── Heatmap ───────────────────────────────────────────────────────────────

export interface HeatmapCell { date: string; value: number; }
export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: HeatmapCell[];
  colorScale?: string[];
  cellSize?: number;
  showTooltip?: boolean;
}

const defaultColors = ["#161b22","#0e4429","#006d32","#26a641","#39d353"];

const Heatmap = React.forwardRef<HTMLDivElement, HeatmapProps>(
  ({ className, data, colorScale = defaultColors, cellSize = 12, ...props }, ref) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    const getColor = (v: number) => {
      if (v === 0) return colorScale[0];
      const idx = Math.ceil((v / max) * (colorScale.length - 1));
      return colorScale[Math.min(idx, colorScale.length - 1)];
    };

    return (
      <div ref={ref} className={cn("veloria-heatmap overflow-auto", className)} {...props}>
        <div className="flex flex-wrap gap-0.5" role="img" aria-label="Activity heatmap">
          {data.map((cell) => (
            <div
              key={cell.date}
              title={`${cell.date}: ${cell.value}`}
              className="rounded-sm transition-opacity hover:opacity-70"
              style={{ width: cellSize, height: cellSize, backgroundColor: getColor(cell.value) }}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          {colorScale.map((c, i) => <div key={i} className="rounded-sm" style={{ width: cellSize - 2, height: cellSize - 2, backgroundColor: c }} />)}
          <span>More</span>
        </div>
      </div>
    );
  }
);
Heatmap.displayName = "Heatmap";

// ─── KanbanBoard ───────────────────────────────────────────────────────────

export interface KanbanCard { id: string; title: string; description?: string; tags?: string[]; assignee?: React.ReactNode; }
export interface KanbanColumn { id: string; title: string; cards: KanbanCard[]; color?: string; limit?: number; }
export interface KanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: KanbanColumn[];
  onCardMove?: (cardId: string, fromCol: string, toCol: string) => void;
  renderCard?: (card: KanbanCard, colId: string) => React.ReactNode;
}

const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ className, columns, onCardMove, renderCard, ...props }, ref) => {
    const [dragging, setDragging] = React.useState<{ cardId: string; fromCol: string } | null>(null);

    return (
      <div ref={ref} className={cn("veloria-kanban-board flex gap-4 overflow-x-auto pb-4", className)} {...props}>
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-muted/30 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragging && dragging.fromCol !== col.id) { onCardMove?.(dragging.cardId, dragging.fromCol, col.id); setDragging(null); } }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {col.color && <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.color }} />}
                <h3 className="text-sm font-semibold">{col.title}</h3>
              </div>
              <span className="text-xs text-muted-foreground">{col.cards.length}{col.limit ? `/${col.limit}` : ""}</span>
            </div>
            <div className="flex flex-col gap-2">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => setDragging({ cardId: card.id, fromCol: col.id })}
                  onDragEnd={() => setDragging(null)}
                  className={cn("rounded-lg border border-border bg-background p-3 shadow-sm cursor-grab active:cursor-grabbing transition-opacity hover:shadow-md", dragging?.cardId === card.id && "opacity-40")}
                >
                  {renderCard ? renderCard(card, col.id) : (
                    <>
                      <p className="text-sm font-medium leading-snug">{card.title}</p>
                      {card.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{card.description}</p>}
                      {(card.tags?.length || card.assignee) && (
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1">
                            {card.tags?.map((tag) => <span key={tag} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium">{tag}</span>)}
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

export {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption,
  DataTable,
  List, ListItem,
  Statistic,
  Timeline,
  Calendar,
  CodeBlock,
  Chart,
  StatsCard,
  TreeView,
  JsonViewer,
  Heatmap,
  KanbanBoard,
};

export type {
  DataTableColumn, DataTableProps,
  ListProps, ListItemProps,
  StatisticProps,
  TimelineItem, TimelineProps,
  CalendarProps,
  CodeBlockProps,
  ChartProps,
  StatsCardProps,
  TreeNode, TreeViewProps,
  JsonViewerProps,
  HeatmapCell, HeatmapProps,
  KanbanCard, KanbanColumn, KanbanBoardProps,
};
