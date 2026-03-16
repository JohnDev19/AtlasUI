import { useMediaQuery } from "./use-media-query";
const breakpoints = { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" };
export function useBreakpoint(bp: keyof typeof breakpoints) {
  return useMediaQuery(`(min-width: ${breakpoints[bp]})`);
}
