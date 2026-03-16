/**
 * Veloria UI component registry — v0.1.3
 *
 * Every component lives here: name, category, description, and the npm deps
 * it needs. The `add` command reads this to know what to install.
 *
 * — JohnDev19
 */

export interface ComponentMeta {
  name: string;
  category: Category;
  description: string;
  deps: string[];
  registryDeps?: string[];
  /** Whether this component supports the classic variant */
  supportsClassic?: boolean;
  /** Added in which version */
  since?: string;
}

export type Category =
  | "basic"
  | "layout"
  | "navigation"
  | "forms"
  | "advanced-forms"
  | "data-display"
  | "feedback"
  | "overlay"
  | "media"
  | "utility"
  | "unique";

export const REGISTRY: ComponentMeta[] = [
  // ─── Basic ──────────────────────────────────────────────────────────────
  { name: "button",         category: "basic",   since: "0.1.0", supportsClassic: true,  description: "Solid, outline, ghost, soft, link, danger, classic variants. Loading state, icon slots.", deps: ["@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"] },
  { name: "icon-button",    category: "basic",   since: "0.1.0", description: "Square or circular icon-only button.", deps: ["@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"] },
  { name: "link",           category: "basic",   since: "0.1.0", description: "Anchor with external link indicator and underline control.", deps: ["@radix-ui/react-slot"] },
  { name: "badge",          category: "basic",   since: "0.1.0", supportsClassic: true,  description: "Compact label — stamped-label classic variant, 5 color variants, optional dot.", deps: ["class-variance-authority", "clsx", "tailwind-merge"] },
  { name: "avatar",         category: "basic",   since: "0.1.0", description: "Image with fallback initials, status ring, 6 sizes.", deps: ["@radix-ui/react-avatar"] },
  { name: "avatar-group",   category: "basic",   since: "0.1.0", description: "Stacked avatars with overflow count.", deps: ["@radix-ui/react-avatar"], registryDeps: ["avatar"] },
  { name: "divider",        category: "basic",   since: "0.1.0", description: "Horizontal/vertical separator with optional center label.", deps: ["@radix-ui/react-separator"] },
  { name: "tag",            category: "basic",   since: "0.1.0", description: "Closable colored tag with icon slot.", deps: [] },
  { name: "chip",           category: "basic",   since: "0.1.0", description: "Toggleable chip with avatar/icon and remove button.", deps: [] },
  { name: "tooltip",        category: "basic",   since: "0.1.0", description: "Radix tooltip, all four sides, configurable delay.", deps: ["@radix-ui/react-tooltip"] },

  // ─── Layout ─────────────────────────────────────────────────────────────
  { name: "container",      category: "layout",  since: "0.1.0", description: "Responsive max-width wrapper with padding control.", deps: [] },
  { name: "stack",          category: "layout",  since: "0.1.0", description: "Flex column/row with gap, align, justify, divider.", deps: [] },
  { name: "grid",           category: "layout",  since: "0.1.0", description: "CSS Grid with column/row/gap config.", deps: [] },
  { name: "flex",           category: "layout",  since: "0.1.0", description: "Flex with full directional control.", deps: [] },
  { name: "section",        category: "layout",  since: "0.1.0", description: "Semantic section with vertical padding presets.", deps: [] },
  { name: "spacer",         category: "layout",  since: "0.1.0", description: "Invisible spacer.", deps: [] },
  { name: "aspect-ratio",   category: "layout",  since: "0.1.0", description: "Radix aspect-ratio wrapper.", deps: ["@radix-ui/react-aspect-ratio"] },
  { name: "center",         category: "layout",  since: "0.1.0", description: "Flex centering helper.", deps: [] },
  { name: "scroll-area",    category: "layout",  since: "0.1.0", description: "Custom scrollbar via Radix ScrollArea.", deps: ["@radix-ui/react-scroll-area"] },
  { name: "masonry",        category: "layout",  since: "0.1.0", description: "CSS multi-column masonry grid.", deps: [] },

  // ─── Navigation ─────────────────────────────────────────────────────────
  { name: "navbar",         category: "navigation", since: "0.1.0", description: "Sticky + glass-blur top bar.", deps: [] },
  { name: "sidebar",        category: "navigation", since: "0.1.0", description: "Collapsible with width transition.", deps: [] },
  { name: "menu",           category: "navigation", since: "0.1.0", description: "Vertical nav with active/disabled states.", deps: [] },
  { name: "dropdown-menu",  category: "navigation", since: "0.1.0", description: "Full Radix Dropdown with all sub-primitives.", deps: ["@radix-ui/react-dropdown-menu"] },
  { name: "breadcrumb",     category: "navigation", since: "0.1.0", description: "Accessible trail with custom separator.", deps: [] },
  { name: "pagination",     category: "navigation", since: "0.1.0", description: "Page numbers, ellipsis, prev/next.", deps: [] },
  { name: "tabs",           category: "navigation", since: "0.1.0", supportsClassic: true, description: "Line, pills, enclosed, classic variants · Radix powered.", deps: ["@radix-ui/react-tabs"] },
  { name: "stepper",        category: "navigation", since: "0.1.0", description: "Horizontal/vertical multi-step progress indicator.", deps: [] },
  { name: "command-dialog", category: "navigation", since: "0.1.0", description: "⌘K command palette via cmdk.", deps: ["cmdk"] },
  { name: "navigation-menu",category: "navigation", since: "0.1.0", description: "Mega-menu navigation with Radix.", deps: [] },

  // ─── Forms ──────────────────────────────────────────────────────────────
  { name: "input",          category: "forms",   since: "0.1.0", supportsClassic: true, description: "Left/right icon slots, sizes, error state, classic variant.", deps: ["class-variance-authority", "clsx", "tailwind-merge"] },
  { name: "textarea",       category: "forms",   since: "0.1.0", description: "Resize control, error state.", deps: [] },
  { name: "select",         category: "forms",   since: "0.1.0", description: "Full Radix Select with all sub-primitives.", deps: ["@radix-ui/react-select"] },
  { name: "checkbox",       category: "forms",   since: "0.1.0", description: "With label, description, error state.", deps: ["@radix-ui/react-checkbox"] },
  { name: "radio-group",    category: "forms",   since: "0.1.0", description: "Per-option labels and descriptions.", deps: ["@radix-ui/react-radio-group"] },
  { name: "switch",         category: "forms",   since: "0.1.0", description: "Three sizes, label, description.", deps: ["@radix-ui/react-switch"] },
  { name: "slider",         category: "forms",   since: "0.1.0", description: "Range slider.", deps: ["@radix-ui/react-slider"] },
  { name: "range-slider",   category: "forms",   since: "0.1.0", description: "Dual-thumb slider.", deps: ["@radix-ui/react-slider"] },
  { name: "date-picker",    category: "forms",   since: "0.1.0", description: "Native date input wrapper.", deps: [] },
  { name: "time-picker",    category: "forms",   since: "0.1.0", description: "Native time input wrapper.", deps: [] },

  // ─── Advanced Forms ──────────────────────────────────────────────────────
  { name: "file-upload",    category: "advanced-forms", since: "0.1.0", description: "Drag-and-drop zone with click-to-upload fallback.", deps: [] },
  { name: "otp-input",      category: "advanced-forms", since: "0.1.0", description: "PIN/OTP with auto-advance and paste support.", deps: [] },
  { name: "color-picker",   category: "advanced-forms", since: "0.1.0", description: "Swatches + hex input.", deps: [] },
  { name: "search-input",   category: "advanced-forms", since: "0.1.0", description: "Search with loading state and clear button.", deps: [] },
  { name: "password-input", category: "advanced-forms", since: "0.1.0", description: "Toggle show/hide.", deps: [] },
  { name: "combobox",       category: "advanced-forms", since: "0.1.0", description: "Searchable single-value select.", deps: ["cmdk"] },
  { name: "multi-select",   category: "advanced-forms", since: "0.1.0", description: "Multi-value select with chips.", deps: [] },
  { name: "form-field",     category: "advanced-forms", since: "0.1.0", description: "Composable form primitives.", deps: [] },
  { name: "form-label",     category: "advanced-forms", since: "0.1.0", description: "Form label primitive.", deps: [] },
  { name: "form-error",     category: "advanced-forms", since: "0.1.0", description: "Form error message primitive.", deps: [] },
  { name: "phone-input",    category: "advanced-forms", since: "0.1.2", description: "International phone number with country dial-code selector.", deps: [] },
  { name: "tag-input",      category: "advanced-forms", since: "0.1.2", description: "Type and press Enter to add inline tags.", deps: [] },
  { name: "currency-input", category: "advanced-forms", since: "0.1.2", description: "Formatted number input with locale-aware currency symbol.", deps: [] },
  { name: "rating-input",   category: "advanced-forms", since: "0.1.2", description: "Star rating picker with hover state and read-only mode.", deps: [] },

  // ─── Data Display ────────────────────────────────────────────────────────
  { name: "card",           category: "data-display", since: "0.1.0", supportsClassic: true, description: "Surface with header/content/footer slots · classic, elevated, ghost variants.", deps: ["class-variance-authority", "clsx", "tailwind-merge"] },
  { name: "table",          category: "data-display", since: "0.1.0", description: "Full HTML table system.", deps: [] },
  { name: "data-table",     category: "data-display", since: "0.1.0", description: "Sortable data table with loading and empty states.", deps: [] },
  { name: "list",           category: "data-display", since: "0.1.0", description: "Simple, bordered, and divided lists.", deps: [] },
  { name: "statistic",      category: "data-display", since: "0.1.0", description: "Key metric with trend indicator.", deps: [] },
  { name: "timeline",       category: "data-display", since: "0.1.0", description: "Vertical events with color-coded icons.", deps: [] },
  { name: "calendar",       category: "data-display", since: "0.1.0", description: "Month picker with highlighted dates.", deps: [] },
  { name: "code-block",     category: "data-display", since: "0.1.0", description: "Code display with copy button and line numbers.", deps: [] },
  { name: "chart",          category: "data-display", since: "0.1.0", description: "Chart wrapper (bring your own chart library).", deps: [] },
  { name: "list-item",      category: "data-display", since: "0.1.0", description: "List item primitive.", deps: [] },
  { name: "stats-card",     category: "data-display", since: "0.1.2", description: "Metric card with icon, trend indicator, and loading skeleton.", deps: [] },
  { name: "tree-view",      category: "data-display", since: "0.1.2", description: "Nested expandable tree with keyboard navigation.", deps: [] },
  { name: "json-viewer",    category: "data-display", since: "0.1.2", description: "Collapsible syntax-highlighted JSON tree.", deps: [] },
  { name: "heatmap",        category: "data-display", since: "0.1.2", description: "GitHub-style activity grid with intensity scale.", deps: [] },
  { name: "kanban-board",   category: "data-display", since: "0.1.2", description: "Drag-and-drop column board with card tagging.", deps: [] },

  // ─── Feedback ────────────────────────────────────────────────────────────
  { name: "alert",              category: "feedback", since: "0.1.0", description: "Info/success/warning/danger with optional dismiss.", deps: [] },
  { name: "toast",              category: "feedback", since: "0.1.0", description: "Radix Toast with all sub-primitives.", deps: ["@radix-ui/react-toast"] },
  { name: "snackbar",           category: "feedback", since: "0.1.0", description: "Positioned message with action.", deps: [] },
  { name: "progress",           category: "feedback", since: "0.1.0", description: "Linear bar with color variants.", deps: [] },
  { name: "circular-progress",  category: "feedback", since: "0.1.0", description: "SVG ring with indeterminate mode.", deps: [] },
  { name: "skeleton",           category: "feedback", since: "0.1.0", description: "Pulse placeholder for text, rect, circle.", deps: [] },
  { name: "loading-spinner",    category: "feedback", since: "0.1.0", description: "Accessible SVG spinner.", deps: [] },
  { name: "empty-state",        category: "feedback", since: "0.1.0", description: "Icon + title + description + action slot.", deps: [] },
  { name: "status-indicator",   category: "feedback", since: "0.1.0", description: "Online/offline/busy/away dot with pulse.", deps: [] },
  { name: "notification",       category: "feedback", since: "0.1.0", description: "Notification item with avatar, timestamp, unread dot.", deps: [] },
  { name: "banner-alert",       category: "feedback", since: "0.1.2", description: "Full-width top-of-page announcement strip with 4 variants.", deps: [] },
  { name: "confirm-dialog",     category: "feedback", since: "0.1.2", description: "Confirmation modal with async confirm and danger variant.", deps: ["@radix-ui/react-dialog"] },
  { name: "floating-action-button", category: "feedback", since: "0.1.2", description: "FAB with expandable speed-dial actions.", deps: [] },
  { name: "rich-tooltip",       category: "feedback", since: "0.1.2", description: "Tooltip with title, description, and action slot.", deps: ["@radix-ui/react-tooltip"] },

  // ─── Overlay ─────────────────────────────────────────────────────────────
  { name: "modal",          category: "overlay", since: "0.1.0", description: "Preset dialog with size variants.", deps: ["@radix-ui/react-dialog"] },
  { name: "dialog",         category: "overlay", since: "0.1.0", description: "Full Radix Dialog primitive suite.", deps: ["@radix-ui/react-dialog"] },
  { name: "drawer",         category: "overlay", since: "0.1.0", description: "Slide-in from any edge.", deps: ["@radix-ui/react-dialog"] },
  { name: "sheet",          category: "overlay", since: "0.1.0", description: "Drawer alias with sheet semantics.", deps: ["@radix-ui/react-dialog"] },
  { name: "popover",        category: "overlay", since: "0.1.0", description: "Floating panel.", deps: ["@radix-ui/react-popover"] },
  { name: "hover-card",     category: "overlay", since: "0.1.0", description: "Rich hover preview.", deps: ["@radix-ui/react-hover-card"] },
  { name: "context-menu",   category: "overlay", since: "0.1.0", description: "Right-click menu.", deps: ["@radix-ui/react-context-menu"] },
  { name: "lightbox",       category: "overlay", since: "0.1.0", description: "Full-screen image overlay.", deps: ["@radix-ui/react-dialog"] },
  { name: "image-viewer",   category: "overlay", since: "0.1.0", description: "Image viewer with zoom.", deps: [] },
  { name: "tour",           category: "overlay", since: "0.1.2", description: "Multi-step onboarding overlay with dot progress indicator.", deps: [] },

  // ─── Media ───────────────────────────────────────────────────────────────
  { name: "image",          category: "media",   since: "0.1.0", description: "Fallback, aspect ratio, object-fit, rounded, caption.", deps: [] },
  { name: "video-player",   category: "media",   since: "0.1.0", description: "HTML5 video with captions/subtitles track support.", deps: [] },
  { name: "audio-player",   category: "media",   since: "0.1.0", description: "Custom UI with seek bar, cover art.", deps: [] },
  { name: "carousel",       category: "media",   since: "0.1.0", description: "Autoplay, dots, arrows, loop, slidesPerView.", deps: [] },
  { name: "gallery",        category: "media",   since: "0.1.0", description: "Responsive image grid with click handler.", deps: [] },

  // ─── Utility ─────────────────────────────────────────────────────────────
  { name: "theme-switcher",    category: "utility", since: "0.1.0", description: "Icon / toggle / select variants.", deps: [] },
  { name: "copy-button",       category: "utility", since: "0.1.0", description: "Icon or labelled copy button with success feedback.", deps: [] },
  { name: "keyboard-shortcut", category: "utility", since: "0.1.0", description: "Styled <kbd> shortcut display.", deps: [] },
  { name: "resizable-panel",   category: "utility", since: "0.1.0", description: "Drag-to-resize panel with min/max constraints.", deps: [] },
  { name: "drag-drop-area",    category: "utility", since: "0.1.0", description: "Accessible file drop zone.", deps: [] },
  { name: "infinite-scroll",   category: "utility", since: "0.1.2", description: "IntersectionObserver-based load-more trigger with loader slot.", deps: [] },
  { name: "virtual-list",      category: "utility", since: "0.1.2", description: "Windowed list renderer for large datasets.", deps: [] },

  // ─── Unique (v0.1.3) ─────────────────────────────────────────────────────
  { name: "marquee",           category: "unique",  since: "0.1.3", description: "Smooth infinite-scroll ticker with configurable speed, pause-on-hover, reverse.", deps: [] },
  { name: "glow-card",         category: "unique",  since: "0.1.3", description: "Card with animated radial glow that follows the mouse cursor.", deps: [] },
  { name: "spotlight-card",    category: "unique",  since: "0.1.3", description: "Card with sharper spotlight effect on mouse position.", deps: [] },
  { name: "bento-grid",        category: "unique",  since: "0.1.3", description: "Asymmetric bento-box grid with colSpan/rowSpan per item.", deps: [] },
  { name: "bento-item",        category: "unique",  since: "0.1.3", description: "Bento grid item with configurable span.", deps: [], registryDeps: ["bento-grid"] },
  { name: "gradient-text",     category: "unique",  since: "0.1.3", description: "Animated or static gradient applied to any text element.", deps: [] },
  { name: "typewriter-text",   category: "unique",  since: "0.1.3", description: "Cycling typewriter with configurable speed and blinking cursor.", deps: [] },
  { name: "count-up",          category: "unique",  since: "0.1.3", description: "Viewport-triggered animated number counter with easing.", deps: [] },
  { name: "reading-progress",  category: "unique",  since: "0.1.3", description: "Sticky reading progress bar tracking scroll position.", deps: [] },
  { name: "animated-border",   category: "unique",  since: "0.1.3", description: "Conic-gradient spinning border animation.", deps: [] },
  { name: "ripple-button",     category: "unique",  since: "0.1.3", description: "Material-style ripple effect on click.", deps: [] },
  { name: "pricing-card",      category: "unique",  since: "0.1.3", supportsClassic: true, description: "Opinionated pricing tier card with feature checklist and classic variant support.", deps: [] },
  { name: "sticky-note",       category: "unique",  since: "0.1.3", description: "Post-it style note with 6 colors, optional pin, rotation.", deps: [] },
  { name: "ribbon",            category: "unique",  since: "0.1.3", description: "Decorative corner ribbon for New / Sale / Hot labels.", deps: [] },
  { name: "pulse-ring",        category: "unique",  since: "0.1.3", description: "Animated concentric ring pulse for live/active status.", deps: [] },
  { name: "command-bar",       category: "unique",  since: "0.1.3", description: "Floating bottom action bar for bulk/contextual actions.", deps: [] },
  { name: "scroll-reveal",     category: "unique",  since: "0.1.3", description: "Scroll-triggered reveal wrapper with 6 animation modes.", deps: [] },
];

export const COMPONENTS_BY_NAME = new Map(REGISTRY.map((c) => [c.name, c]));

export const CATEGORIES: Category[] = [
  "basic", "layout", "navigation", "forms", "advanced-forms",
  "data-display", "feedback", "overlay", "media", "utility", "unique",
];

/** Components that support variant="classic" */
export const CLASSIC_SUPPORTED = REGISTRY
  .filter((c) => c.supportsClassic)
  .map((c) => c.name);
