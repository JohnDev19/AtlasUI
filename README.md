<div align="center">

<br/>

```
╦  ╦╔═╗╦  ╔═╗╦═╗╦╔═╗
╚╗╔╝║╣ ║  ║ ║╠╦╝║╠═╣
 ╚╝ ╚═╝╩═╝╚═╝╩╚═╩╩ ╩
```

### **Build anything. Ship faster.**

Production-ready React components — accessible, composable, dark-mode ready.
Works with Tailwind CSS and Next.js out of the box.

[![npm](https://img.shields.io/npm/v/veloria-ui?color=0ea5e9&label=veloria-ui)](https://www.npmjs.com/package/veloria-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)](https://www.typescriptlang.org)
[![GitHub](https://img.shields.io/github/stars/JohnDev19/Veloria-UI?style=social)](https://github.com/JohnDev19/Veloria-UI)

**[Docs](https://ui-veloria.vercel.app/)** · **[Components](https://ui-veloria.vercel.app/components)** · **[Issues](https://github.com/JohnDev19/Veloria-UI/issues)** · **[Changelog](CHANGELOG.md)**

</div>

---

## Install

```bash
npm install veloria-ui
# pnpm add veloria-ui
# bun add veloria-ui
```

---

## Setup

### 1. Import the stylesheet

```tsx
// app/layout.tsx
import "veloria-ui/styles";
```

### 2. Add the Tailwind plugin

```ts
// tailwind.config.ts
import { veloriaPlugin } from "veloria-ui/tailwind";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  plugins: [veloriaPlugin],
};
```

### 3. Wrap your app

```tsx
// app/layout.tsx
import { VeloriaProvider } from "veloria-ui/provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VeloriaProvider>{children}</VeloriaProvider>
      </body>
    </html>
  );
}
```

### 4. Start building

```tsx
import { Button, Card, CardContent, Input, Badge } from "veloria-ui";

export default function Page() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6">
        <Badge variant="soft" color="success">New</Badge>
        <Input placeholder="Email address" type="email" />
        <Button variant="solid" size="lg">Get started</Button>
      </CardContent>
    </Card>
  );
}
```

---

## CLI

veloria-ui ships with a CLI that copies components straight into your project — shadcn-style. You own the code.

```bash
# Set up veloria-ui in your project (writes veloria.config.json)
npx veloria-ui init

# Add components
npx veloria-ui add button
npx veloria-ui add card modal drawer toast

# Browse all components
npx veloria-ui list
npx veloria-ui list --category forms

# Compare your local copy to the latest upstream version  ✨ new in v0.1.5
npx veloria-ui diff button
npx veloria-ui diff modal --context 6
npx veloria-ui diff input --json
```

### `diff` — upstream comparison

`veloria-ui diff` is a first-of-its-kind feature in the React UI component space. After you've customised a component that was originally added via `veloria-ui add`, you can run diff at any time to see exactly what changed in the upstream source — without leaving your terminal.

```
$ npx veloria-ui diff button

  diff  button
  local     components/ui/button/index.tsx
  upstream  https://raw.githubusercontent.com/JohnDev19/Veloria-UI/main/…

  +3 additions    -1 deletion

    12     const buttonVariants = cva(
    13  -    "inline-flex items-center justify-center rounded-md text-sm",
    14  +    "inline-flex items-center justify-center gap-2 rounded-md text-sm",
    15       {
   ···
    31  +    loading: "opacity-70 cursor-wait",
    32       },
```

**How it works:**
1. Fetches the latest source directly from the GitHub raw API — no npm round-trip.
2. Locates your local copy via `veloria.config.json` (falls back to common paths).
3. Runs a Myers diff (the same algorithm Git uses) and renders unified-style hunks.

**Flags:**

| Flag | Description |
|------|-------------|
| `--context <n>` | Lines of context around each change (default: `3`) |
| `--json` | Output machine-readable JSON — useful in CI |

---

## Theming

Override them in your global CSS:

```css
:root {
  /* swap in your brand color */
  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 100%;

  /* rounder corners */
  --radius: 0.75rem;
}
```

Full token list: `--background` `--foreground` `--primary` `--secondary` `--muted` `--accent` `--destructive` `--success` `--warning` `--info` `--border` `--input` `--ring` `--radius`.

---

## Dark Mode

Uses the `class` strategy — add `dark` to `<html>` and everything flips automatically.

```tsx
import { useTheme, ThemeSwitcher } from "veloria-ui";

function Header() {
  const { theme, setTheme } = useTheme();
  return <ThemeSwitcher value={theme} onChange={setTheme} variant="toggle" />;
}
```

---

## Package Structure

```
veloria-ui/
├── src/
│   ├── components/
│   │   ├── basic/           Button, IconButton, Badge, Avatar, Tooltip…
│   │   ├── layout/          Container, Stack, Grid, ScrollArea, Masonry…
│   │   ├── navigation/      Navbar, Tabs, DropdownMenu, Stepper…
│   │   ├── forms/           Input, Select, Checkbox, Slider, NumberInput, AvatarUpload…
│   │   ├── advanced-forms/  OTPInput, ColorPicker, Combobox, MultiSelect…
│   │   ├── data-display/    Card, DataTable, SparklineChart, RadialProgressChart,
│   │   │                    GaugeChart, AuroraCard, PricingCard, FileCard…
│   │   ├── feedback/        Alert, Toast, Skeleton, StepProgress, EmptyState…
│   │   ├── overlay/         Modal, Drawer, CommandDialog, Lightbox…
│   │   ├── media/           VideoPlayer, AudioPlayer, Carousel, Gallery…
│   │   └── utility/         ThemeSwitcher, CopyButton, TypewriterText…
│   ├── hooks/               utility hooks
│   ├── styles/              veloria.css — full design token system
│   ├── types/               shared TypeScript types
│   ├── utils/               cn() and helpers
│   ├── cli/                 veloria-ui CLI (add, init, list, diff)
│   ├── provider.tsx         VeloriaProvider for Next.js
│   └── tailwind.ts          veloriaPlugin + veloriaPreset
├── package.json
├── tsup.config.ts
└── tsconfig.json
```

---

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).
→ [github.com/JohnDev19/Veloria-UI/issues](https://github.com/JohnDev19/Veloria-UI/issues)

---

## Security

See [SECURITY.md](SECURITY.md) for our vulnerability disclosure policy.

---

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be kind.

---

## License

MIT © [JohnDev19](https://github.com/JohnDev19)

---

<div align="center">
  <sub>Built by JohnDev19 · v0.1.5</sub>
</div>