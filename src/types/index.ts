import { type VariantProps } from "class-variance-authority";
import React from "react";

// ─── Size System ────────────────────────────────────────────────────────────

export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ResponsiveSize = Size | Partial<Record<"base" | "sm" | "md" | "lg" | "xl", Size>>;

// ─── Color Variants ─────────────────────────────────────────────────────────

export type ColorScheme =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "ghost";

// ─── Visual Variants ────────────────────────────────────────────────────────

export type Variant = "solid" | "outline" | "ghost" | "soft" | "link";

// ─── Placement ──────────────────────────────────────────────────────────────

export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export type Side = "top" | "right" | "bottom" | "left";

// ─── Shared Component Props ──────────────────────────────────────────────────

export interface AtlasBaseProps {
  /** Additional CSS class names */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
  /** Data attributes passthrough */
  [key: `data-${string}`]: unknown;
}

export interface AtlasAriaProps {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean;
  id?: string;
}

// ─── Polymorphic Component Support ──────────────────────────────────────────

export type AsChildProps<T extends React.ElementType = React.ElementType> = {
  asChild?: boolean;
  as?: T;
};

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  Props = object
> = Props &
  Omit<React.ComponentPropsWithRef<C>, keyof Props> & {
    as?: C;
    ref?: PolymorphicRef<C>;
  };

// ─── Orientation ─────────────────────────────────────────────────────────────

export type Orientation = "horizontal" | "vertical";

// ─── Status ──────────────────────────────────────────────────────────────────

export type Status = "idle" | "loading" | "success" | "error" | "warning";

// ─── Theme ───────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark" | "system";

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type { VariantProps };
