import * as React from "react";
import { cn } from "../../utils/cn";

export interface PricingFeature {
  /** Feature description shown in the list. */
  label: string;
  /** Shows a check icon when true, a cross when false. */
  included: boolean;
  /** Optional parenthetical note appended to the label. */
  note?: string;
}

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plan name e.g. "Pro", "Enterprise". */
  name: string;
  /** Numeric price (will prepend currency symbol) or an arbitrary string like "Custom". */
  price: number | string;
  /** Billing period shown after the price. Default "/month". */
  period?: string;
  /** Short description under the price. */
  description?: string;
  /** Feature list rendered with check / cross icons. */
  features?: PricingFeature[];
  /** Label on the call-to-action button. Default "Get started". */
  ctaLabel?: string;
  /** Handler for the CTA button click. */
  onCtaClick?: () => void;
  /** Highlights the card with an accent ring and a "Most popular" badge. */
  popular?: boolean;
  /** Apply the classic bevel variant. Default "default". */
  variant?: "default" | "classic";
  /** Currency symbol prepended to numeric prices. Default "$". */
  currency?: string;
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      name,
      price,
      period = "/month",
      description,
      features = [],
      ctaLabel = "Get started",
      onCtaClick,
      popular = false,
      variant = "default",
      currency = "$",
      className,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "atlas-pricing-card relative flex flex-col rounded-xl border bg-card text-card-foreground",
        popular
          ? "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20"
          : "border-border shadow-sm",
        variant === "classic" && "veloria-classic",
        className
      )}
      {...props}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            Most popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {name}
        </p>

        <div className="mt-3 flex items-baseline gap-1">
          {typeof price === "number" ? (
            <>
              <span className="text-4xl font-bold tracking-tight">
                {currency}{price}
              </span>
              <span className="text-sm text-muted-foreground">{period}</span>
            </>
          ) : (
            <span className="text-4xl font-bold tracking-tight">{price}</span>
          )}
        </div>

        {description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Divider + feature list */}
      {features.length > 0 && (
        <div className="flex-1 border-t border-border px-6 py-5">
          <ul className="space-y-3" role="list">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                {f.included ? (
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                <span
                  className={cn(
                    "text-sm",
                    !f.included && "text-muted-foreground/60"
                  )}
                >
                  {f.label}
                  {f.note && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({f.note})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="p-6 pt-0">
        <button
          type="button"
          onClick={onCtaClick}
          className={cn(
            "w-full rounded-md px-4 py-2.5 text-sm font-medium",
            "transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            popular
              ? "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-[0.98]"
              : "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  )
);

PricingCard.displayName = "PricingCard";

export { PricingCard };
