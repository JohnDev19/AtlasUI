import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

// ─── Navbar ────────────────────────────────────────────────────────────────

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
  bordered?: boolean;
  blurred?: boolean;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, sticky, bordered, blurred, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "atlas-navbar z-40 w-full",
        sticky && "sticky top-0",
        bordered && "border-b border-border",
        blurred && "backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/60",
        !blurred && "bg-background",
        className
      )}
      {...props}
    />
  )
);
Navbar.displayName = "Navbar";

// ─── Sidebar ──────────────────────────────────────────────────────────────

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsible?: boolean;
  collapsed?: boolean;
  width?: string;
  side?: "left" | "right";
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsed, width = "240px", side = "left", style, ...props }, ref) => (
    <aside
      ref={ref}
      aria-label="Sidebar navigation"
      className={cn(
        "atlas-sidebar relative flex flex-col border-r border-border bg-background",
        "transition-[width] duration-300 ease-in-out overflow-hidden shrink-0",
        collapsed && "!w-0 border-transparent",
        className
      )}
      style={{ width: collapsed ? 0 : width, ...style }}
      {...props}
    />
  )
);
Sidebar.displayName = "Sidebar";

// ─── Menu ──────────────────────────────────────────────────────────────────

export interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode;
  as?: React.ElementType;
  href?: string;
}

const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, icon, active, disabled, badge, children, as: Comp = "div", ...props }, ref) => (
    <Comp
      ref={ref}
      role="menuitem"
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled}
      className={cn(
        "atlas-menu-item flex items-center gap-3 px-3 py-2 rounded-md text-sm",
        "transition-colors duration-150 cursor-pointer select-none",
        active
          ? "bg-accent text-accent-foreground font-medium"
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {badge && <span className="shrink-0">{badge}</span>}
    </Comp>
  )
);
MenuItem.displayName = "MenuItem";

const Menu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="menu"
      className={cn("atlas-menu flex flex-col gap-0.5 p-1", className)}
      {...props}
    />
  )
);
Menu.displayName = "Menu";

// ─── DropdownMenu ─────────────────────────────────────────────────────────

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "atlas-dropdown-content z-50 min-w-[8rem] overflow-hidden rounded-md border border-border",
        "bg-popover p-1 text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    destructive?: boolean;
  }
>(({ className, inset, destructive, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm",
      "outline-none transition-colors gap-2",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      destructive && "text-destructive focus:text-destructive",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

// ─── Breadcrumb ───────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator, ...props }, ref) => (
    <nav ref={ref} aria-label="Breadcrumb" className={cn("atlas-breadcrumb", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden="true" className="text-muted-foreground/50">
                {separator ?? (
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            )}
            {item.href && !item.current ? (
              <a href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </a>
            ) : (
              <span
                className={cn(item.current && "text-foreground font-medium")}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
);
Breadcrumb.displayName = "Breadcrumb";

// ─── Pagination ───────────────────────────────────────────────────────────

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  total: number;
  page: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  showEdges?: boolean;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, total, page, pageSize = 10, onPageChange, siblingCount = 1, showEdges = true, ...props }, ref) => {
    const totalPages = Math.ceil(total / pageSize);

    const getPageNumbers = () => {
      const pages: (number | "...")[] = [];
      const delta = siblingCount;

      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === totalPages ||
          (i >= page - delta && i <= page + delta)
        ) {
          pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
          pages.push("...");
        }
      }
      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <nav ref={ref} aria-label="Pagination" className={cn("atlas-pagination flex items-center gap-1", className)} {...props}>
        <button
          onClick={() => onPageChange?.(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-sm hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Previous page"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted-foreground">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange?.(p as number)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "h-8 min-w-[2rem] px-2 flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-accent"
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= totalPages}
          className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-sm hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Next page"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7 7 7" />
          </svg>
        </button>
      </nav>
    );
  }
);
Pagination.displayName = "Pagination";

// ─── Tabs ─────────────────────────────────────────────────────────────────

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "line" | "pills" | "enclosed";
  }
>(({ className, variant = "line", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "atlas-tabs-list inline-flex items-center",
      variant === "line" && "border-b border-border gap-0 w-full",
      variant === "pills" && "gap-1 bg-muted p-1 rounded-lg",
      variant === "enclosed" && "border border-border rounded-t-lg gap-0",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "line" | "pills" | "enclosed";
  }
>(({ className, variant = "line", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
      "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      variant === "line" && [
        "px-4 py-2.5 border-b-2 border-transparent -mb-px",
        "text-muted-foreground hover:text-foreground",
        "data-[state=active]:border-primary data-[state=active]:text-foreground",
      ],
      variant === "pills" && [
        "px-3 py-1.5 rounded-md text-muted-foreground",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      ],
      variant === "enclosed" && [
        "px-4 py-2 border-r last:border-r-0 border-border",
        "text-muted-foreground hover:text-foreground bg-muted",
        "data-[state=active]:bg-background data-[state=active]:text-foreground",
      ],
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "atlas-tabs-content mt-4",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// ─── Stepper ──────────────────────────────────────────────────────────────

export interface StepperStep {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepperStep[];
  current: number;
  orientation?: "horizontal" | "vertical";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, current, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "atlas-stepper flex",
        orientation === "horizontal" ? "flex-row items-center" : "flex-col",
        className
      )}
      role="list"
      aria-label="Progress steps"
      {...props}
    >
      {steps.map((step, i) => {
        const status = i < current ? "complete" : i === current ? "current" : "upcoming";

        return (
          <React.Fragment key={i}>
            <div
              role="listitem"
              aria-current={status === "current" ? "step" : undefined}
              className={cn(
                "flex items-center gap-3",
                orientation === "vertical" && "flex-col items-start",
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                "transition-colors border-2",
                status === "complete" && "bg-primary border-primary text-primary-foreground",
                status === "current" && "border-primary text-primary bg-primary/10",
                status === "upcoming" && "border-border text-muted-foreground",
              )}>
                {status === "complete" ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (step.icon ?? <span>{i + 1}</span>)}
              </div>
              <div className={orientation === "horizontal" ? "hidden sm:block" : ""}>
                <p className={cn("text-sm font-medium", status === "upcoming" && "text-muted-foreground")}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "transition-colors",
                orientation === "horizontal"
                  ? "flex-1 h-px mx-3"
                  : "ml-4 w-px h-8",
                i < current ? "bg-primary" : "bg-border"
              )} aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  )
);
Stepper.displayName = "Stepper";

// ─── CommandPalette ─────────────────────────────────────────────────────
// Thin wrapper - full implementation in overlay/CommandDialog
export { Stepper as CommandPalette } from "./index"; // Placeholder, see CommandDialog

export {
  Navbar, Sidebar,
  Menu, MenuItem,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
  DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuRadioGroup,
  Breadcrumb,
  Pagination,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Stepper,
};
