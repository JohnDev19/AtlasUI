import * as React from "react";
export interface UseIntersectionOptions extends IntersectionObserverInit { once?: boolean; }
export function useIntersection<T extends Element>(ref: React.RefObject<T>, options: UseIntersectionOptions = {}) {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const observer = new IntersectionObserver(([e]) => { setEntry(e); if (options.once && e.isIntersecting) observer.disconnect(); }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options.once, options.threshold, options.root, options.rootMargin]);
  return entry;
}
