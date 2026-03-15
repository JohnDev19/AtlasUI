import * as React from "react";
import { cn } from "../../utils/cn";

// ─── ThemeSwitcher ─────────────────────────────────────────────────────────

export type Theme = "light" | "dark" | "system";

export interface ThemeSwitcherProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "onChange"> {
  value?: Theme;
  onChange?: (theme: Theme) => void;
  variant?: "icon" | "toggle" | "select";
}

const ThemeSwitcher = React.forwardRef<HTMLDivElement, ThemeSwitcherProps>(
  ({ className, value = "system", onChange, variant = "icon", ...props }, ref) => {
    const icons: Record<Theme, React.ReactNode> = {
      light: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
      dark: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      system: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    };

    const themes: Theme[] = ["light", "dark", "system"];

    if (variant === "icon") {
      const next: Record<Theme, Theme> = { light: "dark", dark: "system", system: "light" };
      return (
        <div ref={ref} className={cn("atlas-theme-switcher", className)} {...props}>
          <button
            type="button"
            onClick={() => onChange?.(next[value])}
            aria-label={`Current theme: ${value}. Switch to ${next[value]}`}
            className="h-9 w-9 flex items-center justify-center rounded-md border border-border hover:bg-accent transition-colors"
          >
            {icons[value]}
          </button>
        </div>
      );
    }

    if (variant === "toggle") {
      return (
        <div ref={ref} className={cn("atlas-theme-switcher inline-flex rounded-md border border-border overflow-hidden", className)} {...props} role="group" aria-label="Theme selection">
          {themes.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => onChange?.(theme)}
              aria-pressed={value === theme}
              aria-label={`${theme} theme`}
              className={cn(
                "flex h-8 w-8 items-center justify-center border-r last:border-r-0 border-border transition-colors",
                value === theme ? "bg-accent text-accent-foreground" : "hover:bg-muted"
              )}
            >
              {icons[theme]}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("atlas-theme-switcher", className)} {...props}>
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value as Theme)}
          aria-label="Select theme"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {themes.map((theme) => (
            <option key={theme} value={theme} className="capitalize">
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
ThemeSwitcher.displayName = "ThemeSwitcher";

// ─── CopyButton ────────────────────────────────────────────────────────────

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  timeout?: number;
  onCopied?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "button";
  label?: string;
}

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, text, timeout = 2000, onCopied, size = "md", variant = "icon", label = "Copy", ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onCopied?.();
        setTimeout(() => setCopied(false), timeout);
      } catch {
        // Fallback
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      }
    };

    const iconSize = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : label}
        className={cn(
          "atlas-copy-button inline-flex items-center justify-center gap-1.5 rounded-md transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "icon" && [
            size === "sm" && "h-7 w-7",
            size === "md" && "h-8 w-8",
            size === "lg" && "h-9 w-9",
            "border border-border hover:bg-accent text-muted-foreground hover:text-foreground",
          ],
          variant === "button" && [
            "px-3 border border-border hover:bg-accent text-sm",
            size === "sm" && "h-7 text-xs",
            size === "md" && "h-8",
            size === "lg" && "h-9",
          ],
          copied && "text-success border-success/30",
          className
        )}
        {...props}
      >
        {copied ? (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
        {variant === "button" && <span>{copied ? "Copied!" : label}</span>}
      </button>
    );
  }
);
CopyButton.displayName = "CopyButton";

// ─── KeyboardShortcut ──────────────────────────────────────────────────────

export interface KeyboardShortcutProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color" | "size"> {
  keys: string[];
  separator?: string;
  size?: "sm" | "md" | "lg";
}

const KeyboardShortcut = React.forwardRef<HTMLSpanElement, KeyboardShortcutProps>(
  ({ className, keys, separator = "+", size = "md", ...props }, ref) => (
    <span
      ref={ref}
      className={cn("atlas-kbd inline-flex items-center gap-0.5", className)}
      aria-label={`Keyboard shortcut: ${keys.join(separator)}`}
      {...props}
    >
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="text-muted-foreground/60 mx-0.5 text-xs">{separator}</span>
          )}
          <kbd
            className={cn(
              "inline-flex items-center justify-center rounded border border-border bg-muted font-mono font-medium",
              "shadow-[inset_0_-1px_0_0_rgb(0_0_0_/_0.1)] dark:shadow-[inset_0_-1px_0_0_rgb(255_255_255_/_0.05)]",
              size === "sm" && "h-5 min-w-[1.25rem] px-1 text-[10px]",
              size === "md" && "h-6 min-w-[1.5rem] px-1.5 text-xs",
              size === "lg" && "h-7 min-w-[1.75rem] px-2 text-sm",
            )}
          >
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </span>
  )
);
KeyboardShortcut.displayName = "KeyboardShortcut";

