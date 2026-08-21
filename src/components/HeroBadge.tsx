'use client';

import { useEffect, useRef, useState } from 'react';
import { OnlineBadge } from './OnlineBadge';
import { LaserBeam } from './LaserBeam';

const OK = { r: 0x22, g: 0xf0, b: 0xb5 };
const ALERT = { r: 0xff, g: 0x3b, b: 0x5c };
const DURATION = 380;

const toHex = (n: number) => n.toString(16).padStart(2, '0');
const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Decorative hero centerpiece: the "Online" badge with a laser draining from it.
 * Hovering shifts it from green (online) to red (offline), the visual echo of
 * "until they aren't." It is purely ornamental, so it stays hidden from
 * assistive tech; the real call-to-action is the button + form beneath it.
 *
 * Below lg the badge shrinks to a static pill and the laser is dropped
 * entirely. Hover is the whole point of the effect and touch never fires it, so
 * mobile was spending roughly 585px of hero height on a 3px CSS line it could
 * not interact with, which pushed the CTA a full screen below the fold.
 */
export function HeroBadge() {
  const [hover, setHover] = useState(false);
  const [color, setColor] = useState('#22F0B5');
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    const target = hover ? 1 : 0;
    const tick = (now: number) => {
      const last = lastTickRef.current ?? now;
      const dt = now - last;
      lastTickRef.current = now;
      const dir = target - tRef.current;
      if (Math.abs(dir) < 0.001) {
        tRef.current = target;
        rafRef.current = null;
        lastTickRef.current = null;
        return;
      }
      const step = (dt / DURATION) * Math.sign(dir);
      tRef.current = Math.max(0, Math.min(1, tRef.current + step));
      const e = easeOutCubic(tRef.current);
      const r = mix(OK.r, ALERT.r, e);
      const g = mix(OK.g, ALERT.g, e);
      const b = mix(OK.b, ALERT.b, e);
      setColor(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTickRef.current = null;
    };
  }, [hover]);

  return (
    <div
      aria-hidden="true"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex flex-col items-center select-none"
    >
      {/* Badge + laser group, sized to the badge so the laser's percentage-based
          positioning matches /badge-lab. Font-size lives on the wrapper so the
          laser (h in em) scales with the badge. Perspective is lg-only because
          the tilt exists to sell the beam's depth, and there is no beam below
          lg. */}
      <div className="relative text-3xl sm:text-4xl lg:text-7xl lg:[perspective:800px]">
        <LaserBeam
          direction="down"
          color={color}
          wispSpeed={-15}
          flowSpeed={-0.35}
          fogFallSpeed={-0.6}
          horizontalSizing={4.3}
          verticalSizing={10.0}
          decay={0.2}
          falloffStart={4.0}
          wispDensity={10}
          wispIntensity={10}
          className="absolute left-1/2 top-19/28 hidden -translate-x-1/2 w-[140%] h-[8.33em] lg:block"
        />
        <OnlineBadge
          hovered={hover}
          onHoverChange={setHover}
          className="relative z-10 origin-bottom cursor-default lg:[transform:rotateX(22deg)]"
        />
      </div>
    </div>
  );
}
