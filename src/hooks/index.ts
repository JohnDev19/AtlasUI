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
 * Read and set the current Veloria UI theme.
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
 * Used heavily inside Veloria UI popovers, dropdowns, and comboboxes.
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

// ═══════════════════════════════════════════════════════════════
// New in v0.1.2
// ═══════════════════════════════════════════════════════════════


// ─── useForm ──────────────────────────────────────────────────────────────

type FieldValue = string | number | boolean | undefined;

export interface UseFormOptions<T extends Record<string, FieldValue>> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T extends Record<string, FieldValue>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  setValue: (field: keyof T, value: FieldValue) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => void;
  reset: () => void;
}

export function useForm<T extends Record<string, FieldValue>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const [values, setValuesState] = React.useState<T>(options.initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isDirty = JSON.stringify(values) !== JSON.stringify(options.initialValues);

  const runValidation = React.useCallback((vals: T) => {
    if (!options.validate) return {};
    return options.validate(vals);
  }, [options]);

  const isValid = Object.keys(runValidation(values)).length === 0;

  const setValue = React.useCallback((field: keyof T, value: FieldValue) => {
    setValuesState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setValues = React.useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const setError = React.useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearError = React.useCallback((field: keyof T) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleChange = React.useCallback((field: keyof T) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const val = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setValue(field, val as FieldValue);
    if (touched[field]) {
      const newVals = { ...values, [field]: val };
      const errs = runValidation(newVals as T);
      setErrors(errs);
    }
  }, [values, touched, setValue, runValidation]);

  const handleBlur = React.useCallback((field: keyof T) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = runValidation(values);
    setErrors(errs);
  }, [values, runValidation]);

  const handleSubmit = React.useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    const allTouched = Object.keys(values).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Partial<Record<keyof T, boolean>>
    );
    setTouched(allTouched);
    const errs = runValidation(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);
    Promise.resolve(options.onSubmit?.(values)).finally(() => setIsSubmitting(false));
  }, [values, options, runValidation]);

  const reset = React.useCallback(() => {
    setValuesState(options.initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [options.initialValues]);

  return {
    values, errors, touched, isSubmitting, isDirty, isValid,
    setValue, setValues, setError, clearError,
    handleChange, handleBlur, handleSubmit, reset,
  };
}

// ─── usePagination ────────────────────────────────────────────────────────

export interface UsePaginationOptions {
  total: number;
  pageSize?: number;
  defaultPage?: number;
  onChange?: (page: number, pageSize: number) => void;
}

export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  hasPrev: boolean;
  hasNext: boolean;
  goTo: (page: number) => void;
  goNext: () => void;
  goPrev: () => void;
  goFirst: () => void;
  goLast: () => void;
  setPageSize: (size: number) => void;
}

export function usePagination({
  total,
  pageSize: defaultPageSize = 10,
  defaultPage = 1,
  onChange,
}: UsePaginationOptions): UsePaginationReturn {
  const [page, setPage] = React.useState(defaultPage);
  const [pageSize, setPageSizeState] = React.useState(defaultPageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const goTo = React.useCallback((p: number) => {
    const clamped = Math.max(1, Math.min(p, totalPages));
    setPage(clamped);
    onChange?.(clamped, pageSize);
  }, [totalPages, pageSize, onChange]);

  const setPageSize = React.useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
    onChange?.(1, size);
  }, [onChange]);

  const from = Math.min((page - 1) * pageSize + 1, total);
  const to   = Math.min(page * pageSize, total);

  return {
    page, pageSize, totalPages, total, from, to,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    goTo,
    goNext: () => goTo(page + 1),
    goPrev: () => goTo(page - 1),
    goFirst: () => goTo(1),
    goLast:  () => goTo(totalPages),
    setPageSize,
  };
}

// ─── useIntersection ──────────────────────────────────────────────────────

export interface UseIntersectionOptions extends IntersectionObserverInit {
  once?: boolean;
}

export function useIntersection<T extends HTMLElement>(
  options: UseIntersectionOptions = {}
): [React.RefCallback<T>, boolean] {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const { once, ...observerOptions } = options;

  const ref: React.RefCallback<T> = React.useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node) return;

    observerRef.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && once) {
        observerRef.current?.disconnect();
      }
    }, observerOptions);

    observerRef.current.observe(node);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, observerOptions.threshold, observerOptions.root, observerOptions.rootMargin]);

  return [ref, isIntersecting];
}

// ─── useWindowSize ────────────────────────────────────────────────────────

export interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = React.useState<WindowSize>(() => ({
    width:  typeof window !== "undefined" ? window.innerWidth  : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return size;
}

// ─── useStep ──────────────────────────────────────────────────────────────

export interface UseStepOptions {
  total: number;
  defaultStep?: number;
  onChange?: (step: number) => void;
}

export interface UseStepReturn {
  step: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  goNext: () => void;
  goPrev: () => void;
  goTo: (step: number) => void;
  reset: () => void;
}

export function useStep({ total, defaultStep = 0, onChange }: UseStepOptions): UseStepReturn {
  const [step, setStep] = React.useState(defaultStep);

  const goTo = React.useCallback((s: number) => {
    const clamped = Math.max(0, Math.min(s, total - 1));
    setStep(clamped);
    onChange?.(clamped);
  }, [total, onChange]);

  return {
    step,
    total,
    isFirst: step === 0,
    isLast:  step === total - 1,
    progress: total > 1 ? (step / (total - 1)) * 100 : 0,
    goNext:  () => goTo(step + 1),
    goPrev:  () => goTo(step - 1),
    goTo,
    reset:   () => goTo(defaultStep),
  };
}

// ─── useCountdown ─────────────────────────────────────────────────────────

export interface UseCountdownOptions {
  from: number;
  interval?: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export interface UseCountdownReturn {
  count: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useCountdown({
  from,
  interval = 1000,
  onComplete,
  autoStart = false,
}: UseCountdownOptions): UseCountdownReturn {
  const [count, setCount] = React.useState(from);
  const [isRunning, setIsRunning] = React.useState(autoStart);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, interval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, interval, onComplete]);

  return {
    count,
    isRunning,
    start: () => { if (count > 0) setIsRunning(true); },
    pause: () => setIsRunning(false),
    reset: () => { setIsRunning(false); setCount(from); },
  };
}

