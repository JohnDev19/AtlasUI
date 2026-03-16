/**
 * Veloria UI — New Unique Components (v0.1.3)
 *
 * Components not commonly found in other UI libraries:
 * Marquee, GlowCard, MorphingText, ScrollReveal, NumberFlow,
 * BentoGrid, PricingCard, ReadingProgress, SpotlightCard,
 * AnimatedBorder, TiltCard, TypewriterText, GradientText,
 * StickyNote, Ribbon, PulseRing, CountUp, RippleButton
 */

import * as React from "react";
import { cn } from "../../utils/cn";

// ─── Marquee ─────────────────────────────────────────────────────────────────
// Smooth infinite-scroll ticker. No equivalent in shadcn/MUI/Chakra.

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pixels per second */
  speed?: number;
  /** Pause on hover */
  pauseOnHover?: boolean;
  /** Reverse direction */
  reverse?: boolean;
  /** Gap between items */
  gap?: number;
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  ({ className, children, speed = 40, pauseOnHover = true, reverse = false, gap = 32, ...props }, ref) => {
    const duration = `${100 / (speed / 40)}s`;
    return (
      <div
        ref={ref}
        className={cn("veloria-marquee relative flex overflow-hidden", className)}
        style={{ "--marquee-gap": `${gap}px` } as React.CSSProperties}
        {...props}
      >
        {[0, 1].map((i) => (
          <div
            key={i}
            aria-hidden={i === 1}
            className={cn(
              "flex shrink-0 items-center",
              reverse ? "animate-marquee-reverse" : "animate-marquee",
              pauseOnHover && "hover:[animation-play-state:paused]"
            )}
            style={{ animationDuration: duration, gap: `${gap}px` }}
          >
            {children}
          </div>
        ))}
      </div>
    );
  }
);
Marquee.displayName = "Marquee";

// ─── GlowCard ────────────────────────────────────────────────────────────────
// Card with animated glow that follows mouse. Not in any major library.

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  glowSize?: number;
}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, children, glowColor = "hsl(var(--primary) / 0.4)", glowSize = 300, style, ...props }, ref) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [pos, setPos] = React.useState({ x: -9999, y: -9999 });

    const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      setPos({ x: -9999, y: -9999 });
    }, []);

    const combinedRef = (node: HTMLDivElement | null) => {
      (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    return (
      <div
        ref={combinedRef}
        className={cn(
          "veloria-glow-card relative overflow-hidden rounded-xl border border-border bg-card",
          "shadow-sm transition-shadow duration-300",
          className
        )}
        style={{
          ...style,
          "--glow-x": `${pos.x}px`,
          "--glow-y": `${pos.y}px`,
          "--glow-color": glowColor,
          "--glow-size": `${glowSize}px`,
        } as React.CSSProperties}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Glow layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background: `radial-gradient(var(--glow-size) circle at var(--glow-x) var(--glow-y), var(--glow-color), transparent 70%)`,
          }}
        />
        {children}
      </div>
    );
  }
);
GlowCard.displayName = "GlowCard";

// ─── SpotlightCard ───────────────────────────────────────────────────────────
// Card with sharper spotlight effect — different from GlowCard.

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
}

const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  ({ className, children, spotlightColor = "hsl(var(--primary) / 0.15)", style, ...props }, ref) => {
    const [pos, setPos] = React.useState({ x: 50, y: 50 });
    const [active, setActive] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "veloria-spotlight-card relative overflow-hidden rounded-xl border border-border bg-card shadow-sm",
          className
        )}
        style={{
          ...style,
          background: active
            ? `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 40%), hsl(var(--card))`
            : undefined,
        } as React.CSSProperties}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SpotlightCard.displayName = "SpotlightCard";

// ─── BentoGrid ───────────────────────────────────────────────────────────────
// Asymmetric bento-box grid layout. Popular design trend, absent from most libs.

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, children, columns = 3, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "veloria-bento-grid grid gap-4 auto-rows-[minmax(140px,auto)]",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-4",
        "max-sm:grid-cols-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
BentoGrid.displayName = "BentoGrid";

