import type { HeartbeatDay } from "@/lib/publicMonitors";

/**
 * Dependency-free SVG response-time chart. Plots the per-day average response
 * time over the available window. Server-rendered; the viewBox makes it fully
 * responsive without any client JS.
 */
export function ResponseTimeChart({ days }: { days: HeartbeatDay[] }) {
  const points = days
    .filter((d) => d.responseMs != null && d.totalChecks > 0)
    .map((d) => ({ day: d.day, value: d.responseMs as number }));

  if (points.length < 2) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Not enough response-time data yet.
      </div>
    );
  }

  const W = 800;
  const H = 220;
  const padX = 8;
  const padY = 16;

  const values = points.map((p) => p.value);
  const maxV = Math.max(...values);
  const minV = Math.min(...values);
  const range = maxV - minV || 1;

  const x = (i: number) => padX + (i / (points.length - 1)) * (W - padX * 2);
  const y = (v: number) => padY + (1 - (v - minV) / range) * (H - padY * 2);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${x(points.length - 1).toFixed(1)},${H - padY} L${x(0).toFixed(1)},${H - padY} Z`;

  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-48 w-full sm:h-56"
        preserveAspectRatio="none"
        role="img"
        aria-label="Average response time over time"
      >
        <defs>
          <linearGradient id="rt-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#rt-fill)" className="text-primary" />
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          className="text-primary"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>min {minV} ms</span>
        <span>avg {avg} ms</span>
        <span>max {maxV} ms</span>
      </div>
    </div>
  );
}
