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
  100_000_000, 10_000_000, 1_000_000, 100_000, 10_000, 1_000, 100, 10, 1,
];

export function LiveChecksCounter() {
  const statsRef = useRef<ChecksStats>(FALLBACK_STATS);
  const [value, setValue] = useState(() => extrapolateTotal(FALLBACK_STATS));

  useEffect(() => {
    let cancelled = false;

    fetch(STATS_ENDPOINT, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ChecksStats | null) => {
        if (cancelled || !data || typeof data.total !== "number") return;
        statsRef.current = data;
        setValue(extrapolateTotal(data));
      })
      .catch(() => {
        // fall back to hardcoded baseline already in statsRef
      });

    const id = setInterval(() => {
      setValue(extrapolateTotal(statsRef.current));
    }, 150);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs sm:text-sm uppercase tracking-widest text-white/50">
        Checks performed
      </span>
      <Counter
        value={value}
        places={PLACES}
        fontSize={56}
        padding={6}
        gap={4}
        horizontalPadding={0}
        textColor="white"
        fontWeight={800}
        gradientHeight={12}
        gradientFrom="rgba(0,0,0,0.9)"
        gradientTo="transparent"
      />
    </div>
  );
}
