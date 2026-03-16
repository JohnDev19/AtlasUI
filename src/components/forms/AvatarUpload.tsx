import * as React from "react";
import { cn } from "../../utils/cn";

export interface AvatarUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current image URL — if provided, displays this image. */
  value?: string;
  /** Called with the selected File and its base64 data-URL preview. */
  onChange?: (file: File, previewUrl: string) => void;
  /** Called when the remove button is clicked. */
  onRemove?: () => void;
  /** Maximum allowed file size in bytes. Default 5 MB. */
  maxSize?: number;
  /** Visual size of the avatar circle. Default "md". */
  size?: "sm" | "md" | "lg" | "xl";
  /** Fallback initials to show when no image is present. */
  fallback?: string;
  /** Disable the upload interaction. */
  disabled?: boolean;
  /** Accepted MIME types passed to the file input. Default "image/*". */
  accept?: string;
}

// ── size maps ─────────────────────────────────────────────────────────────

const AVATAR_SIZE: Record<string, string> = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
  xl: "h-40 w-40",
};

const ICON_SIZE: Record<string, string> = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

const TEXT_SIZE: Record<string, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

// ── helpers ───────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── component ─────────────────────────────────────────────────────────────

const AvatarUpload = React.forwardRef<HTMLDivElement, AvatarUploadProps>(
  (
    {
      value,
      onChange,
      onRemove,
      maxSize = 5 * 1024 * 1024,
      size = "md",
      fallback,
      disabled = false,
      accept = "image/*",
      className,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [preview, setPreview] = React.useState<string | null>(value ?? null);
    const [error, setError] = React.useState<string | null>(null);
    const [hovering, setHovering] = React.useState(false);

    // Sync when controlled value changes
    React.useEffect(() => {
      setPreview(value ?? null);
    }, [value]);

    const trigger = () => {
      if (!disabled) inputRef.current?.click();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);

      if (file.size > maxSize) {
        setError(`File too large — max ${formatBytes(maxSize)}`);
        // Reset so same file triggers change again if user tries to re-upload
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setPreview(url);
        onChange?.(file, url);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    };

    return (
      <div
        ref={ref}
        className={cn("atlas-avatar-upload inline-flex flex-col items-center gap-2", className)}
        {...props}
      >
        {/* Clickable avatar circle */}
        <div
          role={disabled ? undefined : "button"}
          tabIndex={disabled ? undefined : 0}
          aria-label="Upload profile photo"
          onClick={trigger}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => !disabled && setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className={cn(
            "relative overflow-hidden rounded-full bg-muted",
            AVATAR_SIZE[size],
            !disabled && "cursor-pointer",
            disabled && "cursor-not-allowed opacity-60",
            // Crop guide ring — always visible as a faint circle
            "ring-2 ring-offset-2 ring-offset-background",
            hovering && !disabled
              ? "ring-primary"
              : "ring-muted-foreground/20"
          )}
        >
          {/* Image or fallback */}
          {preview ? (
            <img
              src={preview}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center",
                "text-muted-foreground font-semibold select-none",
                TEXT_SIZE[size]
              )}
            >
              {fallback ?? (
                <svg
                  className={ICON_SIZE[size]}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
          )}

          {/* Hover overlay */}
          {hovering && !disabled && (
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-0.5",
                "bg-black/55 text-white"
              )}
              aria-hidden="true"
            >
              <svg
                className={ICON_SIZE[size]}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-[11px] font-medium leading-none">
                {preview ? "Change" : "Upload"}
              </span>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Error message */}
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}

        {/* Remove link — only shown when there is a preview */}
        {preview && onRemove && !disabled && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setError(null);
              onRemove();
            }}
            className="text-xs text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Remove photo
          </button>
        )}
      </div>
    );
  }
);

AvatarUpload.displayName = "AvatarUpload";

export { AvatarUpload };
