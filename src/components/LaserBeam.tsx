'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// LaserFlow pulls in three.js (~170KB gzipped). Load it as a separate chunk,
// client-only, so it never lands in the route's first-load bundle.
const LaserFlow = dynamic(() => import('./LaserFlow'), { ssr: false });

type LaserBeamProps = {
  className?: string;
  style?: CSSProperties;
  /** Direction the beam points. Default 'up'. */
  direction?: 'up' | 'down';
  color?: string;
  /** Where the disc/source sits along the canvas (−0.5 to 0.5). */
  beamOffset?: number;
  wispDensity?: number;
  wispSpeed?: number;
  wispIntensity?: number;
  flowSpeed?: number;
  flowStrength?: number;
  fogIntensity?: number;
  fogScale?: number;
  fogFallSpeed?: number;
  verticalSizing?: number;
  horizontalSizing?: number;
  decay?: number;
  falloffStart?: number;
  /** Fraction of the beam's far end to fade to transparent (0–1). Default 0.35. */
  endFade?: number;
};

/**
 * Container-driven LaserFlow wrapper. Size and position it with `className`
 * or `style` — the beam fills 100% of the container. Use `direction` to flip
 * the beam vertically.
 */
export function LaserBeam({
  className,
  style,
  direction = 'up',
  color = '#22F0B5',
  beamOffset = -0.42,
  wispDensity = 1,
  wispSpeed = 15,
  wispIntensity = 4,
  flowSpeed = 0.35,
  flowStrength = 0.25,
  fogIntensity = 0.5,
  fogScale = 0.3,
  fogFallSpeed = 0.6,
  verticalSizing = 2.5,
  horizontalSizing = 0.5,
  decay = 0.2,
  falloffStart = 3,
  endFade = 0.6,
}: LaserBeamProps) {
  // Mount the WebGL beam only on devices that can afford it: fine-pointer,
  // large-viewport, no prefers-reduced-motion — and only once the main thread
  // is idle. Phones never load three.js (parse + shader compile + a perpetual
  // rAF loop is seconds of main-thread work on a throttled mobile CPU); they
  // keep the CSS beam below, which is server-rendered and paints immediately.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  const fadeStart = `${(1 - endFade) * 100}%`;
  // The far end is the bottom for direction='down', top for direction='up'.
  const maskImage =
    direction === 'down'
      ? `linear-gradient(to bottom, black 0%, black ${fadeStart}, transparent 100%)`
      : `linear-gradient(to top, black 0%, black ${fadeStart}, transparent 100%)`;

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none overflow-hidden', className)}
      style={{
        WebkitMaskImage: maskImage,
        maskImage,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transform: direction === 'down' ? 'scaleY(-1)' : undefined,
        }}
      >
        {/* CSS approximation of the beam — server-rendered so the hero paints
            complete at FCP. Stays as the final visual on touch/small devices;
            fades out under the WebGL beam once that mounts on desktop. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: ready ? 0 : 1,
            transition: 'opacity 900ms ease',
          }}
        >
          {/* fog glow around the source (local bottom = badge end after flip) */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '-8%',
              width: '85%',
              height: '75%',
              transform: 'translateX(-50%)',
              background: `radial-gradient(ellipse 50% 65% at 50% 100%, ${color}59 0%, ${color}1f 48%, transparent 75%)`,
            }}
          />
          {/* beam core */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 3,
              transform: 'translateX(-50%)',
              background: `linear-gradient(to top, ${color}E6 0%, ${color}66 55%, transparent 100%)`,
              boxShadow: `0 0 22px 7px ${color}40`,
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: ready ? 1 : 0,
            transition: 'opacity 600ms ease',
          }}
        >
        {ready && <LaserFlow
          color={color}
          horizontalBeamOffset={0}
          verticalBeamOffset={beamOffset}
          wispDensity={wispDensity}
          wispSpeed={wispSpeed}
          wispIntensity={wispIntensity}
          flowSpeed={flowSpeed}
          flowStrength={flowStrength}
          fogIntensity={fogIntensity}
          fogScale={fogScale}
          fogFallSpeed={fogFallSpeed}
          decay={decay}
          falloffStart={falloffStart}
          verticalSizing={verticalSizing}
          horizontalSizing={horizontalSizing}
        />}
        </div>
      </div>
    </div>
  );
}
