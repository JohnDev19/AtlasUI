import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// ─── Alert ─────────────────────────────────────────────────────────────────

const alertVariants = cva(
  "atlas-alert relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        info: "border-info/30 bg-info/10 text-info-foreground [&>svg]:text-info",
        success: "border-success/30 bg-success/10 text-success-foreground [&>svg]:text-success",
        warning: "border-warning/30 bg-warning/10 text-warning-foreground [&>svg]:text-warning",
        danger: "border-destructive/30 bg-destructive/10 text-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, closable, onClose, children, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      {icon}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">{children}</div>
        {closable && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-0.5 text-current/50 hover:text-current transition-colors"
            aria-label="Dismiss alert"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-semibold leading-tight tracking-tight", className)} {...props} />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm leading-relaxed", className)} {...props} />
  )
);
AlertDescription.displayName = "AlertDescription";

// ─── Toast ─────────────────────────────────────────────────────────────────

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "atlas-toast-viewport fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm p-4",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const toastVariants = cva(
  [
    "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden",
    "rounded-lg border p-4 shadow-lg transition-all",
    "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
    "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full data-[state=open]:fade-in",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-right-full",
  ],
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        success: "bg-success/10 border-success/20 text-success",
        warning: "bg-warning/10 border-warning/20 text-warning",
        danger: "bg-destructive/10 border-destructive/20 text-destructive",
        info: "bg-info/10 border-info/20 text-info",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitive.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
));
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn("text-sm opacity-80", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    toast-close=""
    className={cn(
      "ml-auto shrink-0 rounded-md p-0.5 opacity-50 hover:opacity-100 transition-opacity",
      className
    )}
    aria-label="Close"
    {...props}
  >
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium",
      "transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

// ─── Snackbar ─────────────────────────────────────────────────────────────

export interface SnackbarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  message: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  position?: "bottom-center" | "bottom-left" | "bottom-right" | "top-center";
}

const Snackbar = React.forwardRef<HTMLDivElement, SnackbarProps>(
  ({ className, open, message, action, variant = "default", position = "bottom-center", ...props }, ref) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "atlas-snackbar fixed z-50 flex items-center gap-4 rounded-lg px-4 py-3 shadow-lg",
          "min-w-[280px] max-w-[480px]",
          position === "bottom-center" && "bottom-4 left-1/2 -translate-x-1/2",
          position === "bottom-left" && "bottom-4 left-4",
          position === "bottom-right" && "bottom-4 right-4",
          position === "top-center" && "top-4 left-1/2 -translate-x-1/2",
          variant === "default" && "bg-foreground text-background",
          variant === "success" && "bg-success text-success-foreground",
          variant === "warning" && "bg-warning text-warning-foreground",
          variant === "danger" && "bg-destructive text-destructive-foreground",
          className
        )}
        {...props}
      >
        <p className="flex-1 text-sm font-medium">{message}</p>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }
);
Snackbar.displayName = "Snackbar";

// ─── Progress ─────────────────────────────────────────────────────────────

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "default" | "success" | "warning" | "danger";
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, label, showValue, size = "md", color = "default", ...props }, ref) => (
    <div className="atlas-progress w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showValue && <span className="text-sm text-muted-foreground">{value ?? 0}%</span>}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full bg-secondary",
          size === "sm" && "h-1.5",
          size === "md" && "h-2.5",
          size === "lg" && "h-4",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-in-out",
            color === "default" && "bg-primary",
            color === "success" && "bg-success",
            color === "warning" && "bg-warning",
            color === "danger" && "bg-destructive",
          )}
          style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
);
Progress.displayName = "Progress";

// ─── CircularProgress ─────────────────────────────────────────────────────

export interface CircularProgressProps extends React.SVGAttributes<SVGElement> {
  value?: number;
  size?: number;
  thickness?: number;
  showValue?: boolean;
  label?: string;
  color?: "default" | "success" | "warning" | "danger";
  indeterminate?: boolean;
}

const CircularProgress = ({
  value = 0,
  size = 48,
  thickness = 4,
  showValue,
  label,
  color = "default",
  indeterminate,
  className,
  ...props
}: CircularProgressProps) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const colorMap = {
    default: "stroke-primary",
    success: "stroke-success",
    warning: "stroke-warning",
    danger: "stroke-destructive",
  };

  return (
    <div className={cn("atlas-circular-progress relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        className={indeterminate ? "animate-spin" : ""}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        {...props}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
          className="stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
          strokeLinecap="round"
          className={cn("transition-all duration-500", colorMap[color])}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showValue && !indeterminate && (
        <span className="absolute text-xs font-semibold">{value}%</span>
      )}
    </div>
  );
};
CircularProgress.displayName = "CircularProgress";

