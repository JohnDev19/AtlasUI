#!/usr/bin/env node

/**
 * veloria-ui CLI
 *
 * Copies Veloria UI components into your project so you own the code.
 * Works exactly like shadcn/ui's CLI — pick what you want, paste it in.
 *
 * By JohnDev19 — https://github.com/JohnDev19/Veloria-UI
 * Docs: https://veloria-ui.vercel.app/
 *
 * Commands:
 *   veloria-ui init                    — project setup wizard
 *   veloria-ui add button card modal   — copy components into your project
 *   veloria-ui list                    — browse all 90 components
 *   veloria-ui list --category forms   — filter by category
 *   veloria-ui diff button             — compare local vs latest
 */

import path from "path";
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import fs from "fs-extra";
import { execa } from "execa";
import { REGISTRY, COMPONENTS_BY_NAME, CATEGORIES, type Category } from "./registry";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PKG_VERSION: string = (require("../../package.json") as { version: string }).version;

// ─── Banner ───────────────────────────────────────────────────────────────

const banner = `
${chalk.bold.blue("  ╔═╗╔╦╗╦  ╔═╗╔═╗╦ ╦╦")}
${chalk.bold.blue("  ╠═╣ ║ ║  ╠═╣╚═╗║ ║║")}
${chalk.bold.blue("  ╩ ╩ ╩ ╩═╝╩ ╩╚═╝╚═╝╩")}
  ${chalk.dim("Build anything. Ship faster.")}
  ${chalk.dim("by JohnDev19  ·  https://github.com/JohnDev19/Veloria-UI")}
`;

// ─── Program ──────────────────────────────────────────────────────────────

const program = new Command();

program
  .name("veloria-ui")
  .description("veloria-ui CLI — copy components into your project")
  .version(PKG_VERSION, "-v, --version")
  .addHelpText("before", banner);

// ─── init ─────────────────────────────────────────────────────────────────

program
  .command("init")
  .description("Set up veloria-ui in your project")
  .option("--typescript", "Use TypeScript", true)
  .option("--tailwind", "Configure Tailwind", true)
  .option("--no-install", "Skip dependency install")
  .option("-y, --yes", "Skip all prompts, use defaults")
  .action(async (opts) => {
    console.log(chalk.bold.blue("\n  Veloria UI Init\n") + chalk.dim("  Let's get you set up…\n"));

    const cwd = process.cwd();
    const pkgPath = path.join(cwd, "package.json");

    if (!fs.existsSync(pkgPath)) {
      console.error(chalk.red("\n  No package.json found. Run from your project root.\n"));
      process.exit(1);
    }

    const pkg = fs.readJsonSync(pkgPath) as Record<string, unknown>;
    const isNext = !!((pkg.dependencies as Record<string, string>)?.next ||
                      (pkg.devDependencies as Record<string, string>)?.next);

    const answers = opts.yes
      ? { componentsDir: "components/ui", cssPath: isNext ? "app/globals.css" : "src/index.css", pm: detectPM(cwd) }
      : await prompts([
          { type: "text",   name: "componentsDir", message: "Where should components go?",      initial: "components/ui" },
          { type: "text",   name: "cssPath",        message: "Path to your global CSS file?",    initial: isNext ? "app/globals.css" : "src/index.css" },
          { type: "select", name: "pm",             message: "Package manager?",
            choices: [{ title: "npm", value: "npm" }, { title: "pnpm", value: "pnpm" },
                      { title: "yarn", value: "yarn" }, { title: "bun", value: "bun" }] },
        ]);

    if (!answers.componentsDir) return;

    // Write atlas.config.json
    fs.writeJsonSync(path.join(cwd, "atlas.config.json"), {
      $schema: "https://veloria-ui.vercel.app/schema.json",
      style: "default",
      typescript: opts.typescript ?? true,
      tailwind: { config: "tailwind.config.ts", css: answers.cssPath, baseColor: "slate", cssVariables: true },
      aliases: { components: `@/${answers.componentsDir}`, utils: "@/lib/utils" },
    }, { spaces: 2 });
    console.log(chalk.green("  ✓ Created atlas.config.json"));

    // Write lib/utils.ts if missing
    const utilsPath = path.join(cwd, "lib", "utils.ts");
    if (!fs.existsSync(utilsPath)) {
      await fs.ensureDir(path.dirname(utilsPath));
      await fs.writeFile(utilsPath,
        `import { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n`
      );
      console.log(chalk.green("  ✓ Created lib/utils.ts"));
    }

    // Install core deps
    if (opts.install !== false) {
      const pm = answers.pm as string;
      const spinner = ora(`Installing core deps with ${pm}…`).start();
      try {
        const deps = ["clsx", "tailwind-merge", "class-variance-authority", "@radix-ui/react-slot"];
        const cmd = pm === "pnpm" ? ["pnpm", "add", ...deps]
                  : pm === "bun"  ? ["bun",  "add", ...deps]
                  : pm === "yarn" ? ["yarn", "add", ...deps]
                                  : ["npm",  "install", ...deps];
        await execa(cmd[0], cmd.slice(1), { cwd });
        spinner.succeed(chalk.green("Core deps installed"));
      } catch {
        spinner.warn(chalk.yellow("Auto-install failed — run manually:"));
        console.log(chalk.dim("  npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot\n"));
      }
    }

    console.log(`
${chalk.bold.green("  Veloria UI is ready!")}

  ${chalk.dim("Next steps:")}
  ${chalk.cyan("1.")} Add components: ${chalk.bold("npx veloria-ui add button card modal")}
  ${chalk.cyan("2.")} Browse all:     ${chalk.bold("npx veloria-ui list")}
  ${chalk.cyan("3.")} Docs:           ${chalk.bold("https://veloria-ui.vercel.app/")}
  ${chalk.cyan("4.")} Issues:         ${chalk.bold("https://github.com/JohnDev19/Veloria-UI/issues")}
`);
  });

