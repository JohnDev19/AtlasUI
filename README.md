<div align="center">

<br/>

```
╦  ╦╔═╗╦  ╔═╗╦═╗╦╔═╗
╚╗╔╝║╣ ║  ║ ║╠╦╝║╠═╣
 ╚╝ ╚═╝╩═╝╚═╝╩╚═╩╩ ╩
```

### **Build anything. Ship faster.**

Production-ready React components — accessible, composable, ready.
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

## React Hook Form adapter

Import from `veloria-ui/rhf` for zero-boilerplate RHF-integrated form components. Requires `react-hook-form ^7.0.0`.

```tsx
import { useForm } from "react-hook-form";
import { RhfInput, RhfSelect, RhfCheckbox, RhfSlider } from "veloria-ui/rhf";

const { control, handleSubmit } = useForm<{
  email: string;
  role: string;
  agree: boolean;
  volume: number;
}>();

<form onSubmit={handleSubmit(onSubmit)}>
  <RhfInput    name="email"  control={control} label="Email" type="email" />
  <RhfSelect   name="role"   control={control} label="Role"  options={roles} />
  <RhfSlider   name="volume" control={control} label="Volume" min={0} max={100} showValue />
  <RhfCheckbox name="agree"  control={control} label="I agree to the terms" />
  <Button type="submit">Submit</Button>
</form>
```

All 11 wrappers: `RhfInput`, `RhfTextArea`, `RhfSelect`, `RhfCheckbox`, `RhfSwitch`, `RhfRadioGroup`, `RhfSlider`, `RhfCombobox`, `RhfMultiSelect`, `RhfRatingInput`, `RhfOTPInput`.

Each wrapper automatically handles `invalid` state, renders `<FormError>` with the validation message, and forwards all original visual props unchanged.

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

# Compare your local copy to the latest upstream version
npx veloria-ui diff button
npx veloria-ui diff modal --context 6
npx veloria-ui diff input --json

# Check all installed components for upstream changes 
npx veloria-ui upgrade --check
npx veloria-ui upgrade
npx veloria-ui upgrade --all
```

### `diff` — upstream comparison

`veloria-ui diff` is a first-of-its-kind feature in the React UI component space. After you've customised a component that was originally added via `veloria-ui add`, run diff at any time to see exactly what changed in the upstream source — without leaving your terminal.

```
  diff  button
  local     components/ui/button/index.tsx
  upstream  https://raw.githubusercontent.com/JohnDev19/Veloria-UI/main/…

  +3 additions    -1 deletion

    13  -    "inline-flex items-center justify-center rounded-md",
    14  +    "inline-flex items-center justify-center gap-2 rounded-md",
```

### `upgrade` — keep components in sync

`veloria-ui upgrade` checks every installed component against upstream using a three-state model: **up-to-date**, **upstream-changed** (safe to auto-upgrade), and **diverged** (you've modified it locally — warned before overwriting). Powered by `veloria.lock.json`.

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
│   │   ├── forms/           Input, Select, Checkbox, Slider, DateRangePicker…
│   │   ├── advanced-forms/  OTPInput, ColorPicker, Combobox, MultiSelect, RichTextEditor…
│   │   ├── data-display/    Card, DataTable, DataGrid, SparklineChart, GaugeChart…
│   │   ├── feedback/        Alert, Toast, Skeleton, EmptyState, BannerAlert…
│   │   ├── overlay/         Modal, Drawer, CommandDialog, CommandBar…
│   │   ├── media/           VideoPlayer, AudioPlayer, Carousel, Gallery…
│   │   └── utility/         ThemeSwitcher, CopyButton, TypewriterText…
│   ├── rhf/                 React Hook Form adapter (veloria-ui/rhf)
│   ├── hooks/               utility hooks
│   ├── styles/              veloria.css — full design token system
│   ├── types/               shared TypeScript types
│   ├── utils/               cn() and helpers
│   ├── cli/                 veloria-ui CLI (add, init, list, diff, upgrade)
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
