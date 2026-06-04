import { cn } from "@/lib/utils";
import type { HeartbeatDay } from "@/lib/publicMonitors";

const barTone: Record<HeartbeatDay["status"], string> = {
  online: "bg-emerald-500/80",
  offline: "bg-red-500/80",
  unknown: "bg-foreground/10",
};

function formatDay(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * 90-day uptime timeline. Each bar is one UTC day, colored by status.
 * Pure server-rendered; native title tooltips show the per-day detail.
 */
export function UptimeHeartbeat({
  days,
  totalDays = 90,
}: {
  days: HeartbeatDay[];
  totalDays?: number;
}) {
  // Pad the front with "unknown" so short histories still render a full strip.
  const padCount = Math.max(0, totalDays - days.length);
  const padded: (HeartbeatDay | null)[] = [
    ...Array.from({ length: padCount }, () => null),
    ...days.slice(-totalDays),
  ];

  return (
    <div>
      <div className="flex items-end gap-[2px] sm:gap-[3px]">
        {padded.map((d, i) => {
          if (!d) {
            return (
              <div
                key={`pad-${i}`}
                className="h-9 flex-1 rounded-[2px] bg-foreground/[0.06]"
                title="No data"
              />
            );
          }
          const tip =
            d.status === "unknown"
              ? `${formatDay(d.day)} — no data`
              : `${formatDay(d.day)} — ${d.uptimePercentage != null ? d.uptimePercentage.toFixed(2) : "?"}% uptime · ${d.totalChecks} checks`;
          return (
            <div
              key={d.day}
              className={cn("h-9 flex-1 rounded-[2px]", barTone[d.status])}
              title={tip}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{totalDays} days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
