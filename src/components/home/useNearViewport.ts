'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * True once the element comes within `margin` of the viewport — used to
 * defer downloading below-fold component chunks until they're about to
 * be seen.
 */
export function useNearViewport(margin = '500px') {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${margin} 0px` }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, near };
}
