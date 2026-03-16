import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { classicButtonBase } from "../../variants/classic";

const buttonVariants = cva(
  [
    "veloria-button",
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-md font-medium",
    "ring-offset-background transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none",
  ],
  {
    variants: {
      variant: {
        solid:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-[0.98]",
        outline:
          "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost:
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        danger:
          "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
        success:
          "bg-success text-success-foreground shadow hover:bg-success/90",
        /**
         * classic — premium editorial feel.
         * Warm parchment base · inset highlight · engraved depth.
         * Not literal 3D — refined tactile quality.
         */
        classic: cn(classicButtonBase),
      },
      size: {
        xs:   "h-6 px-2 text-xs rounded",
        sm:   "h-8 px-3 text-sm",
        md:   "h-9 px-4 text-sm",
        lg:   "h-10 px-6 text-base",
        xl:   "h-12 px-8 text-base",
        icon: "h-9 w-9",
      },
      fullWidth: { true: "w-full" },
      loading:   { true: "cursor-wait" },
    },
    compoundVariants: [
      // Classic size overrides — slightly more generous padding for the premium feel
      { variant: "classic", size: "sm", class: "px-4 tracking-wide" },
      { variant: "classic", size: "md", class: "px-5 tracking-wide" },
      { variant: "classic", size: "lg", class: "px-7 tracking-widest text-sm" },
      { variant: "classic", size: "xl", class: "px-9 tracking-widest" },
    ],
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        disabled={disabled || loading === true}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-0.5 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!loading && leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>}
        {children}
        {rightIcon && !loading && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
