'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in seconds. */
  delay?: number;
  className?: string;
  /** Vertical travel distance in px. */
  y?: number;
};

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Subtle, slow scroll-reveal used across the home page below the fold.
 * Deliberately plain IntersectionObserver + CSS — pulling motion/react in
 * here would put framer-motion in every page's first-load bundle.
 * Honors prefers-reduced-motion by rendering statically.
 */
export function Reveal({ children, delay = 0, className, y = 16 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity 700ms ${EASE} ${delay}s, transform 700ms ${EASE} ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
