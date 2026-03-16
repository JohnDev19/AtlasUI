import * as React from "react";

/**
 * useScrollLock — lock body scroll when a modal or overlay is open.
 * SSR-safe. Restores original overflow on cleanup.
 *
 * @example
 * const { lock, unlock, isLocked } = useScrollLock();
 * // or auto-lock based on a boolean:
 * useScrollLock({ locked: isOpen });
 */

export interface UseScrollLockOptions {
  /** Automatically lock when true, unlock when false */
  locked?: boolean;
}

export interface UseScrollLockReturn {
  isLocked: boolean;
  lock: () => void;
  unlock: () => void;
}

export function useScrollLock(options: UseScrollLockOptions = {}): UseScrollLockReturn {
  const { locked: controlledLocked } = options;
  const [isLocked, setIsLocked] = React.useState(false);
  const originalOverflow = React.useRef<string>("");

  const lock = React.useCallback(() => {
    if (typeof document === "undefined") return;
    originalOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setIsLocked(true);
  }, []);

  const unlock = React.useCallback(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = originalOverflow.current;
    setIsLocked(false);
  }, []);

  React.useEffect(() => {
    if (controlledLocked === undefined) return;
    if (controlledLocked) {
      lock();
    } else {
      unlock();
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = originalOverflow.current;
      }
    };
  }, [controlledLocked, lock, unlock]);

  return { isLocked, lock, unlock };
}
