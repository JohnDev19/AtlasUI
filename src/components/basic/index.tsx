/**
 * Veloria UI — Basic Components
 * IconButton · Link · Avatar · AvatarGroup · Divider · Tag · Chip · Tooltip
 */
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// ─── IconButton ───────────────────────────────────────────────────────────
const iconButtonVariants = cva(
  ["veloria-icon-button","inline-flex items-center justify-center shrink-0","transition-all duration-150",
   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
   "disabled:pointer-events-none disabled:opacity-50"],
  { variants: {
      variant: {
        solid:   "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.96]",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost:   "bg-transparent hover:bg-accent hover:text-accent-foreground",
        soft:    "bg-primary/10 text-primary hover:bg-primary/20",
        danger:  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: { xs:"h-6 w-6 [&>svg]:h-3 [&>svg]:w-3", sm:"h-7 w-7 [&>svg]:h-3.5 [&>svg]:w-3.5",
              md:"h-9 w-9 [&>svg]:h-4 [&>svg]:w-4", lg:"h-10 w-10 [&>svg]:h-5 [&>svg]:w-5", xl:"h-12 w-12 [&>svg]:h-6 [&>svg]:w-6" },
      shape: { square:"rounded-md", circle:"rounded-full" },
    },
    defaultVariants: { variant:"ghost", size:"md", shape:"square" },
  }
);

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButtonVariants> {
  "aria-label": string; asChild?: boolean; icon?: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, shape, asChild=false, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(iconButtonVariants({ variant, size, shape, className }))} {...props}>{icon ?? children}</Comp>;
  }
);
IconButton.displayName = "IconButton";

// ─── Link ─────────────────────────────────────────────────────────────────
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean; underline?: "always"|"hover"|"none"; asChild?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, external, underline="hover", asChild=false, children, ...props }, ref) => {
    const Comp = asChild ? (Slot as React.ElementType) : "a";
    const extProps = external ? { target:"_blank", rel:"noopener noreferrer" } : {};
    return (
      <Comp ref={ref} className={cn("veloria-link text-primary transition-colors rounded-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        underline==="always" && "underline underline-offset-4",
        underline==="hover"  && "hover:underline underline-offset-4",
        underline==="none"   && "no-underline", className)} {...extProps} {...props}>
        {children}
        {external && <svg className="ml-0.5 inline-block h-3 w-3 align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>}
      </Comp>
    );
  }
);
Link.displayName = "Link";

// ─── Avatar ───────────────────────────────────────────────────────────────
const avatarSizes = { xs:"h-6 w-6 text-[10px]", sm:"h-8 w-8 text-xs", md:"h-10 w-10 text-sm", lg:"h-12 w-12 text-base", xl:"h-16 w-16 text-lg", "2xl":"h-20 w-20 text-xl" };
const statusColors = { online:"bg-green-500", offline:"bg-gray-400", busy:"bg-red-500", away:"bg-yellow-500" };

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string; alt?: string; fallback?: string;
  size?: keyof typeof avatarSizes; status?: keyof typeof statusColors; shape?: "circle"|"square";
}

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ src, alt, fallback, size="md", status, shape="circle", className, ...props }, ref) => (
    <div className="relative inline-block">
      <AvatarPrimitive.Root ref={ref} className={cn("veloria-avatar inline-flex items-center justify-center overflow-hidden bg-muted",
        shape==="circle" ? "rounded-full" : "rounded-md", avatarSizes[size], className)} {...props}>
        {src && <AvatarPrimitive.Image src={src} alt={alt ?? fallback ?? "Avatar"} className="h-full w-full object-cover"/>}
        <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-muted font-semibold text-muted-foreground" delayMs={src ? 600 : 0}>
          {fallback ?? (alt ? alt.slice(0,2).toUpperCase() : "?")}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {status && <span aria-label={status} className={cn("absolute bottom-0 right-0 block rounded-full ring-2 ring-background", statusColors[status], (size==="xs"||size==="sm") ? "h-2 w-2" : "h-2.5 w-2.5")}/>}
    </div>
  )
);
Avatar.displayName = "Avatar";

