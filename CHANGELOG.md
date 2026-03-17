# Changelog

All notable changes to Veloria UI are documented here.  
Project by [JohnDev19](https://github.com/JohnDev19) · [GitHub](https://github.com/JohnDev19/Veloria-UI) · [ui-veloria.vercel.app](https://ui-veloria.vercel.app/)

This project follows [Semantic Versioning](https://semver.org).

---

## [0.1.5] — 2026-03-17

### CLI — Three major UX enhancements

---

#### `veloria-ui add` — Interactive component picker

Running `veloria-ui add` with no component names now launches a full interactive picker instead of printing a usage hint. The picker is a two-step flow built on `prompts` multiselect:

**Step 1 — Category select**

A multiselect showing all 10 categories with a live `installed/total` counter so you can see at a glance which areas of your project already have components:

```
? Which categories do you want to browse?
  ❯ ◉ Basic              2/11 installed
    ◯ Forms              0/14 installed
    ◉ Feedback           1/16 installed
    ◯ Data Display       0/22 installed
```

**Step 2 — Component select per category**

For each chosen category, a multiselect shows every component with:
- A `✓` prefix on components that are already installed in your project
- A truncated description so you know what you're selecting
- A `[+deps]` hint on components that will auto-pull registry dependencies

```
? Basic components
  ❯ ✓  button        Solid, outline, ghost, soft, link, classic variants…
     ◯  badge         Compact label — solid, outline, soft, classic…
     ◯  avatar-group  Stacked avatars with overflow count  [+deps]
     ✓  tooltip       Radix tooltip, all four sides…
```

Already-installed components are pre-ticked but will be skipped (not re-copied) unless `--force` is passed. A summary line at the end tells you exactly which components were skipped and why.

**New `--dry-run` flag for `add`**

Added to both the interactive and direct modes. Shows what files would be written and which npm packages would be installed, without touching anything:

```bash
npx veloria-ui add button modal --dry-run
npx veloria-ui add --dry-run   # works with interactive picker too
```

Output:
```
  Dry run — no files written.

  Would copy to: components/ui/
    button/index.tsx
    modal/index.tsx

  Would install: @radix-ui/react-slot, @radix-ui/react-dialog, clsx, …
```

---

#### `veloria-ui remove` — Uninstall components

New command (alias: `rm`) to remove installed components cleanly.

```bash
npx veloria-ui remove button
npx veloria-ui remove button card modal
npx veloria-ui rm avatar-group   # alias
```

**Dependent check** — before removing, the CLI scans your other installed components for `registryDeps` entries that point to what you are about to remove. If any are found, it warns you:

```
  ⚠  The following installed components depend on what you're removing:

    avatar-group  →  depends on  avatar
    command-palette  →  depends on  command-dialog

  Remove anyway? (dependents may break)  › No
```

Pass `--force` to skip the warning and remove unconditionally.

**File preview** — shows exactly which files and directories will be deleted before asking for confirmation:

```
  Files to be removed:
    components/ui/button/index.tsx
    components/ui/button/  (directory)
```

**Lock cleanup** — removes the component entry from `veloria.lock.json` automatically, keeping your lock file accurate.

**Flags:**

| Flag | Description |
|------|-------------|
| `<components...>` | One or more component names to remove |
| `-y, --yes` | Skip confirmation prompt |
| `--force` | Remove even if other components depend on it |

```bash
# Remove a single component
npx veloria-ui remove button

# Remove multiple at once
npx veloria-ui remove button card modal

# Remove without confirmation
npx veloria-ui remove skeleton --yes

# Remove even if dependents exist
npx veloria-ui remove avatar --force
```

---

#### `add` — Dependency graph display

Every `veloria-ui add` invocation (interactive or direct) now prints a structured dependency tree before the confirmation prompt. The tree shows:

- Which components you explicitly selected
- Which components are being auto-pulled via `registryDeps` (shown in yellow with an `(auto — registry dep)` label)
- Which npm packages will be installed as peer dependencies

```
  Adding 3 components (2 selected + 1 auto)

  ├── command-bar
  │   └── command-dialog  (auto — registry dep)
  └── avatar-group
      └── avatar  (auto — registry dep)

  npm peer deps
  ├── cmdk
  ├── @radix-ui/react-dialog
  └── @radix-ui/react-avatar
```

For components with no registry deps or npm deps, the output is minimal:

```
  Adding 1 component

  └── button

  npm peer deps
  ├── @radix-ui/react-slot
  ├── class-variance-authority
  ├── clsx
  └── tailwind-merge
```

This replaces the previous flat `Peer deps: …` line and makes the install plan fully transparent before anything is written to disk.

---

### Bug Fixes

- `add` with `--force` on a component that pulls `registryDeps` now correctly overwrites the dep files too, not only the top-level component.
- `upgrade` hint at the bottom of `list` now correctly says `npx veloria-ui add` (not `add <n>`) to reflect the new interactive mode.

### React Hook Form Adapter — `veloria-ui/rhf`

A new optional sub-path export that provides zero-boilerplate `Controller` wrappers for every Veloria UI form component. Import from `veloria-ui/rhf` — requires `react-hook-form ^7.0.0` as an optional peer dependency.

**11 wrappers shipped:**

| Wrapper | Wraps | Notes |
|---------|-------|-------|
| `RhfInput` | `Input` + `FormField` | All `InputProps` forwarded (size, leftElement, rightElement…) |
| `RhfTextArea` | `TextArea` + `FormField` | Full resize/rows control |
| `RhfSelect` | Radix `Select` + `FormField` | `onValueChange` bridged to `field.onChange` |
| `RhfCheckbox` | `Checkbox` + `FormField` | Boolean field — `checked` ↔ `field.value` |
| `RhfSwitch` | `Switch` + `FormField` | Same boolean mapping as `RhfCheckbox` |
| `RhfRadioGroup` | `RadioGroup` + `FormField` | `onValueChange` → `field.onChange` |
| `RhfSlider` | `Slider` + `FormField` | Stores plain `number`, converts to `number[]` internally |
| `RhfCombobox` | `Combobox` + `FormField` | `onChange` bridged to `field.onChange` |
| `RhfMultiSelect` | `MultiSelect` + `FormField` | Field value is `string[]` |
| `RhfRatingInput` | `RatingInput` + `FormField` | Numeric value |
| `RhfOTPInput` | `OTPInput` + `FormField` | String value |

Every wrapper automatically maps `fieldState.error` to the component's `invalid` prop and renders `<FormError>` with the message. All original visual props (`size`, `placeholder`, `disabled`, `label`, etc.) pass straight through — no new API surface to learn.

**Usage:**

```tsx
import { useForm } from "react-hook-form";
import { RhfInput, RhfSelect, RhfCheckbox } from "veloria-ui/rhf";

const { control, handleSubmit } = useForm<{ email: string; role: string; agree: boolean }>();

<form onSubmit={handleSubmit(onSubmit)}>
  <RhfInput    name="email"  control={control} label="Email" type="email" />
  <RhfSelect   name="role"   control={control} label="Role"  options={roles} />
  <RhfCheckbox name="agree"  control={control} label="I agree to the terms" />
</form>
```

### Build

- `veloria-ui/rhf` entry added to `exports` map in `package.json`
- New tsup build target for `src/rhf/index.ts` (CJS + ESM + DTS)
- `react-hook-form` added to `sharedExternal` — never bundled
- `veloria-ui` itself added to `sharedExternal` — prevents self-resolution error during the RHF build pass
- All `Rhf*.tsx` files import from `../index` (relative source path) rather than `"veloria-ui"` package name — eliminates circular resolve during build

### Infrastructure

- `.npmrc` added with `public-hoist-pattern[]=tsup` and `public-hoist-pattern[]=typescript` so `pnpm install` always hoists build tool binaries to `node_modules/.bin` — fixes `tsup: not found` on Replit and similar isolated-store environments
- `react-hook-form ^7.0.0` added as optional peer dependency

### New Components (5)

**`DataGrid`** (`data-display`)
A spreadsheet-grade table built entirely without external grid libraries. Implements row virtualisation with a configurable overscan so 100k-row datasets render at 60fps. Columns are resizable by dragging the right edge of any header. Cells are editable on double-click with Tab-to-next-cell navigation and Enter/Escape to commit/cancel. Supports multi-column sorting (click header to cycle asc/desc), row selection via a `selectedRows` Set, right-click-to-copy on any cell, a `render` slot per column for custom cell content, and animated skeleton loading rows. Zero external dependencies beyond React.

```tsx
<DataGrid
  columns={[
    { key: "name",  header: "Name",   sortable: true,  editable: true, width: 200 },
    { key: "email", header: "Email",  sortable: true,  width: 260 },
    { key: "role",  header: "Role",   editable: true },
    { key: "status", header: "Status", render: (v) => <Badge>{String(v)}</Badge> },
  ]}
  rows={users}
  height={480}
  onChange={setUsers}
  selectedRows={selected}
  onRowSelect={setSelected}
/>
```

**`RichTextEditor`** (`advanced-forms`)
A Tiptap-based editor styled to match the design system. Toolbar covers headings (H1–H3), bold, italic, underline, strikethrough, inline code, text alignment (left/center/right), bullet list, ordered list, blockquote, code block with syntax highlighting via `lowlight`, link, undo/redo. A `BubbleMenu` appears on text selection for quick bold/italic/link access. Controlled via `value`/`onChange` (HTML string). Supports `minHeight`, `maxHeight` (scrollable), `disabled`, `placeholder`, and `autofocus`. All toolbar icons are inline SVG — no icon library dependency.

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  placeholder="Write something…"
  minHeight={300}
/>
```

**`DateRangePicker`** (`forms`)
A full custom two-calendar date range popover — not a wrapper around a native `<input type="date">`. Renders two side-by-side month grids (configurable to one with `numberOfMonths={1}`). Selection is two-click: first click sets the anchor, second sets the end. Hover preview shows the in-range highlight as you move the cursor. Edge days (from/to) get a filled primary circle; in-range days get a tinted background strip with squared-off edges connecting to the edge circles. Supports `minDate`, `maxDate`, a `disabledDates` predicate, and a `format` override for the trigger label. Clear button appears once a range is set.

```tsx
<DateRangePicker
  value={range}
  onChange={setRange}
  numberOfMonths={2}
  placeholder="Select date range"
/>
```

**`CommandBar`** (`overlay`)
A persistent ⌘K command bar in the style of Linear/Vercel. Renders as a floating dialog at 20% from the top. Registers `Cmd+K` / `Ctrl+K` globally via a `useCommandBar` hook that can also be called standalone. Actions are grouped, searchable by label/description/keywords, and can carry keyboard shortcut hints rendered as `<kbd>` chips. The empty-state query shows recent actions (passed as `recentIds`). Built on cmdk + Radix Dialog. Footer row shows ↑↓ navigate, ↵ select, ⌘K to open.

```tsx
<CommandBar
  actions={actions}
  recentIds={recentActionIds}
  open={open}
  onOpenChange={setOpen}
/>
```

**`MultiStepForm`** (`advanced-forms`)
A compound component that wires Stepper + form state + per-step async validation + animated slide transitions into a single coherent API. Each step definition can include a `validate` function returning an error map; the nav button won't advance until it resolves cleanly. Shared form data accumulates across steps and is handed to `onComplete` at the end. The `useMultiStepForm` hook exposes `setField`, `setError`, `clearError`, `next`, `back`, `goTo`, and `progress` to any child. The stepper renders in two layouts: `"top"` (horizontal with connector lines) and `"left"` (vertical sidebar). Completed steps are clickable to jump back. `MultiStepFormNav` renders the Back/Continue buttons with a progress bar above them.

```tsx
<MultiStepForm steps={steps} onComplete={handleSubmit} stepperPosition="top">
  <MultiStepFormStepPanel>
    <AccountFields />
  </MultiStepFormStepPanel>
  <MultiStepFormStepPanel>
    <ProfileFields />
  </MultiStepFormStepPanel>
  <MultiStepFormStepPanel>
    <ReviewStep />
  </MultiStepFormStepPanel>
  <MultiStepFormNav />
</MultiStepForm>
```

### Registry

Five new entries added to `src/cli/registry.ts` under `// ── v0.1.7 additions`. See `registry-additions.ts` for the exact entries to splice in.

### Dependencies added (peer, optional per component)

| Component | New deps |
|-----------|----------|
| `RichTextEditor` | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`, `@tiptap/extension-link`, `@tiptap/extension-underline`, `@tiptap/extension-text-align`, `@tiptap/extension-code-block-lowlight`, `lowlight` |
| `DateRangePicker` | `@radix-ui/react-popover` (already peer dep) |
| `CommandBar` | `cmdk`, `@radix-ui/react-dialog` (already peer deps) |
| `DataGrid` | none |
| `MultiStepForm` | none |

---

## [0.1.4] — 2026-03-17

### CLI

#### `veloria-ui upgrade` — new command

Reads `veloria.config.json`, discovers every component you have installed, checks each one against the latest upstream source on GitHub, and prompts you to upgrade those that have changed. Modelled on `npm outdated` but for copied source files — the first component library to ship this natively.

**Discovery** — scans your components directory for sub-folders matching registry names, then cross-references `veloria.lock.json` to catch any components stored at non-standard paths. No manual component list needed.

**Three-state staleness model** powered by `veloria.lock.json` (written/updated by `add` and `upgrade`):

| State | Meaning |
|-------|---------|
| `up-to-date` | Upstream hash matches the hash recorded at install time |
| `upstream-changed` | Upstream changed since install, but your local file is unmodified — safe to auto-upgrade |
| `diverged` | Both upstream and your local file have changed — warned before overwriting |
| `no-lock` | Component pre-dates the lock file; falls back to raw content comparison |

**Interactive prompt per outdated component** — shows `+N -N` change counts and offers three choices: upgrade, show full diff first (then decide), or skip.

**Flags:**

| Flag | Description |
|------|-------------|
| `[component]` | Upgrade a single named component |
| `-y, --yes` / `--all` | Upgrade all outdated non-interactively (skips diverged unless `--force`) |
| `--check` | Dry-run — report status only, make no changes |
| `--force` | Overwrite even diverged (locally modified) components |
| `--json` | Machine-readable JSON status report |

```bash
# Check what's outdated (no changes)
npx veloria-ui upgrade --check

# Interactive upgrade — prompts per component
npx veloria-ui upgrade

# Upgrade a single component
npx veloria-ui upgrade button

# Upgrade everything non-interactively
npx veloria-ui upgrade --all

# CI status report
npx veloria-ui upgrade --check --json
```

**`veloria.lock.json`** — new file written by `add` and updated by `upgrade`. Records the SHA-256 of each component's upstream source at install time, the upstream URL, and timestamps. Commit this file — it's what makes three-state upgrade detection possible.

#### `add` — updated

- Now fetches and writes real upstream source (not stubs) when GitHub is reachable.
- Records the upstream content hash and URL in `veloria.lock.json` at add time.
- Added `--force` flag to overwrite existing local files.

#### `diff` — updated

- The "To update" hint at the end of diff output now points to `npx veloria-ui upgrade <component>` instead of `add --force`.

---

## [0.1.4] — 2026-03-17

### CLI

#### `veloria-ui diff <component>` — now fully implemented

Previously this command printed a "not implemented yet" warning. It is now a fully working line-by-line diff engine:

- **Fetches upstream source** directly from the GitHub raw API (`raw.githubusercontent.com`) — no npm registry round-trip needed.
- **Locates your local copy** automatically by reading `veloria.config.json` (falls back to `components/ui/<n>/index.tsx` and several other candidate paths).
- **Myers diff algorithm** — the same LCS-based algorithm used by Git. Produces the minimal edit set between your local file and the upstream source.
- **Unified-style terminal output** — colour-coded hunks (`+` in green, `-` in red) with configurable context lines, summary counts, and `···` separators between hunks.
- **`--json` flag** — machine-readable JSON output containing the full diff array and summary, suitable for CI pipelines or editor integrations.
- **`--context <n>` flag** — control how many context lines appear around each change (default: 3).
- **Graceful error handling** — clear messages when the component is not found locally (with an `add` hint), when the upstream fetch fails (with the checked URLs listed), or when the component name is unknown.
- **Multi-path resolution** — tries both a dedicated `<Component>.tsx` file and the category `index.tsx` to handle components that are co-located with siblings.

```bash
# Basic usage
npx veloria-ui diff button

# More context around changes
npx veloria-ui diff modal --context 6

# CI-friendly JSON output
npx veloria-ui diff input --json
```

---

## [0.1.3] — 2026-03-16 (Edited)

### Branding & Naming

- Renamed all `atlas-` CSS keyframe and class prefixes to `veloria-` throughout `veloria.css`
- Renamed `atlas.css` to `veloria.css` — update your import to `import "veloria-ui/styles"`
- Renamed `atlasPlugin` → `veloriaPlugin` and `atlasPreset` → `veloriaPreset` in `tailwind.ts`
- Renamed `AtlasProvider` → `VeloriaProvider` and `AtlasProviderProps` → `VeloriaProviderProps` in `provider.tsx`
- Renamed `AtlasTheme` type → `VeloriaTheme` in `hooks/index.ts`
- Renamed `AtlasBaseProps` → `VeloriaBaseProps` and `AtlasAriaProps` → `VeloriaAriaProps` in `types/index.ts`
- Renamed `atlas.config.json` → `veloria.config.json` — CLI `init` now writes `veloria.config.json`
- Renamed localStorage theme key from `atlas-theme` to `veloria-theme`
- Removed legacy `atlas` bin alias from `package.json`
- Updated all homepage and docs URLs to `https://ui-veloria.vercel.app/`
- Removed hardcoded component count from descriptions and CLI copy

### Bug Fixes

- Fixed `TypeError: Cannot read properties of null (reading 'matches')` — `window.matchMedia` now uses optional chaining (`?.`) in `useTheme` and an explicit null guard in `useMediaQuery`, preventing crashes in jsdom and certain SSR environments

---

## [0.1.2] — 2026-03-15 (UPDATED)

### New Components (20)

**Advanced Forms**
- `PhoneInput` — international phone number with country dial-code selector
- `TagInput` — type and press Enter to add inline tags, supports max, duplicates control
- `CurrencyInput` — formatted number input with locale-aware currency symbol
- `RatingInput` — star rating picker with hover state, clear button, and read-only mode

**Data Display**
- `StatsCard` — metric card with icon, trend indicator, and loading skeleton
- `TreeView` — nested expandable tree with keyboard navigation and multi-depth support
- `JsonViewer` — collapsible syntax-highlighted JSON tree with configurable max depth
- `Heatmap` — GitHub-style activity grid with value intensity scale
- `KanbanBoard` — drag-and-drop column board with card tagging and assignee slot

**Feedback and Overlay**
- `BannerAlert` — full-width top-of-page announcement strip with 4 variants
- `ConfirmDialog` — opinionated confirmation modal with async confirm support and danger variant
- `FloatingActionButton` — FAB with expandable speed-dial actions and 3 position presets
- `RichTooltip` — tooltip with title, description, and action slot
- `Tour` — multi-step onboarding overlay with dot progress indicator

**Utility**
- `InfiniteScroll` — IntersectionObserver-based load-more trigger with loader slot
- `VirtualList` — windowed list renderer for large datasets with configurable overscan

### New Hooks (6)

- `useForm` — form state and validation with touched tracking, no extra dependencies
- `usePagination` — pagination logic decoupled from UI, with from/to helpers
- `useIntersection` — IntersectionObserver wrapper with optional `once` mode
- `useWindowSize` — reactive window width and height, SSR-safe
- `useStep` — multi-step wizard state with `isFirst`, `isLast`, and progress percentage
- `useCountdown` — countdown timer with `start`, `pause`, and `reset` controls

---

## [0.1.1] — 2026-03-13 (UPDATED)

### Build fixes

- Fixed `tailwindcss/plugin` resolve error — marked as external in tsup, switched to `require()` at runtime
- Fixed `"types"` export condition ordering in `package.json` — `types` now comes before `import`/`require`
- Fixed `use-toast.ts` renamed to `use-toast.tsx` — file contained JSX but had `.ts` extension
- Fixed `TS2320` / `TS2322` conflicts across all component interfaces — `HTMLAttributes` built-in props (`color`, `size`, `title`, `prefix`, `onChange`, `onDrop`, `onDragOver`) now properly `Omit`-ed before extending
- Renamed package from `veloria-ui-kit` to `veloria-ui`
- CLI `--version` flag now reads dynamically from `package.json` instead of being hardcoded

---

## [0.1.0] — 2024-06-28

### Initial Release

First public release of Veloria UI. A full CLI, hooks, a Tailwind plugin, and a complete CSS token system with light + dark mode.

---

#### veloria-ui

**Basic (10)**
- `Button` — solid, outline, ghost, soft, link, danger variants · sizes xs–xl · loading state · left/right icon slots
- `IconButton` — square or circular icon-only button with all button variants
- `Link` — anchor with external link indicator and underline control
- `Badge` — compact label with 5 color variants and optional dot
- `Avatar` — image with fallback initials, online/offline status ring, 6 sizes
- `AvatarGroup` — stacked avatar row with overflow count
- `Divider` — horizontal/vertical with optional center label
- `Tag` — closable colored tag with icon slot
- `Chip` — toggleable with avatar/icon support and remove button
- `Tooltip` — Radix-powered, all four sides, configurable delay

**Layout (10)**
- `Container` — responsive max-width wrapper with padding control
- `Stack` — flex column/row with gap, align, justify, and divider support
- `Grid` — CSS Grid with column/row/gap config
- `Flex` — inline flex with full directional control
- `Section` — semantic `<section>` with vertical padding presets
- `Spacer` — invisible spacer
- `AspectRatio` — Radix aspect-ratio wrapper
- `Center` — flex centering helper
- `ScrollArea` — custom scrollbar via Radix ScrollArea
- `Masonry` — CSS multi-column masonry grid

**Navigation (10)**
- `Navbar` — sticky + glass-blur top bar
- `Sidebar` — collapsible with width transition
- `Menu` / `MenuItem` — vertical nav with active/disabled states
- `DropdownMenu` — full Radix Dropdown with all sub-primitives
- `Breadcrumb` — accessible trail with custom separator
- `Pagination` — page numbers, ellipsis, prev/next
- `Tabs` — line, pills, enclosed variants · Radix powered
- `Stepper` — horizontal/vertical multi-step progress indicator
- `CommandDialog` — ⌘K command palette via cmdk

**Forms (10)**
- `Input` — left/right icon slots, sizes, error state
- `TextArea` — resize control, error state
- `Select` — full Radix Select with all sub-primitives
- `Checkbox` — with label, description, error state
- `RadioGroup` — per-option labels and descriptions
- `Switch` — three sizes, label, description
- `Slider` — range slider
- `RangeSlider` — dual-thumb slider
- `DatePicker` — calendar popover with keyboard navigation
- `TimePicker` — hour/minute/second with AM/PM toggle

**Advanced Forms (10)**
- `FileUpload` — drag-and-drop with preview, size limit, MIME type filter
- `OTPInput` — SMS-style one-time-password input
- `ColorPicker` — HEX/RGB/HSL input with swatch palette
- `SearchInput` — debounced search with clear button
- `PasswordInput` — toggle visibility with strength meter
- `Combobox` — searchable dropdown with keyboard navigation
- `MultiSelect` — tag-style multi-value select
- `FormField` — label + input + error wrapper
- `FormLabel` — accessible label
- `FormError` — error message slot

**Data Display (10)**
- `Card` / `CardHeader` / `CardContent` / `CardFooter`
- `Table` — sortable columns, sticky header
- `DataTable` — full-featured table with pagination and row selection
- `List` / `ListItem`
- `Statistic` — large number with label and trend
- `Timeline` — vertical event list
- `Calendar` — month grid with event dots
- `Chart` — wrapper around Recharts with theme tokens
- `CodeBlock` — syntax-highlighted code with copy button

**Feedback (10)**
- `Alert` — inline alert with 5 variants and icon slot
- `Toast` — Radix Toast with 5 variants · programmatic via `useToast`
- `Snackbar` — bottom-anchored status message
- `Progress` — linear with animated fill
- `CircularProgress` — SVG ring with percentage label
- `Skeleton` — text, rect, circle variants
- `LoadingSpinner` — 4 sizes · 3 variants
- `EmptyState` — icon + title + description + action slot
- `StatusIndicator` — colored dot with pulse animation
- `Notification` — card-style notification with timestamp

**Overlay (10)**
- `Modal` — centered dialog with close button
- `Dialog` — full Radix Dialog with all sub-primitives
- `Drawer` — side-sheet with 4 sides
- `Sheet` — lightweight Drawer alias
- `Popover` — Radix Popover
- `HoverCard` — hover-triggered card
- `ContextMenu` — right-click menu via Radix
- `CommandDialog` — ⌘K palette
- `Lightbox` — full-screen image viewer with zoom
- `ImageViewer` — in-place image pan and zoom

**Media (5)**
- `Image` — next/image wrapper with blur placeholder and fallback
- `VideoPlayer` — custom controls, poster, autoplay, loop, track support
- `AudioPlayer` — custom UI with seek bar, cover art
- `Carousel` — autoplay, dots, arrows, loop, slidesPerView
- `Gallery` — responsive image grid with click handler

**Utility (5)**
- `ThemeSwitcher` — icon / toggle / select variants
- `CopyButton` — icon or labelled button with success feedback
- `KeyboardShortcut` — styled `<kbd>` shortcut display
- `ResizablePanel` — drag-to-resize with min/max constraints
- `DragDropArea` — accessible file drop zone

#### Hooks
- `useDisclosure` — open/close state management
- `useMediaQuery` — window media query subscription
- `useBreakpoint` — Tailwind breakpoint helper
- `useClipboard` — clipboard copy with timeout feedback
- `useLocalStorage` — persistent state
- `useTheme` — theme switching (persists to localStorage)
- `useDebounce` — debounced value
- `useOnClickOutside` — outside click detection
- `useKeydown` — keyboard shortcut listener with modifier support
- `useMounted` — SSR-safe mount check
- `useToast` — programmatic toast notifications

#### Infrastructure
- Tailwind CSS plugin + preset (`veloriaPlugin`, `veloriaPreset`)
- Full CSS design token system — light and dark themes
- `VeloriaProvider` for Next.js App Router
- TypeScript strict throughout — full named type exports
- Tree-shakeable ESM + CJS dual build via tsup
- Turbo monorepo setup

#### veloria-ui CLI
- `init` — project setup wizard (detects Next.js, writes veloria.config.json)
- `add` — copies components + installs npm deps, resolves Veloria UI peer deps
- `list` — browse all components filtered by category
- `diff` — compare local copy to latest (registry fetch, coming soon)
- Auto-detects npm / pnpm / yarn / bun