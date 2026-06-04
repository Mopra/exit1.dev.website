import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import LaserFlow from './LaserFlow';

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
          width: '100%',
          height: '100%',
          transform: direction === 'down' ? 'scaleY(-1)' : undefined,
        }}
      >
        <LaserFlow
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
        />
      </div>
    </div>
  );
}
