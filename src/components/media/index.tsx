import * as React from "react";
import { cn } from "../../utils/cn";

// ─── Image ─────────────────────────────────────────────────────────────────

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  aspectRatio?: "auto" | "square" | "video" | "portrait" | string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  rounded?: boolean | "sm" | "md" | "lg" | "xl" | "full";
  caption?: string;
}

const aspectMap = { auto: "", square: "aspect-square", video: "aspect-video", portrait: "aspect-[3/4]" };

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, fallback, aspectRatio = "auto", objectFit = "cover", rounded, caption, src, alt = "", style, ...props }, ref) => {
    const [error, setError] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);

    const roundedClass = rounded === true ? "rounded-lg" : rounded === "sm" ? "rounded-sm" : rounded === "md" ? "rounded-md" : rounded === "lg" ? "rounded-lg" : rounded === "xl" ? "rounded-xl" : rounded === "full" ? "rounded-full" : "";
    const aspectClass = aspectRatio in aspectMap ? aspectMap[aspectRatio as keyof typeof aspectMap] : "";

    if (error && fallback) {
      return <div className={cn(aspectClass, roundedClass, "flex items-center justify-center bg-muted", className)}>{fallback}</div>;
    }

    return (
      <figure className={cn("veloria-image", aspectClass, className)}>
        {!loaded && !error && <div className={cn("animate-pulse bg-muted", aspectClass, roundedClass, "absolute inset-0")} />}
        <img
          ref={ref}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn("w-full h-full", `object-${objectFit}`, roundedClass, !loaded && "opacity-0", loaded && "opacity-100 transition-opacity duration-300")}
          style={style}
          {...props}
        />
        {caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{caption}</figcaption>}
      </figure>
    );
  }
);
Image.displayName = "Image";

// ─── VideoPlayer ───────────────────────────────────────────────────────────

export interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  captions?: { src: string; label: string; srclang: string }[];
  aspectRatio?: "video" | "square" | string;
  rounded?: boolean;
}

const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ className, src, poster, captions, aspectRatio = "video", rounded = true, controls = true, ...props }, ref) => (
    <div className={cn("veloria-video-player relative overflow-hidden bg-black", aspectRatio === "video" ? "aspect-video" : aspectRatio === "square" ? "aspect-square" : "", rounded && "rounded-xl", className)}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        controls={controls}
        className="h-full w-full"
        {...props}
      >
        {captions?.map((c) => (
          <track key={c.srclang} kind="subtitles" src={c.src} label={c.label} srcLang={c.srclang} />
        ))}
        Your browser does not support video playback.
      </video>
    </div>
  )
);
VideoPlayer.displayName = "VideoPlayer";

// ─── AudioPlayer ───────────────────────────────────────────────────────────

export interface AudioPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  title?: string;
  artist?: string;
  coverArt?: string;
  autoPlay?: boolean;
}

const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(
  ({ className, src, title, artist, coverArt, autoPlay, ...props }, ref) => {
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);

    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

    const toggle = () => {
      if (!audioRef.current) return;
      if (playing) audioRef.current.pause();
      else audioRef.current.play();
      setPlaying(!playing);
    };

    return (
      <div ref={ref} className={cn("veloria-audio-player flex items-center gap-4 rounded-xl border border-border bg-card p-4", className)} {...props}>
        <audio
          ref={audioRef}
          src={src}
          autoPlay={autoPlay}
          onTimeUpdate={() => { if (!audioRef.current) return; setCurrentTime(audioRef.current.currentTime); setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0); }}
          onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
          onEnded={() => setPlaying(false)}
        />
        {coverArt && <img src={coverArt} alt={title ?? "Cover"} className="h-12 w-12 shrink-0 rounded-lg object-cover" />}
        <div className="flex-1 min-w-0">
          {title && <p className="text-sm font-semibold truncate">{title}</p>}
          {artist && <p className="text-xs text-muted-foreground truncate">{artist}</p>}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] tabular-nums text-muted-foreground w-8">{fmt(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => {
                if (!audioRef.current || !duration) return;
                const t = (Number(e.target.value) / 100) * duration;
                audioRef.current.currentTime = t;
                setProgress(Number(e.target.value));
              }}
              className="flex-1 h-1 accent-primary cursor-pointer"
              aria-label="Seek"
            />
            <span className="text-[10px] tabular-nums text-muted-foreground w-8 text-right">{fmt(duration)}</span>
          </div>
        </div>
        <button type="button" onClick={toggle} className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={playing ? "Pause" : "Play"}>
          {playing
            ? <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
            : <svg className="h-4 w-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          }
        </button>
      </div>
    );
  }
);
AudioPlayer.displayName = "AudioPlayer";

