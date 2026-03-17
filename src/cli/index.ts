#!/usr/bin/env node

/**
 * veloria-ui CLI
 *
 * Copies Veloria UI components into your project so you own the code.
 *
 * By JohnDev19 — https://github.com/JohnDev19/Veloria-UI
 * Docs: https://ui-veloria.vercel.app/
 *
 * Commands:
 *   veloria-ui init                    — project setup wizard
 *   veloria-ui add button card modal   — copy components into your project
 *   veloria-ui list                    — browse all components
 *   veloria-ui list --category forms   — filter by category
 *   veloria-ui diff button             — compare local vs latest upstream
 *   veloria-ui diff button --json      — machine-readable diff output
 *   veloria-ui upgrade                 — check all added components for upstream changes
 *   veloria-ui upgrade button          — upgrade a specific component
 *   veloria-ui upgrade --all           — upgrade every outdated component non-interactively
 */

import path from "path";
import crypto from "crypto";
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
${chalk.bold.blue("  ╦  ╦╔═╗╦  ╔═╗╦═╗╦╔═╗")}
${chalk.bold.blue("  ╚╗╔╝║╣ ║  ║ ║╠╦╝║╠═╣")}
${chalk.bold.blue("   ╚╝ ╚═╝╩═╝╚═╝╩╚═╩╩ ╩")}
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

    // Write veloria.config.json
    fs.writeJsonSync(path.join(cwd, "veloria.config.json"), {
      $schema: "https://ui-veloria.vercel.app/schema.json",
      style: "default",
      typescript: opts.typescript ?? true,
      tailwind: { config: "tailwind.config.ts", css: answers.cssPath, baseColor: "slate", cssVariables: true },
      aliases: { components: `@/${answers.componentsDir}`, utils: "@/lib/utils" },
    }, { spaces: 2 });
    console.log(chalk.green("  ✓ Created veloria.config.json"));

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
  ${chalk.cyan("npx veloria-ui add button")}   ${chalk.dim("— copy your first component")}
  ${chalk.cyan("npx veloria-ui list")}          ${chalk.dim("— browse all components")}
`);
  });

// ─── add ──────────────────────────────────────────────────────────────────

program
  .command("add [components...]")
  .description("Add components to your project")
  .option("-y, --yes",        "Skip confirmation prompts")
  .option("--no-install",     "Skip npm/pnpm/yarn install")
  .option("-p, --path <dir>", "Override components directory")
  .option("--force",          "Overwrite existing local files")
  .action(async (names: string[], opts) => {
    const cwd      = process.cwd();
    const cfgPath  = path.join(cwd, "veloria.config.json");
    const cfg      = fs.existsSync(cfgPath) ? (fs.readJsonSync(cfgPath) as { aliases?: { components?: string } }) : {};
    const baseDir  = opts.path
      ?? cfg.aliases?.components?.replace(/^@\//, "")
      ?? "components/ui";
    const targetDir = path.join(cwd, baseDir);

    if (!names.length) {
      console.log(chalk.dim("\n  Usage: npx veloria-ui add <component> [component…]\n"));
      return;
    }

    const unknown = names.filter((n) => !COMPONENTS_BY_NAME[n]);
    if (unknown.length) {
      console.error(chalk.red(`\n  Unknown component(s): ${unknown.join(", ")}\n`));
      console.log(chalk.dim("  Run ") + chalk.cyan("npx veloria-ui list") + chalk.dim(" to see all available components.\n"));
      process.exit(1);
    }

    const toAdd = new Set<string>(names);
    for (const n of names) {
      const c = COMPONENTS_BY_NAME[n];
      (c.registryDeps ?? []).forEach((d) => toAdd.add(d));
    }

    const allDeps = new Set<string>();
    for (const n of toAdd) {
      const c = COMPONENTS_BY_NAME[n];
      c.deps.forEach((d) => allDeps.add(d));
    }

    console.log(chalk.bold.blue(`\n  Adding ${[...toAdd].join(", ")}\n`));
    if (allDeps.size) {
      console.log(chalk.dim(`  Peer deps: ${[...allDeps].join(", ")}\n`));
    }

    if (!opts.yes) {
      const { ok } = await prompts({
        type: "confirm", name: "ok",
        message: `Copy to ${path.relative(cwd, targetDir)}?`, initial: true,
      });
      if (!ok) return;
    }

    await fs.ensureDir(targetDir);

    // Fetch upstream source and record hash in veloria.lock.json
    const lock = readLock(cwd);

    for (const name of toAdd) {
      const dest = path.join(targetDir, name, "index.tsx");

      if (fs.existsSync(dest) && !opts.force) {
        console.log(chalk.dim(`  skip  ${name} (already exists — use --force to overwrite)`));
        continue;
      }

      // Try to fetch real upstream source; fall back to stub
      const urls = resolveGitHubPaths(name);
      let src: string | null = null;
      let sourceUrl = "";
      for (const url of urls) {
        src = await fetchText(url);
        if (src !== null) { sourceUrl = url; break; }
      }

      await fs.ensureDir(path.dirname(dest));

      if (src) {
        await fs.writeFile(dest, src, "utf-8");
        // Record the upstream hash at install time
        lock[name] = {
          upstreamHash: sha256(src),
          upstreamUrl:  sourceUrl,
          localPath:    path.relative(cwd, dest),
          addedAt:      new Date().toISOString(),
        };
      } else {
        // Offline / path not found — write a stub and note it has no hash
        const stub =
          `// veloria-ui — ${name}\n` +
          `// Added by veloria-ui CLI. Edit freely — you own this code.\n` +
          `// Source: https://github.com/JohnDev19/Veloria-UI/tree/main/src/components\n` +
          `export * from "veloria-ui";\n`;
        await fs.writeFile(dest, stub, "utf-8");
        lock[name] = {
          upstreamHash: null,
          upstreamUrl:  null,
          localPath:    path.relative(cwd, dest),
          addedAt:      new Date().toISOString(),
        };
      }

      console.log(chalk.green(`  ✓ ${name}`));
    }

    writeLock(cwd, lock);

    if (opts.install !== false && allDeps.size) {
      const pm  = detectPM(cwd);
      const spinner = ora(`Installing peer deps with ${pm}…`).start();
      try {
        const deps = [...allDeps];
        const cmd  = pm === "pnpm" ? ["pnpm", "add", ...deps]
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
      chalk.dim("  Add one: ") + chalk.cyan("npx veloria-ui add <n>\n"));
  });

