import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { classicInputBase } from "../../variants/classic";

const inputVariants = cva(
  [
    "veloria-input flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
    "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-shadow duration-150",
  ],
  {
    variants: {
      variant: {
        default: "",
        outline: "border-border shadow-none",
        filled:  "bg-muted border-transparent focus-visible:bg-background",
        /**
         * classic — engraved inset appearance.
         * Warm paper background, brass border, inset shadow depth.
         */
        classic: cn(classicInputBase),
      },
      inputSize: {
        sm: "h-8 px-2 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-base",
      },
      hasError: {
        true: "border-destructive focus-visible:ring-destructive",
      },
    },
    defaultVariants: { variant: "default", inputSize: "md" },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hasError?: boolean;
  inputSize?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, hasError, leftIcon, rightIcon, type, ...props }, ref) => {
    if (!leftIcon && !rightIcon) {
      return (
        <input
          type={type}
          ref={ref}
          className={cn(inputVariants({ variant, inputSize, hasError, className }))}
          {...props}
        />
      );
    }
    return (
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-muted-foreground pointer-events-none" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            inputVariants({ variant, inputSize, hasError, className }),
            leftIcon && "pl-9",
            rightIcon && "pr-9"
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-muted-foreground pointer-events-none" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
