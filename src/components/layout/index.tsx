import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// ─── Container ─────────────────────────────────────────────────────────────

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  center?: boolean;
  padded?: boolean;
}

const maxWidthMap = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth = "xl", center = true, padded = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "atlas-container w-full",
        maxWidthMap[maxWidth],
        center && "mx-auto",
        padded && "px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  )
);
Container.displayName = "Container";

// ─── Stack ─────────────────────────────────────────────────────────────────

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  divider?: React.ReactNode;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction = "column", gap = 4, align, justify, wrap, divider, children, ...props }, ref) => {
    const gapClass = `gap-${gap}`;
    const validChildren = React.Children.toArray(children).filter(React.isValidElement);

    return (
      <div
        ref={ref}
        className={cn(
          "atlas-stack flex",
          direction === "row" ? "flex-row" : "flex-col",
          gapClass,
          align && `items-${align}`,
          justify && `justify-${justify}`,
          wrap && "flex-wrap",
          className
        )}
        {...props}
      >
        {divider
          ? validChildren.map((child, i) => (
              <React.Fragment key={i}>
                {child}
                {i < validChildren.length - 1 && divider}
              </React.Fragment>
            ))
          : children}
      </div>
    );
  }
);
Stack.displayName = "Stack";

// ─── Grid ──────────────────────────────────────────────────────────────────

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  rows?: number;
  flow?: "row" | "col" | "dense";
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 4, rows, flow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "atlas-grid grid",
        `grid-cols-${cols}`,
        `gap-${gap}`,
        rows && `grid-rows-${rows}`,
        flow && `grid-flow-${flow}`,
        className
      )}
      {...props}
    />
  )
);
Grid.displayName = "Grid";

// ─── Flex ──────────────────────────────────────────────────────────────────

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean | "reverse";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  inline?: boolean;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction = "row", align, justify, wrap, gap, inline, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "atlas-flex",
        inline ? "inline-flex" : "flex",
        direction !== "row" && `flex-${direction}`,
        align && `items-${align}`,
        justify && `justify-${justify}`,
        wrap === true && "flex-wrap",
        wrap === "reverse" && "flex-wrap-reverse",
        gap !== undefined && `gap-${gap}`,
        className
      )}
      {...props}
    />
  )
);
Flex.displayName = "Flex";

// ─── Section ──────────────────────────────────────────────────────────────

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  py?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const pyMap = { sm: "py-8", md: "py-12", lg: "py-16", xl: "py-24", "2xl": "py-32" };

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, as: Comp = "section", py = "lg", ...props }, ref) => (
    <Comp ref={ref} className={cn("atlas-section w-full", pyMap[py], className)} {...props} />
  )
);
Section.displayName = "Section";

// ─── Spacer ───────────────────────────────────────────────────────────────

export interface SpacerProps {
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
  axis?: "horizontal" | "vertical" | "both";
  className?: string;
}

const Spacer = ({ size = 4, axis = "vertical", className }: SpacerProps) => (
  <span
    className={cn(
      "atlas-spacer block",
      axis === "vertical" && `h-${size}`,
      axis === "horizontal" && `w-${size}`,
      axis === "both" && `h-${size} w-${size}`,
      className
    )}
    aria-hidden="true"
  />
);
Spacer.displayName = "Spacer";

// ─── AspectRatio ──────────────────────────────────────────────────────────

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AspectRatioPrimitive.Root ref={ref} className={cn("atlas-aspect-ratio", className)} {...props} />
));
AspectRatio.displayName = "AspectRatio";

// ─── Center ───────────────────────────────────────────────────────────────

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
  minH?: string;
}

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, inline, minH, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "atlas-center",
        inline ? "inline-flex" : "flex",
        "items-center justify-center",
        className
      )}
      style={{ minHeight: minH, ...style }}
      {...props}
    />
  )
);
Center.displayName = "Center";

// ─── ScrollArea ───────────────────────────────────────────────────────────

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    orientation?: "vertical" | "horizontal" | "both";
  }
>(({ className, children, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("atlas-scroll-area relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    {(orientation === "vertical" || orientation === "both") && (
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-[1px]"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
      </ScrollAreaPrimitive.Scrollbar>
    )}
    {(orientation === "horizontal" || orientation === "both") && (
      <ScrollAreaPrimitive.Scrollbar
        orientation="horizontal"
        className="flex touch-none select-none transition-colors flex-col h-2.5 border-t border-t-transparent p-[1px]"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
      </ScrollAreaPrimitive.Scrollbar>
    )}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = "ScrollArea";

// ─── Masonry ──────────────────────────────────────────────────────────────

export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
}

const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ className, columns = 3, gap = 4, children, ...props }, ref) => {
    const cols = typeof columns === "number" ? columns : 3;

    return (
      <div
        ref={ref}
        className={cn("atlas-masonry w-full", className)}
        style={{
          columnCount: cols,
          columnGap: `${gap * 4}px`,
        }}
        {...props}
      >
        {React.Children.map(children, (child) => (
          <div style={{ breakInside: "avoid", marginBottom: `${gap * 4}px` }}>
            {child}
          </div>
        ))}
      </div>
    );
  }
);
Masonry.displayName = "Masonry";

export {
  Container,
  Stack,
  Grid,
  Flex,
  Section,
  Spacer,
  AspectRatio,
  Center,
  ScrollArea,
  Masonry,
};