// ─── diff ─────────────────────────────────────────────────────────────────

program
  .command("diff [component]")
  .description("Compare your local copy to the latest upstream version")
  .option("--json",           "Output raw JSON instead of coloured terminal diff")
  .option("-c, --context <n>","Lines of context around each change (default: 3)")
  .action(async (component: string | undefined, opts) => {
    if (!component) {
      console.log(
        chalk.bold.blue("\n  veloria-ui diff\n") +
        chalk.dim("  Usage: npx veloria-ui diff <component>\n\n") +
        chalk.dim("  Examples:\n") +
        `    ${chalk.cyan("npx veloria-ui diff button")}\n` +
        `    ${chalk.cyan("npx veloria-ui diff modal --context 5")}\n` +
        `    ${chalk.cyan("npx veloria-ui diff input --json")}\n`
      );
      return;
    }

    if (!COMPONENTS_BY_NAME[component]) {
      console.error(
        chalk.red(`\n  Unknown component: "${component}"\n`) +
        chalk.dim("  Run ") + chalk.cyan("npx veloria-ui list") + chalk.dim(" to see all components.\n")
      );
      process.exit(1);
    }

    const cwd     = process.cwd();
    const context = parseInt(opts.context ?? "3", 10);
    const spinner = ora(`  Fetching upstream source for ${chalk.cyan(component)}…`).start();

    const urls = resolveGitHubPaths(component);
    let upstreamSrc: string | null = null;
    let successUrl = "";
    for (const url of urls) {
      upstreamSrc = await fetchText(url);
      if (upstreamSrc !== null) { successUrl = url; break; }
    }

    if (upstreamSrc === null) {
      spinner.fail(chalk.red("  Could not fetch upstream source."));
      console.log(
        chalk.dim("\n  Checked:\n") +
        urls.map((u) => chalk.dim(`    ${u}`)).join("\n") +
        "\n\n" +
        chalk.dim("  You may be offline, or this component lives in a non-standard path.\n") +
        chalk.dim("  View manually: ") +
        chalk.cyan(`https://github.com/JohnDev19/Veloria-UI/tree/main/src/components\n`)
      );
      process.exit(1);
    }

    spinner.text = `  Locating local copy of ${chalk.cyan(component)}…`;

    const localPath = resolveLocalPath(component, cwd);
    if (!localPath) {
      spinner.warn(chalk.yellow(`  No local copy of "${component}" found.`));
      console.log(
        chalk.dim("\n  Add it first:\n") +
        `    ${chalk.cyan(`npx veloria-ui add ${component}`)}\n`
      );
      process.exit(0);
    }

    spinner.succeed(chalk.dim(`  Found local copy at ${path.relative(cwd, localPath)}`));

    const localLines    = fs.readFileSync(localPath, "utf-8").split("\n");
    const upstreamLines = upstreamSrc.split("\n");
    const diff          = computeDiff(localLines, upstreamLines);

    if (opts.json) {
      const added   = diff.filter((d) => d.type === "added").length;
      const removed = diff.filter((d) => d.type === "removed").length;
      console.log(JSON.stringify({
        component,
        localPath,
        upstreamUrl: successUrl,
        summary: { added, removed, changed: added + removed },
        diff: diff.map((d) => ({ type: d.type, lineNo: d.lineNo, content: d.content })),
      }, null, 2));
      return;
    }

    renderDiff(diff, component, path.relative(cwd, localPath), successUrl, context);
  });

