import * as React from "react";
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = React.useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; }
    catch { return initialValue; }
  });
  const setValue = (value: T | ((v: T) => T)) => {
    const next = value instanceof Function ? value(stored) : value;
    setStored(next);
    if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(next));
  };
  return [stored, setValue] as const;
}
