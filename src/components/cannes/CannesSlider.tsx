"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  /** Image paths under /public, shown in order with a crossfade. */
  images: string[];
  /** Time each slide is shown, in ms. */
  interval?: number;
  className?: string;
};

/**
 * Minimal crossfade slider for the Cannes collage tile. Auto-advances through
 * the supplied images and exposes dot controls. Pauses nothing fancy — just a
 * calm, looping fade that matches the page's quiet rhythm.
 */
export function CannesSlider({ images, interval = 4000, className }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % images.length),
      interval
    );
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-card ${className ?? ""}`}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, 100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                i === active
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
