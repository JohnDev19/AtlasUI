# Veloria UI — Documentation

> Version 0.1.9 · 2026-03-17
> by [JohnDev19](https://github.com/JohnDev19) · [ui-veloria.vercel.app](https://ui-veloria.vercel.app/)

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Setup](#setup)
4. [React Hook Form Adapter](#react-hook-form-adapter)
5. [Motion System](#motion-system)
   - [Quick start](#quick-start)
   - [Presets](#presets)
   - [Animated](#animated)
   - [MotionPresence](#motionpresence)
   - [withMotion](#withmotion)
   - [useMotion](#usemotion)
   - [Pre-wrapped components](#pre-wrapped-components)
   - [Stagger](#stagger)
   - [Imperative API](#imperative-api)
   - [MotionConfig reference](#motionconfig-reference)
   - [prefers-reduced-motion](#prefers-reduced-motion)
6. [CLI Reference](#cli-reference)
   - [init](#init)
   - [add](#add)
   - [remove](#remove)
   - [list](#list)
   - [diff](#diff)
   - [upgrade](#upgrade)
7. [Component Categories](#component-categories)
8. [Theming & Design Tokens](#theming--design-tokens)
9. [Dark Mode](#dark-mode)
10. [Hooks Reference](#hooks-reference)
11. [TypeScript](#typescript)
12. [Accessibility](#accessibility)
13. [Framework Guides](#framework-guides)
14. [Contributing](#contributing)
15. [Changelog](#changelog)

---

## Overview

Veloria UI is a copy-paste React component library built for teams that want to own their UI code. It ships a CLI (`veloria-ui`) that copies component source files directly into your project — you edit them freely, no black-box abstraction. Components are built on Radix UI primitives, styled with Tailwind CSS design tokens, and fully typed with TypeScript.

**What makes Veloria UI different:**

- **You own the code.** `veloria-ui add button` copies source into `components/ui/button/index.tsx`. Git-track it, fork it, delete it.
- **`veloria-ui/motion`** — zero-dependency animation system built on the Web Animations API. No Framer Motion, no GSAP. 16 presets. `prefers-reduced-motion` aware.
- **Interactive picker.** `veloria-ui add` with no args opens a two-step category → component browser.
- **`veloria-ui remove`** — cleanly uninstalls components, warns about dependents, updates `veloria.lock.json`.
- **`veloria-ui diff`** — native terminal diff against upstream. See exactly what changed without leaving your terminal.
- **`veloria-ui upgrade`** — three-state staleness detection keeps components in sync without clobbering local edits.
- **`veloria-ui/rhf`** — zero-boilerplate React Hook Form adapter. Drop-in `Controller` wrappers for every form component.
- **No runtime dependency** after you've added a component. The copied file is self-contained.
- **122 components** across 10 categories.

---

## Installation

```bash
npm install veloria-ui
# pnpm add veloria-ui
# bun add veloria-ui
# yarn add veloria-ui
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
import { VeloriaProvider } from "veloria-ui/provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><VeloriaProvider>{children}</VeloriaProvider></body>
    </html>
  );
}
```

### 4. Start building

```tsx
import { Button, Card, CardContent, Input, Badge } from "veloria-ui";

<Card>
  <CardContent className="flex flex-col gap-4 p-6">
    <Badge variant="soft" color="success">New</Badge>
    <Input placeholder="Email address" type="email" />
    <Button variant="solid" size="lg">Get started</Button>
  </CardContent>
</Card>
```

---

## React Hook Form Adapter

Import from `veloria-ui/rhf`. Requires `react-hook-form ^7.0.0`.

```tsx
import { RhfInput, RhfSelect, RhfCheckbox } from "veloria-ui/rhf";
import { useForm } from "react-hook-form";

const { control, handleSubmit } = useForm<{ email: string; role: string; agree: boolean }>();

<form onSubmit={handleSubmit(onSubmit)}>
  <RhfInput    name="email"  control={control} label="Email" type="email" />
  <RhfSelect   name="role"   control={control} label="Role"  options={roles} />
  <RhfCheckbox name="agree"  control={control} label="I agree to the terms" />
  <Button type="submit">Submit</Button>
</form>
```

All 11 wrappers: `RhfInput`, `RhfTextArea`, `RhfSelect`, `RhfCheckbox`, `RhfSwitch`, `RhfRadioGroup`, `RhfSlider`, `RhfCombobox`, `RhfMultiSelect`, `RhfRatingInput`, `RhfOTPInput`.

---

## Motion System

`veloria-ui/motion` is a thin animation layer built on the **Web Animations API**. Zero dependencies — no Framer Motion, no GSAP. Ships inside the `veloria-ui` package, tree-shaken out if unused.

### Quick start

```tsx
import {
  Animated,
  MotionModal,
  MotionCard,
  MotionDrawer,
} from "veloria-ui/motion";

// Pre-wrapped component — drop-in replacement with motion prop
<MotionModal motion="fade-scale" open={isOpen} onOpenChange={setOpen} title="Hello" />
<MotionDrawer motion="slide-left" open={isOpen} onOpenChange={setOpen} side="left" />

// Conditional element with animated enter/exit
<Animated show={isVisible} motion="fade-up">
  <p>Animates in and out</p>
</Animated>

// Mount-only animation (no show prop = always visible, runs on mount)
<MotionCard motion={{ preset: "fade-up", delay: 150 }}>
  Content
</MotionCard>
```

---

### Presets

Pass any preset name as a string shorthand to `motion=`.

| Preset | Description |
|--------|-------------|
| `"fade"` | Simple opacity fade |
| `"fade-up"` | Fade in from below |
| `"fade-down"` | Fade in from above |
| `"fade-left"` | Fade in from the right |
| `"fade-right"` | Fade in from the left |
| `"fade-scale"` | Fade + scale from 95% → 100% |
| `"slide-up"` | Translate from 100% below, no fade |
| `"slide-down"` | Translate from 100% above |
| `"slide-left"` | Translate from 100% right |
| `"slide-right"` | Translate from 100% left |
| `"zoom"` | Scale from 50% with fade |
| `"zoom-out"` | Scale from 110% with fade |
| `"flip"` | 3D Y-axis perspective flip |
| `"flip-x"` | 3D X-axis perspective flip |
| `"bounce"` | Elastic entrance with spring easing |
| `"none"` | No animation (useful for accessible overrides) |

---

### MotionConfig reference

For fine-grained control, pass a `MotionConfig` object instead of a preset string:

```tsx
<Animated
  show={isVisible}
  motion={{
    preset:      "fade-up",   // MotionPreset — default "fade"
    duration:    300,          // ms — default 220
    delay:       150,          // ms — default 0
    easing:      "ease-out",   // or "spring", "bounce", custom cubic-bezier
    distance:    24,           // px — used by translate-based presets, default 16
    exitReverse: true,         // reverse enter frames for exit, default true
    // Override frames entirely:
    enterKeyframes: [{ opacity: 0 }, { opacity: 1 }],
    exitKeyframes:  [{ opacity: 1 }, { opacity: 0 }],
  }}
>
  content
</Animated>
```

**Available easings:** `"ease"`, `"ease-in"`, `"ease-out"`, `"ease-in-out"`, `"spring"` (cubic-bezier overshoot), `"bounce"` (elastic), `"linear"`, or any custom `"cubic-bezier(…)"` string.

**Duration constants** (importable from `veloria-ui/motion`):

```ts
import { DURATIONS } from "veloria-ui/motion";

DURATIONS.instant  // 120ms
DURATIONS.fast     // 220ms  ← default
DURATIONS.normal   // 300ms
DURATIONS.slow     // 450ms
DURATIONS.dramatic // 600ms
```

---

### `<Animated>`

Wraps any HTML element with animated enter/exit. The element is removed from the DOM after the exit animation completes (unless `keepMounted` is set).

```tsx
import { Animated } from "veloria-ui/motion";

<Animated
  show={isVisible}           // toggle enter/exit
  motion="fade-up"           // preset or MotionConfig
  as="section"               // HTML element, default "div"
  keepMounted={false}        // keep in DOM after exit, default false
  className="my-class"
>
  {children}
</Animated>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | `boolean` | `true` | Controls visibility and triggers enter/exit |
| `motion` | `MotionPreset \| MotionConfig` | — | Animation configuration |
| `as` | `React.ElementType` | `"div"` | HTML element to render |
| `keepMounted` | `boolean` | `false` | Stay in DOM after exit (hidden) |

---

### `<MotionPresence>`

Manages enter/exit for children that mount and unmount. When the child is removed from the React tree, `MotionPresence` plays its exit animation before removing it from the DOM — identical to Framer Motion's `AnimatePresence`.

```tsx
import { MotionPresence } from "veloria-ui/motion";

<MotionPresence
  motion="zoom"
  onExitComplete={() => console.log("fully gone")}
>
  {isOpen && <Panel key="panel" />}
</MotionPresence>
```

The child **must** have a stable `key` prop. The child must accept a `ref` (any native HTML element or a `React.forwardRef` component).

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactElement` | Single child with a stable `key` |
| `motion` | `MotionPreset \| MotionConfig` | Animation for this child |
| `onExitComplete` | `() => void` | Called after exit animation finishes |

---

### `withMotion()`

Higher-order component that wraps any component (including your locally-copied Veloria UI components) and adds a `motion` prop.

```tsx
import { withMotion } from "veloria-ui/motion";
import { Modal } from "@/components/ui/modal";   // your local copy

const MotionModal = withMotion(Modal, {
  visibleProp: "open",  // watch this prop for enter/exit (default: "open")
});

<MotionModal motion="fade-scale" open={isOpen} onOpenChange={setOpen} title="Hello" />
```

For non-overlay components (no `open` prop), pass `{ visibleProp: null }` — the animation runs once on mount:

```tsx
const MotionCard = withMotion(Card, { visibleProp: null });

<MotionCard motion={{ preset: "fade-up", delay: 200 }}>
  Animates on mount only
</MotionCard>
```

**Zero overhead** — if you don't pass `motion`, the component renders with no wrapper or animation cost.

---

### `useMotion()`

Low-level React hook. Attach animated enter/exit to any DOM element ref you control.

```tsx
import { useMotion } from "veloria-ui/motion";

function MyPanel({ show }: { show: boolean }) {
  const { ref, isVisible } = useMotion({
    show,
    motion: "slide-up",
    onExitComplete: () => console.log("exited"),
    animateOnMount: true,  // run enter on first mount, default true
  });

  if (!isVisible) return null;

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      Content
    </div>
  );
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `show` | `boolean` | `true` | Toggle enter/exit |
| `motion` | `MotionPreset \| MotionConfig` | — | Animation config |
| `onExitComplete` | `() => void` | — | Called after exit finishes |
| `animateOnMount` | `boolean` | `true` | Run enter on initial mount |

---

### Pre-wrapped components

Ready-to-use `Motion*` variants. Import and use as drop-in replacements. All accept the original component's props plus `motion`.

```tsx
import {
  // Overlay — open/close animated
  MotionModal, MotionDrawer, MotionSheet, MotionDialog,
  MotionPopover, MotionHoverCard,

  // Feedback — open driven
  MotionToast, MotionSnackbar, MotionBannerAlert,

  // Data Display — mount triggered
  MotionCard, MotionAlert,
} from "veloria-ui/motion";
```

**Example — recommended presets per component:**

```tsx
// Modal — scale from centre
<MotionModal motion="fade-scale" open={open} onOpenChange={setOpen} title="Confirm" />

// Drawer from left
<MotionDrawer motion="slide-right" open={open} onOpenChange={setOpen} side="left" />

// Drawer from right (default side)
<MotionDrawer motion="slide-left" open={open} onOpenChange={setOpen} />

// Drawer from bottom
<MotionDrawer motion="slide-up" open={open} onOpenChange={setOpen} side="bottom" />

// Toast — slide from corner
<MotionToast motion="fade-up" open={open} onOpenChange={setOpen} />

// Card — reveal on page load
<MotionCard motion={{ preset: "fade-up", delay: 150, duration: 300 }}>
  Dashboard card
</MotionCard>
```

---

### Stagger

Animate list items one after another with increasing delays:

```tsx
import { Animated, stagger } from "veloria-ui/motion";

// stagger(index, stepMs, baseDelayMs)
{items.map((item, i) => (
  <Animated
    key={item.id}
    motion={{ preset: "fade-up", delay: stagger(i, 60) }}
  >
    <Card>{item.name}</Card>
  </Animated>
))}
// item 0 → 0ms, item 1 → 60ms, item 2 → 120ms…
```

---

### Imperative API

Run animations directly on DOM elements without React:

```tsx
import { animate, resolveConfig } from "veloria-ui/motion";

const config = resolveConfig("slide-up");
// or: resolveConfig({ preset: "slide-up", duration: 400 })

await animate({
  el:     document.getElementById("my-panel")!,
  config,
  phase:  "enter",   // or "exit"
  signal: abortController.signal,  // optional, to cancel mid-animation
});
```

---

### `prefers-reduced-motion`

The motion system automatically respects the OS accessibility setting. When `prefers-reduced-motion: reduce` is detected:

- All WAAPI keyframe animations are **skipped entirely**
- Elements become immediately visible/hidden with no transition
- No RAF overhead, no timing delays
- SSR safe — returns `false` on the server

You can also read this yourself:

```tsx
import { prefersReducedMotion } from "veloria-ui/motion";

if (!prefersReducedMotion()) {
  // run custom animation
}
```

---

## CLI Reference

```bash
npx veloria-ui init                  # project setup wizard
npx veloria-ui add                   # interactive component picker
npx veloria-ui add button card       # add specific components
npx veloria-ui remove button         # remove an installed component
npx veloria-ui list                  # browse all components
npx veloria-ui list --category forms # filter by category
npx veloria-ui diff button           # compare local vs upstream
npx veloria-ui upgrade               # check all for upstream changes
npx veloria-ui upgrade --all         # upgrade everything
```

---

### `init`

Sets up veloria-ui in your project. Writes `veloria.config.json` and `lib/utils.ts`.

| Option | Description |
|--------|-------------|
| `--typescript` | Use TypeScript (default: `true`) |
| `--tailwind` | Configure Tailwind (default: `true`) |
| `--no-install` | Skip dependency install |
| `-y, --yes` | Skip all prompts |

---

### `add`

```bash
npx veloria-ui add [components...] [options]
```

When called with no names, launches an **interactive two-step picker**: category multiselect → per-category component multiselect. Already-installed components are pre-ticked with `✓`. Components with `registryDeps` show `[+deps]`.

**Dependency graph** is printed before confirmation on every `add`:

```
  Adding 2 components (1 selected + 1 auto)

  └── command-bar
      └── command-dialog  (auto — registry dep)

  npm peer deps
  ├── cmdk
  └── @radix-ui/react-dialog
```

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip confirmation |
| `--no-install` | Skip peer dep install |
| `-p, --path <dir>` | Override destination directory |
| `--force` | Overwrite existing local files |
| `--dry-run` | Show what would be added without writing |

---

### `remove`

```bash
npx veloria-ui remove <components...> [options]
npx veloria-ui rm <components...>
```

Removes components, warns about dependents, cleans `veloria.lock.json`.

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip confirmation |
| `--force` | Remove even if other components depend on it |

---

### `list`

```bash
npx veloria-ui list [--category <name>]
npx veloria-ui ls
```

Lists all available components by category. Filter: `basic`, `layout`, `navigation`, `forms`, `advanced-forms`, `data-display`, `feedback`, `overlay`, `media`, `utility`.

---

### `diff`

```bash
npx veloria-ui diff <component> [--context <n>] [--json]
```

Compares your local copy to upstream using a Myers diff algorithm. Reads from `node_modules` first, falls back to GitHub `master` branch.

---

### `upgrade`

```bash
npx veloria-ui upgrade [component] [--check] [--all] [--force] [--json]
npx veloria-ui up
```

Three-state model: `up-to-date`, `upstream-changed` (safe auto-upgrade), `diverged` (both changed — warned). Powered by `veloria.lock.json`.

---

## Component Categories

### Basic (11) · Layout (10) · Navigation (10)

### Forms (14)

`input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `range-slider`, `date-picker`, `time-picker`, `number-input`, `avatar-upload`, `date-range-picker`, `form-field`

### Advanced Forms (13)

`file-upload`, `otp-input`, `color-picker`, `search-input`, `password-input`, `combobox`, `multi-select`, `phone-input`, `tag-input`, `currency-input`, `rating-input`, `rich-text-editor`, `multi-step-form`

### Data Display (22)

`card`, `table`, `data-table`, `data-grid`, `list`, `list-item`, `statistic`, `timeline`, `calendar`, `code-block`, `chart`, `stats-card`, `tree-view`, `json-viewer`, `heatmap`, `kanban-board`, `sparkline-chart`, `radial-progress-chart`, `gauge-chart`, `aurora-card`, `pricing-card`, `file-card`

### Feedback (16)

`alert`, `toast`, `snackbar`, `progress`, `circular-progress`, `skeleton`, `loading-spinner`, `empty-state`, `status-indicator`, `notification`, `banner-alert`, `confirm-dialog`, `floating-action-button`, `rich-tooltip`, `tour`, `step-progress`

### Overlay (11)

`modal`, `dialog`, `drawer`, `sheet`, `popover`, `hover-card`, `context-menu`, `command-dialog`, `command-bar`, `lightbox`, `image-viewer`

### Media (5)

`image`, `video-player`, `audio-player`, `carousel`, `gallery`

### Utility (8)

`theme-switcher`, `copy-button`, `keyboard-shortcut`, `resizable-panel`, `drag-drop-area`, `infinite-scroll`, `virtual-list`, `typewriter-text`

---

## Theming & Design Tokens

All tokens are CSS custom properties in `veloria.css`, consumed via Tailwind classes.

```css
--background   --foreground
--card         --card-foreground
--popover      --popover-foreground
--primary      --primary-foreground
--secondary    --secondary-foreground
--muted        --muted-foreground
--accent       --accent-foreground
--destructive  --destructive-foreground
--border       --input            --ring
--success      --warning          --info
--radius-sm    --radius           --radius-md   --radius-lg   --radius-full
```

Override in `globals.css`:

```css
:root {
  --primary: 262 83% 58%;
  --radius:  0.25rem;
}
```

---

## Dark Mode

```tsx
import { useTheme, ThemeSwitcher } from "veloria-ui";

<ThemeSwitcher value={theme} onChange={setTheme} variant="toggle" />
```

---

## Hooks Reference

| Hook | Description |
|------|-------------|
| `useDisclosure` | open/close state with `toggle`, `open`, `close` |
| `useMediaQuery` | reactive window media query |
| `useBreakpoint` | Tailwind breakpoint helper |
| `useClipboard` | copy with timeout feedback |
| `useLocalStorage` | persistent state |
| `useTheme` | theme switching |
| `useDebounce` | debounced value |
| `useOnClickOutside` | outside click detection |
| `useKeydown` | keyboard shortcut with modifier support |
| `useMounted` | SSR-safe mount check |
| `useToast` | programmatic toast queue |
| `useForm` | form state and validation |
| `usePagination` | pagination logic |
| `useIntersection` | IntersectionObserver wrapper |
| `useWindowSize` | reactive window dimensions |
| `useStep` | multi-step wizard state |
| `useCountdown` | countdown timer |
| `useCommandBar` | open/close CommandBar programmatically |

---

## TypeScript

```ts
import type {
  ButtonProps, InputProps, CardProps,
  // motion types
  MotionPreset, MotionConfig, MotionProps,
} from "veloria-ui";

import type { MotionPreset, MotionConfig } from "veloria-ui/motion";
```

---

## Accessibility

All interactive components include ARIA roles, keyboard navigation, visible focus rings, screen reader labels, and Radix UI primitives for disclosure/dialog/menu patterns.

The motion system fully respects `prefers-reduced-motion` — all animations are skipped when the OS setting is enabled.

---

## Framework Guides

### Next.js (App Router)

```tsx
// app/layout.tsx
import "veloria-ui/styles";
import { VeloriaProvider } from "veloria-ui/provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><VeloriaProvider>{children}</VeloriaProvider></body>
    </html>
  );
}
```

### Vite + React

```tsx
// src/main.tsx
import "veloria-ui/styles";
import { VeloriaProvider } from "veloria-ui/provider";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <VeloriaProvider><App /></VeloriaProvider>
);
```

### Remix

```tsx
// app/root.tsx
import veloriaStyles from "veloria-ui/styles?url";
import { VeloriaProvider } from "veloria-ui/provider";

export const links = () => [{ rel: "stylesheet", href: veloriaStyles }];

export default function App() {
  return (
    <html lang="en">
      <head><Meta /><Links /></head>
      <body>
        <VeloriaProvider><Outlet /></VeloriaProvider>
        <ScrollRestoration /><Scripts />
      </body>
    </html>
  );
}
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
git clone https://github.com/JohnDev19/Veloria-UI.git
cd Veloria-UI
npm install
npm run build
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

Current version: **0.1.9** — `veloria-ui/motion` animation system.

---

<div align="center">
  <sub>Veloria UI · MIT License · by JohnDev19</sub>
</div>
