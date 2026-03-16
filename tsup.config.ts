import { defineConfig } from "tsup";

const sharedExternal = [
  "react", "react-dom", "react/jsx-runtime",
  /^@radix-ui\/.*/,
  "cmdk", "tailwindcss", "tailwindcss/plugin",
  "lucide-react", "clsx", "tailwind-merge", "class-variance-authority",
];

const cliExternal = [...sharedExternal, "chalk", "commander", "execa", "fs-extra", "ora", "prompts"];

export default defineConfig([
  // ── Main library ───────────────────────────────────────────────────────
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: true, splitting: true, sourcemap: true, clean: true, treeshake: true,
    external: sharedExternal,
    outDir: "dist",
    banner: { js: `/**\n * veloria-ui v0.1.3\n * Build anything. Ship faster.\n * MIT License — JohnDev19\n */` },
  },
  // ── Status / metadata API ─────────────────────────────────────────────
  {
    entry: { "api/index": "src/api/index.ts" },
    format: ["cjs", "esm"],
    dts: true, sourcemap: true, clean: false,
    external: sharedExternal,
    outDir: "dist",
  },
  // ── VeloriaProvider ───────────────────────────────────────────────────
  {
    entry: { provider: "src/provider.tsx" },
    format: ["cjs", "esm"],
    dts: true, sourcemap: true, clean: false,
    external: sharedExternal,
    outDir: "dist",
  },
  // ── Tailwind plugin ───────────────────────────────────────────────────
  {
    entry: { tailwind: "src/tailwind.ts" },
    format: ["cjs"],
    dts: true, sourcemap: false, clean: false,
    external: ["tailwindcss", "tailwindcss/plugin"],
    outDir: "dist",
  },
  // ── CLI binary ────────────────────────────────────────────────────────
  {
    entry: { "cli/index": "src/cli/index.ts" },
    format: ["cjs"],
    dts: false, sourcemap: false, clean: false,
    outDir: "dist",
    banner: { js: "#!/usr/bin/env node" },
    external: cliExternal,
  },
]);
