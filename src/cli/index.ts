#!/usr/bin/env node

/**
 * veloria-ui CLI — v0.1.3
 *
 * Commands:
 *   veloria-ui init                    — project setup wizard
 *   veloria-ui add button card modal   — copy components into your project
 *   veloria-ui list                    — browse all components
 *   veloria-ui list --category forms   — filter by category
 *   veloria-ui list --classic          — show components with classic variant
 *   veloria-ui status                  — show library stats
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
import { getLibraryStats } from "../api";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PKG_VERSION: string = (require("../../package.json") as { version: string }).version;

const banner = `
${chalk.bold.blue("  ╦  ╦╔═╗╦  ╔═╗╦═╗╦╔═╗")}
${chalk.bold.blue("  ╚╗╔╝║╣ ║  ║ ║╠╦╝║╠═╣")}
${chalk.bold.blue("   ╚╝ ╚═╝╩═╝╚═╝╩╚═╩╩ ╩")}
  ${chalk.dim("Build anything. Ship faster.")}
  ${chalk.dim("by JohnDev19  ·  veloria-ui.vercel.app")}
`;

const program = new Command();

program
  .name("veloria-ui")
  .description("veloria-ui CLI — copy components into your project")
  .version(PKG_VERSION, "-v, --version")
  .addHelpText("before", banner);

// init
program.command("init").description("Set up veloria-ui in your project")
  .option("-y, --yes", "Skip all prompts, use defaults")
  .action(async (opts) => {
    console.log(chalk.bold.blue("\n  Veloria UI Init\n") + chalk.dim("  Setting up…\n"));
    const cwd = process.cwd();
    const answers = opts.yes
      ? { componentsDir: "components/ui", pm: detectPM(cwd) }
      : await prompts([
          { type: "text",   name: "componentsDir", message: "Where should components go?", initial: "components/ui" },
          { type: "select", name: "pm",             message: "Package manager?",
            choices: [{ title: "npm", value: "npm" },{ title: "pnpm", value: "pnpm" },{ title: "yarn", value: "yarn" },{ title: "bun", value: "bun" }],
            initial: ["npm","pnpm","yarn","bun"].indexOf(detectPM(cwd)) },
        ]);
    fs.ensureDirSync(path.join(cwd, answers.componentsDir));
    fs.writeJsonSync(path.join(cwd, "veloria.config.json"), { ...answers }, { spaces: 2 });
    console.log(chalk.green("\n  ✓ veloria.config.json created"));
    console.log(chalk.dim("\n  Next: npx veloria-ui add button card\n"));
  });

// add
program.command("add [components...]").description("Add components to your project")
  .option("--no-install", "Skip npm install")
  .action(async (components: string[], opts) => {
    const cwd = process.cwd();
    const cfgPath = path.join(cwd, "veloria.config.json");
    const cfg = fs.existsSync(cfgPath) ? fs.readJsonSync(cfgPath) as Record<string,string> : {};
    const targetDir = path.join(cwd, cfg.componentsDir ?? "components/ui");
    fs.ensureDirSync(targetDir);
    const toAdd = new Set<string>();
    const allDeps = new Set<string>();
    const resolve = (name: string) => {
      const meta = COMPONENTS_BY_NAME.get(name);
      if (!meta) { console.warn(chalk.yellow(`  ⚠  Unknown: "${name}"`)); return; }
      if (toAdd.has(name)) return;
      toAdd.add(name);
      meta.deps.forEach(d => allDeps.add(d));
      meta.registryDeps?.forEach(resolve);
    };
    components.forEach(resolve);
    if (!toAdd.size) return;
    for (const name of toAdd) {
      const dir = path.join(targetDir, name);
      fs.ensureDirSync(dir);
      fs.writeFileSync(path.join(dir, "index.tsx"), `// veloria-ui — ${name}\nexport * from "veloria-ui";\n`);
      console.log(chalk.green(`  ✓ ${name}`));
    }
    if (opts.install && allDeps.size) {
      const spinner = ora("Installing…").start();
      try {
        const pm = cfg.pm ?? detectPM(cwd);
        const cmd = pm === "yarn" ? ["yarn","add",...allDeps] : pm === "pnpm" ? ["pnpm","add",...allDeps] : pm === "bun" ? ["bun","add",...allDeps] : ["npm","install",...allDeps];
        await execa(cmd[0], cmd.slice(1), { cwd });
        spinner.succeed(chalk.green(`Installed: ${[...allDeps].join(", ")}`));
      } catch { spinner.warn(chalk.yellow("Auto-install failed.")); }
    }
    const exNames = [...toAdd].map(n => n.split("-").map(p => p[0].toUpperCase()+p.slice(1)).join("")).join(", ");
    console.log(`\n${chalk.bold.green("  Done!")}  ${chalk.cyan(`import { ${exNames} } from "veloria-ui"`)}\n`);
  });

// list
program.command("list").alias("ls").description("List all available components")
  .option("-c, --category <category>", "Filter by category")
  .option("--classic", "Show only classic-variant components")
  .action((opts) => {
    const filterCat = opts.category?.toLowerCase() as Category | undefined;
    console.log(chalk.bold.blue("\n  veloria-ui Components\n"));
    const cats = filterCat ? [filterCat] : CATEGORIES;
    let total = 0;
    for (const cat of cats) {
      let items = REGISTRY.filter(c => c.category === cat);
      if (opts.classic) items = items.filter(c => c.supportsClassic);
      if (!items.length) continue;
      const label = cat.replace(/-/g,"_").replace(/\b\w/g,c=>c.toUpperCase()).replace(/_/g," ");
      console.log(chalk.bold(`  ${label} (${items.length})`));
      for (const c of items) {
        const tags = [c.supportsClassic && chalk.magenta("[classic]"), c.since !== "0.1.0" && chalk.dim(`v${c.since}`)].filter(Boolean).join(" ");
        console.log(`    ${chalk.cyan(c.name.padEnd(26))}${tags}  ${chalk.dim(c.description)}`);
      }
      total += items.length;
      console.log();
    }
    console.log(chalk.dim(`  ${total} components\n`));
  });

// status
program.command("status").description("Show library metadata and counts")
  .action(() => {
    const stats = getLibraryStats();
    console.log(chalk.bold.blue(`\n  veloria-ui v${stats.version}  ${chalk.green("●")} ${stats.status}\n`));
    console.log(`  ${chalk.dim("Released:   ")} ${stats.releaseDate}`);
    console.log(`  ${chalk.dim("Components: ")} ${stats.totalComponents}`);
    console.log(`  ${chalk.dim("Hooks:      ")} ${stats.totalHooks}`);
    console.log(`  ${chalk.dim("Categories: ")} ${stats.totalCategories}`);
    console.log(`  ${chalk.dim("Variants:   ")} ${stats.variants.join(", ")}`);
    console.log(`\n  ${chalk.dim(stats.links.docs)}\n`);
  });

// diff
program.command("diff [component]").description("Compare your local copy to latest")
  .action((component?: string) => {
    if (!component) { console.log(chalk.dim("\n  Usage: npx veloria-ui diff <component>\n")); return; }
    console.log(chalk.yellow(`\n  ⚠  Registry diff not yet wired up for "${component}".`));
    console.log(chalk.dim(`  https://github.com/JohnDev19/Veloria-UI/tree/main/src/components\n`));
  });

program.on("command:*", (o) => { console.error(chalk.red(`\n  Unknown command: "${o[0]}"\n`)); program.help(); process.exit(1); });
program.parse(process.argv);
if (!process.argv.slice(2).length) { console.log(banner); program.help(); }

function detectPM(cwd: string): string {
  if (fs.existsSync(path.join(cwd,"bun.lockb")))      return "bun";
  if (fs.existsSync(path.join(cwd,"pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd,"yarn.lock")))      return "yarn";
  return "npm";
}
