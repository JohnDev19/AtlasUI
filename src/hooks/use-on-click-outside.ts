import * as React from "react";
export function useOnClickOutside<T extends HTMLElement>(ref: React.RefObject<T>, handler: (e: MouseEvent | TouchEvent) => void) {
  React.useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => { document.removeEventListener("mousedown", listener); document.removeEventListener("touchstart", listener); };
  }, [ref, handler]);
}
