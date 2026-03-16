import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../utils/cn";

// ─── Alert ─────────────────────────────────────────────────────────────────

const alertVariants = {
  default:  "bg-background border-border text-foreground",
  info:     "bg-info/10 border-info/30 text-info dark:text-blue-300",
  success:  "bg-success/10 border-success/30 text-success dark:text-green-300",
  warning:  "bg-warning/10 border-warning/30 text-warning dark:text-yellow-300",
  danger:   "bg-destructive/10 border-destructive/30 text-destructive dark:text-red-300",
};

const alertIcons = {
  default: null,
  info:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  success: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
  danger:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertVariants;
  title?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, dismissible, onDismiss, icon, children, ...props }, ref) => {
    const [dismissed, setDismissed] = React.useState(false);
    if (dismissed) return null;
    return (
      <div
        ref={ref}
        role="alert"
        className={cn("veloria-alert relative rounded-lg border p-4 flex gap-3", alertVariants[variant], className)}
        {...props}
      >
        {(icon !== undefined ? icon : alertIcons[variant]) && (
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {icon !== undefined ? icon : alertIcons[variant]}
          </svg>
        )}
        <div className="flex-1 min-w-0">
          {title && <h5 className="mb-1 font-semibold text-sm">{title}</h5>}
          {children && <div className="text-sm opacity-90">{children}</div>}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={() => { setDismissed(true); onDismiss?.(); }}
            className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss alert"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

// ─── Toast (Radix) ─────────────────────────────────────────────────────────

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn("fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[100vw]", className)}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & { variant?: "default" | "success" | "warning" | "danger" }
>(({ className, variant = "default", ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      "veloria-toast group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-xl border p-4 shadow-lg transition-all",
      "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-full",
      variant === "success" && "border-success/30 bg-success/10 text-success",
      variant === "warning" && "border-warning/30 bg-warning/10 text-warning",
      variant === "danger"  && "border-destructive/30 bg-destructive/10 text-destructive",
      variant === "default" && "border-border bg-background text-foreground",
      className
    )}
    {...props}
  />
));
Toast.displayName = "Toast";

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn("text-sm opacity-80", className)} {...props} />
));
ToastDescription.displayName = "ToastDescription";

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action ref={ref} className={cn("inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-transparent bg-foreground/10 px-3 text-sm font-medium transition-colors hover:bg-foreground/20 focus:outline-none focus:ring-2 focus:ring-ring", className)} {...props} />
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close ref={ref} className={cn("absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring", className)} aria-label="Close" {...props}>
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  </ToastPrimitive.Close>
));
ToastClose.displayName = "ToastClose";

// ─── Snackbar ──────────────────────────────────────────────────────────────

export interface SnackbarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  message: React.ReactNode;
  action?: React.ReactNode;
  position?: "bottom-left" | "bottom-center" | "bottom-right" | "top-center";
  autoHideDuration?: number;
  onClose?: () => void;
}

const positionClasses = {
  "bottom-left":   "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right":  "bottom-4 right-4",
  "top-center":    "top-4 left-1/2 -translate-x-1/2",
};