// ─── upgrade ──────────────────────────────────────────────────────────────

/**
 * How upgrade detects staleness:
 *
 * Each component has three possible states:
 *
 *   UP TO DATE    — upstream hash === hash recorded at install time
 *                   (upstream hasn't changed since you ran `add`)
 *
 *   UPSTREAM CHANGED  — upstream hash !== recorded install hash
 *                       but your local file hash === recorded install hash
 *                       → upstream has new changes, your file is unmodified
 *                       → safe to auto-upgrade
 *
 *   DIVERGED      — upstream hash !== recorded install hash
 *                   AND your local file hash !== recorded install hash
 *                   → both you and upstream have changed the file
 *                   → prompt with a warning before overwriting
 *
 *   NO LOCK DATA  — component was added before veloria.lock.json existed,
 *                   or was added offline (stub only). We fall back to a
 *                   pure content comparison (same as `diff`).
 */

interface UpgradeStatus {
  name:        string;
  localPath:   string;
  upstreamUrl: string;
  state:
    | "up-to-date"
    | "upstream-changed"    // upstream changed, local unmodified — safe upgrade
    | "diverged"            // both changed — warn before overwriting
    | "no-lock"             // no lock data, upstream diff exists
    | "up-to-date-no-lock"  // no lock data but content matches
    | "not-found-local"     // local file missing (deleted)
    | "fetch-failed";       // could not reach GitHub
  upstreamSrc: string | null;
  addedLines:  number;
  removedLines: number;
}

