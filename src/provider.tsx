"use client";

/**
 * Veloria UI — VeloriaProvider
 * Wraps your Next.js app (or any React app) and sets up the theme context.
 * Drop it into app/layout.tsx.
 *
 * @example
 * import { VeloriaProvider } from "veloria-ui/provider";
 * export default function RootLayout({ children }) {
 *   return <html lang="en"><body><VeloriaProvider>{children}</VeloriaProvider></body></html>;
 * }
 */

import * as React from "react";

export interface VeloriaProviderProps {
  children: React.ReactNode;
  /** Default theme. Defaults to "system". */
  defaultTheme?: "light" | "dark" | "system";
  /** localStorage key for persisted theme. */
  storageKey?: string;
}

interface ThemeContextValue {
  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
});

export const VeloriaProvider: React.FC<VeloriaProviderProps> = ({
  children,
  defaultTheme = "system",
  storageKey = "veloria-theme",
}) => {
  const [theme, setThemeState] = React.useState<"light" | "dark" | "system">(defaultTheme);

  const applyTheme = React.useCallback((t: "light" | "dark" | "system") => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    const resolved =
      t === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : t;
    root.classList.add(resolved);
  }, []);

  const setTheme = React.useCallback(
    (t: "light" | "dark" | "system") => {
      setThemeState(t);
      try { localStorage.setItem(storageKey, t); } catch { /* SSR */ }
      applyTheme(t);
    },
    [storageKey, applyTheme]
  );

  // Initialise from storage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey) as "light" | "dark" | "system" | null;
      if (saved) { setThemeState(saved); applyTheme(saved); }
      else applyTheme(defaultTheme);
    } catch {
      applyTheme(defaultTheme);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/** Access the Veloria theme context inside any component. */
export const useThemeContext = () => React.useContext(ThemeContext);
