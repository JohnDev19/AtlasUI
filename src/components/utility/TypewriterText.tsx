import * as React from "react";
import { cn } from "../../utils/cn";

export interface TypewriterTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Array of strings to cycle through. At least one is required. */
  strings: string[];
  /** Milliseconds per character when typing forward. Default 80. */
  speed?: number;
  /** Milliseconds per character when deleting. Default 40. */
  deleteSpeed?: number;
  /** Milliseconds to pause at a fully-typed string before deleting. Default 2000. */
  pause?: number;
  /** Cursor character appended to the text. Default "|". */
  cursor?: string;
  /** Whether to loop indefinitely. Default true. */
  loop?: boolean;
}

const TypewriterText = React.forwardRef<HTMLSpanElement, TypewriterTextProps>(
  (
    {
      strings,
      speed = 80,
      deleteSpeed = 40,
      pause = 2000,
      cursor = "|",
      loop = true,
      className,
      ...props
    },
    ref
  ) => {
    const [display, setDisplay] = React.useState("");
    const [cursorVisible, setCursorVisible] = React.useState(true);

    // Cursor blink — independent of the typing loop
    React.useEffect(() => {
      const id = setInterval(() => setCursorVisible((v) => !v), 530);
      return () => clearInterval(id);
    }, []);

    // Typing loop
    React.useEffect(() => {
      if (!strings.length) return;

      let stringIdx = 0;
      let charIdx   = 0;
      let isDeleting = false;
      let timeout: ReturnType<typeof setTimeout>;

      const tick = () => {
        const current = strings[stringIdx];

        if (!isDeleting) {
          // Type one character forward
          charIdx = Math.min(charIdx + 1, current.length);
          setDisplay(current.slice(0, charIdx));

          if (charIdx === current.length) {
            // Reached the end — pause, then start deleting
            isDeleting = true;
            timeout = setTimeout(tick, pause);
          } else {
            timeout = setTimeout(tick, speed);
          }
        } else {
          // Delete one character
          charIdx = Math.max(charIdx - 1, 0);
          setDisplay(current.slice(0, charIdx));

          if (charIdx === 0) {
            // Finished deleting — advance to next string
            isDeleting = false;
            const nextIdx = stringIdx + 1;

            if (nextIdx >= strings.length) {
              if (!loop) return; // stop the loop
              stringIdx = 0;
            } else {
              stringIdx = nextIdx;
            }

            timeout = setTimeout(tick, speed);
          } else {
            timeout = setTimeout(tick, deleteSpeed);
          }
        }
      };

      timeout = setTimeout(tick, speed);

      return () => clearTimeout(timeout);
      // Re-run only when the relevant props change.
      // Note: if `strings` is an inline array literal it will restart on every
      // parent render — memoize with useMemo or useRef in that case.
    }, [strings, speed, deleteSpeed, pause, loop]);

    return (
      <span
        ref={ref}
        className={cn("atlas-typewriter whitespace-pre", className)}
        aria-label={display}
        aria-live="polite"
        {...props}
      >
        {display}
        <span
          className="select-none"
          style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
          aria-hidden="true"
        >
          {cursor}
        </span>
      </span>
    );
  }
);

TypewriterText.displayName = "TypewriterText";

export { TypewriterText };
