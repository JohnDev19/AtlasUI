# Veloria UI — Documentation

> Version 0.1.8 · 2026-03-17
> by [JohnDev19](https://github.com/JohnDev19) · [ui-veloria.vercel.app](https://ui-veloria.vercel.app/)

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Setup](#setup)
4. [React Hook Form Adapter](#react-hook-form-adapter)
5. [CLI Reference](#cli-reference)
   - [init](#init)
   - [add](#add)
   - [remove](#remove)
   - [list](#list)
   - [diff](#diff)
   - [upgrade](#upgrade)
6. [Component Categories](#component-categories)
7. [Theming & Design Tokens](#theming--design-tokens)
8. [Dark Mode](#dark-mode)
9. [Hooks Reference](#hooks-reference)
10. [TypeScript](#typescript)
11. [Accessibility](#accessibility)
12. [Framework Guides](#framework-guides)
13. [Contributing](#contributing)
14. [Changelog](#changelog)

---

## Overview

Veloria UI is a copy-paste React component library built for teams that want to own their UI code. It ships a CLI (`veloria-ui`) that copies component source files directly into your project — you edit them freely, no black-box abstraction. Components are built on Radix UI primitives, styled with Tailwind CSS design tokens, and fully typed with TypeScript.

**What makes Veloria UI different:**

- **You own the code.** `veloria-ui add button` copies source into `components/ui/button/index.tsx`. Git-track it, fork it, delete it.
- **Interactive picker.** `veloria-ui add` with no args opens a two-step category → component browser so you never have to guess a component name.
- **`veloria-ui remove`** — cleanly uninstalls components, warns about dependents, and updates `veloria.lock.json`.
- **Dependency graph.** Every `add` shows a full tree of what will be installed — components, auto-pulled registry deps, and npm packages — before anything is written.
- **`veloria-ui diff`** — the first component library with a native terminal diff against upstream. See exactly what changed without leaving your terminal.
- **`veloria-ui upgrade`** — three-state staleness detection keeps your components in sync with upstream without clobbering your local edits.
- **`veloria-ui/rhf`** — a zero-boilerplate React Hook Form adapter sub-path. Drop-in `Controller` wrappers for every form component.
- **No runtime dependency on the library** after you've added a component. The copied file is self-contained.
- **122 components** across 10 categories, with Radix primitives, ARIA attributes, keyboard navigation, and full dark mode out of the box.

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

## React Hook Form Adapter

Import from `veloria-ui/rhf` for zero-boilerplate RHF-integrated form components. Requires `react-hook-form ^7.0.0`.

```tsx
import { useForm } from "react-hook-form";
import { RhfInput, RhfSelect, RhfCheckbox, RhfSlider } from "veloria-ui/rhf";

const { control, handleSubmit } = useForm<{
  email: string; role: string; agree: boolean; volume: number;
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

## CLI Reference

veloria-ui ships a CLI that copies components straight into your project — shadcn-style. You own the code.

```bash
npx veloria-ui init                  # project setup wizard
npx veloria-ui add                   # interactive component picker
npx veloria-ui add button card       # add specific components
npx veloria-ui remove button         # remove an installed component
npx veloria-ui list                  # browse all components
npx veloria-ui list --category forms # filter by category
npx veloria-ui diff button           # compare local vs upstream
npx veloria-ui upgrade               # check all components for upstream changes
npx veloria-ui upgrade --all         # upgrade everything non-interactively
```

---

### `init`

```bash
npx veloria-ui init [options]
```

Sets up veloria-ui in your project. Writes `veloria.config.json` and `lib/utils.ts`. Detects Next.js automatically.

| Option | Description |
|--------|-------------|
| `--typescript` | Use TypeScript (default: `true`) |
| `--tailwind` | Configure Tailwind (default: `true`) |
| `--no-install` | Skip dependency install |
| `-y, --yes` | Skip all prompts, use defaults |

---

### `add`

```bash
npx veloria-ui add [components...] [options]
```

Copies one or more components into your project. Registry dependencies are resolved and added automatically. Records the upstream hash in `veloria.lock.json`.

**When called with no component names, opens an interactive two-step picker:**

```
? Which categories do you want to browse?
  ❯ ◉ Basic              2/11 installed
    ◯ Forms              0/14 installed
    ◉ Feedback           1/16 installed
```

Then per-category:

```
? Basic components
  ❯ ✓  button        Solid, outline, ghost, soft, link, classic variants…
     ◯  badge         Compact label — solid, outline, soft, classic…
     ◯  avatar-group  Stacked avatars with overflow count  [+deps]
```

Already-installed components are pre-ticked with `✓`. Components that pull registry deps show `[+deps]`.

**Dependency graph display**

Every `add` prints a full tree before confirmation so you can see exactly what will be installed:

```
  Adding 2 components (1 selected + 1 auto)

  └── command-bar
      └── command-dialog  (auto — registry dep)

  npm peer deps
  ├── cmdk
  └── @radix-ui/react-dialog
```

**Source resolution**

The CLI resolves component source in this order:

1. `node_modules/veloria-ui/src/components/<category>/` — works offline and on Replit with no network needed.
2. `https://raw.githubusercontent.com/JohnDev19/Veloria-UI/master/src/components/` — fallback when node_modules src is unavailable.

All `atlas-` CSS class prefixes are automatically renamed to `veloria-` on copy.

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip confirmation prompts |
| `--no-install` | Skip peer dep install |
| `-p, --path <dir>` | Override destination directory |
| `--force` | Overwrite existing local files |
| `--dry-run` | Show what would be added without writing anything |

```bash
# Interactive picker
npx veloria-ui add

# Add specific components
npx veloria-ui add button
npx veloria-ui add card modal drawer toast

# Custom output path
npx veloria-ui add select --path src/design-system

# Preview without writing
npx veloria-ui add command-bar --dry-run

# Overwrite existing copies
npx veloria-ui add button --force
```

---

### `remove`

```bash
npx veloria-ui remove <components...> [options]
npx veloria-ui rm <components...>   # alias
```

Removes one or more installed components from your project. Deletes the component file, removes the directory if it becomes empty, and cleans up `veloria.lock.json`.

**Dependent check**

Before removing, the CLI scans your other installed components for `registryDeps` that point to what you are removing. If any are found, it warns and prompts:

```
  ⚠  The following installed components depend on what you're removing:

    avatar-group   →  depends on  avatar
    command-palette  →  depends on  command-dialog

  Remove anyway? (dependents may break)  › No
```

Pass `--force` to skip this check.

**File preview**

Shows exactly what will be deleted before asking for confirmation:

```
  Files to be removed:
    components/ui/button/index.tsx
    components/ui/button/  (directory)
```

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip confirmation prompt |
| `--force` | Remove even if other components depend on it |

```bash
# Remove a single component
npx veloria-ui remove button

# Remove multiple at once
npx veloria-ui remove button card modal

# Remove without confirmation prompt
npx veloria-ui remove skeleton --yes

# Remove even if other components depend on it
npx veloria-ui remove avatar --force

# Using the alias
npx veloria-ui rm modal
```

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
npx veloria-ui list --category data-display
```

---

### `diff`

```bash
npx veloria-ui diff <component> [options]
```

Compares your local copy of a component to the latest upstream source using a Myers diff algorithm. Produces unified-style, colour-coded terminal output.

Source is resolved from `node_modules` first, falling back to the GitHub `master` branch.

| Option | Description | Default |
|--------|-------------|---------|
| `--context <n>` | Lines of context around each hunk | `3` |
| `--json` | Machine-readable JSON output | — |

```bash
npx veloria-ui diff button
npx veloria-ui diff modal --context 6
npx veloria-ui diff input --json
```

**Terminal output example:**

```
  diff  button
  local     components/ui/button/index.tsx
  upstream  node_modules

  +2 additions  -1 deletion

    13  -    "inline-flex items-center justify-center rounded-md",
    14  +    "inline-flex items-center justify-center gap-2 rounded-md",
   ···
    31  +    loading: "opacity-70 cursor-wait",

  To update your local copy, run: npx veloria-ui upgrade button
```

**JSON output shape:**

```json
{
  "component": "button",
  "localPath": "components/ui/button/index.tsx",
  "upstreamUrl": "node_modules",
  "summary": { "added": 2, "removed": 1, "changed": 3 },
  "diff": [
    { "type": "removed", "lineNo": { "local": 13 }, "content": "  ..." },
    { "type": "added",   "lineNo": { "upstream": 13 }, "content": "  ..." }
  ]
}
```

---

### `upgrade`

```bash
npx veloria-ui upgrade [component] [options]
npx veloria-ui up [component] [options]   # alias
```

Checks installed components against upstream and upgrades those that have changed. Uses `veloria.lock.json` for three-state staleness detection.

**Three-state staleness model:**

| State | Meaning |
|-------|---------|
| `up-to-date` | Upstream hash matches hash recorded at install time |
| `upstream-changed` | Upstream changed, local unmodified — safe to auto-upgrade |
| `diverged` | Both upstream and your local file changed — warned before overwriting |
| `no-lock` | Component pre-dates the lock file; falls back to raw content comparison |

| Flag | Description |
|------|-------------|
| `[component]` | Upgrade a single named component |
| `-y, --yes` / `--all` | Upgrade all outdated non-interactively (skips diverged unless `--force`) |
| `--check` | Dry-run — report status only, make no changes |
| `--force` | Overwrite even diverged (locally modified) components |
| `--json` | Machine-readable JSON status report |

```bash
# Check what's outdated (no changes made)
npx veloria-ui upgrade --check

# Interactive upgrade — prompts per component
npx veloria-ui upgrade

# Upgrade a single component
npx veloria-ui upgrade button

# Upgrade everything non-interactively
npx veloria-ui upgrade --all

# CI status report (exits 0 whether outdated or not)
npx veloria-ui upgrade --check --json
```

**`veloria.lock.json`** — written by `add` and updated by `upgrade`. Records the SHA-256 of each component's upstream source at install time, the upstream URL, and timestamps. Commit this file — it's what makes three-state upgrade detection possible.

---

## Component Categories

### Basic (11 components)

| Component | Description |
|-----------|-------------|
| `button` | Solid, outline, ghost, soft, link, classic, danger variants. Loading state, icon slots. |
| `icon-button` | Square or circular icon-only button. |
| `link` | Anchor with external link indicator and underline control. |
| `badge` | Compact label — solid, outline, soft, classic, neutral variants. |
| `avatar` | Image with fallback initials, status ring, 6 sizes. |
| `avatar-group` | Stacked avatars with overflow count. |
| `divider` | Horizontal/vertical separator with optional center label. |
| `tag` | Closable colored tag with icon slot. |
| `chip` | Toggleable chip with avatar/icon and remove button. |
| `tooltip` | Radix tooltip, all four sides, configurable delay. |
| `classic-variant` | Classic beveled-edge style for Button, IconButton, Badge, Tag, Chip, Card. |

### Layout (10 components)

| Component | Description |
|-----------|-------------|
| `container` | Responsive max-width wrapper with padding control. |
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
| `sidebar` | Collapsible side nav with width transition. |
| `menu` | Vertical nav menu with active/disabled states. |
| `dropdown-menu` | Full Radix Dropdown with all sub-primitives. |
| `breadcrumb` | Accessible trail with custom separator. |
| `pagination` | Page numbers with ellipsis and prev/next. |
| `tabs` | Line, pills, enclosed variants. Radix powered. |
| `command-palette` | ⌘K command palette. |
| `navigation-menu` | Radix Navigation Menu for complex navbars. |
| `stepper` | Horizontal/vertical multi-step indicator. |

### Forms (14 components)

| Component | Description |
|-----------|-------------|
| `input` | Left/right icon slots, sizes, error state. |
| `textarea` | Multi-line input with resize control. |
| `select` | Full Radix Select — animated dropdown. |
| `checkbox` | With label, description, error state. |
| `radio-group` | Per-option labels and descriptions. |
| `switch` | Three sizes, label, description. |
| `slider` | Single-thumb range slider. |
| `range-slider` | Dual-thumb slider. |
| `date-picker` | Native date input wrapper. |
| `time-picker` | Native time input wrapper. |
| `number-input` | Stepper with −/+ buttons, min/max/step clamp, keyboard support. |
| `avatar-upload` | Avatar circle with hover camera overlay, instant preview, size validation. |
| `date-range-picker` | Two-calendar date range selector with hover preview and keyboard nav. |
| `form-field` | Label + input + error wrapper. |

### Advanced Forms (13 components)

| Component | Description |
|-----------|-------------|
| `file-upload` | Drag-and-drop zone with click-to-upload fallback. |
| `otp-input` | PIN/OTP with auto-advance and paste support. |
| `color-picker` | Swatches + hex input. |
| `search-input` | Search with loading state and clear button. |
| `password-input` | Password with show/hide toggle. |
| `combobox` | Searchable single-value select. |
| `multi-select` | Multi-value select with chips. |
| `phone-input` | International phone number with country dial-code selector. |
| `tag-input` | Type and press Enter to add inline tags. |
| `currency-input` | Formatted number input with locale-aware currency symbol. |
| `rating-input` | Star rating picker with hover state, clear button, read-only mode. |
| `rich-text-editor` | Tiptap-based editor with toolbar, headings, lists, code blocks, links. |
| `multi-step-form` | Compound multi-step form with per-step validation and animated transitions. |

### Data Display (22 components)

| Component | Description |
|-----------|-------------|
| `card` | Surface with header/content/footer slots. 6 variants. |
| `table` | Full HTML table system. |
| `data-table` | Sortable data table with loading and empty states. |
| `data-grid` | Spreadsheet-grade grid — column resizing, virtualisation, inline editing. |
| `list` | Simple, bordered, and divided lists. |
| `list-item` | List item with icon and extra slot. |
| `statistic` | Key metric with trend indicator. |
| `timeline` | Vertical events with color-coded icons. |
| `calendar` | Month picker with highlighted dates. |
| `code-block` | Code display with copy button and line numbers. |
| `chart` | Chart wrapper — bring your own chart library. |
| `stats-card` | Metric card with icon, trend indicator, and loading skeleton. |
| `tree-view` | Nested expandable tree with keyboard navigation. |
| `json-viewer` | Collapsible syntax-highlighted JSON tree. |
| `heatmap` | GitHub-style activity grid with value intensity scale. |
| `kanban-board` | Drag-and-drop column board with card tagging and assignee slot. |
| `sparkline-chart` | Zero-dep SVG inline trend line with area fill and animated draw. |
| `radial-progress-chart` | Multi-segment animated SVG ring chart with center label and legend. |
| `gauge-chart` | Half-circle SVG gauge with animated needle and colour zones. |
| `aurora-card` | Dark card with mouse-reactive aurora gradient blobs and glassmorphism. |
| `pricing-card` | Pricing tier with features list, CTA, popular badge, monthly/annual toggle. |
| `file-card` | File attachment display with type badge, size, progress bar. |

### Feedback (16 components)

| Component | Description |
|-----------|-------------|
| `alert` | Info/success/warning/danger with optional dismiss. |
| `toast` | Radix Toast with all sub-primitives. |
| `snackbar` | Positioned message with action. |
| `progress` | Linear bar with color variants. |
| `circular-progress` | SVG ring with indeterminate mode. |
| `skeleton` | Pulse placeholder for text, rect, circle. |
| `loading-spinner` | Accessible SVG spinner. |
| `empty-state` | Icon + title + description + action. |
| `status-indicator` | Online/offline/busy/away dot with pulse. |
| `notification` | Notification item with avatar, timestamp, unread dot. |
| `banner-alert` | Full-width top-of-page announcement strip with 4 variants. |
| `confirm-dialog` | Opinionated confirmation modal with async confirm and danger variant. |
| `floating-action-button` | FAB with expandable speed-dial actions and 3 position presets. |
| `rich-tooltip` | Tooltip with title, description, and action slot. |
| `tour` | Multi-step onboarding overlay with dot progress indicator. |
| `step-progress` | Animated segmented progress bar for multi-step checkout flows. |

### Overlay (11 components)

| Component | Description |
|-----------|-------------|
| `modal` | Preset dialog — sm to full size variants. |
| `dialog` | Full Radix Dialog primitive suite. |
| `drawer` | Slides in from any edge. |
| `sheet` | Drawer alias. |
| `popover` | Floating panel. |
| `hover-card` | Rich hover preview. |
| `context-menu` | Right-click menu. |
| `command-dialog` | ⌘K palette. |
| `command-bar` | Persistent Linear-style command bar with grouped actions and live search. |
| `lightbox` | Full-screen image overlay. |
| `image-viewer` | Lightbox alias. |

### Media (5 components)

| Component | Description |
|-----------|-------------|
| `image` | Image with fallback, aspect ratio, fit, caption. |
| `video-player` | HTML5 video with captions/subtitles support. |
| `audio-player` | Custom audio UI with seek bar, cover art. |
| `carousel` | Autoplay, dots, arrows, loop, slidesPerView. |
| `gallery` | Responsive image grid with click handler. |

### Utility (8 components)

| Component | Description |
|-----------|-------------|
| `theme-switcher` | Icon / toggle / select variants. |
| `copy-button` | Icon or labelled copy button with success feedback. |
| `keyboard-shortcut` | Styled `<kbd>` shortcut display. |
| `resizable-panel` | Drag-to-resize panel with min/max constraints. |
| `drag-drop-area` | Accessible file drop zone. |
| `infinite-scroll` | IntersectionObserver-based load-more trigger with loader slot. |
| `virtual-list` | Windowed list renderer for large datasets. |
| `typewriter-text` | Cycles through strings with character-by-character typing animation. |

---

## Theming & Design Tokens

All tokens are CSS custom properties defined in `veloria.css` and consumed via Tailwind classes.

```css
/* Core palette */
--background       --foreground
--card             --card-foreground
--popover          --popover-foreground
--primary          --primary-foreground
--secondary        --secondary-foreground
--muted            --muted-foreground
--accent           --accent-foreground
--destructive      --destructive-foreground
--border           --input            --ring

/* Semantic */
--success          --success-foreground
--warning          --warning-foreground
--info             --info-foreground

/* Radius */
--radius-sm   --radius   --radius-md   --radius-lg   --radius-full
```

Override any token in your `globals.css`:

```css
:root {
  --primary: 262 83% 58%;           /* purple */
  --radius: 0.25rem;                /* sharper corners */
}
```

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

## Hooks Reference

| Hook | Description |
|------|-------------|
| `useDisclosure` | open/close state with `toggle`, `open`, `close` helpers |
| `useMediaQuery` | reactive window media query subscription |
| `useBreakpoint` | Tailwind breakpoint helper |
| `useClipboard` | clipboard copy with configurable timeout feedback |
| `useLocalStorage` | persistent state synced to localStorage |
| `useTheme` | theme switching — persists to localStorage |
| `useDebounce` | debounced value with configurable delay |
| `useOnClickOutside` | outside click detection |
| `useKeydown` | keyboard shortcut listener with modifier support |
| `useMounted` | SSR-safe mount check |
| `useToast` | programmatic toast queue |
| `useForm` | form state and validation with touched tracking |
| `usePagination` | pagination logic decoupled from UI, with from/to helpers |
| `useIntersection` | IntersectionObserver wrapper with optional `once` mode |
| `useWindowSize` | reactive window width/height, SSR-safe |
| `useStep` | multi-step wizard state with `isFirst`, `isLast`, progress |
| `useCountdown` | countdown timer with `start`, `pause`, `reset` controls |
| `useCommandBar` | open/close the CommandBar programmatically from anywhere |

---

## TypeScript

All components export their prop types. Import directly:

```ts
import type { ButtonProps, InputProps, CardProps } from "veloria-ui";
```

When you copy a component with `veloria-ui add`, the TypeScript source is copied too — you own it and can extend the types freely.

---

## Accessibility

All interactive components include:

- Appropriate ARIA roles and attributes
- Full keyboard navigation (Tab, Arrow keys, Enter, Space, Escape)
- Visible focus rings using the `--ring` design token
- Screen reader friendly labels and live regions
- Radix UI primitives for disclosure, dialog, menu, and select patterns

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
      <body>
        <VeloriaProvider>{children}</VeloriaProvider>
      </body>
    </html>
  );
}
```

### Vite / React

```tsx
// src/main.tsx
import "veloria-ui/styles";
import { VeloriaProvider } from "veloria-ui/provider";
import { createRoot } from "react-dom/client";
import App from "./App";

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
      <head><Links /></head>
      <body>
        <VeloriaProvider><Outlet /></VeloriaProvider>
      </body>
    </html>
  );
}
```

---

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

→ [github.com/JohnDev19/Veloria-UI/issues](https://github.com/JohnDev19/Veloria-UI/issues)

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

Current version: **0.1.8** — Interactive picker, `remove` command, dep graph display.