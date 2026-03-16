# Changelog

All notable changes to Veloria UI are documented here.
Project by [JohnDev19](https://github.com/JohnDev19) · [GitHub](https://github.com/JohnDev19/Veloria-UI) · [ui-veloria.vercel.app](https://ui-veloria.vercel.app/)

This project follows [Semantic Versioning](https://semver.org).

---

## [0.1.4] — 2026-03-16

### New Components (10)

**Charts**
- `SparklineChart` — zero-dependency SVG inline trend line with optional area fill, animated draw-on, and end-point dot. Designed to slot directly into `StatsCard` or any compact metric surface. No external chart library needed.
- `RadialProgressChart` — multi-segment animated SVG donut ring. Each arc is independently sized via `stroke-dasharray`, eased in on mount, with a customizable center label slot and an optional colour legend below.
- `GaugeChart` — half-circle SVG gauge with a `requestAnimationFrame`-driven animated needle, configurable colour zones (green → amber → red by default), per-zone stroke arcs, and rendered min/max/value labels. Fully controlled via `value`, `min`, `max`, and `zones` props.

**Modern & Unique**
- `AuroraCard` — dark-surface card with three aurora gradient blobs that track mouse position via `onMouseMove` offset math. Each blob moves at a different speed and direction, creating a parallax aurora effect. The content renders inside a relative `z-10` panel on top. Zero external dependencies — pure CSS transforms + inline style.
- `TypewriterText` — cycles through a `strings[]` array, typing each character-by-character then erasing, with configurable `speed`, `deleteSpeed`, `pause`, `cursor`, and `loop` props. Cursor blinks independently of the typing loop via a separate `setInterval`. Accessible with `aria-live="polite"`.

**Data Display**
- `FileCard` — file attachment surface with auto-derived type badge (colour-coded per extension), formatted file size, optional upload/download progress bar that turns green on completion, and download/remove action buttons. Two layout variants: `compact` (inline pill) and `full` (card with icon block).
- `PricingCard` — structured pricing tier with plan name, price + billing period, optional description, feature list with check/cross icons and optional notes, a CTA button that highlights when `popular` is set, and a "Most popular" ribbon badge. Supports `classic` bevel variant.

**Forms**
- `NumberInput` — stepper input flanked by − and + buttons. Clamps to `min`/`max`, steps by configurable `step` amount, increments on `ArrowUp`/`ArrowDown` keyboard events, and adjusts on mouse scroll when focused. Hides native browser spinners. Supports controlled and uncontrolled modes. Sizes `xs`–`lg`.
- `AvatarUpload` — avatar circle with a camera overlay that appears on hover, a hidden `<input type="file">` triggered on click or keyboard, instant `FileReader` base64 preview, max-size validation with an error message, and a "Remove photo" link. Sizes `sm`–`xl`. Fully accessible with `role="button"` and `aria-label`.

**Feedback**
- `StepProgress` — animated segmented progress bar. Each segment fills left-to-right with a staggered CSS `scaleX` transition (40ms per-segment delay). Props: `steps`, `current`, `color`, `animated`, `showLabel`, `size`. Renders a `role="progressbar"` with correct ARIA attributes.

**Utility**
- `TypewriterText` — see Modern & Unique above (also exported from `utility`).

### Architecture

All 10 new components are **standalone files** — each lives in its own `.tsx` file alongside the relevant `index.tsx`. This means `index.tsx` re-exports them without duplicating implementation, tree-shaking works per-component, and diffs stay minimal when individual components change.

- `src/components/data-display/SparklineChart.tsx`
- `src/components/data-display/RadialProgressChart.tsx`
- `src/components/data-display/GaugeChart.tsx`
- `src/components/data-display/AuroraCard.tsx`
- `src/components/data-display/FileCard.tsx`
- `src/components/data-display/PricingCard.tsx`
- `src/components/forms/NumberInput.tsx`
- `src/components/forms/AvatarUpload.tsx`
- `src/components/feedback/StepProgress.tsx`
- `src/components/utility/TypewriterText.tsx`

### CLI Registry

All 10 new components are registered in `src/cli/registry.ts` and are available via:

```bash
npx veloria-ui add sparkline-chart
npx veloria-ui add radial-progress-chart
npx veloria-ui add gauge-chart
npx veloria-ui add aurora-card
npx veloria-ui add pricing-card
npx veloria-ui add file-card
npx veloria-ui add number-input
npx veloria-ui add avatar-upload
npx veloria-ui add step-progress
npx veloria-ui add typewriter-text
```

---

## [0.1.3] — 2026-03-16

### Classic Variant

Added `classic` variant across **Button**, **IconButton**, **Badge**, **Tag**, **Chip**, and **Card** components. The classic style uses beveled inset box-shadows to mimic the tactile feel of physical plastic or rubber:
- Top-left inset highlight (`rgba(255,255,255,0.72)` light mode, `rgba(255,255,255,0.10)` dark)
- Bottom-right inset shadow (`rgba(0,0,0,0.14)` light mode, `rgba(0,0,0,0.50)` dark)
- Active/pressed state inverts the bevel to simulate a physical click-down

New CSS utilities added to `veloria.css`:
- `.veloria-classic` — applies the raised bevel shadow
- `.veloria-classic-pressed` — applies the pressed/inverted bevel shadow
- CSS custom properties `--classic-highlight`, `--classic-shadow`, `--classic-bevel`, `--classic-bevel-pressed` — all responsive to dark mode

### Select Dropdown Redesign

Replaced the system-native OS picker with a fully custom animated dropdown:
- Layered `box-shadow` (soft ambient + key shadow, separate dark mode values)
- Open animation: `fade-in-0` + `zoom-in-[0.97]` + directional slide from trigger
- Close animation: `fade-out-0` + `zoom-out-95` + reverse slide
- `SelectScrollUpButton` / `SelectScrollDownButton` — appear when list overflows, replacing the OS scrollbar
- Chevron icon rotates 180° when dropdown is open (CSS rule on `.atlas-select-trigger[data-state="open"] svg`)
- `SelectLabel` styled as uppercase tracking-widened group headers
- Max height capped to `min(available-height, 18rem)` to prevent off-screen overflow

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

### Bug Fixes

- Fixed `TypeError: Cannot read properties of null (reading 'matches')` — `window.matchMedia` now uses optional chaining (`?.`) in `useTheme` and an explicit null guard in `useMediaQuery`, preventing crashes in jsdom and certain SSR environments
- Fixed `TS2430` on `StatisticProps` — added `Omit<..., "prefix">` to resolve conflict with `HTMLAttributes.prefix`
- Fixed `TS2430` on `CalendarProps` — added `Omit<..., "onChange">` to resolve conflict with `HTMLAttributes.onChange`

---

## [0.1.2] — 2026-03-15

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

## [0.1.1] — 2026-03-13

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
