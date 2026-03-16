/**
 * Veloria UI — Utility & Performance Components
 * ThemeSwitcher · CopyButton · KeyboardShortcut · ResizablePanel
 * DragDropArea · InfiniteScroll · VirtualList
 */

import * as React from "react";
import { cn } from "../../utils/cn";

// ─── ThemeSwitcher ────────────────────────────────────────────────────────

export interface ThemeSwitcherProps {
  value?: "light" | "dark" | "system";
  onChange?: (theme: "light" | "dark" | "system") => void;
  variant?: "icon" | "toggle" | "select";
  className?: string;
}

const SunIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="5"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const MoonIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
  </svg>
);

const SystemIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={2}/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8M12 17v4"/>
  </svg>
);

export const ThemeSwitcher = React.forwardRef<HTMLDivElement, ThemeSwitcherProps>(
  ({ value = "system", onChange, variant = "icon", className }, ref) => {
    const cycle = () => {
      const next = value === "light" ? "dark" : value === "dark" ? "system" : "light";
      onChange?.(next);
    };

    if (variant === "select") {
      return (
        <select
          ref={ref as React.Ref<HTMLSelectElement>}
          value={value}
          onChange={(e) => onChange?.(e.target.value as "light" | "dark" | "system")}
          className={cn(
            "veloria-theme-switcher h-9 rounded-md border border-input bg-background px-3 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
          aria-label="Select theme"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      );
    }

    if (variant === "toggle") {
      return (
        <div
          ref={ref}
          role="group"
          aria-label="Theme switcher"
          className={cn("veloria-theme-switcher inline-flex rounded-md border border-input overflow-hidden", className)}
        >
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-label={`${t} theme`}
              aria-pressed={value === t}
              onClick={() => onChange?.(t)}
              className={cn(
                "flex h-8 w-9 items-center justify-center transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                value === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {t === "light" ? <SunIcon /> : t === "dark" ? <MoonIcon /> : <SystemIcon />}
            </button>
          ))}
        </div>
      );
    }

    // icon variant — single cycle button
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={cycle}
        aria-label={`Switch theme (current: ${value})`}
        className={cn(
          "veloria-theme-switcher inline-flex h-9 w-9 items-center justify-center rounded-md",
          "border border-input bg-background text-foreground",
          "hover:bg-accent hover:text-accent-foreground transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        {value === "light" ? <SunIcon /> : value === "dark" ? <MoonIcon /> : <SystemIcon />}
      </button>
    );
  }
);
ThemeSwitcher.displayName = "ThemeSwitcher";

// ─── CopyButton ───────────────────────────────────────────────────────────

export interface CopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  text: string;
  label?: string;
  variant?: "icon" | "button";
  size?: "sm" | "md" | "lg";
  successDuration?: number;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ text, label = "Copy", variant = "icon", size = "md", successDuration = 2000, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      if (!navigator?.clipboard) return;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), successDuration);
      } catch { /* ignore */ }
    };

    const iconSize = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : label}
        className={cn(
          "veloria-copy-button inline-flex items-center justify-center gap-1.5 rounded-md transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "icon" && [
            size === "sm" && "h-7 w-7",
            size === "md" && "h-8 w-8",
            size === "lg" && "h-9 w-9",
            "border border-border hover:bg-accent text-muted-foreground hover:text-foreground",
          ],
          variant === "button" && [
            "px-3 border border-border hover:bg-accent text-sm font-medium",
            size === "sm" && "h-7 text-xs",
            size === "md" && "h-8",
            size === "lg" && "h-9",
          ],
          copied && "text-green-600 border-green-500/40 dark:text-green-400",
          className
        )}
        {...props}
      >
        {copied ? (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
          </svg>
        ) : (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        )}
        {variant === "button" && <span>{copied ? "Copied!" : label}</span>}
      </button>
    );
  }
);
CopyButton.displayName = "CopyButton";

// ─── KeyboardShortcut ─────────────────────────────────────────────────────

export interface KeyboardShortcutProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "size"> {
  keys: string[];
  separator?: string;
  size?: "sm" | "md" | "lg";
}