// ─── Skeleton ─────────────────────────────────────────────────────────────

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rect" | "circle";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rect", width, height, lines = 1, style, ...props }, ref) => {
    if (variant === "text" && lines > 1) {
      return (
        <div className={cn("atlas-skeleton space-y-2", className)} ref={ref} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-muted"
              style={{ width: i === lines - 1 ? "75%" : "100%" }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "atlas-skeleton animate-pulse bg-muted",
          variant === "circle" ? "rounded-full" : "rounded-md",
          variant === "text" && "h-4",
          className
        )}
        style={{ width, height, ...style }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

// ─── LoadingSpinner ───────────────────────────────────────────────────────

export interface LoadingSpinnerProps extends React.SVGAttributes<SVGElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
}

const spinnerSizes = { xs: 12, sm: 16, md: 24, lg: 32, xl: 48 };

const LoadingSpinner = ({ size = "md", label = "Loading", className, ...props }: LoadingSpinnerProps) => (
  <svg
    width={spinnerSizes[size]}
    height={spinnerSizes[size]}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("atlas-loading-spinner animate-spin text-primary", className)}
    role="status"
    aria-label={label}
    {...props}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
LoadingSpinner.displayName = "LoadingSpinner";

// ─── EmptyState ───────────────────────────────────────────────────────────

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "atlas-empty-state flex flex-col items-center justify-center gap-3 text-center py-16 px-6",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="rounded-full bg-muted p-4 text-muted-foreground [&>svg]:h-8 [&>svg]:w-8">
          {icon}
        </div>
      )}
      <div className="max-w-xs">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
);
EmptyState.displayName = "EmptyState";

// ─── StatusIndicator ──────────────────────────────────────────────────────

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "online" | "offline" | "busy" | "away" | "idle";
  label?: string;
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusColors = {
  online: "bg-success",
  offline: "bg-muted-foreground",
  busy: "bg-destructive",
  away: "bg-warning",
  idle: "bg-warning/60",
};

const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({ className, status, label, pulse, size = "md", ...props }, ref) => (
    <span
      ref={ref}
      className={cn("atlas-status-indicator inline-flex items-center gap-1.5", className)}
      {...props}
    >
      <span className="relative inline-flex">
        <span className={cn(
          "rounded-full",
          statusColors[status],
          size === "sm" && "h-1.5 w-1.5",
          size === "md" && "h-2.5 w-2.5",
          size === "lg" && "h-3.5 w-3.5",
        )} />
        {pulse && status === "online" && (
          <span className={cn(
            "absolute inline-flex rounded-full animate-ping opacity-75",
            statusColors[status],
            size === "sm" && "h-1.5 w-1.5",
            size === "md" && "h-2.5 w-2.5",
            size === "lg" && "h-3.5 w-3.5",
          )} />
        )}
      </span>
      {label && <span className="text-sm capitalize">{label ?? status}</span>}
    </span>
  )
);
StatusIndicator.displayName = "StatusIndicator";

// ─── Notification ─────────────────────────────────────────────────────────

export interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  time?: React.ReactNode;
  unread?: boolean;
  onClose?: () => void;
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, title, description, avatar, icon, time, unread, onClose, ...props }, ref) => (
    <div
      ref={ref}
      role="listitem"
      className={cn(
        "atlas-notification flex gap-3 p-4 transition-colors",
        unread && "bg-primary/5",
        className
      )}
      {...props}
    >
      <div className="shrink-0">
        {avatar ?? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-medium leading-snug", unread && "font-semibold")}>{title}</p>
          {unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
        </div>
        {description && <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{description}</p>}
        {time && <p className="mt-1 text-xs text-muted-foreground">{time}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 self-start rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss notification"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
);
Notification.displayName = "Notification";

export {
  Alert, AlertTitle, AlertDescription,
  ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction,
  Snackbar,
  Progress,
  CircularProgress,
  Skeleton,
  LoadingSpinner,
  EmptyState,
  StatusIndicator,
  Notification,
};
