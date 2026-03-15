<div align="center">

<br/>

```
╔═╗╔╦╗╦  ╔═╗╔═╗╦ ╦╦
╠═╣ ║ ║  ╠═╣╚═╗║ ║║
╩ ╩ ╩ ╩═╝╩ ╩╚═╝╚═╝╩
```

### **Build anything. Ship faster.**

90+ production-ready React components — accessible, composable, dark-mode ready.
Works with Tailwind CSS and Next.js out of the box.

[![npm](https://img.shields.io/npm/v/atlasui-lib?color=0ea5e9&label=atlasui-lib)](https://www.npmjs.com/package/atlasui-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)](https://www.typescriptlang.org)
[![GitHub](https://img.shields.io/github/stars/JohnDev19/AtlasUI?style=social)](https://github.com/JohnDev19/AtlasUI)

**[Docs](https://atlasui.vercel.app/)** · **[Components](https://atlasui.vercel.app/components)** · **[Issues](https://github.com/JohnDev19/AtlasUI/issues)** · **[Changelog](CHANGELOG.md)**

</div>

---

## Install

```bash
npm install atlasui-lib
# pnpm add atlasui-lib
# bun add atlasui-lib
```

---

## Setup

### 1. Import the stylesheet

```tsx
// app/layout.tsx
import "atlasui-lib/styles";
```

### 2. Add the Tailwind plugin

```ts
// tailwind.config.ts
import { atlasPlugin } from "atlasui-lib/tailwind";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  plugins: [atlasPlugin],
};
```

### 3. Wrap your app

```tsx
// app/layout.tsx
import { AtlasProvider } from "atlasui-lib/provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AtlasProvider>{children}</AtlasProvider>
      </body>
    </html>
  );
}
```

### 4. Start building

```tsx
import { Button, Card, CardContent, Input, Badge } from "atlasui-lib";

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

atlasui-lib ships with a CLI that copies components straight into your project — shadcn-style. You own the code.

```bash
# Set up atlasui-lib in your project (writes atlas.config.json)
npx atlasui-lib init

# Add components
npx atlasui-lib add button
npx atlasui-lib add card modal drawer toast

# Browse all 90 components
npx atlasui-lib list
npx atlasui-lib list --category forms

# Compare your local copy to the latest version
npx atlasui-lib diff button
```

After running `add`, a file like `components/ui/button/index.tsx` appears in your project. It re-exports from `atlasui-lib` by default, or you can paste the full source in and go wild.

---

## Components (90)

### Basic (10)
`Button` `IconButton` `Link` `Badge` `Avatar` `AvatarGroup` `Divider` `Tag` `Chip` `Tooltip`

### Layout (10)
`Container` `Stack` `Grid` `Flex` `Section` `Spacer` `AspectRatio` `Center` `ScrollArea` `Masonry`

### Navigation (10)
`Navbar` `Sidebar` `Menu` `DropdownMenu` `Breadcrumb` `Pagination` `Tabs` `CommandPalette` `NavigationMenu` `Stepper`

### Forms (10)
`Input` `TextArea` `Select` `Checkbox` `RadioGroup` `Switch` `Slider` `RangeSlider` `DatePicker` `TimePicker`

### Advanced Forms (10)
`FileUpload` `OTPInput` `ColorPicker` `SearchInput` `PasswordInput` `Combobox` `MultiSelect` `FormField` `FormLabel` `FormError`

### Data Display (10)
`Card` `Table` `DataTable` `List` `ListItem` `Statistic` `Timeline` `Calendar` `Chart` `CodeBlock`

### Feedback (10)
`Alert` `Toast` `Snackbar` `Progress` `CircularProgress` `Skeleton` `LoadingSpinner` `EmptyState` `StatusIndicator` `Notification`

### Overlay (10)
`Modal` `Dialog` `Drawer` `Popover` `HoverCard` `ContextMenu` `CommandDialog` `Sheet` `Lightbox` `ImageViewer`

### Media (5)
`Image` `VideoPlayer` `AudioPlayer` `Carousel` `Gallery`

### Utility (5)
`ThemeSwitcher` `CopyButton` `KeyboardShortcut` `ResizablePanel` `DragDropArea`

---

## Hooks

```tsx
import {
  useDisclosure,     // open/close state for modals, drawers, anything toggle
  useMediaQuery,     // subscribe to any CSS media query
  useBreakpoint,     // Tailwind breakpoint detection (sm, md, lg, xl, 2xl)
  useClipboard,      // clipboard copy with "copied!" feedback
  useLocalStorage,   // useState that persists to localStorage
  useTheme,          // read/set light · dark · system theme
  useDebounce,       // debounce any value — perfect for search inputs
  useOnClickOutside, // detect clicks outside a ref'd element
  useKeydown,        // keyboard shortcut listener with modifier support
  useMounted,        // SSR-safe mount check
  useToast,          // fire toasts programmatically
} from "atlasui-lib";
```

---

## Theming

All colors are CSS custom properties. Override them in your global CSS:

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
import { useTheme, ThemeSwitcher } from "atlasui-lib";

function Header() {
  const { theme, setTheme } = useTheme();
  return <ThemeSwitcher value={theme} onChange={setTheme} variant="toggle" />;
}
```

---

## Package Structure

```
atlasui-lib/
├── src/
│   ├── components/
│   │   ├── basic/           Button, IconButton, Badge, Avatar, Tooltip…
│   │   ├── layout/          Container, Stack, Grid, ScrollArea, Masonry…
│   │   ├── navigation/      Navbar, Tabs, DropdownMenu, Stepper…
│   │   ├── forms/           Input, Select, Checkbox, Slider, Switch…
│   │   ├── advanced-forms/  OTPInput, ColorPicker, Combobox, MultiSelect…
│   │   ├── data-display/    Card, DataTable, Timeline, Calendar, CodeBlock…
│   │   ├── feedback/        Alert, Toast, Skeleton, EmptyState, Progress…
│   │   ├── overlay/         Modal, Drawer, CommandDialog, Lightbox…
│   │   ├── media/           VideoPlayer, AudioPlayer, Carousel, Gallery…
│   │   └── utility/         ThemeSwitcher, CopyButton, ResizablePanel…
│   ├── hooks/               10 utility hooks
│   ├── styles/              atlas.css — full design token system
│   ├── types/               shared TypeScript types
│   ├── utils/               cn() and helpers
│   ├── cli/                 atlasui-lib CLI (add, init, list, diff)
│   ├── provider.tsx         AtlasProvider for Next.js
│   └── tailwind.ts          atlasPlugin + atlasPreset
├── package.json
├── tsup.config.ts
└── tsconfig.json
```

---

## Contributing

Issues and PRs welcome.
→ [github.com/JohnDev19/AtlasUI/issues](https://github.com/JohnDev19/AtlasUI/issues)

---

## License

MIT © [JohnDev19](https://github.com/JohnDev19)

---

<div align="center">
  <sub>Built by JohnDev19 on top of Radix UI primitives.</sub>
</div>
