import * as React from "react";
import { cn } from "../../utils/cn";

export interface AuroraCardBlobConfig {
  /** Any valid CSS color (hex, hsl, rgb…). */
  color: string;
  /** Blob diameter as a percentage of the card width. Default 65. */
  size?: number;
}

export interface AuroraCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Blob color configs. Defaults to a purple / pink / teal trio. */
  blobs?: AuroraCardBlobConfig[];
  /**
   * Opacity of the blobs (0–1).
   * @default 0.45
   */
  intensity?: number;
  /**
   * How many pixels of blur to apply to each blob.
   * @default 56
   */
  blur?: number;
}

const DEFAULT_BLOBS: AuroraCardBlobConfig[] = [
  { color: "#7F77DD", size: 70 },
  { color: "#D4537E", size: 60 },
  { color: "#1D9E75", size: 65 },
];

const AuroraCard = React.forwardRef<HTMLDivElement, AuroraCardProps>(
  (
    {
      className,
      children,
      blobs = DEFAULT_BLOBS,
      intensity = 0.45,
      blur = 56,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [mouse, setMouse] = React.useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
      onMouseMove?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setMouse({ x: 50, y: 50 });
      onMouseLeave?.(e);
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "atlas-aurora-card relative overflow-hidden rounded-xl",
          // dark surface... this is the defining characteristic
          "bg-[hsl(224,71%,6%)]",
          className
        )}
        {...props}
      >
        {/* Aurora blobs layer */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {blobs.map((blob, i) => {
            const size = blob.size ?? 65;
            // base position and a different reaction
            // direction so they spread apart as the mouse moves.
            const baseX = [0, 40, 20][i % 3] - size / 4;
            const baseY = [-10, 10, 40][i % 3] - size / 4;
            const direction = i % 2 === 0 ? 1 : -1;
            const dx = (mouse.x - 50) * 0.22 * direction;
            const dy = (mouse.y - 50) * 0.22 * direction;

            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  background: blob.color,
                  width: `${size}%`,
                  height: `${size}%`,
                  top: `${baseY}%`,
                  left: `${baseX}%`,
                  filter: `blur(${blur}px)`,
                  opacity: intensity,
                  transform: `translate(${dx}%, ${dy}%)`,
                  transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  willChange: "transform",
                }}
              />
            );
          })}
        </div>

        {/* Glass content panel */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

AuroraCard.displayName = "AuroraCard";

export { AuroraCard };
