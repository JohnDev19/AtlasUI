import * as React from "react";
interface KeydownOptions { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean; }
export function useKeydown(key: string, handler: (e: KeyboardEvent) => void, options: KeydownOptions = {}) {
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key !== key) return;
      if (options.ctrl  && !e.ctrlKey)  return;
      if (options.shift && !e.shiftKey) return;
      if (options.alt   && !e.altKey)   return;
      if (options.meta  && !e.metaKey)  return;
      handler(e);
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [key, handler, options.ctrl, options.shift, options.alt, options.meta]);
}
