import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes without conflicts.
 * Wrapper around clsx + tailwind-merge — use this everywhere in Veloria UI
 * instead of raw string concatenation.
 *
 * @example
 * cn("px-4 py-2", isLarge && "px-8", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Chains two event handlers so both fire, but respects defaultPrevented
 * on the original handler before calling ours.
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);
    if (
      !checkForDefaultPrevented ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

/**
 * Quick incrementing ID generator — used for linking labels to inputs
 * when no explicit id prop is passed.
 */
let idCounter = 0;
export function generateId(prefix = "atlas"): string {
  return `${prefix}-${++idCounter}`;
}

/** True only in browser environments. Guards SSR code paths. */
export const isBrowser = typeof window !== "undefined";

/** A do-nothing function. Handy as a default prop value. */
export const noop = () => undefined;

/** Narrows out null and undefined from a value. */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

/**
 * Filters React.Children down to only valid elements.
 * Useful when mapping children and you need to skip strings/nulls.
 */
export function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  ) as React.ReactElement[];
}

import React from "react";
