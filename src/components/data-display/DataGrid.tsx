import * as React from "react";
import { cn } from "../../utils/cn";

export interface DataGridColumn<T> {
  key: keyof T & string;
  header: string;
  width?: number;
  minWidth?: number;
  sortable?: boolean;
  editable?: boolean;
  render?: (value: T[keyof T], row: T, rowIndex: number) => React.ReactNode;
}

export interface DataGridProps<T extends Record<string, unknown>> extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  columns: DataGridColumn<T>[];
  rows: T[];
  rowHeight?: number;
  headerHeight?: number;
  height?: number;
  defaultSort?: { key: keyof T & string; direction: "asc" | "desc" };
  onChange?: (rows: T[]) => void;
  onCellEdit?: (rowIndex: number, key: keyof T & string, value: unknown) => void;
  getRowId?: (row: T) => string | number;
  selectedRows?: Set<string | number>;
  onRowSelect?: (ids: Set<string | number>) => void;
  loading?: boolean;
  emptyMessage?: string;
}

interface SortState {
  key: string;
  direction: "asc" | "desc";
}

interface EditingCell {
  rowIndex: number;
  key: string;
}

const OVERSCAN = 3;
const DEFAULT_ROW_HEIGHT = 36;
const DEFAULT_HEADER_HEIGHT = 38;
const DEFAULT_COLUMN_WIDTH = 150;
const MIN_COLUMN_WIDTH = 60;