// ─── ResizablePanel ────────────────────────────────────────────────────────

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  direction?: "horizontal" | "vertical";
  onResize?: (size: number) => void;
}

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({
    className,
    children,
    defaultSize = 300,
    minSize = 100,
    maxSize = 800,
    direction = "horizontal",
    onResize,
    style,
    ...props
  }, ref) => {
    const [size, setSize] = React.useState(defaultSize);
    const isDragging = React.useRef(false);
    const startPos = React.useRef(0);
    const startSize = React.useRef(defaultSize);

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
      startSize.current = size;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const pos = direction === "horizontal" ? e.clientX : e.clientY;
        const delta = pos - startPos.current;
        const newSize = Math.min(maxSize, Math.max(minSize, startSize.current + delta));
        setSize(newSize);
        onResize?.(newSize);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div
        ref={ref}
        className={cn("atlas-resizable-panel relative overflow-hidden", className)}
        style={{
          ...(direction === "horizontal" ? { width: size } : { height: size }),
          ...style,
        }}
        {...props}
      >
        {children}
        <div
          onMouseDown={handleMouseDown}
          role="separator"
          aria-orientation={direction}
          aria-label="Resize panel"
          tabIndex={0}
          className={cn(
            "atlas-resize-handle absolute z-10 flex items-center justify-center",
            "bg-transparent hover:bg-primary/20 transition-colors cursor-col-resize group",
            direction === "horizontal"
              ? "right-0 top-0 h-full w-1.5 cursor-col-resize"
              : "bottom-0 left-0 w-full h-1.5 cursor-row-resize"
          )}
        >
          <div className={cn(
            "rounded-full bg-border group-hover:bg-primary/50 transition-colors",
            direction === "horizontal" ? "h-8 w-1" : "w-8 h-1"
          )} />
        </div>
      </div>
    );
  }
);
ResizablePanel.displayName = "ResizablePanel";

// ─── DragDropArea ──────────────────────────────────────────────────────────

export interface DragDropAreaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "onDragOver"> {
  onDrop?: (items: DataTransfer) => void;
  onDragOver?: (e: React.DragEvent) => void;
  accept?: string[];
  disabled?: boolean;
  active?: boolean;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
}

const DragDropArea = React.forwardRef<HTMLDivElement, DragDropAreaProps>(
  ({
    className,
    onDrop,
    accept,
    disabled,
    active: externalActive,
    label,
    icon,
    hint,
    children,
    ...props
  }, ref) => {
    const [internalActive, setInternalActive] = React.useState(false);
    const active = externalActive ?? internalActive;
    const [dragCounter, setDragCounter] = React.useState(0);

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      setDragCounter((c) => c + 1);
      setInternalActive(true);
    };

    const handleDragLeave = () => {
      setDragCounter((c) => {
        const next = c - 1;
        if (next <= 0) setInternalActive(false);
        return next;
      });
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragCounter(0);
      setInternalActive(false);
      if (!disabled) {
        onDrop?.(e.dataTransfer);
      }
    };

    return (
      <div
        ref={ref}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        aria-label="Drop zone"
        aria-disabled={disabled}
        className={cn(
          "atlas-drag-drop flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center",
          "transition-colors duration-150",
          active && !disabled && "border-primary bg-primary/5",
          !active && "border-border hover:border-primary/50 hover:bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed border-border",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <div className={cn(
              "rounded-full p-3 transition-colors",
              active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {icon ?? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {label ?? (active ? "Release to drop" : "Drag & drop files here")}
              </p>
              {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
              {accept && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Accepted: {accept.join(", ")}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);
DragDropArea.displayName = "DragDropArea";


// ═══════════════════════════════════════════════════════════════
// New in v0.1.2
// ═══════════════════════════════════════════════════════════════


// ─── InfiniteScroll ───────────────────────────────────────────────────────

export interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  as?: React.ElementType;
}

const DefaultLoader = () => (
  <div className="flex justify-center py-4">
    <svg className="h-5 w-5 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  </div>
);

const InfiniteScroll = React.forwardRef<HTMLDivElement, InfiniteScrollProps>(
  ({
    className,
    children,
    onLoadMore,
    hasMore,
    loading,
    threshold = 100,
    loader,
    endMessage,
    as: Comp = "div",
    ...props
  }, ref) => {
    const sentinelRef = React.useRef<HTMLDivElement>(null);
    const loadingRef = React.useRef(false);

    React.useEffect(() => {
      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const observer = new IntersectionObserver(
        async (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && hasMore && !loadingRef.current && !loading) {
            loadingRef.current = true;
            await onLoadMore();
            loadingRef.current = false;
          }
        },
        { rootMargin: `${threshold}px` }
      );

      observer.observe(sentinel);
      return () => observer.disconnect();
    }, [hasMore, loading, onLoadMore, threshold]);

    return (
      <Comp
        ref={ref}
        className={cn("atlas-infinite-scroll", className)}
        {...props}
      >
        {children}
        <div ref={sentinelRef} aria-hidden="true" />
        {loading && (loader ?? <DefaultLoader />)}
        {!hasMore && endMessage && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            {endMessage}
          </div>
        )}
      </Comp>
    );
  }
);
InfiniteScroll.displayName = "InfiniteScroll";

// ─── VirtualList ──────────────────────────────────────────────────────────

export interface VirtualListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  height?: number | string;
  getItemKey?: (item: T, index: number) => string | number;
}

function VirtualList<T>({
  className,
  items,
  itemHeight,
  renderItem,
  overscan = 3,
  height = 400,
  getItemKey,
  style,
  ...props
}: VirtualListProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  const containerHeight = typeof height === "number" ? height : 400;
  const totalHeight = items.length * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount);

  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      ref={containerRef}
      role="list"
      className={cn("atlas-virtual-list overflow-y-auto relative", className)}
      style={{ height, ...style }}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      {...props}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, i) => {
          const actualIndex = startIndex + i;
          return (
            <div
              key={getItemKey ? getItemKey(item, actualIndex) : actualIndex}
              role="listitem"
              style={{
                position: "absolute",
                top: actualIndex * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
VirtualList.displayName = "VirtualList";


export {
 ThemeSwitcher, CopyButton, KeyboardShortcut, ResizablePanel, DragDropArea ,
  InfiniteScroll, VirtualList
};
