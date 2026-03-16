# Veloria UI — Documentation

> Version 0.1.5 · 2026-03-17
> by [JohnDev19](https://github.com/JohnDev19) · [ui-veloria.vercel.app](https://ui-veloria.vercel.app/)

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Setup](#setup)
4. [CLI Reference](#cli-reference)
   - [init](#init)
   - [add](#add)
   - [list](#list)
   - [diff](#diff)
5. [Component Categories](#component-categories)
6. [Theming & Design Tokens](#theming--design-tokens)
7. [Dark Mode](#dark-mode)
8. [Hooks Reference](#hooks-reference)
9. [TypeScript](#typescript)
10. [Accessibility](#accessibility)
11. [Framework Guides](#framework-guides)
12. [Contributing](#contributing)
13. [Changelog](#changelog)

---

## Overview

Veloria UI is a copy-paste React component library built for teams that want to own their UI code. It ships a CLI (`veloria-ui`) that copies component source files directly into your project — you edit them freely, no black-box abstraction. Components are built on Radix UI primitives, styled with Tailwind CSS design tokens, and fully typed with TypeScript.

**What makes Veloria UI different:**

- **You own the code.** `veloria-ui add button` copies source into `components/ui/button/index.tsx`. Git-track it, fork it, delete it.
- **`veloria-ui diff`** — the first component library with a native terminal diff against upstream. See exactly what changed in the library without leaving your terminal.
- **No runtime dependency on the library** after you've added a component. The copied file is self-contained.
- **102 components** across 10 categories, with Radix primitives, ARIA attributes, keyboard navigation, and full dark mode out of the box.

---

## Installation

```bash
# npm
npm install veloria-ui

# pnpm
pnpm add veloria-ui

# bun
bun add veloria-ui

# yarn
yarn add veloria-ui
```

**Peer dependencies** (install alongside veloria-ui):

```bash
npm install react react-dom
```

All Radix UI packages are optional peer dependencies — they are only needed for the specific components that use them and are installed automatically by `veloria-ui add`.

---

## Setup

### 1. Import the stylesheet

```tsx
// app/layout.tsx  (Next.js App Router)
import "veloria-ui/styles";
```

The stylesheet defines all CSS custom properties (design tokens) for both light and dark mode. It must be imported once at the root of your app.

### 2. Add the Tailwind plugin

```ts
// tailwind.config.ts
import { veloriaPlugin } from "veloria-ui/tailwind";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // If you use the node_modules path for Veloria components:
    "./node_modules/veloria-ui/dist/**/*.js",
  ],
  plugins: [veloriaPlugin],
};
```

The `veloriaPlugin` registers all Veloria design tokens as Tailwind utilities and adds component-specific variants.

### 3. Wrap your app with VeloriaProvider

```tsx
// app/layout.tsx
import { VeloriaProvider } from "veloria-ui/provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <VeloriaProvider>{children}</VeloriaProvider>
      </body>
    </html>
  );
}
```

`VeloriaProvider` sets up the theme context used by `useTheme()` and `ThemeSwitcher`. It reads and persists the user's theme preference to `localStorage` under the key `veloria-theme`.

### 4. (Optional) Run the init wizard

```bash
npx veloria-ui init
```

This writes a `veloria.config.json` at your project root (used by `add` and `diff` to know where your components live) and creates `lib/utils.ts` if missing.

---

## CLI Reference

### `init`

```bash
npx veloria-ui init [options]
```

Interactive setup wizard. Creates `veloria.config.json` and `lib/utils.ts`.

| Option | Description |
|--------|-------------|
| `--typescript` | Use TypeScript (default: `true`) |
| `--tailwind` | Configure Tailwind (default: `true`) |
| `--no-install` | Skip dependency install |
| `-y, --yes` | Skip all prompts, use defaults |

**veloria.config.json** schema:

```json
{
  "$schema": "https://ui-veloria.vercel.app/schema.json",
  "style": "default",
  "typescript": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components/ui",
    "utils": "@/lib/utils"
  }
}
```

---

### `add`

```bash
npx veloria-ui add <component> [components...] [options]
```

Copies one or more components into your project. Registry dependencies (e.g. `sheet` requires `drawer`) are resolved and added automatically.

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip confirmation prompts |
| `--no-install` | Skip peer dep install |
| `-p, --path <dir>` | Override destination directory |

**Examples:**

```bash
npx veloria-ui add button
npx veloria-ui add card modal drawer toast
npx veloria-ui add select --path src/design-system
```

After running `add`, the file appears at `components/ui/<name>/index.tsx` (or wherever your config points). The file re-exports from `veloria-ui` by default. You can swap in the full source from [GitHub](https://github.com/JohnDev19/Veloria-UI/tree/main/src/components) and customise freely.

---

### `list`

```bash
npx veloria-ui list [options]
npx veloria-ui ls [options]
```

Lists all available components with their category and description.

| Option | Description |
|--------|-------------|
| `-c, --category <category>` | Filter by category name |

**Available categories:** `basic`, `layout`, `navigation`, `forms`, `advanced-forms`, `data-display`, `feedback`, `overlay`, `media`, `utility`.

```bash
npx veloria-ui list
npx veloria-ui list --category forms
npx veloria-ui list -c data-display
```

---

### `diff`

```bash
npx veloria-ui diff <component> [options]
```

**Compares your local copy of a component to the latest upstream source on GitHub.** This is a unique Veloria UI feature — no other component library ships this natively.

**How it works:**

1. Resolves the upstream file path based on the component's category in the registry.
2. Fetches the raw source from `raw.githubusercontent.com/JohnDev19/Veloria-UI/main/…`.
3. Locates your local copy by reading `veloria.config.json` and checking common file paths.
4. Runs a Myers diff (LCS-based, the same algorithm Git uses) between the two files.
5. Renders unified-style, colour-coded hunks in the terminal with addition/deletion counts.

| Option | Description | Default |
|--------|-------------|---------|
| `--context <n>` | Lines of context around each hunk | `3` |
| `--json` | Machine-readable JSON output | — |

**Terminal output example:**

```
  diff  button
  local     components/ui/button/index.tsx
  upstream  https://raw.githubusercontent.com/JohnDev19/Veloria-UI/main/src/components/basic/Button.tsx

  +3 additions    -1 deletion

    12     const buttonVariants = cva(
    13  -    "inline-flex items-center justify-center rounded-md",
    14  +    "inline-flex items-center justify-center gap-2 rounded-md",
    15       {
   ···
    31  +    loading: "opacity-70 cursor-wait",
    32       },

  To update your local copy, run: npx veloria-ui add button --force
```

**JSON output schema** (`--json`):

```json
{
  "component": "button",
  "localPath": "components/ui/button/index.tsx",
  "upstreamUrl": "https://raw.githubusercontent.com/…",
  "summary": { "added": 3, "removed": 1, "changed": 4 },
  "diff": [
    { "type": "equal",   "lineNo": { "local": 1, "upstream": 1 }, "content": "import React from 'react';" },
    { "type": "removed", "lineNo": { "local": 13 },              "content": "  'inline-flex items-center'," },
    { "type": "added",   "lineNo": { "upstream": 14 },           "content": "  'inline-flex items-center gap-2'," }
  ]
}
```

**Use in CI:**

```bash
# Fail CI if any component has drifted from upstream
npx veloria-ui diff button --json | node -e "
  const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
  if (d.summary.changed > 0) { console.error('Component drift detected'); process.exit(1); }
"
```

---

## Component Categories

### Basic (14 components)

Core building blocks used across every app.

| Component | Description |
|-----------|-------------|
| `button` | Solid, outline, ghost, link variants. Sizes xs–xl. Loading state. |
| `icon-button` | Square button for icon-only actions. |
| `badge` | Solid, soft, outline colour variants. |
| `avatar` | Image with fallback initials, size presets, status ring. |
| `avatar-group` | Overlapping avatar stack with overflow count. |
| `tag` | Dismissible label chip. |
| `chip` | Selectable pill, similar to Material chip. |
| `kbd` | Styled `<kbd>` shortcut display. |
| `separator` | Horizontal/vertical rule. |
| `statistic` | Large number with label and optional trend. |
| `calendar` | Month calendar with date selection. |
| `link` | Styled anchor with external indicator. |
| `code` | Inline code block. |
| `tooltip` | Radix tooltip, all four sides, configurable delay. |

### Layout (10 components)

Structural wrappers and spacing utilities.

| Component | Description |
|-----------|-------------|
| `container` | Responsive max-width wrapper. |
| `stack` | Flex column/row with gap, align, justify, divider. |
| `grid` | CSS Grid with column/row/gap config. |
| `flex` | Flex with full directional control. |
| `section` | Semantic section with vertical padding presets. |
| `spacer` | Invisible spacing element. |
| `aspect-ratio` | Radix aspect-ratio container. |
| `center` | Flex centering helper. |
| `scroll-area` | Custom scrollbar via Radix ScrollArea. |
| `masonry` | CSS multi-column masonry grid. |

### Navigation (10 components)

| Component | Description |
|-----------|-------------|
| `navbar` | Sticky, glass-blur top bar. |
| `sidebar` | Collapsible side nav. |
| `menu` | Vertical nav menu with active/disabled states. |
| `dropdown-menu` | Full Radix Dropdown with sub-menus. |
| `breadcrumb` | Accessible trail with custom separator. |
| `pagination` | Page numbers with ellipsis and prev/next. |
| `tabs` | Line, pills, enclosed variants. Radix powered. |
| `command-palette` | ⌘K command palette. |
| `navigation-menu` | Radix Navigation Menu for mega-navbars. |
| `stepper` | Horizontal/vertical multi-step indicator. |

### Forms (14 components)

| Component | Description |
|-----------|-------------|
| `input` | Left/right icon slots, sizes, error state. |
| `textarea` | Multi-line with resize control. |
| `select` | Full Radix Select — animated dropdown. |
| `checkbox` | With label, description, error. |
| `radio-group` | Per-option labels and descriptions. |
| `switch` | Three sizes, label, description. |
| `slider` | Single-thumb range slider. |
| `range-slider` | Dual-thumb slider. |
| `date-picker` | Native date input wrapper. |
| `time-picker` | Native time input wrapper. |
| `number-input` | Stepper with −/+ buttons, clamping, keyboard. |
| `avatar-upload` | Avatar circle with hover overlay and file preview. |
| `form-field` | Label + input + error wrapper. |
| `label` | Radix Label with required indicator. |

### Advanced Forms (12 components)

| Component | Description |
|-----------|-------------|
| `file-upload` | Drag-and-drop zone with click-to-upload fallback. |
| `otp-input` | PIN/OTP with auto-advance and paste support. |
| `color-picker` | Swatches + hex input. |
| `search-input` | Search with loading state and clear button. |
| `password-input` | Password with show/hide toggle. |
| `combobox` | Searchable select with keyboard navigation. |
| `multi-select` | Multiple selection with tag removal. |
| `phone-input` | International dial-code selector. |
| `tag-input` | Type and press Enter to add tags. |
| `currency-input` | Locale-aware currency symbol. |
| `rating-input` | Star rating with hover and clear. |
| `rich-text-editor` | Basic rich text with toolbar. |

### Data Display (17 components)

| Component | Description |
|-----------|-------------|
| `card` | Surface with header, content, footer. |
| `table` / `data-table` | Sortable, paginated, selectable table. |
| `list` | Ordered/unordered with item slots. |
| `description-list` | Term + description pairs. |
| `timeline` | Vertical event timeline. |
| `stats-card` | Metric with icon and trend indicator. |
| `tree-view` | Nested expandable tree, keyboard nav. |
| `json-viewer` | Collapsible syntax-highlighted JSON tree. |
| `heatmap` | GitHub-style activity grid. |
| `kanban-board` | Drag-and-drop column board. |
| `sparkline-chart` | Zero-dep SVG inline trend line. |
| `radial-progress-chart` | Multi-segment animated SVG donut. |
| `gauge-chart` | Half-circle animated needle gauge. |
| `aurora-card` | Mouse-parallax aurora gradient card. |
| `typewriter-text` | Animated cycling strings with cursor. |
| `file-card` | File attachment surface with type badge. |
| `pricing-card` | Pricing tier with features and CTA. |

### Feedback (10 components)

| Component | Description |
|-----------|-------------|
| `alert` | Info/success/warning/danger with dismiss. |
| `toast` | Radix Toast with all sub-primitives. |
| `snackbar` | Positioned message with action. |
| `progress` | Linear bar with colour variants. |
| `circular-progress` | SVG ring with indeterminate mode. |
| `skeleton` | Pulse placeholder for text, rect, circle. |
| `loading-spinner` | Accessible SVG spinner. |
| `empty-state` | Icon + title + description + action. |
| `status-indicator` | Online/offline/busy/away dot with pulse. |
| `banner-alert` | Full-width top-of-page announcement strip. |

### Overlay (10 components)

| Component | Description |
|-----------|-------------|
| `modal` | Preset dialog — sm to full size. |
| `dialog` | Full Radix Dialog primitive suite. |
| `drawer` | Slides in from any edge. |
| `popover` | Floating panel. |
| `hover-card` | Rich hover preview. |
| `context-menu` | Right-click menu. |
| `command-dialog` | ⌘K palette. |
| `confirm-dialog` | Opinionated confirmation with async support. |
| `lightbox` | Full-screen image overlay. |
| `tour` | Multi-step onboarding overlay. |

### Media (5 components)

| Component | Description |
|-----------|-------------|
| `image` | Image with fallback, aspect ratio, caption. |
| `video-player` | HTML5 video with captions support. |
| `audio-player` | Custom audio UI with seek bar, cover art. |
| `carousel` | Autoplay, dots, arrows, loop, slidesPerView. |
| `gallery` | Responsive grid with click handler. |

### Utility (9 components)

| Component | Description |
|-----------|-------------|
| `theme-switcher` | Icon / toggle / select variants. |
| `copy-button` | Icon or labelled copy with success feedback. |
| `keyboard-shortcut` | Styled `<kbd>` shortcut display. |
| `resizable-panel` | Drag-to-resize panel. |
| `drag-drop-area` | Accessible file drop zone. |
| `infinite-scroll` | IntersectionObserver load-more trigger. |
| `virtual-list` | Windowed list for large datasets. |
| `floating-action-button` | FAB with speed-dial actions. |
| `progress-steps` | Animated step tracker. |

---

## Theming & Design Tokens

All colours are defined as HSL CSS custom properties. Override them in your global CSS:

```css
:root {
  --background:   0 0% 100%;
  --foreground:   222.2 47.4% 11.2%;

  --primary:      262 83% 58%;
  --primary-foreground: 0 0% 100%;

  --secondary:    210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted:        210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --accent:       210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --destructive:  0 100% 50%;
  --destructive-foreground: 210 40% 98%;

  --success:      142 76% 36%;
  --warning:      38 92% 50%;
  --info:         217 91% 60%;

  --border:       214.3 31.8% 91.4%;
  --input:        214.3 31.8% 91.4%;
  --ring:         262 83% 58%;

  --radius:       0.5rem;
}
```

**Dark mode overrides** go inside `.dark { … }` — the stylesheet in `veloria-ui/styles` ships these automatically, so you only need to add overrides for tokens you want to change.

---

## Dark Mode

Uses Tailwind's `class` strategy — add the `dark` class to `<html>` and every component flips automatically.

```tsx
import { useTheme, ThemeSwitcher } from "veloria-ui";

export function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="flex items-center justify-between p-4">
      <span>My App</span>
      <ThemeSwitcher value={theme} onChange={setTheme} variant="toggle" />
    </header>
  );
}
```

`ThemeSwitcher` variants: `"icon"` (sun/moon icon), `"toggle"` (animated pill), `"select"` (dropdown).

---

## Hooks Reference

| Hook | Returns | Description |
|------|---------|-------------|
| `useTheme()` | `{ theme, setTheme }` | Current theme and setter. Persists to localStorage. |
| `useMediaQuery(query)` | `boolean` | Reactive media query, SSR-safe. |
| `useClickOutside(ref, cb)` | `void` | Fires callback when clicking outside ref. |
| `useDebounce(value, ms)` | `T` | Debounced value. |
| `useLocalStorage(key, init)` | `[T, setter]` | Persistent state with localStorage. |
| `useCopyToClipboard()` | `{ copy, copied }` | Copy to clipboard with a timed `copied` flag. |
| `useForm(init, validate?)` | `{ values, errors, touched, … }` | Form state, validation, touched tracking. |
| `usePagination(opts)` | `{ page, pages, from, to, … }` | Pagination logic decoupled from UI. |
| `useIntersection(ref, opts)` | `boolean` | IntersectionObserver wrapper, optional `once`. |
| `useWindowSize()` | `{ width, height }` | Reactive window dimensions, SSR-safe. |
| `useStep(max)` | `{ step, next, prev, isFirst, isLast, … }` | Multi-step wizard state. |
| `useCountdown(seconds)` | `{ count, start, pause, reset }` | Countdown timer. |

---

## TypeScript

All components are fully typed. Base types exported from `veloria-ui`:

```ts
import type { VeloriaBaseProps, VeloriaAriaProps } from "veloria-ui";
```

`VeloriaBaseProps` extends `React.HTMLAttributes<HTMLElement>` with `className` and `children`.

Component-specific prop types are co-exported:

```ts
import { Button } from "veloria-ui";
import type { ButtonProps } from "veloria-ui";
```

---

## Accessibility

Every interactive component follows WCAG 2.1 AA. Key commitments:

- All interactive elements have `aria-label` or visible text labels.
- Keyboard navigation works across all components (Tab, Enter, Space, Arrow keys, Escape).
- Focus trapping in Modal, Drawer, Dialog via Radix primitives.
- `aria-live` regions on dynamic content (toasts, alerts, typewriter text).
- `role` attributes on all non-semantic interactive surfaces.
- Tested with VoiceOver (macOS) and NVDA (Windows).

To report an accessibility issue: open a GitHub issue with the `a11y` label.

---

## Framework Guides

### Next.js App Router

```tsx
// app/layout.tsx
import "veloria-ui/styles";
import { VeloriaProvider } from "veloria-ui/provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <VeloriaProvider>{children}</VeloriaProvider>
      </body>
    </html>
  );
}
```

Add `suppressHydrationWarning` to `<html>` — `VeloriaProvider` adds the `dark` class on mount which can cause a hydration mismatch without it.

### Vite + React

```tsx
// src/main.tsx
import "veloria-ui/styles";
import { VeloriaProvider } from "veloria-ui/provider";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <VeloriaProvider>
    <App />
  </VeloriaProvider>
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

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

Quick start:

```bash
git clone https://github.com/JohnDev19/Veloria-UI.git
cd Veloria-UI
npm install
npm run build
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

---

<div align="center">
  <sub>Veloria UI · MIT License · by JohnDev19</sub>
</div>