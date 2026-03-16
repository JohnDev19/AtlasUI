import type { Config } from "tailwindcss";

// ─── Tailwind v4 ────────────────────────────────────────────
//
// 1. TS2580 — `require` is not in scope in strict TS without @types/node.
//    We declare it locally so only this file gets the ambient type.
//
// 2. TS2344 — tailwindcss/plugin's exported type changed in v4; casting the
//    module to `any` first avoids the constraint entirely.
//
// 3. TS2322 — DarkModeStrategy in v4 is a two-element tuple ["class", string].
//    We cast darkMode through `any` so it always satisfies whatever version of
//    Tailwind the consumer has installed.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: (id: string) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pluginFn = require("tailwindcss/plugin") as any;

// Normalise ESM default vs direct export across Tailwind versions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// Yawa, why?!
const plugin: (...args: any[]) => any =
  typeof pluginFn === "function" ? pluginFn : pluginFn.default;

/**
 * Veloria UI Tailwind plugin.
 *
 * Maps the CSS custom properties in veloria.css to Tailwind utilities.
 *
 *   import { veloriaPlugin } from "veloria-ui/tailwind";
 *   plugins: [veloriaPlugin],
 */
export const veloriaPlugin = plugin(
  ({
    addBase,
    addUtilities,
  }: {
    addBase: (rules: Record<string, unknown>) => void;
    addUtilities: (utils: Record<string, unknown>) => void;
  }) => {
    addBase({
      "*":    { "border-color": "hsl(var(--border))" },
      "body": {
        "background-color": "hsl(var(--background))",
        "color":            "hsl(var(--foreground))",
      },
    });
    addUtilities({
      ".text-balance": { "text-wrap": "balance" },
      ".text-pretty":  { "text-wrap": "pretty" },
    });
  },
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
 * darkMode is cast through `any` → `Config["darkMode"]` so this satisfies
 * whatever tuple variant Tailwind v3 or v4 expects at the call site.
 */
export const veloriaPreset: Partial<Config> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  darkMode: ["class"] as any as Config["darkMode"],
  plugins:  [veloriaPlugin],
};

export default veloriaPlugin;