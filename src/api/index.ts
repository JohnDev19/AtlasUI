/**
 * Veloria UI — Status & Metadata API
 *
 * A lightweight programmatic API that returns live counts and metadata
 * about the library: component counts per category, hook counts,
 * current version, variant list, and health status.
 *
 * Usage:
 *   import { getLibraryStats, getComponentCount, getVersion } from "veloria-ui/api";
 *
 * HTTP endpoint (Next.js App Router example):
 *   export { GET } from "veloria-ui/api/route";
 *
 * — JohnDev19 · v0.1.3
 */

// ─── Registry data ────────────────────────────────────────────────────────────

export interface CategoryStats {
  name: string;
  label: string;
  count: number;
  components: string[];
}

export interface HookStats {
  name: string;
  description: string;
}

export interface LibraryStats {
  name: string;
  version: string;
  description: string;
  releaseDate: string;
  totalComponents: number;
  totalHooks: number;
  totalCategories: number;
  variants: string[];
  categories: CategoryStats[];
  hooks: HookStats[];
  status: "stable" | "beta" | "alpha";
  links: {
    npm: string;
    github: string;
    docs: string;
    changelog: string;
  };
}

// ─── Category definitions ─────────────────────────────────────────────────────

const CATEGORIES: CategoryStats[] = [
  {
    name: "basic",
    label: "Basic & Layout",
    count: 20,
    components: [
      "Button", "IconButton", "Link", "Badge", "Avatar", "AvatarGroup",
      "Divider", "Tag", "Chip", "Tooltip",
      "Container", "Stack", "Grid", "Flex", "Section",
      "Spacer", "AspectRatio", "Center", "ScrollArea", "Masonry",
    ],
  },
  {
    name: "navigation",
    label: "Navigation",
    count: 10,
    components: [
      "Navbar", "Sidebar", "Menu", "DropdownMenu", "Breadcrumb",
      "Pagination", "Tabs", "Stepper", "CommandDialog", "NavigationMenu",
    ],
  },
  {
    name: "forms",
    label: "Forms & Inputs",
    count: 24,
    components: [
      "Input", "TextArea", "Select", "Checkbox", "RadioGroup",
      "Switch", "Slider", "RangeSlider", "DatePicker", "TimePicker",
      "FileUpload", "OTPInput", "ColorPicker", "SearchInput", "PasswordInput",
      "Combobox", "MultiSelect", "FormField", "FormLabel", "FormError",
      "PhoneInput", "TagInput", "CurrencyInput", "RatingInput",
    ],
  },
  {
    name: "data-display",
    label: "Data Display",
    count: 15,
    components: [
      "Card", "Table", "DataTable", "List", "ListItem",
      "Statistic", "Timeline", "Calendar", "CodeBlock", "Chart",
      "StatsCard", "TreeView", "JsonViewer", "Heatmap", "KanbanBoard",
    ],
  },
  {
    name: "feedback",
    label: "Feedback & Status",
    count: 14,
    components: [
      "Alert", "Toast", "Snackbar", "Progress", "CircularProgress",
      "Skeleton", "LoadingSpinner", "EmptyState", "StatusIndicator", "Notification",
      "BannerAlert", "ConfirmDialog", "FloatingActionButton", "RichTooltip",
    ],
  },
  {
    name: "overlay",
    label: "Overlay & Discovery",
    count: 15,
    components: [
      "Modal", "Dialog", "Drawer", "Sheet", "Popover",
      "HoverCard", "ContextMenu", "CommandDialog", "Lightbox", "ImageViewer",
      "Tour", "Tooltip", "RichTooltip", "HoverCard", "ConfirmDialog",
    ],
  },
  {
    name: "media",
    label: "Media",
    count: 5,
    components: [
      "Image", "VideoPlayer", "AudioPlayer", "Carousel", "Gallery",
    ],
  },
  {
    name: "utility",
    label: "Utility & Performance",
    count: 7,
    components: [
      "ThemeSwitcher", "CopyButton", "KeyboardShortcut",
      "ResizablePanel", "DragDropArea", "InfiniteScroll", "VirtualList",
    ],
  },
  {
    name: "unique",
    label: "Unique Components",
    count: 17,
    components: [
      "Marquee", "GlowCard", "SpotlightCard", "BentoGrid", "BentoItem",
      "GradientText", "TypewriterText", "CountUp", "ReadingProgress",
      "AnimatedBorder", "RippleButton", "PricingCard", "StickyNote",
      "Ribbon", "PulseRing", "CommandBar", "ScrollReveal",
    ],
  },
];

