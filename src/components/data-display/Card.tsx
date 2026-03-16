import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { classicCardBase } from "../../variants/classic";

const cardVariants = cva(
  "veloria-card rounded-xl border bg-card text-card-foreground",
  {
    variants: {
      variant: {
        default:   "border-border shadow-sm",
        outline:   "border-border shadow-none",
        elevated:  "border-transparent shadow-lg",
        ghost:     "border-transparent shadow-none bg-transparent",
        filled:    "border-transparent bg-muted",
        /**
         * classic — editorial linen surface with double-border depth.
         * Evokes premium stationery / leather-bound quality.
         */
        classic: cn(classicCardBase),
      },
      interactive: {
        true: "cursor-pointer transition-shadow hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
      },
    },
    compoundVariants: [
      {
        variant: "classic",
        interactive: true,
        class: "hover:shadow-[0_4px_16px_hsl(var(--classic-shadow)),inset_0_1px_0_hsl(var(--classic-highlight))] hover:-translate-y-1",
      },
    ],
    defaultVariants: { variant: "default" },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, interactive, className }))} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold leading-tight tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0 gap-2", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
