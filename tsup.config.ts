import { defineConfig } from "tsup";

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
    external: ["react", "react-dom"],
    outDir: "dist",
    banner: {
      js: `/**
 * atlasui-kit v0.1.0
 * Build anything. Ship faster.
 * By JohnDev19 — https://github.com/JohnDev19/AtlasUI
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
    external: ["react", "react-dom"],
    outDir: "dist",
  },
  // ── Tailwind plugin ─────────────────────────────────────────────────────
  {
    entry: { tailwind: "src/tailwind.ts" },
    format: ["cjs"],
    dts: true,
    sourcemap: false,
    outDir: "dist",
  },
  // ── CLI (separate CJS binary) ───────────────────────────────────────────
  {
    entry: { "cli/index": "src/cli/index.ts" },
    format: ["cjs"],
    dts: false,
    sourcemap: false,
    outDir: "dist",
    banner: { js: "#!/usr/bin/env node" },
    external: ["react", "react-dom"],
  },
]);
