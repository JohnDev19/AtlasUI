import { useLocalStorage } from "./use-local-storage";
import * as React from "react";
export function useTheme() {
  const [theme, setThemeStorage] = useLocalStorage<"light"|"dark"|"system">("veloria-ui-theme","system");
  const setTheme = React.useCallback((t: "light"|"dark"|"system") => {
    setThemeStorage(t);
    if (typeof document === "undefined") return;
    document.documentElement.classList.remove("light","dark");
    const resolved = t === "system" ? (window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light") : t;
    document.documentElement.classList.add(resolved);
  }, [setThemeStorage]);
  return { theme, setTheme };
}
