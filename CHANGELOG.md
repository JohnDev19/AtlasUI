# Changelog

All notable changes to Veloria UI are documented here.  
Project by [JohnDev19](https://github.com/JohnDev19) · [GitHub](https://github.com/JohnDev19/Veloria-UI) · [veloria-ui.vercel.app](https://veloria-ui.vercel.app/)

This project follows [Semantic Versioning](https://semver.org).

---

## [0.1.3] — 2026-03-16

### Highlights

- **Classic variant** — a new premium design variant available on `Button`, `Card`, `Badge`, `Input`, `PricingCard`, and more. Warm parchment surface, aged-brass border, inset highlight depth — not literal 3D, just genuinely tactile. Driven by `--classic-*` CSS custom properties, adapts fully to dark mode.
- **New unique components** — components not commonly found in other UI libraries, covering animation, engagement, and layout patterns.
- **Status API** (`veloria-ui/api`) — programmatic metadata: component counts per category, hook list, version, supported variants, release date, and health status. Includes a ready-made Next.js App Router `GET` handler.
- **Full atlas → veloria rename** — all `atlas-` CSS class prefixes, `AtlasProvider`, `atlasPlugin`, `atlasPreset`, `atlas.config.json`, and `atlas.css` have been replaced with their `veloria-` equivalents throughout.

---

### Classic Variant

Add to any supported component:

```tsx
<Button variant="classic">Continue</Button>
<Card variant="classic"><CardContent>Premium surface</CardContent></Card>
<Badge variant="classic">Verified</Badge>
<Input variant="classic" placeholder="Your name" />
```

Inject CSS tokens into your `globals.css`:

```css
:root {
  --classic-bg:       36 25% 94%;
  --classic-fg:       25 30% 15%;
  --classic-border:   30 20% 65%;
  --classic-surface:  36 20% 97%;
  /* full list in src/variants/classic.ts */
}
```

Components that support `variant="classic"`:
`Button` · `Card` · `Badge` · `Input` · `PricingCard`

---

### New Unique Components

These fill gaps absent from shadcn/ui, MUI, Chakra UI, and Mantine.

**Animation & Engagement**
- `Marquee` — smooth infinite-scroll ticker with speed, pause-on-hover, and reverse direction
- `TypewriterText` — cycling typewriter with configurable typing/deleting speed and blinking cursor
- `GradientText` — animated or static gradient text; composable `as` prop
- `CountUp` — viewport-triggered animated number counter with easing, prefix/suffix, decimal control
- `ScrollReveal` — scroll-triggered reveal wrapper with 6 animation modes (`fade`, `slide-up`, `slide-left`, `slide-right`, `scale`, `blur`)
- `RippleButton` — material-style click ripple effect

**Cards & Surfaces**
- `GlowCard` — mouse-tracking radial glow that follows the cursor
- `SpotlightCard` — sharper spotlight variant with different glow character
- `AnimatedBorder` — conic-gradient spinning border via CSS animation
- `PricingCard` — opinionated pricing tier card with feature checklist, badge, highlighted state, and `classic` variant
- `StickyNote` — post-it style note with 6 colors, optional pin, and rotation

**Layout**
- `BentoGrid` + `BentoItem` — asymmetric bento-box grid with `colSpan` and `rowSpan` per item

**Utility & Status**
- `ReadingProgress` — sticky reading progress bar (top or bottom) tracking scroll
- `Ribbon` — decorative corner ribbon for "New", "Sale", "Hot" labels; 5 color variants
- `PulseRing` — animated concentric ring pulse for live/active indicators
- `CommandBar` — floating bottom action bar for bulk/contextual actions with keyboard shortcut display

---

### Status API (`veloria-ui/api`)

```ts
import {
  getLibraryStats,
  getComponentCount,
  getVersion,
  getCategoryStats,
  getSupportedVariants,
  getStatusResponse,
  GET, // Next.js App Router handler
} from "veloria-ui/api";

// app/api/veloria-ui/status/route.ts
export { GET } from "veloria-ui/api";
```

---

### Renamed & Renamed

| Old (Atlas era) | New (Veloria) |
|---|---|
| `AtlasProvider` | `VeloriaProvider` |
| `atlasPlugin` | `veloriaPlugin` |
| `atlasPreset` | `veloriaPreset` |
| `atlas.css` | `veloria.css` |
| `atlas.config.json` | `veloria.config.json` |
| `AtlasBaseProps` | `VeloriaBaseProps` |
| `AtlasAriaProps` | `VeloriaAriaProps` |
| `atlas-*` CSS prefixes | `veloria-*` |

### Bug Fixes & DX

- `utility/index.tsx` was missing from the package — now complete with all utility components
- `src/index.ts` now exports every component, hook, type, provider, and plugin
- `Card` `interactive` compound variant applies correct hover shadow in the `classic` variant
- `Button` compound variants preserve `tracking-wide`/`tracking-widest` at all sizes for `classic`
- `Badge` overrides `rounded-full` → `rounded` in classic variant for the stamped-label look
- `tsup.config.ts` updated with `api` entry point
- `package.json` `./styles` export updated to `veloria.css`

---

## [0.1.2] — 2026-03-15

### New Components

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

**Feedback & Overlay**
- `BannerAlert` — full-width top-of-page announcement strip with 4 variants
- `ConfirmDialog` — confirmation modal with async confirm support and danger variant
- `FloatingActionButton` — FAB with expandable speed-dial actions and 3 position presets
- `RichTooltip` — tooltip with title, description, and action slot
- `Tour` — multi-step onboarding overlay with dot progress indicator

**Utility**
- `InfiniteScroll` — IntersectionObserver-based load-more trigger with loader slot
- `VirtualList` — windowed list renderer for large datasets with configurable overscan

### New Hooks

- `useForm` — form state and validation with touched tracking, no extra dependencies
- `usePagination` — pagination logic decoupled from UI, with from/to helpers
- `useIntersection` — IntersectionObserver wrapper with optional `once` mode
- `useWindowSize` — reactive window width and height, SSR-safe
- `useStep` — multi-step wizard state with `isFirst`, `isLast`, and progress percentage
- `useCountdown` — countdown timer with `start`, `pause`, and `reset` controls

---

## [0.1.1] — 2026-03-13

### Build Fixes

- Fixed `tailwindcss/plugin` resolve error — marked as external in tsup, switched to `require()` at runtime
- Fixed `"types"` export condition ordering in `package.json` — `types` now comes before `import`/`require`
- Fixed `use-toast.ts` renamed to `use-toast.tsx` — file contained JSX but had `.ts` extension
- Fixed `TS2320` / `TS2322` conflicts across all component interfaces — `HTMLAttributes` built-in props now properly `Omit`-ed before extending
- CLI `--version` flag now reads dynamically from `package.json`

---

## [0.1.0] — 2024-06-28

### Initial Release

First public release of Veloria UI. Components, a full CLI, hooks, a Tailwind plugin, and a complete CSS token system with light + dark mode.

**Basic & Layout**
- `Button` — solid, outline, ghost, soft, link, danger variants · sizes xs–xl · loading state · icon slots
- `IconButton` — square or circular icon-only button
- `Link` — anchor with external link indicator and underline control
- `Badge` — compact label with color variants and optional dot
- `Avatar` — image with fallback initials, status ring, multiple sizes
- `AvatarGroup` — stacked avatar row with overflow count
- `Divider` — horizontal/vertical with optional center label
- `Tag` — closable colored tag with icon slot
- `Chip` — toggleable with avatar/icon support and remove button
- `Tooltip` — Radix-powered, all four sides, configurable delay
- `Container`, `Stack`, `Grid`, `Flex`, `Section`, `Spacer`, `AspectRatio`, `Center`, `ScrollArea`, `Masonry`

**Navigation**
- `Navbar`, `Sidebar`, `Menu`, `DropdownMenu`, `Breadcrumb`, `Pagination`, `Tabs`, `Stepper`, `CommandDialog`, `NavigationMenu`

**Forms & Inputs**
- `Input`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `RangeSlider`, `DatePicker`, `TimePicker`
- `FileUpload`, `OTPInput`, `ColorPicker`, `SearchInput`, `PasswordInput`, `Combobox`, `MultiSelect`, `FormField`, `FormLabel`, `FormError`

**Data Display**
- `Card`, `Table`, `DataTable`, `List`, `Statistic`, `Timeline`, `Calendar`, `CodeBlock`, `Chart`, `ListItem`

**Feedback & Status**
- `Alert`, `Toast`, `Snackbar`, `Progress`, `CircularProgress`, `Skeleton`, `LoadingSpinner`, `EmptyState`, `StatusIndicator`, `Notification`

**Overlay & Discovery**
- `Modal`, `Dialog`, `Drawer`, `Sheet`, `Popover`, `HoverCard`, `ContextMenu`, `CommandDialog`, `Lightbox`, `ImageViewer`

**Media**
- `Image`, `VideoPlayer`, `AudioPlayer`, `Carousel`, `Gallery`

**Utility & Performance**
- `ThemeSwitcher`, `CopyButton`, `KeyboardShortcut`, `ResizablePanel`, `DragDropArea`

**Hooks**
- `useDisclosure`, `useMediaQuery`, `useBreakpoint`, `useClipboard`, `useLocalStorage`, `useTheme`, `useDebounce`, `useOnClickOutside`, `useKeydown`, `useMounted`, `useToast`, `useScrollLock`

**Infrastructure**
- Tailwind CSS plugin + preset (`veloriaPlugin`, `veloriaPreset`)
- Full CSS design token system — light and dark themes
- `VeloriaProvider` for Next.js App Router
- TypeScript strict throughout — full named type exports
- Tree-shakeable ESM + CJS dual build via tsup
- CLI: `init` · `add` · `list` · `diff` · `status`
