# Changelog

All notable changes to AtlasUI are documented here.  
Project by [JohnDev19](https://github.com/JohnDev19) · [GitHub](https://github.com/JohnDev19/AtlasUI) · [atlasui.vercel.app](https://atlasui.vercel.app/)

This project follows [Semantic Versioning](https://semver.org).

---

## [0.1.0] — 2025-03-15

### 🎉 Initial Release

First public release of AtlasUI. 90 components, a full CLI, 10 hooks, a Tailwind
plugin, and a complete CSS token system with light + dark mode.

---

#### atlasui-lib

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
- `DatePicker` — native date input wrapper
- `TimePicker` — native time input wrapper

**Advanced Forms (10)**
- `FileUpload` — drag-and-drop zone with click-to-upload fallback
- `OTPInput` — PIN/OTP with auto-advance and paste support
- `ColorPicker` — swatches + hex input
- `SearchInput` — search with loading state and clear button
- `PasswordInput` — toggle show/hide
- `Combobox` — searchable single-value select
- `MultiSelect` — multi-value select with chips
- `FormField` / `FormLabel` / `FormError` — composable form primitives

**Data Display (10)**
- `Card` — surface with header/content/footer slots · 5 variants
- `Table` + sub-primitives — full HTML table system
- `DataTable` — sortable data table with loading and empty states
- `List` / `ListItem` — simple, bordered, and divided lists
- `Statistic` — key metric with trend indicator
- `Timeline` — vertical events with color-coded icons
- `Calendar` — month picker with highlighted dates
- `CodeBlock` — code display with copy button and line numbers
- `Chart` — chart wrapper (bring your own chart library)

**Feedback (10)**
- `Alert` — info/success/warning/danger with optional dismiss
- `Toast` — Radix Toast with all sub-primitives
- `Snackbar` — positioned message with action
- `Progress` — linear bar with color variants
- `CircularProgress` — SVG ring with indeterminate mode
- `Skeleton` — pulse placeholder for text, rect, circle
- `LoadingSpinner` — accessible SVG spinner
- `EmptyState` — icon + title + description + action slot
- `StatusIndicator` — online/offline/busy/away dot with pulse
- `Notification` — notification item with avatar, timestamp, unread dot

**Overlay (10)**
- `Modal` — preset dialog with size variants (sm → full)
- `Dialog` — full Radix Dialog primitive suite
- `Drawer` — slide-in from any edge (left/right/top/bottom)
- `Sheet` — Drawer alias
- `Popover` — floating panel
- `HoverCard` — rich hover preview
- `ContextMenu` — right-click menu
- `CommandDialog` — ⌘K palette
- `Lightbox` / `ImageViewer` — full-screen image overlay

**Media (5)**
- `Image` — fallback, aspect ratio, object-fit, rounded, caption
- `VideoPlayer` — HTML5 video with captions/subtitles track support
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
- Tailwind CSS plugin + preset (`atlasPlugin`, `atlasPreset`)
- Full CSS design token system — light and dark themes
- `AtlasProvider` for Next.js App Router
- TypeScript strict throughout — full named type exports
- Tree-shakeable ESM + CJS dual build via tsup
- Turbo monorepo setup

#### atlasui-lib CLI
- `init` — project setup wizard (detects Next.js, writes atlas.config.json)
- `add` — copies components + installs npm deps, resolves AtlasUI peer deps
- `list` — browse all 90 components filtered by category
- `diff` — compare local copy to latest (registry fetch, coming soon)
- Auto-detects npm / pnpm / yarn / bun

---

[0.1.0]: https://github.com/JohnDev19/AtlasUI/releases/tag/v0.1.0
