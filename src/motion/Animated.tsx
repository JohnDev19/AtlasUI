/**
 * veloria-ui/motion — <Animated>
 *
 * The primary building block. Wraps any HTML element with enter/exit
 * animation driven by the Web Animations API.
 *
 * Usage:
 *   <Animated show={isOpen} motion="fade-up">
 *     <p>Hello</p>
 *   </Animated>
 *
 *   <Animated motion={{ preset: "fade-scale", delay: 100, duration: 300 }}>
 *     <Card>Always visible, animates on mount</Card>
 *   </Animated>
 */

"use client";

import * as React from "react";
import type { AnimatedProps } from "./types";
import { useMotion } from "./useMotion";

export const Animated = React.forwardRef<HTMLElement, AnimatedProps>(
  function Animated(
    {
      show = true,
      motion,
      keepMounted = false,
      as: Tag = "div",
      children,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const [exitDone, setExitDone] = React.useState(false);

    const { ref: internalRef, isVisible } = useMotion({
      show,
      motion,
      onExitComplete: () => setExitDone(true),
    });

    const mergedRef = React.useCallback(
      (node: HTMLElement | null) => {
        (internalRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
      },
      [internalRef, forwardedRef]
    );

    React.useEffect(() => {
      if (show) setExitDone(false);
    }, [show]);

    if (!keepMounted && !show && exitDone) return null;
    
    if (!keepMounted && !isVisible && !show) return null;

    return (
      <Tag
        ref={mergedRef}
        style={{
          // invisible so the enter animation keyframes take over
          opacity: 0,
          ...style,
        }}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);

Animated.displayName = "Animated";