const Snackbar: React.FC<SnackbarProps> = ({ open = true, message, action, position = "bottom-center", autoHideDuration, onClose, className }) => {
  React.useEffect(() => {
    if (open && autoHideDuration) {
      const t = setTimeout(() => onClose?.(), autoHideDuration);
      return () => clearTimeout(t);
    }
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "veloria-snackbar fixed z-50 flex items-center gap-3 rounded-lg bg-foreground px-4 py-3 text-sm text-background shadow-xl",
        "animate-in slide-in-from-bottom-2 duration-200",
        positionClasses[position],
        className
      )}
    >
      <span className="flex-1">{message}</span>
      {action && <span className="shrink-0 font-semibold text-primary-foreground/80 hover:text-primary-foreground">{action}</span>}
      {onClose && (
        <button type="button" onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity" aria-label="Close">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
};

// ─── Progress ──────────────────────────────────────────────────────────────

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  animated?: boolean;
  label?: string;
}

const progressColors = { default: "bg-primary", success: "bg-green-500", warning: "bg-yellow-500", danger: "bg-destructive" };

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", size = "md", showValue, animated, label, ...props }, ref) => {
    const pct = Math.min(Math.max((value / max) * 100, 0), 100);
    return (
      <div ref={ref} className={cn("veloria-progress", className)} {...props}>
        {(label || showValue) && (
          <div className="mb-1.5 flex items-center justify-between text-sm">
            {label && <span className="font-medium">{label}</span>}
            {showValue && <span className="text-muted-foreground tabular-nums">{Math.round(pct)}%</span>}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn("overflow-hidden rounded-full bg-secondary", size === "sm" && "h-1.5", size === "md" && "h-2.5", size === "lg" && "h-4")}
        >
          <div
            className={cn("h-full rounded-full transition-all duration-500 ease-out", progressColors[variant], animated && "animate-pulse")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

// ─── CircularProgress ──────────────────────────────────────────────────────

export interface CircularProgressProps extends React.SVGAttributes<SVGElement> {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "success" | "warning" | "danger";
  indeterminate?: boolean;
  showValue?: boolean;
}

const circularColors = { default: "text-primary", success: "text-green-500", warning: "text-yellow-500", danger: "text-destructive" };

const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>(
  ({ className, value = 0, max = 100, size = 48, strokeWidth = 4, variant = "default", indeterminate, showValue, ...props }, ref) => {
    const r = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const pct = Math.min(Math.max((value / max) * 100, 0), 100);
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div className="veloria-circular-progress relative inline-flex items-center justify-center">
        <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn(indeterminate && "animate-spin", circularColors[variant], className)} {...props}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-20" />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.4s ease" }}
          />
        </svg>
        {showValue && !indeterminate && (
          <span className="absolute text-xs font-semibold tabular-nums">{Math.round(pct)}%</span>
        )}
      </div>
    );
  }
);
CircularProgress.displayName = "CircularProgress";

// ─── Skeleton ──────────────────────────────────────────────────────────────

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rect" | "circle";
  width?: number | string;
  height?: number | string;
  lines?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rect", width, height, lines = 1, style, ...props }, ref) => {
    if (variant === "text" && lines > 1) {
      return (
        <div className={cn("veloria-skeleton flex flex-col gap-2", className)}>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className={cn("animate-pulse rounded bg-muted", i === lines - 1 && "w-3/4")} style={{ height: height ?? 16 }} />
          ))}
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn("veloria-skeleton animate-pulse bg-muted", variant === "circle" && "rounded-full", variant !== "circle" && "rounded-md", className)}
        style={{ width: width ?? (variant === "text" ? "100%" : undefined), height: height ?? (variant === "text" ? 16 : variant === "circle" ? 40 : 80), ...style }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

// ─── LoadingSpinner ────────────────────────────────────────────────────────

export interface LoadingSpinnerProps extends React.SVGAttributes<SVGElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
}