// ─── Carousel ──────────────────────────────────────────────────────────────

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  slidesPerView?: 1 | 2 | 3;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, items, autoPlay = false, autoPlayInterval = 4000, showDots = true, showArrows = true, loop = true, slidesPerView = 1, ...props }, ref) => {
    const [current, setCurrent] = React.useState(0);
    const total = items.length;

    const prev = () => setCurrent((c) => loop ? (c - 1 + total) % total : Math.max(0, c - 1));
    const next = () => setCurrent((c) => loop ? (c + 1) % total : Math.min(total - 1, c + 1));

    React.useEffect(() => {
      if (!autoPlay) return;
      const t = setInterval(next, autoPlayInterval);
      return () => clearInterval(t);
    }, [autoPlay, autoPlayInterval, current]);

    return (
      <div ref={ref} className={cn("veloria-carousel relative overflow-hidden rounded-xl", className)} {...props}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${(current * 100) / slidesPerView}%)` }}
        >
          {items.map((item, i) => (
            <div key={i} className="shrink-0" style={{ width: `${100 / slidesPerView}%` }}>
              {item}
            </div>
          ))}
        </div>
        {showArrows && total > 1 && (
          <>
            <button type="button" onClick={prev} disabled={!loop && current === 0} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border shadow hover:bg-background transition-colors disabled:opacity-30" aria-label="Previous">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button type="button" onClick={next} disabled={!loop && current === total - 1} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border shadow hover:bg-background transition-colors disabled:opacity-30" aria-label="Next">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
        {showDots && total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" role="tablist" aria-label="Carousel navigation">
            {Array.from({ length: total }).map((_, i) => (
              <button key={i} role="tab" aria-selected={i === current} type="button" onClick={() => setCurrent(i)} className={cn("h-1.5 rounded-full transition-all", i === current ? "w-4 bg-white" : "w-1.5 bg-white/50")} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
    );
  }
);
Carousel.displayName = "Carousel";

// ─── Gallery ───────────────────────────────────────────────────────────────

export interface GalleryItem { src: string; alt?: string; caption?: string; }
export interface GalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  columns?: 2 | 3 | 4 | 5;
  gap?: 1 | 2 | 3 | 4;
  onItemClick?: (item: GalleryItem, index: number) => void;
}

const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  ({ className, items, columns = 3, gap = 3, onItemClick, ...props }, ref) => {
    const colClasses = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" };
    const gapClasses = { 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4" };
    return (
      <div
        ref={ref}
        className={cn("veloria-gallery grid", colClasses[columns], gapClasses[gap], className)}
        {...props}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className={cn("group relative overflow-hidden rounded-lg bg-muted aspect-square cursor-pointer", onItemClick && "cursor-pointer")}
            onClick={() => onItemClick?.(item, i)}
            role={onItemClick ? "button" : undefined}
            tabIndex={onItemClick ? 0 : undefined}
            onKeyDown={(e) => { if (onItemClick && (e.key === "Enter" || e.key === " ")) onItemClick(item, i); }}
          >
            <img
              src={item.src}
              alt={item.alt ?? `Gallery image ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {item.caption && (
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="p-3 text-sm text-white">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
);
Gallery.displayName = "Gallery";

export { Image, VideoPlayer, AudioPlayer, Carousel, Gallery };
export type { ImageProps, VideoPlayerProps, AudioPlayerProps, CarouselProps, GalleryItem, GalleryProps };
