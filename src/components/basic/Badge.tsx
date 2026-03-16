import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { classicBadgeBase } from "../../variants/classic";

const badgeVariants = cva(
  "veloria-badge inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:   "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline:   "border border-border text-foreground bg-transparent",
        soft:      "bg-primary/10 text-primary",
        success:   "bg-success/15 text-success",
        warning:   "bg-warning/15 text-warning",
        danger:    "bg-destructive/15 text-destructive",
        info:      "bg-info/15 text-info",
        /**
         * classic — stamped-label with letter-spacing and warm brass border.
         * Think vintage postage stamp or wax seal label.
         */
        classic: cn(classicBadgeBase),
      },
      dot: { true: "" },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot, dotColor, children, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full bg-current", dotColor)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
