'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

type HeroVideoProps = {
  /** Web-optimized mp4 source path under /public. */
  src: string;
  /** Poster still shown before play and for reduced-motion users. */
  poster: string;
  /** Accessible description of what the clip shows. */
  caption: string;
};

/**
 * Framed, muted product demo for the getting-started hero. Autoplays and
 * loops while on screen, pauses when scrolled away to spare CPU/battery, and
 * falls back to the static poster when the visitor prefers reduced motion.
 */
export function HeroVideo({ src, poster, caption }: HeroVideoProps) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <figure className="relative">
      {/* Soft brand glow anchored behind the frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-[2rem] bg-primary/[0.07] blur-[80px]"
      />

      <div className="relative overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/10 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)]">
        <div className="aspect-video w-full">
          {reduce ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={caption}
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              poster={poster}
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={caption}
            >
              <source src={src} type="video/mp4" />
            </video>
          )}
        </div>

        {/* Caption chip, lower-left — quiet wayfinding over the frame. */}
        <figcaption className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 font-mono text-[11px] text-white/80 backdrop-blur-sm sm:inline-flex">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          {caption}
        </figcaption>
      </div>
    </figure>
  );
}
