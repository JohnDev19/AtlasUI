import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";

/**
 * AtlasUI Tailwind plugin.
 *
 * Maps the CSS custom properties defined in atlas.css to Tailwind
 * color/radius/font utilities. Drop this into your tailwind.config.ts:
 *
 *   import { atlasPlugin } from "atlasui-kit/tailwind";
 *   plugins: [atlasPlugin],
 *
 * Or use atlasPreset which also sets darkMode: ["class"]:
 *
 *   import { atlasPreset } from "atlasui-kit/tailwind";
 *   presets: [atlasPreset],
 */
export const atlasPlugin = plugin(
  ({ addBase, addUtilities }) => {
    addBase({
      "*": { "border-color": "hsl(var(--border))" },
      body: {
        "background-color": "hsl(var(--background))",
        color: "hsl(var(--foreground))",
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
          background:  "hsl(var(--background))",
          foreground:  "hsl(var(--foreground))",
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

/** Full preset — includes the plugin + darkMode: ["class"]. Recommended for new projects. */
export const atlasPreset: Partial<Config> = {
  darkMode: ["class"],
  plugins: [atlasPlugin],
};

export default atlasPlugin;