program
  .command("upgrade [component]")
  .alias("up")
  .description("Check installed components for upstream changes and prompt to upgrade")
  .option("-y, --yes",       "Skip confirmation prompts — upgrade all outdated components")
  .option("--all",           "Upgrade every outdated component without prompting")
  .option("--check",         "Only report status, make no changes (dry-run)")
  .option("--json",          "Output machine-readable JSON status report")
  .option("--force",         "Overwrite even diverged (locally modified) components")
  .action(async (component: string | undefined, opts) => {
    const cwd = process.cwd();

    // ── 1. Resolve which components to check ──────────────────────────
    let targets: string[] = [];

    if (component) {
      // Single component specified
      if (!COMPONENTS_BY_NAME[component]) {
        console.error(
          chalk.red(`\n  Unknown component: "${component}"\n`) +
          chalk.dim("  Run ") + chalk.cyan("npx veloria-ui list") + chalk.dim(" to see all components.\n")
        );
        process.exit(1);
      }
      targets = [component];
    } else {
      // Auto-discover: scan the components directory and cross-reference with the registry
      targets = discoverInstalledComponents(cwd);

      if (!targets.length) {
        console.log(
          chalk.bold.blue("\n  veloria-ui upgrade\n") +
          chalk.dim("  No components found in your project.\n\n") +
          chalk.dim("  Add some first:\n") +
          `    ${chalk.cyan("npx veloria-ui add button card modal")}\n`
        );
        return;
      }
    }

    console.log(
      chalk.bold.blue("\n  veloria-ui upgrade\n") +
      chalk.dim(`  Checking ${targets.length} component${targets.length !== 1 ? "s" : ""} against upstream…\n`)
    );

    // ── 2. Check each component ────────────────────────────────────────
    const lock     = readLock(cwd);
    const statuses: UpgradeStatus[] = [];

    for (const name of targets) {
      const spinner = ora(`  ${name.padEnd(24)} checking…`).start();

      const localPath = resolveLocalPath(name, cwd);
      if (!localPath) {
        spinner.warn(chalk.dim(`  ${name.padEnd(24)} ${chalk.yellow("local file missing")}`));
        statuses.push({
          name, localPath: "", upstreamUrl: "", state: "not-found-local",
          upstreamSrc: null, addedLines: 0, removedLines: 0,
        });
        continue;
      }

      // Fetch upstream
      const urls = resolveGitHubPaths(name);
      let upstreamSrc: string | null = null;
      let upstreamUrl = "";
      for (const url of urls) {
        upstreamSrc = await fetchText(url);
        if (upstreamSrc !== null) { upstreamUrl = url; break; }
      }

      if (upstreamSrc === null) {
        spinner.warn(chalk.dim(`  ${name.padEnd(24)} ${chalk.yellow("fetch failed")}`));
        statuses.push({
          name, localPath, upstreamUrl: urls[0] ?? "", state: "fetch-failed",
          upstreamSrc: null, addedLines: 0, removedLines: 0,
        });
        continue;
      }

      const localSrc      = fs.readFileSync(localPath, "utf-8");
      const upstreamHash  = sha256(upstreamSrc);
      const localHash     = sha256(localSrc);
      const lockEntry     = lock[name];

      // Count diff lines for summary display
      const diffLines  = computeDiff(localSrc.split("\n"), upstreamSrc.split("\n"));
      const addedLines = diffLines.filter((d) => d.type === "added").length;
      const removedLines = diffLines.filter((d) => d.type === "removed").length;

      let state: UpgradeStatus["state"];

      if (lockEntry?.upstreamHash) {
        const recordedUpstreamHash = lockEntry.upstreamHash;
        const recordedLocalHash    = lockEntry.localHash ?? recordedUpstreamHash;

        if (upstreamHash === recordedUpstreamHash) {
          // Upstream hasn't changed since install — up to date
          state = "up-to-date";
        } else if (localHash === recordedLocalHash) {
          // Upstream changed, but local is unmodified — safe to upgrade
          state = "upstream-changed";
        } else {
          // Both changed
          state = "diverged";
        }
      } else {
        // No lock data — fall back to content comparison
        state = (upstreamHash === localHash) ? "up-to-date-no-lock" : "no-lock";
      }

      // Render inline status badge
      const badge =
        state === "up-to-date"          ? chalk.green("✓ up to date") :
        state === "up-to-date-no-lock"  ? chalk.green("✓ up to date") :
        state === "upstream-changed"    ? chalk.yellow(`↑ ${addedLines}+ ${removedLines}- upstream`) :
        state === "diverged"            ? chalk.red(`⚡ diverged  ${addedLines}+ ${removedLines}-`) :
        state === "no-lock"             ? chalk.yellow(`~ ${addedLines}+ ${removedLines}- (no lock)`) :
                                          chalk.dim("? unknown");

      spinner.succeed(`  ${chalk.cyan(name.padEnd(24))} ${badge}`);

      statuses.push({ name, localPath, upstreamUrl, state, upstreamSrc, addedLines, removedLines });
    }

    console.log();

    // ── 3. JSON mode — just print and exit ────────────────────────────
    if (opts.json) {
      console.log(JSON.stringify(
        statuses.map(({ upstreamSrc: _, ...s }) => s), // omit full source from JSON
        null, 2
      ));
      return;
    }

    // ── 4. Check mode — summary only, no changes ──────────────────────
    const outdated = statuses.filter((s) =>
      s.state === "upstream-changed" || s.state === "diverged" || s.state === "no-lock"
    );
    const upToDate  = statuses.filter((s) =>
      s.state === "up-to-date" || s.state === "up-to-date-no-lock"
    );
    const problems  = statuses.filter((s) =>
      s.state === "not-found-local" || s.state === "fetch-failed"
    );

    // Summary line
    console.log(
      chalk.dim(`  ${upToDate.length} up to date`) +
      (outdated.length ? `  ${chalk.yellow(`${outdated.length} outdated`)}` : "") +
      (problems.length ? `  ${chalk.red(`${problems.length} errors`)}` : "") +
      "\n"
    );

    if (opts.check) {
      if (outdated.length) {
        console.log(chalk.dim("  Run ") + chalk.cyan("npx veloria-ui upgrade") + chalk.dim(" to apply updates.\n"));
      }
      return;
    }

    if (!outdated.length) {
      console.log(chalk.green("  All components are up to date.\n"));
      return;
    }

    // ── 5. Decide what to upgrade ─────────────────────────────────────
    let toUpgrade: UpgradeStatus[];

    if (opts.all || opts.yes) {
      // Upgrade all outdated (skip diverged unless --force)
      toUpgrade = outdated.filter((s) => s.state !== "diverged" || opts.force);
      const skipped = outdated.filter((s) => s.state === "diverged" && !opts.force);
      if (skipped.length) {
        console.log(chalk.yellow(`  Skipping ${skipped.length} diverged component(s) — pass --force to overwrite:\n`) +
          skipped.map((s) => `    ${chalk.cyan(s.name)}`).join("\n") + "\n"
        );
      }
    } else {
      // Interactive: prompt per component
      toUpgrade = [];

      for (const s of outdated) {
        const isDiverged = s.state === "diverged";

        // Show a mini diff summary first
        console.log(
          chalk.bold(`  ${chalk.cyan(s.name)}\n`) +
          chalk.dim(`  ${s.localPath}  →  upstream\n`) +
          (isDiverged
            ? chalk.red("  ⚡ Warning: you have local edits AND upstream changed. Upgrading will overwrite your changes.\n") +
              chalk.dim("     Consider running ") + chalk.cyan(`npx veloria-ui diff ${s.name}`) + chalk.dim(" first.\n")
            : ""
          ) +
          chalk.green(`  +${s.addedLines}`) + "  " + chalk.red(`-${s.removedLines}`) + "\n"
        );

        const { action } = await prompts({
          type:    "select",
          name:    "action",
          message: `Upgrade ${s.name}?`,
          choices: [
            { title: `${chalk.green("Yes")}  — overwrite with upstream`,                     value: "yes" },
            { title: `${chalk.cyan("Diff")} — show full diff first, then decide`,            value: "diff" },
            { title: `${chalk.dim("Skip")} — leave my local copy unchanged`,                 value: "skip" },
          ],
        });

        if (action === "skip" || action === undefined) {
          console.log(chalk.dim(`  Skipped ${s.name}\n`));
          continue;
        }

        if (action === "diff") {
          // Show full diff inline, then re-prompt
          if (s.upstreamSrc) {
            const localSrc  = fs.readFileSync(s.localPath, "utf-8");
            const diff      = computeDiff(localSrc.split("\n"), s.upstreamSrc.split("\n"));
            renderDiff(diff, s.name, s.localPath, s.upstreamUrl, 3);
          }

          const { confirmed } = await prompts({
            type:    "confirm",
            name:    "confirmed",
            message: `Apply upstream changes to ${s.name}?`,
            initial: false,
          });

          if (!confirmed) {
            console.log(chalk.dim(`  Skipped ${s.name}\n`));
            continue;
          }
        }

        toUpgrade.push(s);
      }
    }

    if (!toUpgrade.length) {
      console.log(chalk.dim("  No components upgraded.\n"));
      return;
    }

    // ── 6. Apply upgrades ─────────────────────────────────────────────
    console.log();
    const updatedLock = readLock(cwd);
    let upgraded = 0;

    for (const s of toUpgrade) {
      if (!s.upstreamSrc) continue;

      const spinner = ora(`  Upgrading ${chalk.cyan(s.name)}…`).start();

      try {
        await fs.ensureDir(path.dirname(s.localPath));
        await fs.writeFile(s.localPath, s.upstreamSrc, "utf-8");

        // Update lock: record new upstream hash and current local hash (they match after upgrade)
        const newHash = sha256(s.upstreamSrc);
        updatedLock[s.name] = {
          upstreamHash: newHash,
          localHash:    newHash,
          upstreamUrl:  s.upstreamUrl,
          localPath:    s.localPath,
          addedAt:      updatedLock[s.name]?.addedAt ?? new Date().toISOString(),
          upgradedAt:   new Date().toISOString(),
        };

        spinner.succeed(chalk.green(`  ✓ ${s.name}  upgraded`));
        upgraded++;
      } catch (err) {
        spinner.fail(chalk.red(`  ✗ ${s.name}  failed to write`));
        console.error(chalk.dim(`    ${String(err)}`));
      }
    }

    writeLock(cwd, updatedLock);

    console.log(
      `\n${chalk.bold.green(`  Done!`)}  ${upgraded} component${upgraded !== 1 ? "s" : ""} upgraded.\n` +
      chalk.dim("  veloria.lock.json updated — commit it to track upgrade history.\n")
    );
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

// ═══════════════════════════════════════════════════════════════════════════
// Shared helpers
// ═══════════════════════════════════════════════════════════════════════════

// ─── Lock file ────────────────────────────────────────────────────────────

/**
 * veloria.lock.json tracks the upstream content hash at the time each
 * component was `add`-ed. This lets `upgrade` distinguish three cases:
 *
 *   1. Upstream unchanged          — upstreamHash still matches
 *   2. Upstream changed, local not — safe auto-upgrade
 *   3. Both changed (diverged)     — warn before overwriting
 */
export interface LockEntry {
  upstreamHash: string | null; // SHA-256 of upstream source at add time
  localHash?:   string | null; // SHA-256 of local file at add time (same as upstream unless edited)
  upstreamUrl:  string | null;
  localPath:    string;
  addedAt:      string;
  upgradedAt?:  string;
}

export type LockFile = Record<string, LockEntry>;

const LOCK_FILE = "veloria.lock.json";

function readLock(cwd: string): LockFile {
  const p = path.join(cwd, LOCK_FILE);
  return fs.existsSync(p) ? (fs.readJsonSync(p) as LockFile) : {};
}

function writeLock(cwd: string, lock: LockFile): void {
  fs.writeJsonSync(path.join(cwd, LOCK_FILE), lock, { spaces: 2 });
}

// ─── Hashing ──────────────────────────────────────────────────────────────

function sha256(content: string): string {
  return crypto.createHash("sha256").update(content, "utf-8").digest("hex");
}

// ─── Component discovery ──────────────────────────────────────────────────

/**
 * Scans the components directory (from veloria.config.json or default) and
 * returns names of any sub-folders that match a registered component name.
 * Also cross-references veloria.lock.json so components added before
 * directory scanning is possible are not missed.
 */
function discoverInstalledComponents(cwd: string): string[] {
  const cfgPath = path.join(cwd, "veloria.config.json");
  const cfg     = fs.existsSync(cfgPath)
    ? (fs.readJsonSync(cfgPath) as { aliases?: { components?: string } })
    : {};
  const baseDir    = cfg.aliases?.components?.replace(/^@\//, "") ?? "components/ui";
  const targetDir  = path.join(cwd, baseDir);
  const registryNames = new Set(REGISTRY.map((c) => c.name));
  const found = new Set<string>();

  // scan directory for sub-folders whose name matches a registry entry
  if (fs.existsSync(targetDir)) {
    try {
      const entries = fs.readdirSync(targetDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && registryNames.has(entry.name)) {
          found.add(entry.name);
        }
      }
    } catch {
      // non-fatal — fall through to lock file discovery
    }
  }

  // include anything tracked in the lock file but not in the scanned folder
  // (like components placed in a non-standard sub-path)
  const lock = readLock(cwd);
  for (const name of Object.keys(lock)) {
    if (registryNames.has(name)) found.add(name);
  }

  return [...found].sort();
}

// ─── GitHub path resolution ───────────────────────────────────────────────

function resolveGitHubPaths(name: string): string[] {
  const entry = COMPONENTS_BY_NAME[name];
  if (!entry) return [];

  const categoryFolder: Record<string, string> = {
    "basic":          "basic",
    "layout":         "layout",
    "navigation":     "navigation",
    "forms":          "forms",
    "advanced-forms": "advanced-forms",
    "data-display":   "data-display",
    "feedback":       "feedback",
    "overlay":        "overlay",
    "media":          "media",
    "utility":        "utility",
  };

  const folder = categoryFolder[entry.category] ?? entry.category;
  const pascal = name
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");

  const base =
    `https://raw.githubusercontent.com/JohnDev19/Veloria-UI/main/src/components/${folder}`;

  return [
    `${base}/${pascal}.tsx`,
    `${base}/index.tsx`,
  ];
}

// ─── HTTP fetch ───────────────────────────────────────────────────────────

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

// ─── Local path resolution ────────────────────────────────────────────────

function resolveLocalPath(name: string, cwd: string): string | null {
  // check veloria.lock.json for the recorded path
  const lock = readLock(cwd);
  if (lock[name]?.localPath) {
    const lockPath = path.join(cwd, lock[name].localPath);
    if (fs.existsSync(lockPath)) return lockPath;
  }

  const cfgPath = path.join(cwd, "veloria.config.json");
  const baseDir = fs.existsSync(cfgPath)
    ? ((fs.readJsonSync(cfgPath) as { aliases?: { components?: string } })
        .aliases?.components?.replace(/^@\//, "") ?? "components/ui")
    : "components/ui";

  const pascal = name
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");

  const candidates = [
    path.join(cwd, baseDir, name, "index.tsx"),
    path.join(cwd, baseDir, name, `${pascal}.tsx`),
    path.join(cwd, baseDir, `${pascal}.tsx`),
    path.join(cwd, baseDir, `${name}.tsx`),
  ];

  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

// ─── Myers diff ───────────────────────────────────────────────────────────

interface DiffLine {
  type: "equal" | "added" | "removed";
  lineNo: { local?: number; upstream?: number };
  content: string;
}

function computeDiff(localLines: string[], upstreamLines: string[]): DiffLine[] {
  const m = localLines.length;
  const n = upstreamLines.length;

  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (localLines[i - 1] === upstreamLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = m, j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && localLines[i - 1] === upstreamLines[j - 1]) {
      result.unshift({ type: "equal", lineNo: { local: i, upstream: j }, content: localLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] <= dp[i - 1][j])) {
      result.unshift({ type: "added", lineNo: { upstream: j }, content: upstreamLines[j - 1] });
      j--;
    } else {
      result.unshift({ type: "removed", lineNo: { local: i }, content: localLines[i - 1] });
      i--;
    }
  }

  return result;
}

// ─── Terminal diff renderer ───────────────────────────────────────────────

function renderDiff(
  diff: DiffLine[],
  componentName: string,
  localPath: string,
  upstreamUrl: string,
  context = 3,
): void {
  const changedIndexes = diff
    .map((d, idx) => (d.type !== "equal" ? idx : -1))
    .filter((i) => i !== -1);

  if (changedIndexes.length === 0) {
    console.log(chalk.green(`\n  ✓ ${componentName} is up to date — no differences found.\n`));
    return;
  }

  const added   = diff.filter((d) => d.type === "added").length;
  const removed = diff.filter((d) => d.type === "removed").length;

  console.log(
    chalk.bold(`\n  diff  ${chalk.cyan(componentName)}\n`) +
    chalk.dim(`  local     ${localPath}\n`) +
    chalk.dim(`  upstream  ${upstreamUrl}\n`)
  );

  console.log(
    chalk.green(`  +${added} addition${added !== 1 ? "s" : ""}`) +
    "  " +
    chalk.red(`  -${removed} deletion${removed !== 1 ? "s" : ""}`) +
    "\n"
  );

  const visible = new Set<number>();
  for (const idx of changedIndexes) {
    for (let k = Math.max(0, idx - context); k <= Math.min(diff.length - 1, idx + context); k++) {
      visible.add(k);
    }
  }

  let prevVisible = false;
  for (let idx = 0; idx < diff.length; idx++) {
    if (!visible.has(idx)) {
      if (prevVisible) console.log(chalk.dim("  ···"));
      prevVisible = false;
      continue;
    }
    prevVisible = true;

    const line    = diff[idx];
    const lineNum = (line.lineNo.local ?? line.lineNo.upstream ?? 0).toString().padStart(4);

    if (line.type === "added") {
      console.log(chalk.green(`${lineNum}  + ${line.content}`));
    } else if (line.type === "removed") {
      console.log(chalk.red(`${lineNum}  - ${line.content}`));
    } else {
      console.log(chalk.dim(`${lineNum}    ${line.content}`));
    }
  }

  console.log();
  console.log(
    chalk.dim("  To update your local copy, run: ") +
    chalk.cyan(`npx veloria-ui upgrade ${componentName}`) +
    "\n"
  );
}

// ─── Package manager detection ────────────────────────────────────────────

function detectPM(cwd: string): string {
  if (fs.existsSync(path.join(cwd, "bun.lockb")))      return "bun";
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock")))      return "yarn";
  return "npm";
}
