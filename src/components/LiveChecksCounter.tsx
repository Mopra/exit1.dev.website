"use client";

import { useEffect, useRef, useState } from "react";
import Counter from "./reactbits/Counter";
import {
  extrapolateTotal,
  FALLBACK_STATS,
  STATS_ENDPOINT,
  type ChecksStats,
} from "@/lib/checksBaseline";

const PLACES = [
  10_000_000,
  1_000_000,
  ",",
  100_000,
  10_000,
  1_000,
  ",",
  100,
  10,
  1,
];

export function LiveChecksCounter() {
  const statsRef = useRef<ChecksStats>(FALLBACK_STATS);
  const [value, setValue] = useState(0);
  const [rate, setRate] = useState(FALLBACK_STATS.ratePerSecond);
  const [fontSize, setFontSize] = useState(56);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 640px)");
    const update = () => setFontSize(mql.matches ? 56 : 36);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startTicking = () => {
      if (intervalId) return;
      intervalId = setInterval(() => {
        setValue(extrapolateTotal(statsRef.current));
      }, 150);
    };

    fetch(STATS_ENDPOINT, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ChecksStats | null) => {
        if (cancelled) return;
        if (data && typeof data.total === "number") {
          statsRef.current = data;
          setRate(data.ratePerSecond);
        }
        setValue(extrapolateTotal(statsRef.current));
        startTicking();
      })
      .catch(() => {
        if (cancelled) return;
        setValue(extrapolateTotal(statsRef.current));
        startTicking();
      });

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const rateDisplay = rate >= 1 ? rate.toFixed(1) : rate.toFixed(2);

  return (
    <div className="group relative flex flex-col items-center gap-2">
      <Counter
        value={value}
        places={PLACES}
        fontSize={fontSize}
        padding={6}
        gap={4}
        horizontalPadding={0}
        textColor="white"
        fontWeight={800}
        gradientHeight={0}
      />
      <span className="text-xs sm:text-sm uppercase tracking-widest text-white/50">
        Checks and counting
      </span>
      <span
        className="pointer-events-none group-hover:pointer-events-auto mt-1 text-xs text-white/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        ~{rateDisplay} checks/sec ·{" "}
        <a
          href={STATS_ENDPOINT}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-4 hover:text-white"
        >
          live from our public API
        </a>
      </span>
    </div>
  );
}
