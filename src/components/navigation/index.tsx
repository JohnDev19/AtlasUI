import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Command } from "cmdk";
import { cn } from "../../utils/cn";

// ─── Navbar ────────────────────────────────────────────────────────────────

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
  glass?: boolean;
  bordered?: boolean;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, sticky, glass, bordered, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "veloria-navbar z-40 w-full",
        sticky && "sticky top-0",
        glass && "bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60",
        !glass && "bg-background",
        bordered && "border-b border-border",
        className
      )}
      {...props}
    />
  )
);
Navbar.displayName = "Navbar";

// ─── Sidebar ───────────────────────────────────────────────────────────────

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  collapsedWidth?: number;
  expandedWidth?: number;
  side?: "left" | "right";
  bordered?: boolean;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsed, collapsedWidth = 64, expandedWidth = 240, side = "left", bordered = true, style, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        "veloria-sidebar flex flex-col bg-background transition-all duration-300 ease-in-out",
        bordered && (side === "left" ? "border-r border-border" : "border-l border-border"),
        className
      )}
      style={{ width: collapsed ? collapsedWidth : expandedWidth, ...style }}
      {...props}
    />
  )
);
Sidebar.displayName = "Sidebar";

// ─── Menu / MenuItem ───────────────────────────────────────────────────────

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  collapsed?: boolean;
}

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, active, icon, badge, collapsed, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "veloria-menu-item flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-primary/10 text-primary"
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-2",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {!collapsed && <span className="flex-1 text-left">{children}</span>}
      {!collapsed && badge && <span>{badge}</span>}
    </button>
  )
);
MenuItem.displayName = "MenuItem";

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn("veloria-menu flex flex-col gap-1 p-2", className)} {...props} />
  )
);
Menu.displayName = "Menu";

// ─── DropdownMenu (Radix) ─────────────────────────────────────────────────

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} {...props} />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "veloria-dropdown z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean; icon?: React.ReactNode }
>(({ className, inset, icon, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {icon && <span className="h-4 w-4 shrink-0" aria-hidden="true">{icon}</span>}
    {children}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

// ─── Breadcrumb ────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator, ...props }, ref) => (
    <nav ref={ref} aria-label="Breadcrumb" className={cn("veloria-breadcrumb", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-muted-foreground/50">
                {separator ?? (
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            )}
            {item.href && i < items.length - 1 ? (
              <a href={item.href} className="hover:text-foreground transition-colors">{item.label}</a>
            ) : (
              <span className={i === items.length - 1 ? "font-medium text-foreground" : ""}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
);
Breadcrumb.displayName = "Breadcrumb";

// ─── Pagination ────────────────────────────────────────────────────────────

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  siblings?: number;
  showFirstLast?: boolean;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, total, page, pageSize = 10, onPageChange, siblings = 1, showFirstLast = true, ...props }, ref) => {
    const totalPages = Math.ceil(total / pageSize);
    const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const pages: (number | "...")[] = [];

    const left  = Math.max(2, page - siblings);
    const right = Math.min(totalPages - 1, page + siblings);

    if (totalPages <= 1) return null;

    pages.push(1);
    if (left > 2) pages.push("...");
    pages.push(...range(left, right));
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    const btnClass = (active = false, disabled = false) =>
      cn(
        "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border border-border px-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-primary text-primary-foreground border-primary",
        !active && "bg-background hover:bg-accent",
        disabled && "opacity-50 pointer-events-none"
      );

    return (
      <nav ref={ref} aria-label="Pagination" className={cn("veloria-pagination flex flex-wrap items-center gap-1", className)} {...props}>
        {showFirstLast && (
          <button className={btnClass(false, page === 1)} onClick={() => onPageChange(1)} disabled={page === 1} aria-label="First page">«</button>
        )}
        <button className={btnClass(false, page === 1)} onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">‹</button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-1 text-muted-foreground">…</span>
          ) : (
            <button key={i} className={btnClass(p === page)} onClick={() => onPageChange(p as number)} aria-current={p === page ? "page" : undefined}>{p}</button>
          )
        )}
        <button className={btnClass(false, page === totalPages)} onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">›</button>
        {showFirstLast && (
          <button className={btnClass(false, page === totalPages)} onClick={() => onPageChange(totalPages)} disabled={page === totalPages} aria-label="Last page">»</button>
        )}
      </nav>
    );
  }
);
Pagination.displayName = "Pagination";

