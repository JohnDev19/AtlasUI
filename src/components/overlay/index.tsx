import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cn } from "../../utils/cn";

// ─── Dialog Primitives ─────────────────────────────────────────────────────

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const dialogSizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl", full: "max-w-[95vw] h-[95vh]" };

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { size?: keyof typeof dialogSizes; showClose?: boolean }
>(({ className, children, size = "md", showClose = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "veloria-dialog fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 gap-4",
        "rounded-xl border border-border bg-background p-6 shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        dialogSizes[size],
        className
      )}
      {...props}
    >
      {children}
      {showClose && (
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" aria-label="Close">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </DialogClose>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)} {...props} />
);
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2", className)} {...props} />
);
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

// ─── Modal (opinionated wrapper) ───────────────────────────────────────────

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  size?: keyof typeof dialogSizes;
  children?: React.ReactNode;
  showClose?: boolean;
}

const Modal: React.FC<ModalProps> = ({ open, onOpenChange, title, description, footer, size = "md", children, showClose = true }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent size={size} showClose={showClose}>
      {(title || description) && (
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
      )}
      {children}
      {footer && <DialogFooter>{footer}</DialogFooter>}
    </DialogContent>
  </Dialog>
);

// ─── Drawer ────────────────────────────────────────────────────────────────

export interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right" | "top" | "bottom";
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
}

const drawerSizes = {
  left:   { sm: "w-64", md: "w-80", lg: "w-96", full: "w-screen" },
  right:  { sm: "w-64", md: "w-80", lg: "w-96", full: "w-screen" },
  top:    { sm: "h-48", md: "h-64", lg: "h-80", full: "h-screen" },
  bottom: { sm: "h-48", md: "h-64", lg: "h-80", full: "h-screen" },
};

const drawerAnimations = {
  left:   "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  right:  "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  top:    "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  bottom: "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
};

const Drawer: React.FC<DrawerProps> = ({ open, onOpenChange, side = "right", title, description, footer, children, size = "md" }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "veloria-drawer fixed z-50 gap-4 bg-background shadow-xl p-6 flex flex-col",
          "transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out duration-300",
          side === "left"   && `left-0 top-0 h-full ${drawerSizes.left[size]}`,
          side === "right"  && `right-0 top-0 h-full ${drawerSizes.right[size]}`,
          side === "top"    && `top-0 left-0 w-full ${drawerSizes.top[size]}`,
          side === "bottom" && `bottom-0 left-0 w-full ${drawerSizes.bottom[size]}`,
          drawerAnimations[side]
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          <DialogClose className="rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Close">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </DialogClose>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-border pt-4">{footer}</div>}
      </DialogPrimitive.Content>
    </DialogPortal>
  </Dialog>
);

const Sheet = Drawer;

// ─── Popover ───────────────────────────────────────────────────────────────

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "veloria-popover z-50 w-72 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

// ─── HoverCard ─────────────────────────────────────────────────────────────

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "veloria-hover-card z-50 w-64 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = "HoverCardContent";

// ─── ContextMenu ───────────────────────────────────────────────────────────

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "veloria-context-menu z-50 min-w-[10rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & { inset?: boolean; icon?: React.ReactNode; shortcut?: string }
>(({ className, inset, icon, shortcut, children, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {icon && <span className="h-4 w-4 shrink-0">{icon}</span>}
    <span className="flex-1">{children}</span>
    {shortcut && <span className="ml-auto text-xs text-muted-foreground">{shortcut}</span>}
  </ContextMenuPrimitive.Item>
));
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Label ref={ref} className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)} {...props} />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

// ─── Lightbox / ImageViewer ────────────────────────────────────────────────

export interface LightboxProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  src: string;
  alt?: string;
  caption?: string;
}

const Lightbox: React.FC<LightboxProps> = ({ open, onOpenChange, src, alt = "", caption }) => {
  React.useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange?.(false); };
    if (open) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div className="veloria-lightbox fixed inset-0 z-50 flex flex-col items-center justify-center" onClick={() => onOpenChange?.(false)}>
      <div className="absolute inset-0 bg-black/90" />
      <button type="button" className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors" onClick={() => onOpenChange?.(false)} aria-label="Close">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <div className="relative z-10 max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl" />
        {caption && <p className="mt-3 text-center text-sm text-white/70">{caption}</p>}
      </div>
    </div>
  );
};

export interface ImageViewerProps extends LightboxProps {
  thumbnails?: string[];
}

const ImageViewer: React.FC<ImageViewerProps> = ({ open, onOpenChange, src, alt, caption, thumbnails = [] }) => {
  const [current, setCurrent] = React.useState(src);
  const all = thumbnails.length ? thumbnails : [src];

  React.useEffect(() => { setCurrent(src); }, [src]);

  if (!open) return null;
  return (
    <div className="veloria-image-viewer fixed inset-0 z-50 flex flex-col items-center justify-center gap-4">
      <div className="absolute inset-0 bg-black/90" onClick={() => onOpenChange?.(false)} />
      <button type="button" className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors" onClick={() => onOpenChange?.(false)} aria-label="Close">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <div className="relative z-10 max-h-[80vh] max-w-[90vw]">
        <img src={current} alt={alt ?? ""} className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain shadow-2xl" />
        {caption && <p className="mt-2 text-center text-sm text-white/70">{caption}</p>}
      </div>
      {all.length > 1 && (
        <div className="relative z-10 flex gap-2 overflow-x-auto pb-2">
          {all.map((thumb, i) => (
            <button key={i} type="button" onClick={() => setCurrent(thumb)} className={cn("h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-all", current === thumb ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-75")}>
              <img src={thumb} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export {
  Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogClose, DialogContent,
  DialogHeader, DialogFooter, DialogTitle, DialogDescription,
  Modal,
  Drawer, Sheet,
  Popover, PopoverTrigger, PopoverContent,
  HoverCard, HoverCardTrigger, HoverCardContent,
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  ContextMenuSeparator, ContextMenuLabel, ContextMenuGroup, ContextMenuSub, ContextMenuRadioGroup,
  Lightbox,
  ImageViewer,
};

export type { ModalProps, DrawerProps, LightboxProps, ImageViewerProps };
