import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// ─── Link ──────────────────────────────────────────────────────────────────

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  external?: boolean;
  underline?: "always" | "hover" | "none";
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, asChild, external, underline = "hover", children, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <Comp
        ref={ref}
        className={cn(
          "atlas-link text-primary transition-colors",
          underline === "always" && "underline underline-offset-4",
          underline === "hover" && "hover:underline underline-offset-4",
          underline === "none" && "no-underline",
          className
        )}
        {...externalProps}
        {...props}
      >
        {children}
        {external && (
          <svg
            className="inline-block ml-0.5 h-3 w-3 align-super"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </Comp>
    );
  }
);
Link.displayName = "Link";

// ─── Badge ─────────────────────────────────────────────────────────────────

const badgeVariants = cva(
  "atlas-badge inline-flex items-center gap-1 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground",
        outline: "border border-current bg-transparent",
        soft: "bg-primary/10 text-primary",
        neutral: "bg-muted text-muted-foreground",
        /**
         * Classic — raised bevel badge. Highlights on top-left, shadow on
         * bottom-right, mimicking a physical embossed label or rubber stamp.
         */
        classic: "veloria-classic bg-secondary text-secondary-foreground border border-border/50",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-1 text-sm",
      },
      color: {
        primary: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
        neutral: "",
      },
    },
    compoundVariants: [
      { variant: "solid", color: "success", className: "bg-success text-success-foreground" },
      { variant: "solid", color: "warning", className: "bg-warning text-warning-foreground" },
      { variant: "solid", color: "danger", className: "bg-destructive text-destructive-foreground" },
      { variant: "solid", color: "info", className: "bg-info text-info-foreground" },
      { variant: "soft", color: "success", className: "bg-success/10 text-success" },
      { variant: "soft", color: "warning", className: "bg-warning/10 text-warning" },
      { variant: "soft", color: "danger", className: "bg-destructive/10 text-destructive" },
      { variant: "soft", color: "info", className: "bg-info/10 text-info" },
      // Classic color tints — keep the bevel, tint the background
      { variant: "classic", color: "success",  className: "bg-success/15 text-success" },
      { variant: "classic", color: "warning",  className: "bg-warning/15 text-warning" },
      { variant: "classic", color: "danger",   className: "bg-destructive/15 text-destructive" },
      { variant: "classic", color: "info",     className: "bg-info/15 text-info" },
      { variant: "classic", color: "primary",  className: "bg-primary/15 text-primary" },
    ],
    defaultVariants: {
      variant: "soft",
      size: "md",
      color: "primary",
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, color, dot, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size, color, className }))}
      {...props}
    >
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-current shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
);
Badge.displayName = "Badge";

// ─── Avatar ─────────────────────────────────────────────────────────────────

const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl",
};

const statusMap = {
  online: "bg-success",
  offline: "bg-muted-foreground",
  busy: "bg-destructive",
  away: "bg-warning",
};

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: keyof typeof sizeMap;
  status?: keyof typeof statusMap;
  shape?: "circle" | "square";
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, src, alt, fallback, size = "md", status, shape = "circle", ...props }, ref) => (
  <span className="atlas-avatar relative inline-flex shrink-0">
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden",
        sizeMap[size],
        shape === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt ?? ""}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium"
      >
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
    {status && (
      <span
        className={cn(
          "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
          statusMap[status],
          size === "xs" || size === "sm" ? "h-1.5 w-1.5" : "h-2.5 w-2.5"
        )}
        aria-label={status}
      />
    )}
  </span>
));
Avatar.displayName = "Avatar";

