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
  { name: "form-field",         category: "advanced-forms", description: "Form field wrapper with spacing.", deps: [] },
  { name: "form-label",         category: "advanced-forms", description: "Label with required/optional indicators.", deps: [] },
  { name: "form-error",         category: "advanced-forms", description: "Accessible error message.", deps: [] },

  // ── Data Display ───────────────────────────────────────────────────────
  { name: "card",               category: "data-display",   description: "Surface with header/content/footer slots. 6 variants including classic bevel.", deps: [] },
  { name: "table",              category: "data-display",   description: "Full HTML table system.", deps: [] },
  { name: "data-table",         category: "data-display",   description: "Sortable data table with loading and empty states.", deps: [] },
  { name: "list",               category: "data-display",   description: "Simple, bordered, and divided lists.", deps: [] },
  { name: "list-item",          category: "data-display",   description: "List item with icon and extra slot.", deps: [] },
  { name: "statistic",          category: "data-display",   description: "Key metric with trend indicator.", deps: [] },
  { name: "timeline",           category: "data-display",   description: "Vertical events with color-coded icons.", deps: [] },
  { name: "calendar",           category: "data-display",   description: "Month picker with highlighted dates.", deps: [] },
  { name: "chart",              category: "data-display",   description: "Chart wrapper — bring your own chart library.", deps: [] },
  { name: "code-block",         category: "data-display",   description: "Code display with copy button and line numbers.", deps: [] },

  // ── Feedback ───────────────────────────────────────────────────────────
  { name: "alert",              category: "feedback",       description: "Info/success/warning/danger with optional dismiss.", deps: ["class-variance-authority"] },
  { name: "toast",              category: "feedback",       description: "Radix Toast with all sub-primitives.", deps: ["@radix-ui/react-toast"] },
  { name: "snackbar",           category: "feedback",       description: "Positioned message with action.", deps: [] },
  { name: "progress",           category: "feedback",       description: "Linear bar with color variants.", deps: ["@radix-ui/react-progress"] },
  { name: "circular-progress",  category: "feedback",       description: "SVG ring with indeterminate mode.", deps: [] },
  { name: "skeleton",           category: "feedback",       description: "Pulse placeholder for text, rect, circle.", deps: [] },
  { name: "loading-spinner",    category: "feedback",       description: "Accessible SVG spinner.", deps: [] },
  { name: "empty-state",        category: "feedback",       description: "Icon + title + description + action.", deps: [] },
  { name: "status-indicator",   category: "feedback",       description: "Online/offline/busy/away dot with pulse.", deps: [] },
  { name: "notification",       category: "feedback",       description: "Notification item with avatar, timestamp, unread dot.", deps: [] },

  // ── Overlay ────────────────────────────────────────────────────────────
  { name: "modal",              category: "overlay",        description: "Preset dialog — sm to full size variants.", deps: ["@radix-ui/react-dialog"] },
  { name: "dialog",             category: "overlay",        description: "Full Radix Dialog primitive suite.", deps: ["@radix-ui/react-dialog"] },
  { name: "drawer",             category: "overlay",        description: "Slides in from any edge.", deps: ["@radix-ui/react-dialog"] },
  { name: "popover",            category: "overlay",        description: "Floating panel.", deps: ["@radix-ui/react-popover"] },
  { name: "hover-card",         category: "overlay",        description: "Rich hover preview.", deps: ["@radix-ui/react-hover-card"] },
  { name: "context-menu",       category: "overlay",        description: "Right-click menu.", deps: ["@radix-ui/react-context-menu"] },
  { name: "command-dialog",     category: "overlay",        description: "⌘K palette.", deps: ["cmdk", "@radix-ui/react-dialog"] },
  { name: "sheet",              category: "overlay",        description: "Drawer alias.", deps: ["@radix-ui/react-dialog"], registryDeps: ["drawer"] },
  { name: "lightbox",           category: "overlay",        description: "Full-screen image overlay.", deps: ["@radix-ui/react-dialog"] },
  { name: "image-viewer",       category: "overlay",        description: "Lightbox alias.", deps: ["@radix-ui/react-dialog"], registryDeps: ["lightbox"] },

  // ── Media ──────────────────────────────────────────────────────────────
  { name: "image",              category: "media",          description: "Image with fallback, aspect ratio, fit, caption.", deps: [] },
  { name: "video-player",       category: "media",          description: "HTML5 video with captions/subtitles support.", deps: [] },
  { name: "audio-player",       category: "media",          description: "Custom audio UI with seek bar, cover art.", deps: [] },
  { name: "carousel",           category: "media",          description: "Autoplay, dots, arrows, loop, slidesPerView.", deps: [] },
  { name: "gallery",            category: "media",          description: "Responsive image grid with click handler.", deps: [] },

  // ── Utility ────────────────────────────────────────────────────────────
  { name: "theme-switcher",     category: "utility",        description: "Icon / toggle / select variants.", deps: [] },
  { name: "copy-button",        category: "utility",        description: "Icon or labelled copy button with success feedback.", deps: [] },
  { name: "keyboard-shortcut",  category: "utility",        description: "Styled <kbd> shortcut display.", deps: [] },
  { name: "resizable-panel",    category: "utility",        description: "Drag-to-resize panel with min/max constraints.", deps: [] },
  { name: "drag-drop-area",     category: "utility",        description: "Accessible file drop zone.", deps: [] },

  // ── v0.1.2 additions ───────────────────────────────────────────────────
  { name: "phone-input",        category: "advanced-forms", description: "International phone number with country dial-code selector.", deps: [] },
  { name: "tag-input",          category: "advanced-forms", description: "Type and press Enter to add inline tags.", deps: [] },
  { name: "currency-input",     category: "advanced-forms", description: "Formatted number input with locale-aware currency symbol.", deps: [] },
  { name: "rating-input",       category: "advanced-forms", description: "Star rating picker with hover state, clear button, and read-only mode.", deps: [] },
  { name: "stats-card",         category: "data-display",   description: "Metric card with icon, trend indicator, and loading skeleton.", deps: [] },
  { name: "tree-view",          category: "data-display",   description: "Nested expandable tree with keyboard navigation.", deps: [] },
  { name: "json-viewer",        category: "data-display",   description: "Collapsible syntax-highlighted JSON tree.", deps: [] },
  { name: "heatmap",            category: "data-display",   description: "GitHub-style activity grid with value intensity scale.", deps: [] },
  { name: "kanban-board",       category: "data-display",   description: "Drag-and-drop column board with card tagging and assignee slot.", deps: [] },
  { name: "banner-alert",       category: "feedback",       description: "Full-width top-of-page announcement strip with 4 variants.", deps: [] },
  { name: "confirm-dialog",     category: "feedback",       description: "Opinionated confirmation modal with async confirm and danger variant.", deps: ["@radix-ui/react-dialog"] },
  { name: "floating-action-button", category: "feedback",   description: "FAB with expandable speed-dial actions and 3 position presets.", deps: [] },
  { name: "rich-tooltip",       category: "feedback",       description: "Tooltip with title, description, and action slot.", deps: [] },
  { name: "tour",               category: "feedback",       description: "Multi-step onboarding overlay with dot progress indicator.", deps: [] },
  { name: "infinite-scroll",    category: "utility",        description: "IntersectionObserver-based load-more trigger with loader slot.", deps: [] },
  { name: "virtual-list",       category: "utility",        description: "Windowed list renderer for large datasets.", deps: [] },

  // ── v0.1.3 additions ───────────────────────────────────────────────────
  { name: "classic-variant",    category: "basic",          description: "Classic beveled-edge style for Button, IconButton, Badge, Tag, Chip, Card.", deps: [] },

  // ── v0.1.4 additions ───────────────────────────────────────────────────
  { name: "sparkline-chart",    category: "data-display",   description: "Zero-dep SVG inline trend line with area fill, animated draw-on, and dot highlight.", deps: [] },
  { name: "radial-progress-chart", category: "data-display", description: "Multi-segment animated SVG ring chart with center label and legend.", deps: [] },
  { name: "gauge-chart",        category: "data-display",   description: "Half-circle SVG gauge with animated needle, colour zones, and min/max labels.", deps: [] },
  { name: "aurora-card",        category: "data-display",   description: "Dark card with mouse-reactive aurora gradient blobs and glassmorphism panel.", deps: [] },
  { name: "pricing-card",       category: "data-display",   description: "Pricing tier with features list, CTA, popular badge, and monthly/annual toggle.", deps: [] },
  { name: "file-card",          category: "data-display",   description: "File attachment display with type badge, size, progress bar, and download/remove.", deps: [] },
  { name: "number-input",       category: "forms",          description: "Stepper input with −/+ buttons, min/max/step clamp, scroll and keyboard support.", deps: [] },
  { name: "avatar-upload",      category: "forms",          description: "Avatar circle with hover camera overlay, instant preview, and size validation.", deps: [] },
  { name: "step-progress",      category: "feedback",       description: "Animated segmented progress bar for multi-step checkout and onboarding flows.", deps: [] },
  { name: "typewriter-text",    category: "utility",        description: "Cycles through strings with character-by-character typing and deleting animation.", deps: [] },

  // ── v0.1.7 additions ───────────────────────────────────────────────────
  {
    name: "data-grid",
    category: "data-display",
    description: "Spreadsheet-grade grid with column resizing, row virtualisation, inline editing, multi-column sorting, and copy-paste.",
    deps: [],
  },
  {
    name: "rich-text-editor",
    category: "advanced-forms",
    description: "Tiptap-based editor with toolbar, bubble menu, headings, lists, code blocks, links, text alignment, and undo/redo.",
    deps: [
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extension-placeholder",
      "@tiptap/extension-link",
      "@tiptap/extension-underline",
      "@tiptap/extension-text-align",
      "@tiptap/extension-code-block-lowlight",
      "lowlight",
    ],
  },
  {
    name: "date-range-picker",
    category: "forms",
    description: "Two-calendar date range selector with hover preview, keyboard nav, min/max constraints, and clear button.",
    deps: ["@radix-ui/react-popover"],
  },
  {
    name: "command-bar",
    category: "overlay",
    description: "Persistent ⌘K command bar with grouped actions, recent items, keyboard shortcut hints, and live search.",
    deps: ["cmdk", "@radix-ui/react-dialog"],
    registryDeps: ["command-dialog"],
  },
  {
    name: "multi-step-form",
    category: "advanced-forms",
    description: "Compound component wrapping per-step validation, shared form state, animated transitions, and a progress stepper.",
    deps: [],
  },
];

export const COMPONENTS_BY_NAME = new Map(REGISTRY.map((c) => [c.name, c]));

export const CATEGORIES: Category[] = [
  "basic", "layout", "navigation", "forms", "advanced-forms",
  "data-display", "feedback", "overlay", "media", "utility",
];