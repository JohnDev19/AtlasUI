import * as React from "react";
import { cn } from "../../utils/cn";

export interface FileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Full filename including extension. */
  filename: string;
  /** File size in bytes. Formatted automatically. */
  size?: number;
  /** Override the displayed type badge (e.g. "PDF"). Derived from filename if omitted. */
  type?: string;
  /** Upload/download progress 0–100. Omit to hide the bar. */
  progress?: number;
  /** Called when the download button is clicked. */
  onDownload?: () => void;
  /** Called when the remove button is clicked. */
  onRemove?: () => void;
  /** Layout variant. Default "full". */
  variant?: "compact" | "full";
}

// ── helpers ──────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function deriveType(filename: string): string {
  const ext = filename.split(".").pop()?.toUpperCase() ?? "FILE";
  return ext.slice(0, 4);
}

const TYPE_COLORS: Record<string, string> = {
  PDF:  "bg-destructive/10 text-destructive",
  DOC:  "bg-info/10 text-info",
  DOCX: "bg-info/10 text-info",
  XLS:  "bg-success/10 text-success",
  XLSX: "bg-success/10 text-success",
  CSV:  "bg-success/10 text-success",
  PPT:  "bg-warning/10 text-warning",
  PPTX: "bg-warning/10 text-warning",
  PNG:  "bg-primary/10 text-primary",
  JPG:  "bg-primary/10 text-primary",
  JPEG: "bg-primary/10 text-primary",
  GIF:  "bg-primary/10 text-primary",
  SVG:  "bg-primary/10 text-primary",
  WEBP: "bg-primary/10 text-primary",
  ZIP:  "bg-muted text-muted-foreground",
  RAR:  "bg-muted text-muted-foreground",
  TAR:  "bg-muted text-muted-foreground",
  MP4:  "bg-[hsl(var(--info)/0.1)] text-info",
  MP3:  "bg-[hsl(var(--info)/0.1)] text-info",
  MOV:  "bg-[hsl(var(--info)/0.1)] text-info",
};
const DEFAULT_TYPE_COLOR = "bg-secondary text-secondary-foreground";

// ── component ─────────────────────────────────────────────────────────────

const FileCard = React.forwardRef<HTMLDivElement, FileCardProps>(
  (
    {
      filename,
      size,
      type,
      progress,
      onDownload,
      onRemove,
      variant = "full",
      className,
      ...props
    },
    ref
  ) => {
    const fileType = type ?? deriveType(filename);
    const colorCls = TYPE_COLORS[fileType] ?? DEFAULT_TYPE_COLOR;
    const isComplete = progress !== undefined && progress >= 100;

    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={cn(
            "atlas-file-card atlas-file-card--compact",
            "inline-flex items-center gap-2 rounded-md border border-border",
            "bg-background px-3 py-1.5 text-sm",
            className
          )}
          {...props}
        >
          {/* Type badge */}
          <span
            className={cn(
              "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
              colorCls
            )}
          >
            {fileType}
          </span>
          {/* Name */}
          <span className="min-w-0 flex-1 truncate font-medium text-foreground">
            {filename}
          </span>
          {size !== undefined && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatBytes(size)}
            </span>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${filename}`}
              className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-destructive"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      );
    }

    // "full" variant
    return (
      <div
        ref={ref}
        className={cn(
          "atlas-file-card atlas-file-card--full",
          "flex items-start gap-3 rounded-xl border border-border bg-card p-4",
          className
        )}
        {...props}
      >
        {/* Type icon */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            "text-[11px] font-bold uppercase",
            colorCls
          )}
          aria-hidden="true"
        >
          {fileType}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-medium text-foreground"
            title={filename}
          >
            {filename}
          </p>

          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            {size !== undefined && <span>{formatBytes(size)}</span>}
            {progress !== undefined && (
              <span>
                {isComplete ? "Complete" : `${Math.round(progress)}%`}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {progress !== undefined && (
            <div
              className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Upload progress: ${Math.round(progress)}%`}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  isComplete ? "bg-success" : "bg-primary"
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {(onDownload || onRemove) && (
          <div className="flex shrink-0 items-center gap-1">
            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                aria-label={`Download ${filename}`}
                className={cn(
                  "rounded-md p-1.5 text-muted-foreground transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${filename}`}
                className={cn(
                  "rounded-md p-1.5 text-muted-foreground transition-colors",
                  "hover:bg-destructive/10 hover:text-destructive",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

FileCard.displayName = "FileCard";

export { FileCard };
