import Link from "next/link";
import { cn } from "@/lib/utils";
import { InsetCard } from "@/components/InsetCard";
import { BrandLogo } from "@/components/status/BrandLogo";
import {
  classifyStatus,
  formatUptime,
  statusGradientClass,
  statusPresentation,
  uptimeColorClass,
  type MonitorIndexEntry,
} from "@/lib/publicMonitors";

type Tone = "up" | "down" | "degraded" | "muted";

// statusPresentation collapses "degraded" into the red "down" tone; pull it back
// out to amber so a partial degradation doesn't read as a hard outage.
function present(status: string): { label: string; tone: Tone } {
  if (classifyStatus(status) === "degraded") return { label: "Degraded", tone: "degraded" };
  return statusPresentation(status);
}

/**
 * Highlighted strip of the marquee events, rendered above the full directory.
 * Larger cards than the directory grid so these read as the headline names.
 */
export function FeaturedStatus({ monitors }: { monitors: MonitorIndexEntry[] }) {
  if (monitors.length === 0) return null;

  return (
    <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {monitors.map((m) => {
        const { label, tone } = present(m.status);
        return (
          <li key={m.slug}>
            <Link
              href={`/status/${m.slug}`}
              aria-label={`${m.host}: ${label}, ${formatUptime(m.uptime30d)} 30-day uptime`}
              className="group block cursor-pointer rounded-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            >
              <InsetCard className={cn("h-full bg-foreground/[0.02] p-5 transition-colors motion-safe:duration-150 group-hover:bg-foreground/[0.05] sm:p-6", statusGradientClass(m.status))}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <BrandLogo host={m.host} name={m.name} size={40} />
                    <span className="truncate text-lg font-semibold tracking-tight" title={m.host}>
                      {m.host}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <span
                    className={cn(
                      "text-sm",
                      tone === "down" ? "text-red-500" : tone === "degraded" ? "text-amber-500" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                  <span className="text-right">
                    <span className={cn("block text-2xl font-semibold tabular-nums leading-none", uptimeColorClass(m.uptime30d))}>
                      {formatUptime(m.uptime30d)}
                    </span>
                    <span className="mt-1 block text-[11px] uppercase tracking-wider text-muted-foreground">30-day uptime</span>
                  </span>
                </div>
              </InsetCard>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
