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

# Compare your local copy to the latest version
npx veloria-ui diff button
```

After running `add`, a file like `components/ui/button/index.tsx` appears in your project. It re-exports from `veloria-ui` by default, or you can paste the full source in and go wild.

---

## Components

### Basic (10)
`Button` `IconButton` `Link` `Badge` `Avatar` `AvatarGroup` `Divider` `Tag` `Chip` `Tooltip`

> All interactive components now support a `classic` variant — beveled edges that mimic physical plastic or rubber with a tactile press effect.

### Layout (10)
`Container` `Stack` `Grid` `Flex` `Section` `Spacer` `AspectRatio` `Center` `ScrollArea` `Masonry`

### Navigation (10)
`Navbar` `Sidebar` `Menu` `DropdownMenu` `Breadcrumb` `Pagination` `Tabs` `CommandPalette` `NavigationMenu` `Stepper`

### Forms (12)
`Input` `TextArea` `Select` `Checkbox` `RadioGroup` `Switch` `Slider` `RangeSlider` `DatePicker` `TimePicker` `NumberInput` `AvatarUpload`

> `Select` now uses a fully custom animated dropdown — no OS picker. Includes scroll buttons, chevron animation, and directional slide-in/out transitions.

### Advanced Forms (14)
`FileUpload` `OTPInput` `ColorPicker` `SearchInput` `PasswordInput` `Combobox` `MultiSelect` `FormField` `FormLabel` `FormError` `PhoneInput` `TagInput` `CurrencyInput` `RatingInput`

### Data Display (19)
`Card` `Table` `DataTable` `List` `ListItem` `Statistic` `Timeline` `Calendar` `Chart` `CodeBlock` `StatsCard` `TreeView` `JsonViewer` `Heatmap` `KanbanBoard` `SparklineChart` `RadialProgressChart` `GaugeChart` `AuroraCard` `FileCard` `PricingCard`

### Feedback (15)
`Alert` `Toast` `Snackbar` `Progress` `CircularProgress` `Skeleton` `LoadingSpinner` `EmptyState` `StatusIndicator` `Notification` `BannerAlert` `ConfirmDialog` `FloatingActionButton` `RichTooltip` `Tour` `StepProgress`

### Overlay (10)
`Modal` `Dialog` `Drawer` `Popover` `HoverCard` `ContextMenu` `CommandDialog` `Sheet` `Lightbox` `ImageViewer`

### Media (5)
`Image` `VideoPlayer` `AudioPlayer` `Carousel` `Gallery`

### Utility (8)
`ThemeSwitcher` `CopyButton` `KeyboardShortcut` `ResizablePanel` `DragDropArea` `InfiniteScroll` `VirtualList` `TypewriterText`

---

## New in v0.1.4

### Charts

```tsx
import { SparklineChart, RadialProgressChart, GaugeChart } from "veloria-ui";

// Inline trend line — slots into any stat card
<SparklineChart data={[12, 18, 14, 22, 19, 28, 31]} color="hsl(var(--primary))" />

// Animated multi-segment ring
<RadialProgressChart
  segments={[
    { value: 65, label: "Series A", color: "#7F77DD" },
    { value: 25, label: "Series B", color: "#1D9E75" },
    { value: 10, label: "Series C", color: "#EF9F27" },
  ]}
  size={140}
  centerLabel={<span className="text-lg font-bold">90%</span>}
/>

// Gauge with animated needle
<GaugeChart value={72} label="CPU usage" size={200} />
```

### Modern & Unique

```tsx
import { AuroraCard, TypewriterText } from "veloria-ui";

// Dark card with mouse-reactive aurora blobs
<AuroraCard className="p-8 text-white">
  <h2 className="text-2xl font-bold">Ship faster</h2>
  <p className="mt-2 text-white/70">Aurora reacts to your cursor.</p>
</AuroraCard>

// Typewriter cycling through strings
<TypewriterText
  strings={["Build anything.", "Ship faster.", "Dark mode ready."]}
  speed={80}
  pause={2000}
/>
```

### New Form Components

```tsx
import { NumberInput, AvatarUpload } from "veloria-ui";

<NumberInput value={qty} onChange={setQty} min={1} max={99} step={1} size="md" />

<AvatarUpload
  value={avatarUrl}
  onChange={(file, preview) => upload(file)}
  onRemove={() => setAvatarUrl(undefined)}
  maxSize={2 * 1024 * 1024}
  fallback="JD"
  size="lg"
/>
```

### StepProgress

```tsx
import { StepProgress } from "veloria-ui";

<StepProgress steps={4} current={2} showLabel size="md" />
// → Step 2 of 4 · 50%
```

### PricingCard & FileCard

```tsx
import { PricingCard, FileCard } from "veloria-ui";

<PricingCard
  name="Pro"
  price={29}
  period="/month"
  description="For teams that ship fast."
  popular
  features={[
    { label: "Unlimited projects", included: true },
    { label: "Priority support", included: true },
    { label: "Custom domain", included: false },
  ]}
  onCtaClick={() => checkout("pro")}
/>

<FileCard
  filename="Q4_report_final.pdf"
  size={2.4 * 1024 * 1024}
  progress={100}
  onDownload={() => download()}
  onRemove={() => remove()}
/>
```

---

## Classic variant

All interactive components now accept `variant="classic"` — a beveled style that mimics physical plastic or rubber:

```tsx
<Button variant="classic">Classic button</Button>
<Badge variant="classic" color="success">New</Badge>
<Card variant="classic" interactive>Classic card</Card>
<Chip classic>Filter</Chip>
```

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
  useForm,           // form state + validation, no dependencies
  usePagination,     // pagination logic decoupled from UI
  useIntersection,   // IntersectionObserver wrapper
  useWindowSize,     // reactive viewport dimensions, SSR-safe
  useStep,           // multi-step wizard state
  useCountdown,      // countdown timer with start/pause/reset
} from "veloria-ui";
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

Issues and PRs welcome.
→ [github.com/JohnDev19/Veloria-UI/issues](https://github.com/JohnDev19/Veloria-UI/issues)

---

## License

MIT © [JohnDev19](https://github.com/JohnDev19)

---

<div align="center">
  <sub>Built by JohnDev19</sub>
</div>
