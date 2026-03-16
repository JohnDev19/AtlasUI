import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function composeEventHandlers<E>(
  original?: (e: E) => void,
  handler?: (e: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function (event: E) {
    original?.(event);
    if (
      !checkForDefaultPrevented ||
      !(event as unknown as Event).defaultPrevented
    ) {
      handler?.(event);
    }
  };
}

export const generateId = () => Math.random().toString(36).slice(2, 9);
export const isBrowser = typeof window !== "undefined";
export const isDefined = <T>(v: T | undefined | null): v is T => v !== undefined && v !== null;
export const noop = () => {};