function DataGrid<T extends Record<string, unknown>>({
  columns: columnsProp,
  rows,
  rowHeight = DEFAULT_ROW_HEIGHT,
  headerHeight = DEFAULT_HEADER_HEIGHT,
  height = 480,
  defaultSort,
  onChange,
  onCellEdit,
  getRowId,
  selectedRows,
  onRowSelect,
  loading = false,
  emptyMessage = "No data",
  className,
  ...props
}: DataGridProps<T>) {
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [sort, setSort] = React.useState<SortState | null>(defaultSort ?? null);
  const [editing, setEditing] = React.useState<EditingCell | null>(null);
  const [editValue, setEditValue] = React.useState<string>("");
  const [colWidths, setColWidths] = React.useState<number[]>(() =>
    columnsProp.map((c) => c.width ?? DEFAULT_COLUMN_WIDTH)
  );
  const [copyFlash, setCopyFlash] = React.useState<EditingCell | null>(null);
  const resizeRef = React.useRef<{ colIndex: number; startX: number; startW: number } | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    return [...rows].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }, [rows, sort]);

  const totalHeight = sorted.length * rowHeight;
  const visibleStart = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN);
  const visibleCount = Math.ceil((height - headerHeight) / rowHeight) + OVERSCAN * 2;
  const visibleEnd   = Math.min(sorted.length, visibleStart + visibleCount);
  const visibleRows  = sorted.slice(visibleStart, visibleEnd);
  const paddingTop   = visibleStart * rowHeight;
  const paddingBottom = Math.max(0, (sorted.length - visibleEnd) * rowHeight);

  const rowId = (row: T, i: number): string | number =>
    getRowId ? getRowId(row) : i;

  const toggleSort = (key: string) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const startEdit = (rowIndex: number, key: string, value: unknown) => {
    const col = columnsProp.find((c) => c.key === key);
    if (!col?.editable) return;
    setEditing({ rowIndex, key });
    setEditValue(String(value ?? ""));
  };

  const commitEdit = () => {
    if (!editing) return;
    const absIndex = visibleStart + sorted.findIndex(
      (_, i) => visibleStart + i === editing.rowIndex
    );
    onCellEdit?.(editing.rowIndex, editing.key as keyof T & string, editValue);
    if (onChange) {
      const next = sorted.map((row, i) =>
        i === editing.rowIndex ? { ...row, [editing.key]: editValue } : row
      );
      onChange(next);
    }
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
    if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
    if (e.key === "Tab") {
      e.preventDefault();
      commitEdit();
      if (!editing) return;
      const colIdx = columnsProp.findIndex((c) => c.key === editing.key);
      const nextCol = columnsProp[colIdx + 1];
      if (nextCol?.editable) {
        const nextVal = sorted[editing.rowIndex]?.[nextCol.key];
        startEdit(editing.rowIndex, nextCol.key, nextVal);
      }
    }
  };

  React.useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleCopy = async (value: unknown, rowIndex: number, key: string) => {
    try {
      await navigator.clipboard.writeText(String(value ?? ""));
      setCopyFlash({ rowIndex, key });
      setTimeout(() => setCopyFlash(null), 600);
    } catch {}
  };

  const startResize = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault();
    resizeRef.current = { colIndex, startX: e.clientX, startW: colWidths[colIndex] };
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const { colIndex: ci, startX, startW } = resizeRef.current;
      const next = Math.max(MIN_COLUMN_WIDTH, startW + ev.clientX - startX);
      setColWidths((prev) => prev.map((w, i) => (i === ci ? next : w)));
    };
    const onUp = () => {
      resizeRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const totalWidth = colWidths.reduce((a, b) => a + b, 0);

  const toggleRow = (id: string | number) => {
    if (!onRowSelect || !selectedRows) return;
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    onRowSelect(next);
  };

  return (
    <div
      ref={props.ref as React.Ref<HTMLDivElement>}
      className={cn(
        "veloria-data-grid relative overflow-hidden rounded-md border border-border bg-background text-sm",
        className
      )}
      style={{ height }}
      {...props}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex border-b border-border bg-muted/60"
        style={{ height: headerHeight, minWidth: totalWidth }}
      >
        {columnsProp.map((col, ci) => (
          <div
            key={col.key}
            className="relative flex shrink-0 select-none items-center gap-1 px-3 font-medium text-muted-foreground"
            style={{ width: colWidths[ci] }}
          >
            {col.sortable ? (
              <button
                type="button"
                onClick={() => toggleSort(col.key)}
                className="flex items-center gap-1 truncate hover:text-foreground focus-visible:outline-none"
              >
                <span className="truncate">{col.header}</span>
                <SortIcon active={sort?.key === col.key} direction={sort?.direction} />
              </button>
            ) : (
              <span className="truncate">{col.header}</span>
            )}
            <div
              onMouseDown={(e) => startResize(e, ci)}
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/40"
            />
          </div>
        ))}
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className="overflow-auto"
        style={{ height: height - headerHeight }}
        onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      >
        {loading ? (
          <LoadingRows count={8} rowHeight={rowHeight} colWidths={colWidths} />
        ) : sorted.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div style={{ height: totalHeight, minWidth: totalWidth }}>
            <div style={{ paddingTop }}>
              {visibleRows.map((row, vi) => {
                const absIdx = visibleStart + vi;
                const id = rowId(row, absIdx);
                const isSelected = selectedRows?.has(id);
                return (
                  <div
                    key={id}
                    role="row"
                    aria-selected={isSelected}
                    onClick={() => toggleRow(id)}
                    className={cn(
                      "flex border-b border-border/60 last:border-0",
                      isSelected && "bg-primary/8",
                      !isSelected && "hover:bg-muted/40"
                    )}
                    style={{ height: rowHeight }}
                  >
                    {columnsProp.map((col, ci) => {
                      const raw = row[col.key];
                      const isEditing = editing?.rowIndex === absIdx && editing.key === col.key;
                      const flashing = copyFlash?.rowIndex === absIdx && copyFlash.key === col.key;
                      return (
                        <div
                          key={col.key}
                          role="gridcell"
                          className={cn(
                            "relative flex shrink-0 items-center overflow-hidden px-3",
                            col.editable && "cursor-text",
                            flashing && "bg-success/10"
                          )}
                          style={{ width: colWidths[ci] }}
                          onDoubleClick={() => startEdit(absIdx, col.key, raw)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            handleCopy(raw, absIdx, col.key);
                          }}
                        >
                          {isEditing ? (
                            <input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={handleKeyDown}
                              className="w-full bg-transparent text-sm outline-none ring-2 ring-primary ring-offset-1"
                            />
                          ) : col.render ? (
                            col.render(raw, row, absIdx)
                          ) : (
                            <span className="truncate text-foreground">{String(raw ?? "")}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div style={{ height: paddingBottom }} />
          </div>
        )}
      </div>
    </div>
  );
}

DataGrid.displayName = "DataGrid";

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction?: "asc" | "desc";
}) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={cn("shrink-0", active ? "text-primary" : "text-muted-foreground/40")}
    >
      <path
        d="M6 2L9 5H3L6 2Z"
        fill="currentColor"
        opacity={active && direction === "asc" ? 1 : 0.4}
      />
      <path
        d="M6 10L3 7H9L6 10Z"
        fill="currentColor"
        opacity={active && direction === "desc" ? 1 : 0.4}
      />
    </svg>
  );
}

function LoadingRows({
  count,
  rowHeight,
  colWidths,
}: {
  count: number;
  rowHeight: number;
  colWidths: number[];
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, ri) => (
        <div key={ri} className="flex border-b border-border/60" style={{ height: rowHeight }}>
          {colWidths.map((w, ci) => (
            <div key={ci} className="flex shrink-0 items-center px-3" style={{ width: w }}>
              <div
                className="h-3 animate-pulse rounded bg-muted"
                style={{ width: `${50 + ((ri * 7 + ci * 13) % 40)}%` }}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export { DataGrid };