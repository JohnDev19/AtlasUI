/**
 * Classic variant system for Veloria UI
 *
 * The "classic" variant evokes refined, timeless design:
 * serif-adjacent weight, subtle inset borders, warm neutral tones,
 * gentle textures, and premium tactile feel — without literal 3D effects.
 *
 * Works on: Button, Card, Badge, Input, Select, Chip, Tag, Table,
 *           Alert, Tooltip, Modal, Drawer, Tabs, Pagination, Avatar,
 *           Divider, CodeBlock, Notification, Stepper, and more.
 */

import { cva } from "class-variance-authority";

/**
 * Classic button — warm parchment base, refined border, crisp shadow.
 * Evokes a premium, editorial press-button feel.
 */
export const classicButtonBase = [
  // Base geometry
  "inline-flex items-center justify-center gap-2",
  "whitespace-nowrap font-semibold tracking-wide",
  "select-none transition-all duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-50",
  // Classic feel: inset highlight + shadow depth
  "border border-[hsl(var(--classic-border))] bg-[hsl(var(--classic-bg))]",
  "text-[hsl(var(--classic-fg))]",
  "shadow-[0_1px_3px_hsl(var(--classic-shadow)),inset_0_1px_0_hsl(var(--classic-highlight))]",
  "hover:bg-[hsl(var(--classic-bg-hover))] hover:shadow-[0_2px_6px_hsl(var(--classic-shadow))]",
  "active:shadow-[inset_0_1px_3px_hsl(var(--classic-shadow))] active:translate-y-px",
];

/**
 * Classic card — linen-like surface, double border, editorial spacing.
 */
export const classicCardBase = [
  "rounded-lg",
  "border-2 border-[hsl(var(--classic-border))]",
  "bg-[hsl(var(--classic-surface))]",
  "shadow-[0_2px_8px_hsl(var(--classic-shadow)),inset_0_1px_0_hsl(var(--classic-highlight))]",
  "ring-1 ring-[hsl(var(--classic-border))]/30",
];

/**
 * Classic badge — stamped-label aesthetic with letter-spacing.
 */
export const classicBadgeBase = [
  "inline-flex items-center gap-1 rounded",
  "border border-[hsl(var(--classic-border))]",
  "bg-[hsl(var(--classic-bg))] text-[hsl(var(--classic-fg))]",
  "text-[10px] font-bold uppercase tracking-widest",
  "px-2 py-0.5",
  "shadow-[0_1px_2px_hsl(var(--classic-shadow))]",
];

/**
 * Classic input — engraved-look with inset shadow, crisp border.
 */
export const classicInputBase = [
  "w-full rounded-md",
  "border border-[hsl(var(--classic-border))]",
  "bg-[hsl(var(--classic-input-bg))] text-[hsl(var(--classic-fg))]",
  "shadow-[inset_0_1px_3px_hsl(var(--classic-shadow))]",
  "placeholder:text-[hsl(var(--classic-placeholder))]",
  "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--classic-ring))]",
  "transition-shadow duration-150",
];

/**
 * Classic tab — underline with ruled separator feel.
 */
export const classicTabBase = [
  "border-b-2 border-transparent pb-2 font-semibold tracking-wide",
  "text-[hsl(var(--classic-muted))] transition-colors",
  "data-[state=active]:border-[hsl(var(--classic-border))] data-[state=active]:text-[hsl(var(--classic-fg))]",
  "hover:text-[hsl(var(--classic-fg))]",
];

/**
 * CSS custom properties to inject for the classic variant.
 * Consumers add these to their :root / .dark blocks.
 */
export const classicCSSVars = `
/* ── Veloria UI Classic Variant Tokens ─────────────────────────── */
:root {
  --classic-bg:          36 25% 94%;   /* warm parchment */
  --classic-bg-hover:    36 25% 90%;
  --classic-surface:     36 20% 97%;   /* linen surface */
  --classic-fg:          25 30% 15%;   /* deep warm brown */
  --classic-border:      30 20% 65%;   /* aged brass */
  --classic-highlight:   36 60% 98%;   /* top-edge highlight */
  --classic-shadow:      25 30% 15% / 0.12;
  --classic-muted:       30 15% 55%;
  --classic-placeholder: 30 10% 65%;
  --classic-ring:        30 40% 45%;
  --classic-input-bg:    36 30% 99%;
}

.dark {
  --classic-bg:          25 20% 12%;   /* dark cognac */
  --classic-bg-hover:    25 20% 16%;
  --classic-surface:     25 18% 10%;
  --classic-fg:          36 30% 88%;   /* warm cream */
  --classic-border:      30 15% 30%;   /* darker brass */
  --classic-highlight:   36 20% 25% / 0.6;
  --classic-shadow:      0 0% 0% / 0.4;
  --classic-muted:       30 12% 50%;
  --classic-placeholder: 30 10% 40%;
  --classic-ring:        30 35% 55%;
  --classic-input-bg:    25 20% 9%;
}
`;
