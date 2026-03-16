import type { Config } from "tailwindcss";

// ─── Tailwind v4 compatibility ────────────────────────────────────────────
//
// Three issues arise with Tailwind ≥4 + strict TypeScript:
//
// 1. TS2580 — `require` is not in scope because `@types/node` is a devDep
//    and the tsconfig lib array doesn't include Node globals. We declare it
//    locally so the ambient type is available without widening the whole lib.
//
// 2. TS2344 — The exported type of `tailwindcss/plugin` changed in v4; it no
//    longer satisfies `(...args: any) => any` when cast through `typeof import`.
//    Casting the resolved module to `any` first sidesteps the constraint.
//
// 3. TS2322 — `darkMode: ["class"]` is now `["class", string]` in v4's Config
//    type (two-element tuple). We cast it `as const` so TypeScript infers the
//    exact literal tuple type `["class"]` rather than `string[]`.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: (id: string) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pluginFn = require("tailwindcss/plugin") as any;

// Normalise: some versions export as `{ default: fn }`, others export the fn directly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugin: (...args: any[]) => any =
  typeof pluginFn === "function" ? pluginFn : pluginFn.default;

/**
 * Veloria UI Tailwind plugin.
 *
 * Maps the CSS custom properties in veloria.css to Tailwind utilities.
 * Add to your tailwind.config.ts:
 *
 *   import { veloriaPlugin } from "veloria-ui/tailwind";
 *   plugins: [veloriaPlugin],
 *
 * Or use veloriaPreset which also sets darkMode: ["class"]:
 *
 *   import { veloriaPreset } from "veloria-ui/tailwind";
 *   presets: [veloriaPreset],
 */
export const veloriaPlugin = plugin(
  // ── handler ──────────────────────────────────────────────────────────────
  ({ addBase, addUtilities }: { addBase: (rules: Record<string, unknown>) => void; addUtilities: (utils: Record<string, unknown>) => void }) => {
    addBase({
      "*": { "border-color": "hsl(var(--border))" },
      "body": {
        "background-color": "hsl(var(--background))",
        "color": "hsl(var(--foreground))",
      },
    });
    addUtilities({
      ".text-balance": { "text-wrap": "balance" },
      ".text-pretty":  { "text-wrap": "pretty" },
    });
  },
  // ── theme extension ───────────────────────────────────────────────────────
  {
    theme: {
      extend: {
        colors: {
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          card: {
            DEFAULT:    "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          popover: {
            DEFAULT:    "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          primary: {
            DEFAULT:    "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT:    "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          muted: {
            DEFAULT:    "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT:    "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          destructive: {
            DEFAULT:    "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          success: {
            DEFAULT:    "hsl(var(--success))",
            foreground: "hsl(var(--success-foreground))",
          },
          warning: {
            DEFAULT:    "hsl(var(--warning))",
            foreground: "hsl(var(--warning-foreground))",
          },
          info: {
            DEFAULT:    "hsl(var(--info))",
            foreground: "hsl(var(--info-foreground))",
          },
          border: "hsl(var(--border))",
          input:  "hsl(var(--input))",
          ring:   "hsl(var(--ring))",
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        fontFamily: {
          sans: ["var(--font-sans)"],
          mono: ["var(--font-mono)"],
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to:   { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to:   { height: "0" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up":   "accordion-up 0.2s ease-out",
        },
      },
    },
  }
);

/**
 * Full preset — includes the plugin and sets darkMode to ["class"].
 * Recommended for new projects.
 *
 * `as const` is required so TypeScript infers the exact tuple literal
 * `["class"]` rather than widening to `string[]`, which Tailwind v4's
 * Config type now rejects.
 */
export const veloriaPreset = {
  darkMode: ["class"] as const,
  plugins: [veloriaPlugin],
} satisfies Partial<Config>;

export default veloriaPlugin;