const HOOKS: HookStats[] = [
  { name: "useDisclosure",     description: "Open/close state management for modals, drawers, any toggle" },
  { name: "useMediaQuery",     description: "Subscribe to any CSS media query" },
  { name: "useBreakpoint",     description: "Tailwind breakpoint detection (sm, md, lg, xl, 2xl)" },
  { name: "useClipboard",      description: "Clipboard copy with 'copied!' feedback and timeout" },
  { name: "useLocalStorage",   description: "Persistent useState that syncs to localStorage" },
  { name: "useTheme",          description: "Read and set light · dark · system theme" },
  { name: "useDebounce",       description: "Debounce any value — ideal for search inputs" },
  { name: "useOnClickOutside", description: "Detect clicks outside a ref'd element" },
  { name: "useKeydown",        description: "Keyboard shortcut listener with modifier key support" },
  { name: "useMounted",        description: "SSR-safe mount check" },
  { name: "useToast",          description: "Fire toast notifications programmatically" },
  { name: "useForm",           description: "Form state and validation with touched tracking" },
  { name: "usePagination",     description: "Pagination logic decoupled from UI, with from/to helpers" },
  { name: "useIntersection",   description: "IntersectionObserver wrapper with optional once mode" },
  { name: "useWindowSize",     description: "Reactive window width and height, SSR-safe" },
  { name: "useStep",           description: "Multi-step wizard state with isFirst, isLast, and progress" },
  { name: "useCountdown",      description: "Countdown timer with start, pause, and reset controls" },
  { name: "useScrollLock",     description: "Lock body scroll when a modal or overlay is open" },
];

// ─── Core stats builder ───────────────────────────────────────────────────────

export function getLibraryStats(): LibraryStats {
  const totalComponents = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

  return {
    name: "veloria-ui",
    version: "0.1.3",
    description:
      "Build anything. Ship faster. Accessible, composable React components with Tailwind CSS and dark mode.",
    releaseDate: "2026-03-16",
    totalComponents,
    totalHooks: HOOKS.length,
    totalCategories: CATEGORIES.length,
    variants: ["solid", "outline", "ghost", "soft", "link", "danger", "success", "classic"],
    categories: CATEGORIES,
    hooks: HOOKS,
    status: "stable",
    links: {
      npm:       "https://www.npmjs.com/package/veloria-ui",
      github:    "https://github.com/JohnDev19/Veloria-UI",
      docs:      "https://veloria-ui.vercel.app/",
      changelog: "https://github.com/JohnDev19/Veloria-UI/blob/main/CHANGELOG.md",
    },
  };
}

// ─── Convenience helpers ──────────────────────────────────────────────────────

/** Total number of components across all categories */
export function getComponentCount(): number {
  return CATEGORIES.reduce((sum, c) => sum + c.count, 0);
}

/** Total number of hooks */
export function getHookCount(): number {
  return HOOKS.length;
}

/** Current library version */
export function getVersion(): string {
  return "0.1.3";
}

/** All category names */
export function getCategoryNames(): string[] {
  return CATEGORIES.map((c) => c.name);
}

/** Stats for a specific category */
export function getCategoryStats(name: string): CategoryStats | undefined {
  return CATEGORIES.find((c) => c.name === name);
}

/** All component names across all categories */
export function getAllComponentNames(): string[] {
  return CATEGORIES.flatMap((c) => c.components);
}

/** All hook names */
export function getAllHookNames(): string[] {
  return HOOKS.map((h) => h.name);
}

/** All supported variants */
export function getSupportedVariants(): string[] {
  return ["solid", "outline", "ghost", "soft", "link", "danger", "success", "classic"];
}

// ─── JSON-ready response builder ──────────────────────────────────────────────

/**
 * Returns a plain object suitable for JSON serialization.
 * Use this in your API route handler.
 *
 * @example
 * // app/api/veloria/route.ts
 * import { getStatusResponse } from "veloria-ui/api";
 * export function GET() {
 *   return Response.json(getStatusResponse());
 * }
 */
export function getStatusResponse() {
  const stats = getLibraryStats();
  return {
    ok: true,
    timestamp: new Date().toISOString(),
    data: {
      ...stats,
      summary: {
        totalComponents: stats.totalComponents,
        totalHooks: stats.totalHooks,
        totalCategories: stats.totalCategories,
        version: stats.version,
        status: stats.status,
        releaseDate: stats.releaseDate,
        variantCount: stats.variants.length,
      },
    },
  };
}

// ─── Next.js App Router route handler ────────────────────────────────────────

/**
 * Drop-in Next.js App Router GET handler.
 *
 * @example
 * // app/api/veloria-ui/status/route.ts
 * export { GET } from "veloria-ui/api";
 */
export async function GET(_request?: Request): Promise<Response> {
  const body = getStatusResponse();
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Veloria-Version": getVersion(),
    },
  });
}