// ─── AvatarGroup ─────────────────────────────────────────────────────────────

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<{ src?: string; alt?: string; fallback?: React.ReactNode }>;
  max?: number;
  size?: AvatarProps["size"];
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, avatars, max = 4, size = "md", ...props }, ref) => {
    const visible = avatars.slice(0, max);
    const overflow = avatars.length - max;
    return (
      <div
        ref={ref}
        className={cn("atlas-avatar-group flex -space-x-2", className)}
        {...props}
      >
        {visible.map((av, i) => (
          <Avatar
            key={i}
            src={av.src}
            alt={av.alt}
            fallback={av.fallback}
            size={size}
            className="ring-2 ring-background"
          />
        ))}
        {overflow > 0 && (
          <span
            className={cn(
              "relative inline-flex items-center justify-center rounded-full",
              "bg-muted text-muted-foreground font-medium ring-2 ring-background",
              sizeMap[size],
              "text-[10px]"
            )}
            aria-label={`${overflow} more`}
          >
            +{overflow}
          </span>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

// ─── Divider ──────────────────────────────────────────────────────────────────

export interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  label?: React.ReactNode;
}

const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(({ className, label, orientation = "horizontal", ...props }, ref) => {
  if (label && orientation !== "vertical") {
    return (
      <div className={cn("atlas-divider flex items-center gap-3", className)}>
        <SeparatorPrimitive.Root
          ref={ref}
          className="shrink grow border-none bg-border h-px"
          {...props}
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
        <SeparatorPrimitive.Root className="shrink grow border-none bg-border h-px" />
      </div>
    );
  }

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={cn(
        "atlas-divider shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
});
Divider.displayName = "Divider";

// ─── Tag ──────────────────────────────────────────────────────────────────────

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "soft" | "classic";
  color?: "primary" | "success" | "warning" | "danger" | "neutral";
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, closable, onClose, icon, size = "md", variant = "soft", color = "neutral", children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "atlas-tag inline-flex items-center gap-1 rounded font-medium",
        size === "sm" && "px-1.5 py-0.5 text-[10px]",
        size === "md" && "px-2 py-1 text-xs",
        size === "lg" && "px-3 py-1.5 text-sm",
        // soft
        variant === "soft" && color === "neutral"  && "bg-muted text-muted-foreground",
        variant === "soft" && color === "primary"  && "bg-primary/10 text-primary",
        variant === "soft" && color === "success"  && "bg-success/10 text-success",
        variant === "soft" && color === "warning"  && "bg-warning/10 text-warning",
        variant === "soft" && color === "danger"   && "bg-destructive/10 text-destructive",
        // outline
        variant === "outline" && "border border-current bg-transparent",
        // solid
        variant === "solid" && color === "neutral" && "bg-muted-foreground text-background",
        variant === "solid" && color === "primary" && "bg-primary text-primary-foreground",
        variant === "solid" && color === "success" && "bg-success text-success-foreground",
        variant === "solid" && color === "warning" && "bg-warning text-warning-foreground",
        variant === "solid" && color === "danger"  && "bg-destructive text-destructive-foreground",
        // classic — beveled edges, tactile plastic/rubber feel
        variant === "classic" && "veloria-classic border border-border/50 bg-secondary text-secondary-foreground",
        variant === "classic" && color === "primary" && "bg-primary/15 text-primary border-primary/30",
        variant === "classic" && color === "success" && "bg-success/15 text-success border-success/30",
        variant === "classic" && color === "warning" && "bg-warning/15 text-warning border-warning/30",
        variant === "classic" && color === "danger"  && "bg-destructive/15 text-destructive border-destructive/30",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {children}
      {closable && (
        <button
          type="button"
          onClick={onClose}
          className="ml-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 transition-colors"
          aria-label="Remove tag"
        >
          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
);
Tag.displayName = "Tag";

// ─── Chip ──────────────────────────────────────────────────────────────────

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: (e: React.MouseEvent) => void;
  size?: "sm" | "md" | "lg";
  /** Use the classic bevel style instead of the default flat selection style */
  classic?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, avatar, icon, closable, onClose, size = "md", classic: isClassic = false, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "atlas-chip inline-flex items-center gap-1.5 rounded-full font-medium",
        "border transition-all duration-150 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "sm" && "h-6 px-2 text-xs",
        size === "md" && "h-8 px-3 text-sm",
        size === "lg" && "h-9 px-4 text-sm",
        isClassic
          ? cn(
              "veloria-classic bg-secondary text-secondary-foreground border-border/60",
              "hover:brightness-[0.97] active:veloria-classic-pressed",
              selected && "bg-primary/15 text-primary border-primary/40"
            )
          : selected
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-foreground border-border hover:bg-accent",
        className
      )}
      aria-pressed={selected}
      {...props}
    >
      {avatar && <span className="shrink-0 -ml-0.5">{avatar}</span>}
      {icon && !avatar && <span className="shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5" aria-hidden="true">{icon}</span>}
      {children}
      {closable && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onClose?.(e); }}
          className="shrink-0 -mr-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5"
          aria-label="Remove"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      )}
    </button>
  )
);
Chip.displayName = "Chip";

// ─── Tooltip ──────────────────────────────────────────────────────────────

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "atlas-tooltip z-50 overflow-hidden rounded-md",
        "bg-foreground px-3 py-1.5 text-xs text-background shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  className?: string;
}

const Tooltip = ({ content, children, side = "top", delayDuration = 300, className }: TooltipProps) => (
  <TooltipProvider>
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={className}>{content}</TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
);
Tooltip.displayName = "Tooltip";

export {
  Link,
  Badge, badgeVariants,
  Avatar,
  AvatarGroup,
  Divider,
  Tag,
  Chip,
  Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent,
};