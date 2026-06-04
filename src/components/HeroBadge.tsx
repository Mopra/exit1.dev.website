'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { OnlineBadge } from './OnlineBadge';
import { LaserBeam } from './LaserBeam';

const OK = { r: 0x22, g: 0xf0, b: 0xb5 };
const ALERT = { r: 0xff, g: 0x3b, b: 0x5c };
const DURATION = 380;

const toHex = (n: number) => n.toString(16).padStart(2, '0');
const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function HeroBadge() {
  const [hover, setHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [color, setColor] = useState('#22F0B5');
  const [isTouch, setIsTouch] = useState(false);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: none)');
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

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
    <Link
      href="https://app.exit1.dev/sign-up"
      aria-label="Start monitoring"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        // On touch devices, the first tap previews the alert state + CTA
        // instead of navigating. The second tap (or tapping the button) navigates.
        if (isTouch && !hover) {
          e.preventDefault();
          setHover(true);
        }
      }}
      className="flex flex-col items-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B5C] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0F] rounded-2xl"
    >
      {/* Badge + laser group — sized to the badge so the laser's
          percentage-based positioning matches /badge-lab. Font-size lives on the
          wrapper so the laser (h in em) scales with the badge. */}
      <div className="relative text-5xl sm:text-6xl lg:text-7xl" style={{ perspective: '800px' }}>
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
          className="absolute left-1/2 top-19/28 -translate-x-1/2 w-[140%] h-[8.33em]"
        />
        <OnlineBadge
          hovered={hover}
          onHoverChange={setHover}
          className="relative z-10"
          style={{ transform: 'rotateX(22deg)', transformOrigin: 'center bottom' }}
        />
      </div>

      {/* Reserved slot so the button reveal doesn't shift layout */}
      <div
        aria-hidden={!hover}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
        className="relative z-10 mt-6 sm:mt-8 h-14 flex items-center justify-center"
      >
        <span
          className="inline-flex items-center gap-2 rounded-full px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-white"
          style={{
            background: btnHover ? '#FF5573' : '#FF3B5C',
            boxShadow: hover
              ? btnHover
                ? '0 18px 50px rgba(255, 59, 92, 0.7), 0 6px 16px rgba(255, 59, 92, 0.5)'
                : '0 14px 40px rgba(255, 59, 92, 0.55), 0 4px 12px rgba(255, 59, 92, 0.4)'
              : '0 0 0 rgba(255, 59, 92, 0)',
            opacity: hover ? 1 : 0,
            transform: hover
              ? btnHover
                ? 'translateY(-2px) scale(1.04)'
                : 'translateY(0) scale(1)'
              : 'translateY(-8px) scale(1)',
            transition:
              'opacity 320ms ease, transform 380ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 380ms ease, background-color 200ms ease',
          }}
        >
          Start Monitoring
          <ArrowRight
            className="h-4 w-4"
            style={{
              transform: btnHover ? 'translateX(3px)' : 'translateX(0)',
              transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </span>
      </div>
    </Link>
  );
}