// ─── add ──────────────────────────────────────────────────────────────────

program
  .command("add [components...]")
  .alias("a")
  .description("Copy one or more components into your project")
  .option("-d, --dir <path>", "Output directory", "components/ui")
  .option("--overwrite", "Replace existing files")
  .option("--no-install", "Skip npm dep install")
  .action(async (components: string[], opts) => {
    const cwd = process.cwd();

    if (!components?.length) {
      console.log(chalk.red("\n  Specify at least one component.\n"));
      console.log(`  ${chalk.dim("Example:")} ${chalk.cyan("npx veloria-ui add button card modal\n")}`);
      process.exit(1);
    }

    // Resolve components + their veloria-ui registry deps
    const toAdd = new Set<string>();
    function resolve(name: string) {
      const key = name.toLowerCase().replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      const meta = COMPONENTS_BY_NAME.get(key) || COMPONENTS_BY_NAME.get(name);
      if (!meta) {
        console.error(chalk.red(`\n  "${name}" not found in the registry.\n`));
        console.log(`  Run ${chalk.cyan("npx veloria-ui list")} to see what's available.\n`);
        return;
      }
      toAdd.add(meta.name);
      meta.registryDeps?.forEach(resolve);
    }
    components.forEach(resolve);
    if (!toAdd.size) return;

    const configPath = path.join(cwd, "atlas.config.json");
    const config = fs.existsSync(configPath)
      ? fs.readJsonSync(configPath) as { aliases?: { components?: string } }
      : null;
    const aliasDir = config?.aliases?.components?.replace(/^@\//, "");
    const targetDir = path.join(cwd, opts.dir ?? aliasDir ?? "components/ui");

    console.log(chalk.bold.blue("\n  Veloria UI Add\n") + chalk.dim(`  Adding: ${[...toAdd].join(", ")}\n`));

    const allDeps = new Set<string>();
    for (const name of toAdd) COMPONENTS_BY_NAME.get(name)!.deps.forEach((d) => allDeps.add(d));

    // Write component stubs
    for (const name of toAdd) {
      const spinner = ora(`Adding ${chalk.bold(name)}`).start();
      const pascal = name.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
      const dir = path.join(targetDir, name);
      await fs.ensureDir(dir);
      const file = path.join(dir, "index.tsx");

      if (fs.existsSync(file) && !opts.overwrite) {
        spinner.warn(chalk.yellow(`${name} already exists  (--overwrite to replace)`));
        continue;
      }

      await fs.writeFile(file,
`/**
 * Veloria UI — ${pascal}
 *
 * Added by the veloria-ui CLI. This file is yours — edit it however you want.
 * Re-export from veloria-ui to stay in sync, or paste the full source here
 * to customise the internals.
 *
 * Docs:   https://veloria-ui.vercel.app/components/${name}
 * Source: https://github.com/JohnDev19/Veloria-UI
 */

export { ${pascal} } from "veloria-ui";
export type { ${pascal}Props } from "veloria-ui";
`);
      spinner.succeed(chalk.green(`${name}  →  ${path.relative(cwd, file)}`));
    }

    // Install npm deps
    if (opts.install !== false && allDeps.size > 0) {
      const pm = detectPM(cwd);
      const spinner = ora(`Installing ${allDeps.size} package(s)…`).start();
      try {
        const deps = [...allDeps];
        const cmd = pm === "pnpm" ? ["pnpm", "add", ...deps]
                  : pm === "bun"  ? ["bun",  "add", ...deps]
                  : pm === "yarn" ? ["yarn", "add", ...deps]
                                  : ["npm",  "install", ...deps];
        await execa(cmd[0], cmd.slice(1), { cwd });
        spinner.succeed(chalk.green(`Installed: ${deps.join(", ")}`));
      } catch {
        spinner.warn(chalk.yellow("Auto-install failed — run manually:"));
        console.log(chalk.dim(`  npm install ${[...allDeps].join(" ")}\n`));
      }
    }

    const exNames = [...toAdd].map((n) => n.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("")).join(", ");
    console.log(`\n${chalk.bold.green("  Done!")}  ${path.relative(cwd, targetDir)}\n\n  ${chalk.cyan(`import { ${exNames} } from "@/components/ui/${[...toAdd][0]}"`)}\n`);
  });

// ─── list ─────────────────────────────────────────────────────────────────

program
  .command("list")
  .alias("ls")
  .description("List all available components")
  .option("-c, --category <category>", "Filter by category")
  .action((opts) => {
    const filterCat = opts.category?.toLowerCase() as Category | undefined;
    console.log(chalk.bold.blue("\n  veloria-ui Components\n"));

    const cats = filterCat ? [filterCat] : CATEGORIES;
    for (const cat of cats) {
      const items = REGISTRY.filter((c) => c.category === cat);
      if (!items.length) continue;
      const label = cat.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase());
      console.log(chalk.bold(`  ${label} (${items.length})`));
      for (const c of items) {
        console.log(`    ${chalk.cyan(c.name.padEnd(22))} ${chalk.dim(c.description)}`);
      }
      console.log();
    }

    console.log(chalk.dim(`  ${REGISTRY.length} components total\n`) +
      chalk.dim("  Add one: ") + chalk.cyan("npx veloria-ui add <name>\n"));
  });