export const KeyboardShortcut = React.forwardRef<HTMLSpanElement, KeyboardShortcutProps>(
  ({ keys, separator = "+", size = "md", className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("veloria-kbd inline-flex items-center gap-0.5", className)}
      {...props}
    >
      {keys.map((key, i) => (
        <React.Fragment key={key}>
          {i > 0 && (
            <span className={cn("text-muted-foreground mx-0.5",
              size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-xs"
            )}>{separator}</span>
          )}
          <kbd className={cn(
            "inline-flex items-center justify-center rounded border border-border",
            "bg-muted font-mono text-muted-foreground font-medium",
            "shadow-[0_1px_1px_hsl(0_0%_0%/0.1),inset_0_1px_0_hsl(0_0%_100%/0.1)]",
            size === "sm" && "h-5 min-w-[1.25rem] px-1 text-[10px]",
            size === "md" && "h-6 min-w-[1.5rem] px-1.5 text-xs",
            size === "lg" && "h-7 min-w-[1.75rem] px-2 text-sm"
          )}>
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </span>
  )
);
KeyboardShortcut.displayName = "KeyboardShortcut";

// ─── ResizablePanel ───────────────────────────────────────────────────────

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  minSize?: number;
  maxSize?: number;
  defaultSize?: number;
  onResize?: (size: number) => void;
}

export const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    { direction = "horizontal", minSize = 100, maxSize = 800,
      defaultSize = 300, onResize, children, className, style, ...props },
    ref
  ) => {
    const [size, setSize] = React.useState(defaultSize);
    const dragging = React.useRef(false);
    const startPos = React.useRef(0);
    const startSize = React.useRef(0);

    const onMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
      startSize.current = size;

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const delta = direction === "horizontal"
          ? ev.clientX - startPos.current
          : ev.clientY - startPos.current;
        const next = Math.min(maxSize, Math.max(minSize, startSize.current + delta));
        setSize(next);
        onResize?.(next);
      };
      const onUp = () => { dragging.current = false; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    return (
      <div
        ref={ref}
        className={cn("veloria-resizable-panel relative", className)}
        style={{
          ...(direction === "horizontal" ? { width: size } : { height: size }),
          ...style,
        }}
        {...props}
      >
        {children}
        <div
          role="separator"
          aria-orientation={direction}
          aria-label="Resize handle"
          onMouseDown={onMouseDown}
          className={cn(
            "absolute bg-border hover:bg-primary/50 transition-colors cursor-col-resize select-none z-10",
            direction === "horizontal"
              ? "right-0 top-0 h-full w-1 cursor-col-resize"
              : "bottom-0 left-0 w-full h-1 cursor-row-resize"
          )}
        />
      </div>
    );
  }
);
ResizablePanel.displayName = "ResizablePanel";

// ─── DragDropArea ─────────────────────────────────────────────────────────

export interface DragDropAreaProps extends Omit<React.HTMLAttributes<HTMLDivElement>,
  "onDrop" | "onDragOver" | "onChange"> {
  onFilesAccepted?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  disabled?: boolean;
  label?: string;
  sublabel?: string;
}

export const DragDropArea = React.forwardRef<HTMLDivElement, DragDropAreaProps>(
  (
    { onFilesAccepted, accept, multiple = true, maxSizeMB, disabled,
      label = "Drop files here", sublabel, className, ...props },
    ref
  ) => {
    const [dragging, setDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const process = (files: FileList | null) => {
      if (!files || disabled) return;
      let arr = Array.from(files);
      if (maxSizeMB) arr = arr.filter(f => f.size <= maxSizeMB * 1024 * 1024);
      if (!multiple) arr = arr.slice(0, 1);
      if (arr.length) onFilesAccepted?.(arr);
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); process(e.dataTransfer.files); }}
        className={cn(
          "veloria-dropzone relative flex flex-col items-center justify-center gap-3",
          "rounded-xl border-2 border-dashed p-10 text-center cursor-pointer",
          "transition-colors duration-200 outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => process(e.target.files)}
          tabIndex={-1}
        />
        <svg className="h-10 w-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
        <div>
          <p className="text-sm font-medium">{label}</p>
          {sublabel && <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>}
          {maxSizeMB && (
            <p className="mt-1 text-xs text-muted-foreground">Max {maxSizeMB} MB per file</p>
          )}
        </div>
      </div>
    );
  }
);
DragDropArea.displayName = "DragDropArea";

// ─── InfiniteScroll ───────────────────────────────────────────────────────

export interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
}

export const InfiniteScroll = React.forwardRef<HTMLDivElement, InfiniteScrollProps>(
  (
    { onLoadMore, hasMore, loading = false, threshold = 0.1,
      loader, endMessage, children, className, ...props },
    ref
  ) => {
    const sentinelRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const el = sentinelRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting && hasMore && !loading) onLoadMore(); },
        { threshold }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, [hasMore, loading, onLoadMore, threshold]);

    return (
      <div ref={ref} className={cn("veloria-infinite-scroll", className)} {...props}>
        {children}
        <div ref={sentinelRef} aria-hidden="true" />
        {loading && (
          <div className="flex justify-center py-6" role="status" aria-label="Loading more">
            {loader ?? (
              <svg className="h-6 w-6 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
          </div>
        )}
        {!hasMore && !loading && endMessage && (
          <div className="py-6 text-center text-sm text-muted-foreground">{endMessage}</div>
        )}
      </div>
    );
  }
);
InfiniteScroll.displayName = "InfiniteScroll";

// ─── VirtualList ──────────────────────────────────────────────────────────

export interface VirtualListProps<T = unknown> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  height?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  overscan = 3,
  height = 400,
  className,
  style,
  ...props
}: VirtualListProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex   = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      ref={containerRef}
      role="list"
      className={cn("veloria-virtual-list overflow-auto", className)}
      style={{ height, ...style }}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      {...props}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, i) => (
          <div
            key={startIndex + i}
            role="listitem"
            style={{
              position: "absolute",
              top: (startIndex + i) * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item, startIndex + i)}
          </div>
        ))}
      </div>
    </div>
  );
}
VirtualList.displayName = "VirtualList";

// ─── Exports ──────────────────────────────────────────────────────────────

export {
  ThemeSwitcher,
  CopyButton,
  KeyboardShortcut,
  ResizablePanel,
  DragDropArea,
  InfiniteScroll,
};
