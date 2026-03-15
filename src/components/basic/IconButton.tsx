import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const iconButtonVariants = cva(
  [
    "atlas-icon-button",
    "inline-flex items-center justify-center rounded-md",
    "transition-all duration-150 shrink-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.96]",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        xs: "h-6 w-6 [&>svg]:h-3 [&>svg]:w-3",
        sm: "h-7 w-7 [&>svg]:h-3.5 [&>svg]:w-3.5",
        md: "h-9 w-9 [&>svg]:h-4 [&>svg]:w-4",
        lg: "h-10 w-10 [&>svg]:h-5 [&>svg]:w-5",
        xl: "h-12 w-12 [&>svg]:h-6 [&>svg]:w-6",
      },
      shape: {
        square: "rounded-md",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
      shape: "square",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Accessible label — required for screen readers */
  "aria-label": string;
  asChild?: boolean;
  icon?: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, shape, asChild = false, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(iconButtonVariants({ variant, size, shape, className }))}
        {...props}
      >
        {icon ?? children}
      </Comp>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
