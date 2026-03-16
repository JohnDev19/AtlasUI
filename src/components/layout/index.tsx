import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "../../utils/cn";

// ─── Container ─────────────────────────────────────────────────────────────

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  center?: boolean;
}

const containerSizes = {
  sm:   "max-w-screen-sm",
  md:   "max-w-screen-md",
  lg:   "max-w-screen-lg",
  xl:   "max-w-screen-xl",
  "2xl":"max-w-screen-2xl",
  full: "max-w-full",
};

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "xl", center = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "veloria-container w-full px-4 sm:px-6 lg:px-8",
        containerSizes[size],
        center && "mx-auto",
        className
      )}
      {...props}
    />
  )
);
Container.displayName = "Container";

// ─── Stack ─────────────────────────────────────────────────────────────────

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  divider?: React.ReactNode;
}

const gapMap = { 0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4", 5: "gap-5", 6: "gap-6", 8: "gap-8", 10: "gap-10", 12: "gap-12", 16: "gap-16" };
const alignMap = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch", baseline: "items-baseline" };
const justifyMap = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between", around: "justify-around", evenly: "justify-evenly" };

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction = "column", gap = 4, align, justify, wrap, divider, children, ...props }, ref) => {
    const dirClass = { row: "flex-row", column: "flex-col", "row-reverse": "flex-row-reverse", "column-reverse": "flex-col-reverse" }[direction];
    const childArr = React.Children.toArray(children).filter(Boolean);
    return (
      <div
        ref={ref}
        className={cn(
          "veloria-stack flex",
          dirClass,
          gapMap[gap],
          align && alignMap[align],
          justify && justifyMap[justify],
          wrap && "flex-wrap",
          className
        )}
        {...props}
      >
        {divider
          ? childArr.map((child, i) => (
              <React.Fragment key={i}>
                {child}
                {i < childArr.length - 1 && divider}
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
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10;
  rows?: number;
  autoFlow?: "row" | "col" | "dense" | "row-dense" | "col-dense";
}

const colsMap = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6", 12: "grid-cols-12" };

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, gap = 4, rows, autoFlow, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("veloria-grid grid", colsMap[cols], gapMap[gap], className)}
      style={{ gridTemplateRows: rows ? `repeat(${rows}, minmax(0, 1fr))` : undefined, gridAutoFlow: autoFlow, ...style }}
      {...props}
    />
  )
);
Grid.displayName = "Grid";

// ─── Flex ──────────────────────────────────────────────────────────────────

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean | "reverse";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
  inline?: boolean;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction = "row", align, justify, wrap, gap, inline, ...props }, ref) => {
    const dirClass = { row: "flex-row", column: "flex-col", "row-reverse": "flex-row-reverse", "column-reverse": "flex-col-reverse" }[direction];
    return (
      <div
        ref={ref}
        className={cn(
          "veloria-flex",
          inline ? "inline-flex" : "flex",
          dirClass,
          align && alignMap[align],
          justify && justifyMap[justify],
          wrap === true && "flex-wrap",
          wrap === "reverse" && "flex-wrap-reverse",
          gap !== undefined && gapMap[gap as keyof typeof gapMap],
          className
        )}
        {...props}
      />
    );
  }
);
Flex.displayName = "Flex";

// ─── Section ───────────────────────────────────────────────────────────────

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  as?: React.ElementType;
}

const spacingMap = { xs: "py-4", sm: "py-8", md: "py-12", lg: "py-16", xl: "py-24", "2xl": "py-32" };

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "md", as: Tag = "section", ...props }, ref) => (
    <Tag ref={ref} className={cn("veloria-section", spacingMap[spacing], className)} {...props} />
  )
);
Section.displayName = "Section";

// ─── Spacer ────────────────────────────────────────────────────────────────

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 1 | 2 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  axis?: "horizontal" | "vertical" | "both";
}

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = 4, axis = "both", style, ...props }, ref) => {
    const px = size * 4;
    return (
      <div
        ref={ref}
        style={{
          display: "block",
          width:  axis === "vertical" ? 1 : px,
          minWidth: axis === "vertical" ? 1 : px,
          height: axis === "horizontal" ? 1 : px,
          minHeight: axis === "horizontal" ? 1 : px,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Spacer.displayName = "Spacer";

// ─── AspectRatio ───────────────────────────────────────────────────────────

export interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {}

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>(({ className, ...props }, ref) => (
  <AspectRatioPrimitive.Root ref={ref} className={cn("veloria-aspect-ratio", className)} {...props} />
));
AspectRatio.displayName = "AspectRatio";

// ─── Center ────────────────────────────────────────────────────────────────

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
}

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, inline, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "veloria-center items-center justify-center",
        inline ? "inline-flex" : "flex",
        className
      )}
      {...props}
    />
  )
);
Center.displayName = "Center";

// ─── ScrollArea ────────────────────────────────────────────────────────────

export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  orientation?: "vertical" | "horizontal" | "both";
  scrollbarSize?: number;
}

const ScrollArea = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>, ScrollAreaProps>(
  ({ className, children, orientation = "vertical", scrollbarSize = 8, ...props }, ref) => (
    <ScrollAreaPrimitive.Root ref={ref} className={cn("veloria-scroll-area relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      {(orientation === "vertical" || orientation === "both") && (
        <ScrollAreaPrimitive.Scrollbar
          orientation="vertical"
          className="flex touch-none select-none transition-colors"
          style={{ width: scrollbarSize }}
        >
          <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      {(orientation === "horizontal" || orientation === "both") && (
        <ScrollAreaPrimitive.Scrollbar
          orientation="horizontal"
          className="flex touch-none select-none flex-col transition-colors"
          style={{ height: scrollbarSize }}
        >
          <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
);
ScrollArea.displayName = "ScrollArea";

// ─── Masonry ───────────────────────────────────────────────────────────────

export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5;
  gap?: 2 | 4 | 6 | 8;
}

const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ className, columns = 3, gap = 4, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("veloria-masonry", className)}
      style={{
        columnCount: columns,
        columnGap: `${gap * 4}px`,
        ...style,
      }}
      {...props}
    />
  )
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

export type {
  ContainerProps,
  StackProps,
  GridProps,
  FlexProps,
  SectionProps,
  SpacerProps,
  AspectRatioProps,
  CenterProps,
  ScrollAreaProps,
  MasonryProps,
};
