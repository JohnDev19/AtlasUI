/**
 * Veloria UI — Shared TypeScript Types
 * v0.1.3
 */

import { type VariantProps } from "class-variance-authority";
import React from "react";

// ─── Size System ──────────────────────────────────────────────────────────
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ResponsiveSize = Size | Partial<Record<"base" | "sm" | "md" | "lg" | "xl", Size>>;

// ─── Color Variants ───────────────────────────────────────────────────────
export type ColorScheme =
  | "primary" | "secondary" | "success" | "warning"
  | "danger"  | "info"      | "neutral"  | "ghost";

// ─── Visual Variants ──────────────────────────────────────────────────────
export type Variant = "solid" | "outline" | "ghost" | "soft" | "link" | "danger" | "success" | "classic";

// ─── Placement ────────────────────────────────────────────────────────────
export type Placement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end";

export type Side = "top" | "right" | "bottom" | "left";

// ─── Shared Component Props ───────────────────────────────────────────────
export interface VeloriaBaseProps {
  className?: string;
  style?: React.CSSProperties;
  [key: `data-${string}`]: unknown;
}

export interface VeloriaAriaProps {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean;
  id?: string;
}

// ─── Polymorphic Support ──────────────────────────────────────────────────
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

// ─── Other Common Types ───────────────────────────────────────────────────
export type Orientation = "horizontal" | "vertical";
export type Status = "idle" | "loading" | "success" | "error" | "warning";
export type Theme = "light" | "dark" | "system";

export type { VariantProps };