// ─── Tabs ──────────────────────────────────────────────────────────────────

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & { variant?: "line" | "pills" | "enclosed" | "classic" }
>(({ className, variant = "line", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "veloria-tabs-list inline-flex items-center",
      variant === "line" && "border-b border-border gap-4 w-full",
      variant === "pills" && "gap-1 rounded-lg bg-muted p-1",
      variant === "enclosed" && "border border-border rounded-lg overflow-hidden",
      variant === "classic" && "border-b-2 border-[hsl(var(--classic-border))] gap-4 w-full bg-[hsl(var(--classic-surface))] px-4",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { variant?: "line" | "pills" | "enclosed" | "classic" }
>(({ className, variant = "line", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "veloria-tabs-trigger inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      variant === "line" && [
        "border-b-2 border-transparent pb-2 text-muted-foreground",
        "data-[state=active]:border-primary data-[state=active]:text-foreground",
        "hover:text-foreground",
      ],
      variant === "pills" && [
        "rounded-md px-3 py-1.5 text-muted-foreground",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        "hover:text-foreground",
      ],
      variant === "enclosed" && [
        "px-4 py-2 text-muted-foreground border-r border-border last:border-r-0",
        "data-[state=active]:bg-background data-[state=active]:text-foreground",
      ],
      variant === "classic" && [
        "border-b-2 border-transparent py-2 px-1 text-[hsl(var(--classic-muted))] font-semibold tracking-wide",
        "data-[state=active]:border-[hsl(var(--classic-border))] data-[state=active]:text-[hsl(var(--classic-fg))]",
        "hover:text-[hsl(var(--classic-fg))]",
      ],
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "veloria-tabs-content mt-4 ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

const Tabs = TabsPrimitive.Root;

// ─── Stepper ───────────────────────────────────────────────────────────────

export interface StepperStep {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepperStep[];
  current: number;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "classic";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, current, orientation = "horizontal", variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "veloria-stepper flex",
        orientation === "vertical" ? "flex-col gap-0" : "items-center gap-0",
        className
      )}
      {...props}
    >
      {steps.map((step, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div className={cn("flex items-center gap-3", orientation === "vertical" && "flex-row")}>
              {/* Circle */}
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                done  && (variant === "classic" ? "border-[hsl(var(--classic-border))] bg-[hsl(var(--classic-border))] text-[hsl(var(--classic-surface))]" : "border-primary bg-primary text-primary-foreground"),
                active && (variant === "classic" ? "border-[hsl(var(--classic-border))] bg-[hsl(var(--classic-surface))] text-[hsl(var(--classic-fg))]" : "border-primary bg-background text-primary"),
                !done && !active && "border-muted-foreground/40 bg-background text-muted-foreground",
              )}>
                {done ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : step.icon ?? i + 1}
              </div>
              {/* Label */}
              <div className="flex flex-col">
                <span className={cn("text-sm font-medium", active ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground")}>
                  {step.label}
                  {step.optional && <span className="ml-1 text-xs text-muted-foreground">(optional)</span>}
                </span>
                {step.description && (
                  <span className="text-xs text-muted-foreground">{step.description}</span>
                )}
              </div>
            </div>
            {/* Connector */}
            {i < steps.length - 1 && (
              orientation === "horizontal"
                ? <div className={cn("flex-1 h-0.5 mx-2", i < current ? (variant === "classic" ? "bg-[hsl(var(--classic-border))]" : "bg-primary") : "bg-border")} />
                : <div className={cn("ml-4 w-0.5 h-8 my-1", i < current ? (variant === "classic" ? "bg-[hsl(var(--classic-border))]" : "bg-primary") : "bg-border")} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  )
);
Stepper.displayName = "Stepper";

// ─── CommandDialog ─────────────────────────────────────────────────────────

export interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

const CommandDialog: React.FC<CommandDialogProps> = ({ open, onOpenChange, children, placeholder, className }) => {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange?.(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="veloria-command-dialog fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
      onClick={() => onOpenChange?.(false)}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center border-b border-border px-3">
            <svg className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <Command.Input
              placeholder={placeholder ?? "Type a command or search…"}
              className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">ESC</kbd>
          </div>
          <Command.List className="max-h-80 overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
            {children}
          </Command.List>
        </Command>
      </div>
    </div>
  );
};

export {
  Navbar,
  Sidebar,
  Menu,
  MenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  Breadcrumb,
  Pagination,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Stepper,
  CommandDialog,
};

export type {
  NavbarProps,
  SidebarProps,
  MenuProps,
  MenuItemProps,
  BreadcrumbItem,
  BreadcrumbProps,
  PaginationProps,
  StepperStep,
  StepperProps,
  CommandDialogProps,
};
