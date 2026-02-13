"use client";

import { useEffect, useRef } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
  rootMargin?: string;
}

export function LazyVideo({ src, className, rootMargin = "200px" }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = "auto";
          video.play().catch(() => {
            // Autoplay may be blocked by browser policy — safe to ignore
          });
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      preload="none"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
