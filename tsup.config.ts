import { defineConfig } from "tsup";

// everything that ships as a peer dep or is only needed at
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
  // tiptap — all packages are peer deps, never bundle them
  /^@tiptap\/.*/,
  "lowlight",
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

  // ── VeloriaProvider (separate entry, needs "use client") ────────────────
  {
    entry:     { provider: "src/provider.tsx" },
    format:    ["cjs", "esm"],
    dts:       true,
    sourcemap: true,
    clean:     false,
    external:  sharedExternal,
    outDir:    "dist",
  },

  // ── Tailwind plugin ─────────────────────────────────────────────────────
  // tailwindcss itself must stay external — it is a devDep of the consumer.
  {
    entry:     { tailwind: "src/tailwind.ts" },
    format:    ["cjs"],
    dts:       true,
    sourcemap: false,
    clean:     false,
    external:  ["tailwindcss", "tailwindcss/plugin"],
    outDir:    "dist",
  },

  // ── CLI binary ──────────────────────────────────────────────────────────
  //
  // IMPORTANT — shebang handling:
  //
  // Do NOT use banner: { js: "#!/usr/bin/env node" } here.
  // tsup's banner is appended after its own generated file header, which
  // puts the shebang on line 2+. Node.js requires the shebang to be the
  // very first bytes of the file (byte 0), otherwise it throws:
  //   SyntaxError: Invalid or unexpected token
  //
  // Correct approach:
  //   1. Keep "#!/usr/bin/env node" as the first line of src/cli/index.ts
  //   2. Set platform: "node" — tsup preserves the source shebang at
  //      byte 0 in the output and skips adding its own file header.
  // bakit kasi ganun.
  //
  {
    entry:    { "cli/index": "src/cli/index.ts" },
    format:   ["cjs"],
    platform: "node",        // tells tsup this is a Node binary
    dts:      false,
    sourcemap: false,
    clean:    false,
    outDir:   "dist",
    external: cliExternal,
    // no banner... shebang lives in src/cli/index.ts line 1
  },
]);