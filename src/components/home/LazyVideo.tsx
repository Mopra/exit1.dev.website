'use client';

import { useEffect, useRef } from 'react';

type Source = { src: string; type: string };

type LazyVideoProps = {
  sources: Source[];
  poster: string;
  /** Intrinsic dimensions so the box is reserved before any media loads. */
  width: number;
  height: number;
  className?: string;
};

/**
 * Below-the-fold looping video that shows its poster immediately and only
 * downloads the media once it scrolls near the viewport. Pauses off-screen
 * and stays on the poster for prefers-reduced-motion.
 */
export function LazyVideo({ sources, poster, width, height, className }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
