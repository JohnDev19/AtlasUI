import * as React from "react";

// ─── useDisclosure ─────────────────────────────────────────────────────────

export interface UseDisclosureOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Manages open/close state for modals, drawers, popovers — anything
 * that needs to toggle. Returns stable callbacks so child components
 * don't re-render on every parent render.
 */
export function useDisclosure(options: UseDisclosureOptions = {}) {
  const [isOpen, setIsOpen] = React.useState(options.defaultOpen ?? false);

  const open = React.useCallback(() => {
    setIsOpen(true);
    options.onOpen?.();
  }, [options]);

  const close = React.useCallback(() => {
    setIsOpen(false);
    options.onClose?.();
  }, [options]);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => {
      if (prev) options.onClose?.();
      else options.onOpen?.();
      return !prev;
    });
  }, [options]);

  return { isOpen, open, close, toggle, onOpenChange: setIsOpen };
}

// ─── useMediaQuery ─────────────────────────────────────────────────────────

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * SSR-safe — returns false on the server.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// ─── useBreakpoint ─────────────────────────────────────────────────────────

const breakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

/**
 * Returns true when the viewport is at or above the given Tailwind breakpoint.
 *
 * @example
 * const isDesktop = useBreakpoint("lg");
 */
export function useBreakpoint(bp: keyof typeof breakpoints): boolean {
  return useMediaQuery(breakpoints[bp]);
}

// ─── useClipboard ──────────────────────────────────────────────────────────

export interface UseClipboardOptions {
  timeout?: number;
}

/**
 * Copies text to the clipboard and briefly flips `copied` to true.
 * Falls back to execCommand for older browsers (looking at you, Safari).
 *
 * @example
 * const { copy, copied } = useClipboard();
 * <button onClick={() => copy(code)}>{copied ? "Copied!" : "Copy"}</button>
 */
export function useClipboard(options: UseClipboardOptions = {}) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async (text: string) => {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), options.timeout ?? 2000);
    } catch {
      // execCommand fallback — deprecated but still works in some envs
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), options.timeout ?? 2000);
    }
  }, [options.timeout]);

  return { copy, copied };
}

// ─── useLocalStorage ──────────────────────────────────────────────────────

/**
 * useState that persists to localStorage. Reads the initial value
 * from storage on mount and syncs back on every set call.
 * Safe to use with SSR — reads from storage only inside useEffect timing.
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = React.useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof newValue === "function" ? (newValue as (p: T) => T)(prev) : newValue;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch { /* quota exceeded or private mode — silently ignore */ }
      return next;
    });
  }, [key]);

  return [value, set];
}

// ─── useTheme ──────────────────────────────────────────────────────────────

export type AtlasTheme = "light" | "dark" | "system";

/**
 * Read and set the current AtlasUI theme.
 * Persists the selection to localStorage under "atlas-theme".
 * Applies the "dark" class to <html> so Tailwind's dark: utilities kick in.
 *
 * @example
 * const { theme, setTheme } = useTheme();
 * <button onClick={() => setTheme("dark")}>Go dark</button>
 */
export function useTheme() {
  const [theme, setThemeState] = useLocalStorage<AtlasTheme>("atlas-theme", "system");

  const resolvedTheme = React.useMemo<"light" | "dark">(() => {
    if (theme === "system") {
      return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme]);

  const setTheme = React.useCallback((t: AtlasTheme) => {
    setThemeState(t);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      if (t !== "system") root.classList.add(t);
    }
  }, [setThemeState]);

  return { theme, resolvedTheme, setTheme };
}

// ─── useDebounce ───────────────────────────────────────────────────────────

/**
 * Delays updating the returned value until `delay` ms have passed
 * without the input changing. Classic use case: search inputs.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── useOnClickOutside ────────────────────────────────────────────────────

/**
 * Fires the handler when a click happens outside of the ref'd element.
 * Used heavily inside AtlasUI popovers, dropdowns, and comboboxes.
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ─── useKeydown ───────────────────────────────────────────────────────────

/**
 * Attaches a keydown listener to window for the given key.
 * Supports modifier checks (Ctrl, Meta, Shift).
 * Pass `enabled: false` to temporarily disable without removing the hook call.
 *
 * @example
 * useKeydown("k", openCommandPalette, { metaKey: true });
 */
export function useKeydown(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; enabled?: boolean } = {}
) {
  React.useEffect(() => {
    if (options.enabled === false) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key !== key) return;
      if (options.ctrlKey && !event.ctrlKey) return;
      if (options.metaKey && !event.metaKey) return;
      if (options.shiftKey && !event.shiftKey) return;
      handler(event);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [key, handler, options]);
}

// ─── useMounted ───────────────────────────────────────────────────────────

/**
 * Returns true after the component has mounted on the client.
 * Use this to guard any DOM-dependent code in SSR environments
 * (Next.js, Remix, etc.) without suppressHydrationWarning hacks.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

export { useId } from "react";