export interface BentoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How many grid columns this item spans */
  colSpan?: 1 | 2 | 3 | 4;
  /** How many grid rows this item spans */
  rowSpan?: 1 | 2 | 3;
}

const BentoItem = React.forwardRef<HTMLDivElement, BentoItemProps>(
  ({ className, colSpan = 1, rowSpan = 1, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "veloria-bento-item rounded-xl border border-border bg-card p-6 overflow-hidden",
        colSpan === 2 && "col-span-2",
        colSpan === 3 && "col-span-3",
        colSpan === 4 && "col-span-4",
        rowSpan === 2 && "row-span-2",
        rowSpan === 3 && "row-span-3",
        className
      )}
      {...props}
    />
  )
);
BentoItem.displayName = "BentoItem";

// ─── GradientText ─────────────────────────────────────────────────────────────
// Animated gradient text — common in premium UIs, missing from most libs.

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
  as?: React.ElementType;
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  (
    {
      className,
      children,
      from = "hsl(var(--primary))",
      via,
      to = "hsl(262 83% 78%)",
      animate = false,
      as: Tag = "span",
      style,
      ...props
    },
    ref
  ) => {
    const gradient = via
      ? `linear-gradient(135deg, ${from}, ${via}, ${to})`
      : `linear-gradient(135deg, ${from}, ${to})`;

    return (
      <Tag
        ref={ref}
        className={cn(
          "veloria-gradient-text bg-clip-text text-transparent",
          animate && "animate-gradient-x bg-[length:200%_auto]",
          className
        )}
        style={{ backgroundImage: gradient, ...style }}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
GradientText.displayName = "GradientText";

// ─── TypewriterText ──────────────────────────────────────────────────────────
// Client-side typewriter with cursor blink. Not in shadcn/MUI/Chakra.

export interface TypewriterTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  cursor?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseMs = 1500,
  cursor = true,
  className,
  ...props
}) => {
  const [text, setText] = React.useState("");
  const [wordIndex, setWordIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);
  const [showCursor, setShowCursor] = React.useState(true);

  React.useEffect(() => {
    const word = words[wordIndex % words.length];
    const delay = deleting ? deletingSpeed : text === word ? pauseMs : typingSpeed;

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((i) => i + 1);
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  React.useEffect(() => {
    const t = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <span className={cn("veloria-typewriter", className)} {...props}>
      {text}
      {cursor && (
        <span
          aria-hidden="true"
          className={cn(
            "ml-0.5 inline-block w-0.5 h-[1.1em] align-middle bg-current transition-opacity",
            showCursor ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </span>
  );
};
TypewriterText.displayName = "TypewriterText";

// ─── CountUp ─────────────────────────────────────────────────────────────────
// Animated number counter. Compact, dependency-free.

export interface CountUpProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  /** Start counting when element enters viewport */
  onViewport?: boolean;
}

const CountUp = React.forwardRef<HTMLSpanElement, CountUpProps>(
  (
    {
      end,
      start = 0,
      duration = 2000,
      decimals = 0,
      prefix = "",
      suffix = "",
      separator = "",
      onViewport = true,
      className,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState(start);
    const [started, setStarted] = React.useState(!onViewport);
    const elRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
      if (!onViewport) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
        { threshold: 0.3 }
      );
      if (elRef.current) observer.observe(elRef.current);
      return () => observer.disconnect();
    }, [onViewport]);

    React.useEffect(() => {
      if (!started) return;
      const startTime = performance.now();
      const range = end - start;
      const frame = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setValue(start + range * ease);
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, [started, start, end, duration]);

    const formatted = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    const combinedRef = (node: HTMLSpanElement | null) => {
      (elRef as React.MutableRefObject<HTMLSpanElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
    };

    return (
      <span ref={combinedRef} className={cn("veloria-count-up tabular-nums", className)} {...props}>
        {prefix}{formatted}{suffix}
      </span>
    );
  }
);
CountUp.displayName = "CountUp";

// ─── ReadingProgress ─────────────────────────────────────────────────────────
// Sticky reading progress bar at top of page.

export interface ReadingProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  color?: string;
  height?: number;
  position?: "top" | "bottom";
}

const ReadingProgress = React.forwardRef<HTMLDivElement, ReadingProgressProps>(
  ({ className, color = "hsl(var(--primary))", height = 3, position = "top", ...props }, ref) => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const onScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
        className={cn(
          "veloria-reading-progress fixed left-0 right-0 z-50",
          position === "top" ? "top-0" : "bottom-0",
          className
        )}
        style={{ height }}
        {...props}
      >
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%`, background: color }}
        />
      </div>
    );
  }
);
ReadingProgress.displayName = "ReadingProgress";

// ─── AnimatedBorder ──────────────────────────────────────────────────────────
// Container with animated gradient border (conic sweep).

export interface AnimatedBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number;
  speed?: number;
  colors?: string[];
  radius?: string;
}

const AnimatedBorder = React.forwardRef<HTMLDivElement, AnimatedBorderProps>(
  (
    {
      className,
      children,
      borderWidth = 2,
      speed = 4,
      colors = ["hsl(var(--primary))", "hsl(262 83% 78%)", "hsl(var(--info))", "hsl(var(--primary))"],
      radius = "0.75rem",
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("veloria-animated-border relative p-[var(--border-w)] overflow-hidden", className)}
        style={{
          "--border-w": `${borderWidth}px`,
          borderRadius: radius,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {/* Spinning gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-[-200%] animate-spin"
          style={{
            background: `conic-gradient(from 0deg, ${colors.join(", ")})`,
            animationDuration: `${speed}s`,
            animationTimingFunction: "linear",
          }}
        />
        {/* Content */}
        <div
          className="relative z-10 h-full w-full bg-background"
          style={{ borderRadius: `calc(${radius} - ${borderWidth}px)` }}
        >
          {children}
        </div>
      </div>
    );
  }
);
AnimatedBorder.displayName = "AnimatedBorder";

// ─── RippleButton ─────────────────────────────────────────────────────────────
// Button with material-style ripple on click.

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, children, rippleColor = "rgba(255,255,255,0.4)", onClick, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now();
      setRipples((r) => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
      setTimeout(() => setRipples((r) => r.filter((rip) => rip.id !== id)), 600);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(
          "veloria-ripple-button relative overflow-hidden inline-flex items-center justify-center gap-2",
          "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
          "transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50 select-none",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden="true"
            className="absolute rounded-full animate-ripple"
            style={{
              left: r.x,
              top: r.y,
              transform: "translate(-50%, -50%)",
              background: rippleColor,
              width: 8,
              height: 8,
            }}
          />
        ))}
        {children}
      </button>
    );
  }
);
RippleButton.displayName = "RippleButton";

// ─── PricingCard ──────────────────────────────────────────────────────────────
// Opinionated pricing tier card. Missing from every major component library.

export interface PricingFeature {
  text: string;
  included: boolean;
  note?: string;
}

export interface PricingCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  plan: string;
  price: React.ReactNode;
  period?: string;
  description?: string;
  features: PricingFeature[];
  cta?: React.ReactNode;
  badge?: string;
  highlighted?: boolean;
  variant?: "default" | "classic";
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className,
      plan,
      price,
      period = "/month",
      description,
      features,
      cta,
      badge,
      highlighted = false,
      variant = "default",
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "veloria-pricing-card relative flex flex-col rounded-2xl border p-8 gap-6",
        highlighted
          ? "border-primary bg-primary text-primary-foreground shadow-2xl shadow-primary/25 scale-[1.02]"
          : variant === "classic"
          ? "border-[hsl(var(--classic-border))] bg-[hsl(var(--classic-surface))] shadow-[0_2px_8px_hsl(var(--classic-shadow)),inset_0_1px_0_hsl(var(--classic-highlight))]"
          : "border-border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      {badge && (
        <span
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2",
            "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest",
            highlighted ? "bg-background text-primary" : "bg-primary text-primary-foreground"
          )}
        >
          {badge}
        </span>
      )}
      <div>
        <p className={cn("text-sm font-semibold uppercase tracking-widest", !highlighted && "text-muted-foreground")}>
          {plan}
        </p>
        <div className="mt-2 flex items-end gap-1">
          <span className="text-4xl font-bold tracking-tight">{price}</span>
          {period && <span className={cn("mb-1 text-sm", !highlighted && "text-muted-foreground")}>{period}</span>}
        </div>
        {description && (
          <p className={cn("mt-2 text-sm", !highlighted && "text-muted-foreground")}>{description}</p>
        )}
      </div>
      <ul className="flex flex-col gap-3" role="list">
        {features.map((f, i) => (
          <li key={i} className={cn("flex items-start gap-2.5 text-sm", !f.included && "opacity-50")}>
            <svg
              className={cn("mt-0.5 h-4 w-4 shrink-0", f.included ? (highlighted ? "" : "text-success") : "")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {f.included ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <span>
              {f.text}
              {f.note && (
                <span className={cn("ml-1 text-xs", !highlighted && "text-muted-foreground")}>({f.note})</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      {cta && <div className="mt-auto">{cta}</div>}
    </div>
  )
);
PricingCard.displayName = "PricingCard";

// ─── StickyNote ───────────────────────────────────────────────────────────────
// Post-it style note component. Unique visual, absent elsewhere.

export type StickyNoteColor = "yellow" | "pink" | "blue" | "green" | "purple" | "orange";

export interface StickyNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: StickyNoteColor;
  rotated?: boolean | number;
  pinned?: boolean;
}

const stickyColors: Record<StickyNoteColor, string> = {
  yellow: "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800",
  pink:   "bg-pink-100 dark:bg-pink-900/40 border-pink-200 dark:border-pink-800",
  blue:   "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800",
  green:  "bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800",
  purple: "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800",
  orange: "bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800",
};

const StickyNote = React.forwardRef<HTMLDivElement, StickyNoteProps>(
  ({ className, children, color = "yellow", rotated, pinned = false, style, ...props }, ref) => {
    const rotation = rotated === true ? -2 : typeof rotated === "number" ? rotated : 0;
    return (
      <div
        ref={ref}
        className={cn(
          "veloria-sticky-note relative rounded-sm border p-4 shadow-md font-handwriting text-sm leading-relaxed",
          stickyColors[color],
          className
        )}
        style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined, ...style }}
        {...props}
      >
        {pinned && (
          <div
            aria-hidden="true"
            className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-gray-400 shadow-sm border border-gray-500"
          />
        )}
        {children}
      </div>
    );
  }
);
StickyNote.displayName = "StickyNote";

// ─── Ribbon ──────────────────────────────────────────────────────────────────
// Decorative corner ribbon for "New", "Sale", "Hot" etc. Not in any major lib.

export interface RibbonProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  color?: "primary" | "success" | "danger" | "warning" | "info";
  corner?: "top-left" | "top-right";
}

const ribbonColors = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-green-500 text-white",
  danger:  "bg-destructive text-destructive-foreground",
  warning: "bg-yellow-500 text-white",
  info:    "bg-blue-500 text-white",
};

const Ribbon = React.forwardRef<HTMLDivElement, RibbonProps>(
  ({ className, label, color = "primary", corner = "top-right", ...props }, ref) => (
    <div
      ref={ref}
      aria-label={label}
      className={cn(
        "veloria-ribbon absolute overflow-hidden pointer-events-none",
        corner === "top-right" ? "top-0 right-0" : "top-0 left-0",
        "h-16 w-16",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute flex items-center justify-center",
          "text-[9px] font-bold uppercase tracking-widest",
          "shadow-md",
          ribbonColors[color],
          corner === "top-right"
            ? "right-[-20px] top-[14px] w-[90px] rotate-45"
            : "left-[-20px] top-[14px] w-[90px] -rotate-45"
        )}
      >
        {label}
      </span>
    </div>
  )
);
Ribbon.displayName = "Ribbon";

// ─── PulseRing ────────────────────────────────────────────────────────────────
// Animated pulsing ring indicator (live/active status).

export interface PulseRingProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  size?: "sm" | "md" | "lg";
  dotSize?: number;
}

const PulseRing = React.forwardRef<HTMLDivElement, PulseRingProps>(
  ({ className, color = "hsl(var(--success))", size = "md", ...props }, ref) => {
    const dotSizes = { sm: "h-2 w-2", md: "h-3 w-3", lg: "h-4 w-4" };
    const ringSizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
    return (
      <div ref={ref} className={cn("veloria-pulse-ring relative inline-flex items-center justify-center", className)} {...props}>
        <div
          className={cn("absolute rounded-full animate-ping opacity-60", ringSizes[size])}
          style={{ background: color }}
          aria-hidden="true"
        />
        <div
          className={cn("relative rounded-full", dotSizes[size])}
          style={{ background: color }}
        />
      </div>
    );
  }
);
PulseRing.displayName = "PulseRing";

// ─── CommandBar ───────────────────────────────────────────────────────────────
// Persistent command/action bar that sits at bottom of screen.

export interface CommandBarAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

export interface CommandBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  actions: CommandBarAction[];
  visible?: boolean;
  selectedCount?: number;
  onClear?: () => void;
}

const CommandBar = React.forwardRef<HTMLDivElement, CommandBarProps>(
  ({ className, actions, visible = true, selectedCount, onClear, ...props }, ref) => {
    if (!visible) return null;
    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label="Command bar"
        className={cn(
          "veloria-command-bar fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "flex items-center gap-1 rounded-xl border border-border bg-background/95 backdrop-blur",
          "shadow-[0_8px_32px_hsl(0_0%_0%/0.2)] px-2 py-2",
          "animate-in slide-in-from-bottom-2 duration-200",
          className
        )}
        {...props}
      >
        {selectedCount !== undefined && (
          <>
            <span className="px-3 text-sm font-medium text-muted-foreground">
              {selectedCount} selected
            </span>
            <div className="h-6 w-px bg-border mx-1" aria-hidden="true" />
          </>
        )}
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5",
              "text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:pointer-events-none disabled:opacity-50",
              action.variant === "danger"
                ? "text-destructive hover:bg-destructive/10"
                : "text-foreground hover:bg-accent"
            )}
          >
            {action.icon && <span className="h-4 w-4 shrink-0" aria-hidden="true">{action.icon}</span>}
            {action.label}
            {action.shortcut && (
              <kbd className="ml-1 rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-muted-foreground">
                {action.shortcut}
              </kbd>
            )}
          </button>
        ))}
        {onClear && (
          <>
            <div className="h-6 w-px bg-border mx-1" aria-hidden="true" />
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Clear selection"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        )}
      </div>
    );
  }
);
CommandBar.displayName = "CommandBar";

// ─── ScrollReveal ─────────────────────────────────────────────────────────────
// Wrapper that animates children into view on scroll.

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale" | "blur";
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  (
    {
      className,
      children,
      animation = "fade",
      delay = 0,
      duration = 600,
      threshold = 0.15,
      once = true,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(false);
    const elRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        },
        { threshold }
      );
      if (elRef.current) observer.observe(elRef.current);
      return () => observer.disconnect();
    }, [threshold, once]);

    const initial: Record<string, React.CSSProperties> = {
      fade:        { opacity: 0 },
      "slide-up":  { opacity: 0, transform: "translateY(24px)" },
      "slide-left": { opacity: 0, transform: "translateX(-24px)" },
      "slide-right": { opacity: 0, transform: "translateX(24px)" },
      scale:       { opacity: 0, transform: "scale(0.92)" },
      blur:        { opacity: 0, filter: "blur(8px)" },
    };

    const final: React.CSSProperties = { opacity: 1, transform: "none", filter: "none" };

    const combinedRef = (node: HTMLDivElement | null) => {
      (elRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    return (
      <div
        ref={combinedRef}
        className={cn("veloria-scroll-reveal", className)}
        style={{
          ...(visible ? final : initial[animation]),
          transitionProperty: "opacity, transform, filter",
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: `${delay}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ScrollReveal.displayName = "ScrollReveal";

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  Marquee,
  GlowCard,
  SpotlightCard,
  BentoGrid,
  BentoItem,
  GradientText,
  TypewriterText,
  CountUp,
  ReadingProgress,
  AnimatedBorder,
  RippleButton,
  PricingCard,
  StickyNote,
  Ribbon,
  PulseRing,
  CommandBar,
  ScrollReveal,
};