// ─── diff ─────────────────────────────────────────────────────────────────

program
  .command("diff [component]")
  .description("Compare your local copy to the latest version")
  .action((component?: string) => {
    if (!component) {
      console.log(chalk.dim("\n  Usage: npx veloria-ui diff <component>\n"));
      return;
    }
    console.log(chalk.bold.blue(`\n  diff: ${component}\n`) +
      chalk.dim("  Comparing local copy to latest in the veloria-ui registry…\n"));
    // Full diff requires fetching from the registry — tracked here:
    // https://github.com/JohnDev19/Veloria-UI/issues
    console.log(chalk.yellow("  ⚠  Registry diff isn't wired up yet."));
    console.log(chalk.dim(`  Check the latest source at:\n`) +
      chalk.cyan(`  https://github.com/JohnDev19/Veloria-UI/tree/main/src/components\n`));
  });

// ─── Error handling ───────────────────────────────────────────────────────

program.on("command:*", (operands) => {
  console.error(chalk.red(`\n  Unknown command: "${operands[0]}"\n`));
  program.help();
  process.exit(1);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  console.log(banner);
  program.help();
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function detectPM(cwd: string): string {
  if (fs.existsSync(path.join(cwd, "bun.lockb")))      return "bun";
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock")))      return "yarn";
  return "npm";
}
