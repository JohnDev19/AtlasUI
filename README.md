<div align="center">

<br/>

```
╦  ╦╔═╗╦  ╔═╗╦═╗╦╔═╗
╚╗╔╝║╣ ║  ║ ║╠╦╝║╠═╣
 ╚╝ ╚═╝╩═╝╚═╝╩╚═╩╩ ╩
```

### **Build anything. Ship faster.**

Accessible, composable, dark-mode ready React components.  
Works with Tailwind CSS and Next.js out of the box.

[![npm](https://img.shields.io/npm/v/veloria-ui?color=0ea5e9&label=veloria-ui)](https://www.npmjs.com/package/veloria-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)](https://www.typescriptlang.org)
[![GitHub](https://img.shields.io/github/stars/JohnDev19/Veloria-UI?style=social)](https://github.com/JohnDev19/Veloria-UI)

**[Docs](https://veloria-ui.vercel.app/)** · **[Components](https://veloria-ui.vercel.app/components)** · **[Issues](https://github.com/JohnDev19/Veloria-UI/issues)** · **[Changelog](CHANGELOG.md)**

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
        <Badge variant="soft">New</Badge>
        <Input placeholder="Email address" type="email" />
        <Button variant="solid" size="lg">Get started</Button>
      </CardContent>
    </Card>
  );
}
```

---

## CLI

Copies components straight into your project — shadcn-style. You own the code.

```bash
# Set up veloria-ui in your project
npx veloria-ui init

# Add components
npx veloria-ui add button
npx veloria-ui add card modal drawer toast

# Browse all components
npx veloria-ui list
npx veloria-ui list --category forms
npx veloria-ui list --classic

# Show library status
npx veloria-ui status

# Compare your local copy to the latest
npx veloria-ui diff button
```

---

## Components

### Basic & Layout

`Button` `IconButton` `Link` `Badge` `Avatar` `AvatarGroup` `Divider` `Tag` `Chip` `Tooltip`
`Container` `Stack` `Grid` `Flex` `Section` `Spacer` `AspectRatio` `Center` `ScrollArea` `Masonry`

### Navigation

`Navbar` `Sidebar` `Menu` `DropdownMenu` `Breadcrumb` `Pagination` `Tabs` `Stepper` `CommandDialog` `NavigationMenu`

### Forms & Inputs

`Input` `TextArea` `Select` `Checkbox` `RadioGroup` `Switch` `Slider` `RangeSlider` `DatePicker` `TimePicker`
`FileUpload` `OTPInput` `ColorPicker` `SearchInput` `PasswordInput` `Combobox` `MultiSelect` `FormField` `FormLabel` `FormError`
`PhoneInput` `TagInput` `CurrencyInput` `RatingInput`

### Data Display

`Card` `Table` `DataTable` `List` `ListItem` `Statistic` `Timeline` `Calendar` `CodeBlock` `Chart`
`StatsCard` `TreeView` `JsonViewer` `Heatmap` `KanbanBoard`

### Feedback & Status

`Alert` `Toast` `Snackbar` `Progress` `CircularProgress` `Skeleton` `LoadingSpinner` `EmptyState`
`StatusIndicator` `Notification` `BannerAlert` `ConfirmDialog` `FloatingActionButton` `RichTooltip`

### Overlay & Discovery

`Modal` `Dialog` `Drawer` `Sheet` `Popover` `HoverCard` `ContextMenu` `CommandDialog`
`Lightbox` `ImageViewer` `Tour`

### Media

`Image` `VideoPlayer` `AudioPlayer` `Carousel` `Gallery`

### Utility & Performance

`ThemeSwitcher` `CopyButton` `KeyboardShortcut` `ResizablePanel` `DragDropArea` `InfiniteScroll` `VirtualList`

### Unique — new in v0.1.3

Components not commonly found in other UI libraries:

`Marquee` `GlowCard` `SpotlightCard` `BentoGrid` `BentoItem` `GradientText` `TypewriterText`
`CountUp` `ReadingProgress` `AnimatedBorder` `RippleButton` `PricingCard` `StickyNote`
`Ribbon` `PulseRing` `CommandBar` `ScrollReveal`

---

## Classic Variant — new in v0.1.3

A premium design variant available on `Button`, `Card`, `Badge`, `Input`, `PricingCard`, and more.

Warm parchment surface, aged-brass border, inset highlight depth — not literal 3D, but genuinely tactile and refined.

```tsx
<Button variant="classic" size="lg">Continue</Button>
<Badge variant="classic">Verified</Badge>
<Input variant="classic" placeholder="Your name" />
<Card variant="classic" interactive>
  <CardContent className="p-6">Premium surface</CardContent>
</Card>
```

Add the CSS tokens to your `globals.css`:

```css
:root {
  --classic-bg:      36 25% 94%;
  --classic-fg:      25 30% 15%;
  --classic-border:  30 20% 65%;
  /* full token list in src/variants/classic.ts */
}
```

---

## Status API — new in v0.1.3

Query live library metadata programmatically.

```ts
import {
  getLibraryStats,
  getComponentCount,
  getVersion,
  getStatusResponse,
  GET, // Next.js App Router handler
} from "veloria-ui/api";

// app/api/veloria-ui/status/route.ts
export { GET } from "veloria-ui/api";
```

---

## Hooks

```tsx
import {
  useDisclosure,     // open/close state for modals, drawers, toggles
  useMediaQuery,     // subscribe to any CSS media query
  useBreakpoint,     // Tailwind breakpoint detection
  useClipboard,      // clipboard copy with feedback
  useLocalStorage,   // useState that persists to localStorage
  useTheme,          // read/set light · dark · system theme
  useDebounce,       // debounce any value
  useOnClickOutside, // detect clicks outside a ref'd element
  useKeydown,        // keyboard shortcut listener
  useMounted,        // SSR-safe mount check
  useToast,          // fire toasts programmatically
  useForm,           // form state and validation
  usePagination,     // pagination logic decoupled from UI
  useIntersection,   // IntersectionObserver wrapper
  useWindowSize,     // reactive window dimensions
  useStep,           // multi-step wizard state
  useCountdown,      // countdown timer with controls
  useScrollLock,     // lock body scroll for overlays
} from "veloria-ui";
```

---

## Theming

All colors are CSS custom properties — override them in your global CSS:

```css
:root {
  --primary:   262 83% 58%;
  --radius:    0.75rem;
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
│   │   ├── basic/           Button, Badge, IconButton, Avatar, Tooltip…
│   │   ├── layout/          Container, Stack, Grid, ScrollArea, Masonry…
│   │   ├── navigation/      Navbar, Tabs, DropdownMenu, Stepper…
│   │   ├── forms/           Input, Select, Checkbox, Slider, Switch…
│   │   ├── advanced-forms/  OTPInput, ColorPicker, Combobox, MultiSelect…
│   │   ├── data-display/    Card, DataTable, Timeline, Calendar, CodeBlock…
│   │   ├── feedback/        Alert, Toast, Skeleton, EmptyState, Progress…
│   │   ├── overlay/         Modal, Drawer, CommandDialog, Lightbox…
│   │   ├── media/           VideoPlayer, AudioPlayer, Carousel, Gallery…
│   │   └── utility/         ThemeSwitcher, CopyButton, Marquee,
│   │                        GlowCard, BentoGrid, PricingCard…
│   ├── variants/            classic.ts — Classic variant tokens
│   ├── api/                 Status & metadata API
│   ├── hooks/               18 utility hooks
│   ├── styles/              veloria.css — design token system
│   ├── types/               shared TypeScript types
│   ├── utils/               cn() and helpers
│   ├── cli/                 veloria-ui CLI (add, init, list, diff, status)
│   ├── provider.tsx         VeloriaProvider for Next.js
│   └── tailwind.ts          veloriaPlugin + veloriaPreset
├── package.json
├── tsup.config.ts
└── tsconfig.json
```

---

## Contributing

Issues and PRs welcome.
→ [github.com/JohnDev19/Veloria-UI/issues](https://github.com/JohnDev19/Veloria-UI/issues)

---

## License

MIT © [JohnDev19](https://github.com/JohnDev19)

---

<div align="center">
  <sub>Built by JohnDev19</sub>
</div>
