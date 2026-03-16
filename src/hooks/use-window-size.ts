import * as React from "react";
export interface WindowSize { width: number; height: number; }
export function useWindowSize(): WindowSize {
  const [size, setSize] = React.useState<WindowSize>({ width: 0, height: 0 });
  React.useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}
