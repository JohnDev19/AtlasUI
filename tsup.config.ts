import { defineConfig } from "tsup";

const sharedExternal = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  /^@radix-ui\/.*/,
  "cmdk",
  "tailwindcss",
  "tailwindcss/plugin",
  "lucide-react",
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

// ROOT-CAUSE FIX:
// "moduleResolution: bundler" (TypeScript 5+) is strict about package exports
// and fails in pnpm's isolated node_modules when packages aren't hoisted to root.
// "node16" is compatible with pnpm's symlinked structure and correctly resolves
// @radix-ui/* type declarations without requiring shamefully-hoist.
// skipLibCheck ensures residual .d.ts issues in deps don't block our build.
const dtsCompilerOptions = {
  moduleResolution: "node16" as const,
  skipLibCheck: true,
};

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: { compilerOptions: dtsCompilerOptions },
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
  {
    entry: { provider: "src/provider.tsx" },
    format: ["cjs", "esm"],
    dts: { compilerOptions: dtsCompilerOptions },
    sourcemap: true,
    clean: false,
    external: sharedExternal,
    outDir: "dist",
  },
  {
    entry: { tailwind: "src/tailwind.ts" },
    format: ["cjs"],
    dts: { compilerOptions: dtsCompilerOptions },
    sourcemap: false,
    clean: false,
    external: ["tailwindcss", "tailwindcss/plugin"],
    outDir: "dist",
  },
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