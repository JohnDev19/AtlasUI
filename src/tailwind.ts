// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");

/**
 * Veloria UI Tailwind Plugin — v0.1.3
 *
 * Adds:
 * - animate-marquee / animate-marquee-reverse utilities
 * - animate-ripple utility
 * - animate-gradient-x utility
 * - veloria-* component base class markers
 */
export const veloriaPlugin = plugin(
  ({ addUtilities }: { addUtilities: (u: Record<string, Record<string, string>>) => void }) => {
    addUtilities({
      ".animate-marquee": {
        animation: "marquee var(--marquee-duration, 30s) linear infinite",
      },
      ".animate-marquee-reverse": {
        animation: "marquee-reverse var(--marquee-duration, 30s) linear infinite",
      },
      ".animate-ripple": {
        animation: "ripple 0.6s ease-out forwards",
      },
      ".animate-gradient-x": {
        animation: "gradient-x 3s ease infinite",
        "background-size": "200% auto",
      },
    });
  },
  {
    theme: {
      extend: {
        keyframes: {
          marquee: {
            from: { transform: "translateX(0)" },
            to:   { transform: "translateX(calc(-100% - var(--marquee-gap, 2rem)))" },
          },
          "marquee-reverse": {
            from: { transform: "translateX(calc(-100% - var(--marquee-gap, 2rem)))" },
            to:   { transform: "translateX(0)" },
          },
          ripple: {
            "0%":   { width: "8px", height: "8px", opacity: "0.6" },
            "100%": { width: "300px", height: "300px", opacity: "0" },
          },
          "gradient-x": {
            "0%, 100%": { "background-position": "0% center" },
            "50%":      { "background-position": "100% center" },
          },
        },
        animation: {
          marquee:           "marquee linear infinite",
          "marquee-reverse": "marquee-reverse linear infinite",
          ripple:            "ripple 0.6s ease-out forwards",
          "gradient-x":      "gradient-x 3s ease infinite",
        },
        colors: {
          success:     "hsl(var(--success) / <alpha-value>)",
          warning:     "hsl(var(--warning) / <alpha-value>)",
          info:        "hsl(var(--info)    / <alpha-value>)",
          border:      "hsl(var(--border)  / <alpha-value>)",
          input:       "hsl(var(--input)   / <alpha-value>)",
          ring:        "hsl(var(--ring)    / <alpha-value>)",
          background:  "hsl(var(--background)  / <alpha-value>)",
          foreground:  "hsl(var(--foreground)  / <alpha-value>)",
          card:        "hsl(var(--card)        / <alpha-value>)",
          "card-foreground":    "hsl(var(--card-foreground)    / <alpha-value>)",
          muted:                "hsl(var(--muted)               / <alpha-value>)",
          "muted-foreground":   "hsl(var(--muted-foreground)    / <alpha-value>)",
          accent:               "hsl(var(--accent)              / <alpha-value>)",
          "accent-foreground":  "hsl(var(--accent-foreground)   / <alpha-value>)",
          primary:              "hsl(var(--primary)             / <alpha-value>)",
          "primary-foreground": "hsl(var(--primary-foreground)  / <alpha-value>)",
          destructive:          "hsl(var(--destructive)         / <alpha-value>)",
          "destructive-foreground": "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        borderRadius: {
          DEFAULT: "var(--radius)",
          sm:   "calc(var(--radius) - 4px)",
          md:   "calc(var(--radius) - 2px)",
          lg:   "var(--radius)",
          xl:   "calc(var(--radius) + 4px)",
          "2xl":"calc(var(--radius) + 8px)",
        },
      },
    },
  }
);

export const veloriaPreset = {
  plugins: [veloriaPlugin],
};
