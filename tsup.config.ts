import { defineConfig } from "tsup";

// Everything that ships as a peer dep or is only needed at
// the consumer's build time goes here — never bundle these.
const sharedExternal = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  // all radix primitives
  /^@radix-ui\/.*/,
  // cmdk, tailwind, lucide — large, always present in consumer projects
  "cmdk",
  "tailwindcss",
  "tailwindcss/plugin",
  "lucide-react",
  // class helpers — tiny but user may tree-shake their own copy
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
];

const cliExternal = [
  ...sharedExternal,
  "chalk",
  "commander",
  "execa",
  "fs-extra",
  "ora",
  "prompts",
];

export default defineConfig([
  // ── Main component library ──────────────────────────────────────────────
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    external: sharedExternal,
    outDir: "dist",
    banner: {
      js: `/**
 * veloria-ui
 * Build anything. Ship faster.
 * By JohnDev19 — https://github.com/JohnDev19/Veloria-UI
 * MIT License
 */`,
    },
  },
  // ── AtlasProvider (separate entry, needs "use client") ──────────────────
  {
    entry: { provider: "src/provider.tsx" },
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: false,
    external: sharedExternal,
    outDir: "dist",
  },
  // ── Tailwind plugin ─────────────────────────────────────────────────────
  // tailwindcss itself must be external — it's a devDep of the consumer,
  // not something we should bundle. Same with the /plugin subpath.
  {
    entry: { tailwind: "src/tailwind.ts" },
    format: ["cjs"],
    dts: true,
    sourcemap: false,
    clean: false,
    external: ["tailwindcss", "tailwindcss/plugin"],
    outDir: "dist",
  },
  // ── CLI binary ──────────────────────────────────────────────────────────
  {
    entry: { "cli/index": "src/cli/index.ts" },
    format: ["cjs"],
    dts: false,
    sourcemap: false,
    clean: false,
    outDir: "dist",
    banner: { js: "#!/usr/bin/env node" },
    external: cliExternal,
  },
]);
