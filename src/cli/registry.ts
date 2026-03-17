/**
 * Veloria UI component registry.
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
  | "utility";

export const REGISTRY: ComponentMeta[] = [

  // ── Basic ──────────────────────────────────────────────────────────────
  { name: "button",             category: "basic",          description: "Solid, outline, ghost, soft, link, classic, danger variants. Loading state, icon slots.", deps: ["@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"] },
  { name: "icon-button",        category: "basic",          description: "Square or circular icon-only button including classic bevel variant.", deps: ["@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"] },
  { name: "link",               category: "basic",          description: "Anchor with external link indicator and underline control.", deps: ["@radix-ui/react-slot"] },
  { name: "badge",              category: "basic",          description: "Compact label — solid, outline, soft, classic, neutral variants with color tints.", deps: ["class-variance-authority", "clsx", "tailwind-merge"] },
  { name: "avatar",             category: "basic",          description: "Image with fallback initials, status ring, 6 sizes.", deps: ["@radix-ui/react-avatar"] },
  { name: "avatar-group",       category: "basic",          description: "Stacked avatars with overflow count.", deps: ["@radix-ui/react-avatar"], registryDeps: ["avatar"] },
  { name: "divider",            category: "basic",          description: "Horizontal/vertical separator with optional center label.", deps: ["@radix-ui/react-separator"] },
  { name: "tag",                category: "basic",          description: "Closable colored tag with icon slot. Includes classic bevel variant.", deps: [] },
  { name: "chip",               category: "basic",          description: "Toggleable chip with avatar/icon and remove button. Includes classic prop.", deps: [] },
  { name: "tooltip",            category: "basic",          description: "Radix tooltip, all four sides, configurable delay.", deps: ["@radix-ui/react-tooltip"] },

  // ── Layout ─────────────────────────────────────────────────────────────
  { name: "container",          category: "layout",         description: "Responsive max-width wrapper with padding control.", deps: [] },
  { name: "stack",              category: "layout",         description: "Flex column/row with gap, align, justify, divider.", deps: [] },
  { name: "grid",               category: "layout",         description: "CSS Grid with column/row/gap config.", deps: [] },
  { name: "flex",               category: "layout",         description: "Flex with full directional control.", deps: [] },
  { name: "section",            category: "layout",         description: "Semantic section with vertical padding presets.", deps: [] },
  { name: "spacer",             category: "layout",         description: "Invisible spacing element.", deps: [] },
  { name: "aspect-ratio",       category: "layout",         description: "Radix aspect-ratio container.", deps: ["@radix-ui/react-aspect-ratio"] },
  { name: "center",             category: "layout",         description: "Flex centering helper.", deps: [] },
  { name: "scroll-area",        category: "layout",         description: "Custom scrollbar via Radix ScrollArea.", deps: ["@radix-ui/react-scroll-area"] },
  { name: "masonry",            category: "layout",         description: "CSS multi-column masonry grid.", deps: [] },

  // ── Navigation ─────────────────────────────────────────────────────────
  { name: "navbar",             category: "navigation",     description: "Sticky, glass-blur top bar.", deps: [] },
  { name: "sidebar",            category: "navigation",     description: "Collapsible side nav with width transition.", deps: [] },
  { name: "menu",               category: "navigation",     description: "Vertical nav menu with active/disabled states.", deps: [] },
  { name: "dropdown-menu",      category: "navigation",     description: "Full Radix Dropdown with all sub-primitives.", deps: ["@radix-ui/react-dropdown-menu"] },
  { name: "breadcrumb",         category: "navigation",     description: "Accessible trail with custom separator.", deps: [] },
  { name: "pagination",         category: "navigation",     description: "Page numbers with ellipsis and prev/next.", deps: [] },
  { name: "tabs",               category: "navigation",     description: "Line, pills, enclosed variants. Radix powered.", deps: ["@radix-ui/react-tabs"] },
  { name: "command-palette",    category: "navigation",     description: "⌘K command palette.", deps: ["cmdk", "@radix-ui/react-dialog"], registryDeps: ["command-dialog"] },
  { name: "navigation-menu",    category: "navigation",     description: "Radix Navigation Menu for complex navbars.", deps: ["@radix-ui/react-navigation-menu"] },
  { name: "stepper",            category: "navigation",     description: "Horizontal/vertical multi-step indicator.", deps: [] },

  // ── Forms ──────────────────────────────────────────────────────────────
  { name: "input",              category: "forms",          description: "Left/right icon slots, sizes, error state.", deps: ["class-variance-authority"] },
  { name: "textarea",           category: "forms",          description: "Multi-line input with resize control.", deps: [] },
  { name: "select",             category: "forms",          description: "Full Radix Select — custom animated dropdown, scroll buttons, all sub-primitives.", deps: ["@radix-ui/react-select"] },
  { name: "checkbox",           category: "forms",          description: "With label, description, error state.", deps: ["@radix-ui/react-checkbox"] },
  { name: "radio-group",        category: "forms",          description: "Per-option labels and descriptions.", deps: ["@radix-ui/react-radio-group"] },
  { name: "switch",             category: "forms",          description: "Three sizes, label, description.", deps: ["@radix-ui/react-switch"] },
  { name: "slider",             category: "forms",          description: "Single-thumb range slider.", deps: ["@radix-ui/react-slider"] },
  { name: "range-slider",       category: "forms",          description: "Dual-thumb slider.", deps: ["@radix-ui/react-slider"], registryDeps: ["slider"] },
  { name: "date-picker",        category: "forms",          description: "Native date input wrapper.", deps: [] },
  { name: "time-picker",        category: "forms",          description: "Native time input wrapper.", deps: [] },

  // ── Advanced Forms ─────────────────────────────────────────────────────
  { name: "file-upload",        category: "advanced-forms", description: "Drag-and-drop zone with click-to-upload fallback.", deps: [] },
  { name: "otp-input",          category: "advanced-forms", description: "PIN/OTP with auto-advance and paste support.", deps: [] },
  { name: "color-picker",       category: "advanced-forms", description: "Swatches + hex input.", deps: [] },
  { name: "search-input",       category: "advanced-forms", description: "Search with loading state and clear button.", deps: [] },
  { name: "password-input",     category: "advanced-forms", description: "Password with show/hide toggle.", deps: [] },
  { name: "combobox",           category: "advanced-forms", description: "Searchable single-value select.", deps: [] },
  { name: "multi-select",       category: "advanced-forms", description: "Multi-value select with chips.", deps: [] },
  { name: "phone-input",        category: "advanced-forms", description: "International phone number with country dial-code selector.", deps: [] },
  { name: "tag-input",          category: "advanced-forms", description: "Type and press Enter to add inline tags, supports max, duplicates control.", deps: [] },
  { name: "currency-input",     category: "advanced-forms", description: "Formatted number input with locale-aware currency symbol.", deps: [] },
  { name: "rating-input",       category: "advanced-forms", description: "Star rating picker with hover state, clear button, and read-only mode.", deps: [] },
  { name: "multi-step-form",    category: "advanced-forms", description: "Compound component wrapping per-step validation, shared form state, animated transitions, and a progress stepper.", deps: [] },

  // ── Data Display ───────────────────────────────────────────────────────
  { name: "card",               category: "data-display",   description: "Base card with header, content, footer slots.", deps: [] },
  { name: "table",              category: "data-display",   description: "Sortable, paginated data table.", deps: [] },
  { name: "list",               category: "data-display",   description: "Ordered/unordered list with item slots.", deps: [] },
  { name: "accordion",          category: "data-display",   description: "Radix accordion with animated expand.", deps: ["@radix-ui/react-accordion"] },
  { name: "collapsible",        category: "data-display",   description: "Single-item expandable section.", deps: ["@radix-ui/react-collapsible"] },
  { name: "progress",           category: "data-display",   description: "Linear progress bar with Radix.", deps: ["@radix-ui/react-progress"] },
  { name: "skeleton",           category: "data-display",   description: "Loading placeholder shimmer.", deps: [] },
  { name: "alert",              category: "data-display",   description: "Info/success/warning/error strip.", deps: [] },
  { name: "callout",            category: "data-display",   description: "Highlighted callout block with icon.", deps: [] },
  { name: "code-block",         category: "data-display",   description: "Syntax-highlighted fenced code.", deps: [] },
  { name: "stats-card",         category: "data-display",   description: "Metric card with icon, trend indicator, and loading skeleton.", deps: [] },
  { name: "tree-view",          category: "data-display",   description: "Nested expandable tree with keyboard navigation.", deps: [] },
  { name: "json-viewer",        category: "data-display",   description: "Collapsible syntax-highlighted JSON tree.", deps: [] },
  { name: "heatmap",            category: "data-display",   description: "GitHub-style activity grid with value intensity scale.", deps: [] },
  { name: "kanban-board",       category: "data-display",   description: "Drag-and-drop column board with card tagging and assignee slot.", deps: [] },
  { name: "sparkline-chart",    category: "data-display",   description: "Zero-dep SVG inline trend line with area fill, animated draw-on, and dot highlight.", deps: [] },
  { name: "radial-progress-chart", category: "data-display", description: "Multi-segment animated SVG ring chart with center label and legend.", deps: [] },
  { name: "gauge-chart",        category: "data-display",   description: "Half-circle SVG gauge with animated needle, colour zones, and min/max labels.", deps: [] },
  { name: "aurora-card",        category: "data-display",   description: "Dark card with mouse-reactive aurora gradient blobs and glassmorphism panel.", deps: [] },
  { name: "data-grid",          category: "data-display",   description: "Full-featured data grid with column resizing, multi-sort, row selection, and virtual scrolling.", deps: [] },

  // ── Feedback ───────────────────────────────────────────────────────────
  { name: "toast",              category: "feedback",       description: "Radix Toast notifications with queue.", deps: ["@radix-ui/react-toast"] },
  { name: "dialog",             category: "feedback",       description: "Radix Dialog — accessible modal.", deps: ["@radix-ui/react-dialog"] },
  { name: "alert-dialog",       category: "feedback",       description: "Destructive-action confirmation dialog.", deps: ["@radix-ui/react-alert-dialog"] },
  { name: "spinner",            category: "feedback",       description: "Animated loading spinner.", deps: [] },
  { name: "empty-state",        category: "feedback",       description: "Illustrated empty state with call-to-action.", deps: [] },
  { name: "error-boundary",     category: "feedback",       description: "React error boundary with fallback UI.", deps: [] },
  { name: "banner-alert",       category: "feedback",       description: "Full-width top-of-page announcement strip with 4 variants.", deps: [] },
  { name: "confirm-dialog",     category: "feedback",       description: "Opinionated confirmation modal with async confirm and danger variant.", deps: ["@radix-ui/react-dialog"] },
  { name: "floating-action-button", category: "feedback",   description: "FAB with expandable speed-dial actions and 3 position presets.", deps: [] },
  { name: "rich-tooltip",       category: "feedback",       description: "Tooltip with title, description, and action slot.", deps: [] },
  { name: "tour",               category: "feedback",       description: "Multi-step onboarding overlay with dot progress indicator.", deps: [] },

  // ── Overlay ────────────────────────────────────────────────────────────
  { name: "drawer",             category: "overlay",        description: "Side-panel drawer (top/right/bottom/left).", deps: ["@radix-ui/react-dialog"] },
  { name: "popover",            category: "overlay",        description: "Radix Popover with arrow.", deps: ["@radix-ui/react-popover"] },
  { name: "context-menu",       category: "overlay",        description: "Right-click context menu.", deps: ["@radix-ui/react-context-menu"] },
  { name: "hover-card",         category: "overlay",        description: "Hover-triggered info card.", deps: ["@radix-ui/react-hover-card"] },
  { name: "command-dialog",     category: "overlay",        description: "Full-screen cmdk command palette.", deps: ["cmdk", "@radix-ui/react-dialog"] },
  { name: "sheet",              category: "overlay",        description: "Slide-in sheet panel.", deps: ["@radix-ui/react-dialog"] },
  { name: "date-range-picker",  category: "overlay",        description: "Dual-calendar popover for selecting a date range.", deps: ["@radix-ui/react-popover"] },
  { name: "command-bar",        category: "overlay",        description: "Persistent ⌘K command bar with grouped actions, recent items, keyboard shortcut hints, and live search.", deps: ["cmdk", "@radix-ui/react-dialog"], registryDeps: ["command-dialog"] },

  // ── Media ──────────────────────────────────────────────────────────────
  { name: "image",              category: "media",          description: "Lazy image with blur placeholder.", deps: [] },
  { name: "video-player",       category: "media",          description: "HTML5 video with custom controls.", deps: [] },
  { name: "audio-player",       category: "media",          description: "Waveform audio player.", deps: [] },
  { name: "carousel",           category: "media",          description: "Touch-enabled image carousel.", deps: [] },
  { name: "lightbox",           category: "media",          description: "Full-screen image viewer overlay.", deps: ["@radix-ui/react-dialog"] },

  // ── Utility ────────────────────────────────────────────────────────────
  { name: "theme-switcher",     category: "utility",        description: "Icon/toggle/select theme switcher.", deps: [] },
  { name: "copy-button",        category: "utility",        description: "Icon or labelled copy button with success feedback.", deps: [] },
  { name: "keyboard-shortcut",  category: "utility",        description: "Styled <kbd> shortcut display.", deps: [] },
  { name: "resizable-panel",    category: "utility",        description: "Drag-to-resize panel with min/max constraints.", deps: [] },
  { name: "drag-drop-area",     category: "utility",        description: "Accessible file drop zone.", deps: [] },
  { name: "infinite-scroll",    category: "utility",        description: "IntersectionObserver-based load-more trigger with loader slot.", deps: [] },
  { name: "virtual-list",       category: "utility",        description: "Windowed list renderer for large datasets.", deps: [] },
  { name: "typewriter-text",    category: "utility",        description: "Cycles through strings with character-by-character typing and deleting animation.", deps: [] },

  { name: "classic-variant",    category: "basic",          description: "Classic beveled-edge style for Button, IconButton, Badge, Tag, Chip, Card.", deps: [] },

  { name: "rich-text-editor",   category: "advanced-forms", description: "Tiptap-powered rich text editor with toolbar, placeholder, link, code, and alignment support.", deps: ["@tiptap/react", "@tiptap/starter-kit", "@tiptap/extension-placeholder", "@tiptap/extension-link", "@tiptap/extension-underline", "@tiptap/extension-text-align", "@tiptap/extension-code-block-lowlight", "lowlight"] },
];

// ─── FIX: Uplain Record instead of Map so bracket-notation access 
// works correctly in index.ts (COMPONENTS_BY_NAME[name]).
// A Map requires .get(key); plain objects support obj[key] directly.
export const COMPONENTS_BY_NAME: Record<string, ComponentMeta> = Object.fromEntries(
  REGISTRY.map((c) => [c.name, c])
);

export const CATEGORIES: Category[] = [
  "basic", "layout", "navigation", "forms", "advanced-forms",
  "data-display", "feedback", "overlay", "media", "utility",
];