const spinnerSizes = { xs: "h-3 w-3", sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8", xl: "h-12 w-12" };

const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
  ({ className, size = "md", label = "Loading…", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("veloria-loading-spinner animate-spin text-primary", spinnerSizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label={label}
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
);
LoadingSpinner.displayName = "LoadingSpinner";

// ─── EmptyState ────────────────────────────────────────────────────────────

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => (
    <div ref={ref} className={cn("veloria-empty-state flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-12 text-center", className)} {...props}>
      {icon && <div className="text-muted-foreground">{icon}</div>}
      {!icon && (
        <svg className="h-12 w-12 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      {title && <h3 className="text-base font-semibold">{title}</h3>}
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
);
EmptyState.displayName = "EmptyState";

// ─── StatusIndicator ───────────────────────────────────────────────────────

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: "online" | "offline" | "busy" | "away";
  label?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

const statusColorMap = { online: "bg-green-500", offline: "bg-gray-400", busy: "bg-red-500", away: "bg-yellow-500" };

const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({ className, status = "online", label, size = "md", pulse = true, ...props }, ref) => {
    const dotSize = { sm: "h-2 w-2", md: "h-2.5 w-2.5", lg: "h-3.5 w-3.5" }[size];
    return (
      <span ref={ref} className={cn("veloria-status-indicator inline-flex items-center gap-1.5", className)} {...props}>
        <span className="relative inline-flex">
          {pulse && status === "online" && (
            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", statusColorMap[status])} />
          )}
          <span className={cn("relative inline-flex rounded-full", dotSize, statusColorMap[status])} />
        </span>
        {label && <span className="text-sm capitalize">{label ?? status}</span>}
      </span>
    );
  }
);
StatusIndicator.displayName = "StatusIndicator";

// ─── Notification ──────────────────────────────────────────────────────────

export interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  time?: React.ReactNode;
  avatar?: React.ReactNode;
  unread?: boolean;
  onDismiss?: () => void;
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, title, description, time, avatar, unread, onDismiss, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "veloria-notification relative flex items-start gap-3 rounded-lg border border-border bg-background p-4 shadow-sm",
        unread && "border-primary/30 bg-primary/5",
        className
      )}
      {...props}
    >
      {avatar && <div className="shrink-0">{avatar}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-medium", unread && "text-primary")}>{title}</p>
          {time && <span className="shrink-0 text-xs text-muted-foreground">{time}</span>}
        </div>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {unread && <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" aria-label="Unread" />}
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="absolute top-2 right-2 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Dismiss">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  )
);
Notification.displayName = "Notification";

// ─── BannerAlert ───────────────────────────────────────────────────────────

export interface BannerAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  message: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const bannerColors = {
  info:    "bg-info text-white",
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  danger:  "bg-destructive text-white",
};

const BannerAlert = React.forwardRef<HTMLDivElement, BannerAlertProps>(
  ({ className, variant = "info", message, action, dismissible, onDismiss, ...props }, ref) => {
    const [dismissed, setDismissed] = React.useState(false);
    if (dismissed) return null;
    return (
      <div
        ref={ref}
        role="banner"
        className={cn("veloria-banner-alert flex items-center justify-center gap-4 px-4 py-2.5 text-sm font-medium", bannerColors[variant], className)}
        {...props}
      >
        <span className="flex-1 text-center">{message}</span>
        {action && <span className="shrink-0 underline underline-offset-2 cursor-pointer">{action}</span>}
        {dismissible && (
          <button type="button" onClick={() => { setDismissed(true); onDismiss?.(); }} className="shrink-0 ml-auto opacity-80 hover:opacity-100 transition-opacity" aria-label="Dismiss">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
    );
  }
);
BannerAlert.displayName = "BannerAlert";

// ─── ConfirmDialog ─────────────────────────────────────────────────────────

export interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open, onOpenChange, title = "Are you sure?", description, confirmLabel = "Confirm", cancelLabel = "Cancel",
  variant = "default", onConfirm, onCancel, loading,
}) => {
  const [pending, setPending] = React.useState(false);
  const handleConfirm = async () => {
    setPending(true);
    try { await onConfirm?.(); } finally { setPending(false); onOpenChange?.(false); }
  };
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="veloria-confirm-dialog fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <DialogPrimitive.Title className="text-lg font-semibold">{title}</DialogPrimitive.Title>
          {description && <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">{description}</DialogPrimitive.Description>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => { onCancel?.(); onOpenChange?.(false); }} className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{cancelLabel}</button>
            <button
              type="button"
              disabled={pending || loading}
              onClick={handleConfirm}
              className={cn("inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", variant === "danger" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90")}
            >
              {(pending || loading) && <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
              {confirmLabel}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

// ─── FloatingActionButton ──────────────────────────────────────────────────

export interface FABAction { id: string; label: string; icon: React.ReactNode; onClick: () => void; }
export interface FloatingActionButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  icon?: React.ReactNode;
  actions?: FABAction[];
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  tooltip?: string;
  onClick?: () => void;
}

const fabPositions = { "bottom-right": "bottom-6 right-6", "bottom-left": "bottom-6 left-6", "bottom-center": "bottom-6 left-1/2 -translate-x-1/2" };

const FloatingActionButton = React.forwardRef<HTMLDivElement, FloatingActionButtonProps>(
  ({ className, icon, actions, position = "bottom-right", tooltip, onClick, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const hasActions = actions && actions.length > 0;

    return (
      <div ref={ref} className={cn("veloria-fab fixed z-40 flex flex-col-reverse items-center gap-3", fabPositions[position], className)} {...props}>
        {hasActions && open && (
          <div className="flex flex-col-reverse gap-2">
            {actions.map((action) => (
              <div key={action.id} className="flex items-center gap-2 group">
                <span className="rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">{action.label}</span>
                <button
                  type="button"
                  onClick={() => { action.onClick(); setOpen(false); }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border shadow-lg hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {action.icon}
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={hasActions ? () => setOpen(!open) : onClick}
          aria-label={tooltip ?? "Action"}
          aria-expanded={hasActions ? open : undefined}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className={cn("transition-transform duration-200", hasActions && open && "rotate-45")}>
            {icon ?? <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
          </div>
        </button>
      </div>
    );
  }
);
FloatingActionButton.displayName = "FloatingActionButton";

// ─── RichTooltip ───────────────────────────────────────────────────────────

export interface RichTooltipProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}

const RichTooltip: React.FC<RichTooltipProps> = ({ children, title, description, action, side = "top", delayDuration = 300 }) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className={cn(
            "veloria-rich-tooltip z-50 overflow-hidden rounded-xl border border-border bg-popover p-4 shadow-lg max-w-xs",
            "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          )}
        >
          {title && <p className="text-sm font-semibold">{title}</p>}
          {description && <p className={cn("text-xs text-muted-foreground", title && "mt-1")}>{description}</p>}
          {action && <div className="mt-3">{action}</div>}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);

// ─── Tour ──────────────────────────────────────────────────────────────────

export interface TourStep { title: string; description: string; target?: string; }
export interface TourProps {
  steps: TourStep[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onComplete?: () => void;
}

const Tour: React.FC<TourProps> = ({ steps, open = true, onOpenChange, onComplete }) => {
  const [current, setCurrent] = React.useState(0);
  if (!open || steps.length === 0) return null;
  const step = steps[current];
  const isLast = current === steps.length - 1;

  return (
    <div className="veloria-tour fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => onOpenChange?.(false)} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold">{step.title}</h3>
          <button type="button" onClick={() => onOpenChange?.(false)} className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close tour">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{step.description}</p>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={cn("h-1.5 rounded-full transition-all", i === current ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30")} />
            ))}
          </div>
          <div className="flex gap-2">
            {current > 0 && (
              <button type="button" onClick={() => setCurrent(current - 1)} className="inline-flex h-8 items-center justify-center rounded-md border border-input px-3 text-sm hover:bg-accent transition-colors">Back</button>
            )}
            <button
              type="button"
              onClick={() => { if (isLast) { onComplete?.(); onOpenChange?.(false); } else setCurrent(current + 1); }}
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isLast ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  Alert,
  ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastAction, ToastClose,
  Snackbar,
  Progress,
  CircularProgress,
  Skeleton,
  LoadingSpinner,
  EmptyState,
  StatusIndicator,
  Notification,
  BannerAlert,
  ConfirmDialog,
  FloatingActionButton,
  RichTooltip,
  Tour,
};

export type {
  AlertProps,
  SnackbarProps,
  ProgressProps,
  CircularProgressProps,
  SkeletonProps,
  LoadingSpinnerProps,
  EmptyStateProps,
  StatusIndicatorProps,
  NotificationProps,
  BannerAlertProps,
  ConfirmDialogProps,
  FABAction,
  FloatingActionButtonProps,
  RichTooltipProps,
  TourStep,
  TourProps,
};