// ─── AvatarGroup ──────────────────────────────────────────────────────────
export interface AvatarGroupProps {
  avatars: Array<{ src?: string; alt?: string; fallback?: string }>;
  max?: number; size?: keyof typeof avatarSizes; className?: string;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ avatars, max=4, size="md", className }, ref) => {
    const visible = avatars.slice(0, max);
    const overflow = avatars.length - max;
    return (
      <div ref={ref} className={cn("veloria-avatar-group flex items-center -space-x-2", className)}>
        {visible.map((a,i) => <Avatar key={i} src={a.src} alt={a.alt} fallback={a.fallback} size={size} className="ring-2 ring-background"/>)}
        {overflow > 0 && <div className={cn("inline-flex items-center justify-center rounded-full bg-muted ring-2 ring-background text-xs font-semibold text-muted-foreground", avatarSizes[size])} aria-label={`${overflow} more`}>+{overflow}</div>}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

// ─── Divider ──────────────────────────────────────────────────────────────
export interface DividerProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  label?: React.ReactNode; labelPosition?: "start"|"center"|"end";
}

const Divider = React.forwardRef<React.ElementRef<typeof SeparatorPrimitive.Root>, DividerProps>(
  ({ label, labelPosition="center", orientation="horizontal", className, ...props }, ref) => {
    if (!label) return <SeparatorPrimitive.Root ref={ref} orientation={orientation} className={cn("veloria-divider shrink-0 bg-border", orientation==="horizontal" ? "h-px w-full my-2" : "h-full w-px mx-2", className)} {...props}/>;
    return (
      <div className={cn("veloria-divider flex items-center gap-3 my-2", className)} role="separator">
        {labelPosition!=="start" && <div className="flex-1 h-px bg-border"/>}
        <span className="text-xs text-muted-foreground whitespace-nowrap px-1 font-medium">{label}</span>
        {labelPosition!=="end" && <div className="flex-1 h-px bg-border"/>}
      </div>
    );
  }
);
Divider.displayName = "Divider";

// ─── Tag ──────────────────────────────────────────────────────────────────
const tagColors = {
  default: "bg-secondary text-secondary-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/30",
  success: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  danger:  "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  info:    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
};

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>,"color"> {
  color?: keyof typeof tagColors; icon?: React.ReactNode; onRemove?: () => void; size?: "sm"|"md";
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ color="default", icon, onRemove, size="md", className, children, ...props }, ref) => (
    <span ref={ref} className={cn("veloria-tag inline-flex items-center gap-1 rounded-full border font-medium",
      size==="sm" ? "px-2 py-0 text-[11px]" : "px-2.5 py-0.5 text-xs", tagColors[color], className)} {...props}>
      {icon && <span className="shrink-0 [&>svg]:h-3 [&>svg]:w-3" aria-hidden="true">{icon}</span>}
      {children}
      {onRemove && <button type="button" onClick={(e)=>{e.stopPropagation();onRemove();}} aria-label="Remove tag" className="ml-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 transition-colors"><svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg></button>}
    </span>
  )
);
Tag.displayName = "Tag";

// ─── Chip ─────────────────────────────────────────────────────────────────
export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,"color"> {
  selected?: boolean; onRemove?: () => void;
  avatar?: React.ReactNode; icon?: React.ReactNode;
  color?: "default"|"primary"; size?: "sm"|"md";
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ selected, onRemove, avatar, icon, size="md", className, children, onClick, ...props }, ref) => (
    <button ref={ref} type="button" role="checkbox" aria-checked={selected} onClick={onClick}
      className={cn("veloria-chip inline-flex items-center gap-1.5 rounded-full border font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-50",
        size==="sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-sm",
        selected ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-accent",
        className)} {...props}>
      {avatar && <span className="shrink-0 -ml-0.5" aria-hidden="true">{avatar}</span>}
      {!avatar && icon && <span className="shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5" aria-hidden="true">{icon}</span>}
      {children}
      {onRemove && <button type="button" onClick={(e)=>{e.stopPropagation();onRemove();}} aria-label="Remove" className={cn("ml-0.5 -mr-0.5 rounded-full p-0.5 transition-colors", selected ? "hover:bg-white/20" : "hover:bg-black/10 dark:hover:bg-white/10")}><svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg></button>}
    </button>
  )
);
Chip.displayName = "Chip";

// ─── Tooltip ──────────────────────────────────────────────────────────────
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot     = TooltipPrimitive.Root;
const TooltipTrigger  = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>(
  ({ className, sideOffset=6, ...props }, ref) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn(
        "veloria-tooltip z-50 overflow-hidden rounded-md border border-border",
        "bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className)} {...props}/>
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = "TooltipContent";

export interface TooltipProps { content: React.ReactNode; children: React.ReactNode; side?: "top"|"right"|"bottom"|"left"; delayDuration?: number; className?: string; }

const Tooltip: React.FC<TooltipProps> = ({ content, children, side="top", delayDuration=300, className }) => (
  <TooltipProvider>
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={className}>{content}</TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
);

export { IconButton, iconButtonVariants, Link, Avatar, AvatarGroup, Divider, Tag, Chip, Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent };
