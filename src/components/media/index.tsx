import * as React from "react";
import { cn } from "../../utils/cn";

// ─── Image ─────────────────────────────────────────────────────────────────

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | string;
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  loading?: "lazy" | "eager";
  caption?: string;
}

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const aspectMap = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      fallback,
      aspectRatio,
      fit = "cover",
      rounded = "none",
      alt = "",
      loading = "lazy",
      caption,
      onError,
      style,
      ...props
    },
    ref
  ) => {
    const [errored, setErrored] = React.useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setErrored(true);
      onError?.(e);
    };

    const aspectClass =
      aspectRatio && aspectRatio in aspectMap
        ? aspectMap[aspectRatio as keyof typeof aspectMap]
        : undefined;

    const img = errored && fallback ? (
      <div
        className={cn(
          "atlas-image-fallback flex items-center justify-center bg-muted text-muted-foreground",
          roundedMap[rounded],
          aspectClass,
          className
        )}
      >
        {fallback}
      </div>
    ) : (
      <img
        ref={ref}
        alt={alt}
        loading={loading}
        onError={handleError}
        className={cn(
          "atlas-image block",
          `object-${fit}`,
          roundedMap[rounded],
          aspectClass && "w-full h-full",
          className
        )}
        style={style}
        {...props}
      />
    );

    if (caption) {
      return (
        <figure className={cn("inline-block", aspectClass)}>
          {img}
          <figcaption className="mt-2 text-xs text-muted-foreground text-center">
            {caption}
          </figcaption>
        </figure>
      );
    }

    return img;
  }
);
Image.displayName = "Image";

// ─── VideoPlayer ───────────────────────────────────────────────────────────

export interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
  caption?: string;
  tracks?: {
    src: string;
    kind: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
    srcLang: string;
    label: string;
    default?: boolean;
  }[];
}

const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ className, src, poster, aspectRatio = "video", rounded = "lg", caption, tracks = [], controls = true, ...props }, ref) => {
    const aspectClass = aspectMap[aspectRatio] ?? "aspect-video";

    return (
      <figure className={cn("atlas-video-player w-full", className)}>
        <div className={cn(aspectClass, "overflow-hidden", roundedMap[rounded], "bg-black")}>
          <video
            ref={ref}
            src={src}
            poster={poster}
            controls={controls}
            className="w-full h-full object-contain"
            {...props}
          >
            {tracks.map((track, i) => (
              <track
                key={i}
                src={track.src}
                kind={track.kind}
                srcLang={track.srcLang}
                label={track.label}
                default={track.default}
              />
            ))}
            Your browser does not support the video tag.
          </video>
        </div>
        {caption && (
          <figcaption className="mt-2 text-xs text-muted-foreground text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }
);
VideoPlayer.displayName = "VideoPlayer";

// ─── AudioPlayer ───────────────────────────────────────────────────────────

export interface AudioPlayerProps extends Omit<React.AudioHTMLAttributes<HTMLAudioElement>, "title"> {
  src: string;
  title?: string;
  artist?: string;
  coverArt?: string;
  showWaveform?: boolean;
}

const AudioPlayer = React.forwardRef<HTMLAudioElement, AudioPlayerProps>(
  ({ className, src, title, artist, coverArt, controls = true, ...props }, ref) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const combinedRef = (node: HTMLAudioElement | null) => {
      (audioRef as React.MutableRefObject<HTMLAudioElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLAudioElement | null>).current = node;
    };

    const togglePlay = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    };

    const formatTime = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
      <div className={cn("atlas-audio-player flex items-center gap-4 rounded-xl border border-border bg-card p-4 w-full", className)}>
        <audio
          ref={combinedRef}
          src={src}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setIsPlaying(false)}
          {...props}
        />
        {coverArt && (
          <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
            <img src={coverArt} alt={title ?? "Album art"} className="h-full w-full object-cover" />
          </div>
        )}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {isPlaying ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          {(title || artist) && (
            <div className="mb-1.5">
              {title && <p className="text-sm font-medium truncate">{title}</p>}
              {artist && <p className="text-xs text-muted-foreground truncate">{artist}</p>}
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground tabular-nums w-8 shrink-0">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const t = Number(e.target.value);
                setCurrentTime(t);
                if (audioRef.current) audioRef.current.currentTime = t;
              }}
              className="flex-1 h-1.5 rounded-full bg-secondary accent-primary cursor-pointer"
              aria-label="Seek"
            />
            <span className="text-xs text-muted-foreground tabular-nums w-8 shrink-0 text-right">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    );
  }
);
AudioPlayer.displayName = "AudioPlayer";

// ─── Carousel ─────────────────────────────────────────────────────────────

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  slidesPerView?: number;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({
    className,
    items,
    autoPlay = false,
    autoPlayInterval = 4000,
    showDots = true,
    showArrows = true,
    loop = true,
    slidesPerView = 1,
    ...props
  }, ref) => {
    const [current, setCurrent] = React.useState(0);
    const total = items.length;

    const prev = () => setCurrent((c) => (c === 0 ? (loop ? total - 1 : 0) : c - 1));
    const next = React.useCallback(() => setCurrent((c) => (c === total - 1 ? (loop ? 0 : c) : c + 1)), [total, loop]);

    React.useEffect(() => {
      if (!autoPlay) return;
      const id = setInterval(next, autoPlayInterval);
      return () => clearInterval(id);
    }, [autoPlay, autoPlayInterval, next]);

    return (
      <div ref={ref} className={cn("atlas-carousel relative w-full overflow-hidden", className)} {...props}>
        <div
          className="flex transition-transform duration-400 ease-in-out"
          style={{ transform: `translateX(-${current * (100 / slidesPerView)}%)` }}
          aria-live="polite"
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="w-full shrink-0"
              style={{ width: `${100 / slidesPerView}%` }}
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${total}`}
            >
              {item}
            </div>
          ))}
        </div>

        {showArrows && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={!loop && current === 0}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 border border-border shadow-sm hover:bg-background transition-colors disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!loop && current === total - 1}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 border border-border shadow-sm hover:bg-background transition-colors disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {showDots && (
          <div role="tablist" aria-label="Slide navigation" className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === current ? "w-4 bg-primary" : "w-1.5 bg-primary/40 hover:bg-primary/70"
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
Carousel.displayName = "Carousel";

// ─── Gallery ──────────────────────────────────────────────────────────────

export interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface GalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: GalleryImage[];
  columns?: 2 | 3 | 4 | 5;
  gap?: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  rounded?: "none" | "sm" | "md" | "lg";
}

const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  ({ className, images, columns = 3, gap = 2, onImageClick, rounded = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("atlas-gallery", className)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap * 4}px`,
      }}
      role="list"
      aria-label="Image gallery"
      {...props}
    >
      {images.map((image, i) => (
        <div
          key={i}
          role="listitem"
          className={cn(
            "overflow-hidden",
            roundedMap[rounded],
            onImageClick && "cursor-pointer group",
          )}
          onClick={() => onImageClick?.(image, i)}
          onKeyDown={(e) => e.key === "Enter" && onImageClick?.(image, i)}
          tabIndex={onImageClick ? 0 : undefined}
          aria-label={image.alt ?? `Image ${i + 1}`}
        >
          <img
            src={image.src}
            alt={image.alt ?? ""}
            loading="lazy"
            className={cn(
              "w-full h-full object-cover aspect-square",
              "transition-transform duration-300",
              onImageClick && "group-hover:scale-105"
            )}
          />
        </div>
      ))}
    </div>
  )
);
Gallery.displayName = "Gallery";

export { Image, VideoPlayer, AudioPlayer, Carousel, Gallery };
