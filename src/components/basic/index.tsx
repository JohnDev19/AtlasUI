// ─── Link ─────────────────────────────────────────────────────────────────

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// ─── Link ─────────────────────────────────────────────────────────────────

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
    ],
    defaultVariants: {
      variant: "soft",
      size: "md",
      color: "primary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, color, dot, children, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, size, color, className }))} {...props}>
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      )}
      {children}
    </span>
  )
);
Badge.displayName = "Badge";

// ─── Avatar ────────────────────────────────────────────────────────────────

const avatarSizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl",
};

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: keyof typeof avatarSizes;
  shape?: "circle" | "square";
  status?: "online" | "offline" | "busy" | "away";
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, src, alt, fallback, size = "md", shape = "circle", status, ...props }, ref) => (
  <div className="atlas-avatar relative inline-flex shrink-0">
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden",
        avatarSizes[size],
        shape === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className={cn(
          "flex h-full w-full items-center justify-center",
          "bg-muted font-medium text-muted-foreground uppercase"
        )}
      >
        {fallback ?? (alt ? alt.slice(0, 2) : "?")}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
    {status && (
      <span
        aria-label={`Status: ${status}`}
        className={cn(
          "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
          size === "xs" || size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5",
          status === "online" && "bg-success",
          status === "offline" && "bg-muted-foreground",
          status === "busy" && "bg-destructive",
          status === "away" && "bg-warning"
        )}
      />
    )}
  </div>
));
Avatar.displayName = "Avatar";

// ─── AvatarGroup ──────────────────────────────────────────────────────────

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarProps["size"];
  spacing?: "tight" | "normal" | "loose";
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max, size = "md", spacing = "tight", ...props }, ref) => {
    const validChildren = React.Children.toArray(children).filter(React.isValidElement);
    const visible = max ? validChildren.slice(0, max) : validChildren;
    const overflow = max ? validChildren.length - max : 0;

    const spacingMap = { tight: "-space-x-2", normal: "-space-x-1", loose: "space-x-1" };

    return (
      <div
        ref={ref}
        className={cn("atlas-avatar-group flex items-center", spacingMap[spacing], className)}
        {...props}
      >
        {visible.map((child, i) =>
          React.cloneElement(child as React.ReactElement<AvatarProps>, {
            key: i,
            size,
            className: cn(
              "ring-2 ring-background",
              (child as React.ReactElement<AvatarProps>).props.className
            ),
          })
        )}
        {overflow > 0 && (
          <span
            className={cn(
              "atlas-avatar relative flex shrink-0 items-center justify-center rounded-full",
              "bg-muted text-muted-foreground font-medium ring-2 ring-background",
              avatarSizes[size]
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

// ─── Divider ──────────────────────────────────────────────────────────────

export interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  label?: React.ReactNode;
  labelPosition?: "left" | "center" | "right";
}

const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(
  ({ className, orientation = "horizontal", label, labelPosition = "center", ...props }, ref) => {
    if (!label) {
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
    }

    return (
      <div
        className={cn(
          "atlas-divider relative flex items-center gap-3 w-full",
          className
        )}
        role="separator"
      >
        {labelPosition !== "left" && <span className="flex-1 bg-border h-px" />}
        <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
        {labelPosition !== "right" && <span className="flex-1 bg-border h-px" />}
      </div>
    );
  }
);
Divider.displayName = "Divider";

// ─── Tag ──────────────────────────────────────────────────────────────────

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "soft";
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
        variant === "soft" && color === "neutral" && "bg-muted text-muted-foreground",
        variant === "soft" && color === "primary" && "bg-primary/10 text-primary",
        variant === "soft" && color === "success" && "bg-success/10 text-success",
        variant === "soft" && color === "warning" && "bg-warning/10 text-warning",
        variant === "soft" && color === "danger" && "bg-destructive/10 text-destructive",
        variant === "outline" && "border border-current bg-transparent",
        variant === "solid" && color === "neutral" && "bg-muted-foreground text-background",
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
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, avatar, icon, closable, onClose, size = "md", children, ...props }, ref) => (
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
        selected
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
