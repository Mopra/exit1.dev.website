import { CheckCircle2 } from "lucide-react";
import { InsetCard } from "@/components/InsetCard";
import {
  daysAgo,
  displayName,
  formatDateUTC,
  formatUptime,
  summarizeIncidents,
  type MonitorPage,
} from "@/lib/publicMonitors";

const MAX_LISTED = 20;

/**
 * Textual, dated outage history derived from the heartbeat. This is unique,
 * crawlable, *fresh* content that targets "when was X down", "X outage history"
 * and "X downtime" — and it de-templatizes pages that would otherwise differ
 * only by their charts.
 */
export function IncidentHistory({ monitor }: { monitor: MonitorPage }) {
  const name = displayName(monitor);
  const { outages, totalOutageDays, lastOutage, cleanStreakDays } = summarizeIncidents(
    monitor.heartbeat,
  );

  if (totalOutageDays === 0) {
    return (
      <InsetCard className="flex items-center gap-3 p-5 sm:p-6">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
        <p className="text-sm text-foreground/80">
          No outages have been detected for {name} in the last 90 days
          {cleanStreakDays > 0 && <> — {cleanStreakDays} days without a recorded incident</>}.
        </p>
      </InsetCard>
    );
  }

  const listed = outages.slice(0, MAX_LISTED);

  return (
    <div>
      <p className="mb-5 text-sm text-foreground/80">
        exit1.dev detected downtime on{" "}
        <strong className="font-semibold text-foreground">
          {totalOutageDays} {totalOutageDays === 1 ? "day" : "days"}
        </strong>{" "}
        in the last 90 days.
        {lastOutage && (
          <>
            {" "}
            The most recent was{" "}
            <strong className="font-semibold text-foreground">
              {formatDateUTC(lastOutage.day)}
            </strong>{" "}
            ({daysAgo(lastOutage.day)} days ago).
          </>
        )}
      </p>

      <InsetCard className="p-5 sm:p-6">
        <ul className="space-y-3">
          {listed.map((d) => (
            <li key={d.day} className="flex items-baseline justify-between gap-4 text-sm">
              <span className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
                <span className="font-medium text-foreground">{formatDateUTC(d.day)}</span>
                <span className="text-muted-foreground">downtime detected</span>
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatUptime(d.uptimePercentage)} that day · {d.totalChecks} checks
              </span>
            </li>
          ))}
        </ul>
        {outages.length > MAX_LISTED && (
          <p className="mt-4 text-xs text-muted-foreground">
            Showing the {MAX_LISTED} most recent of {outages.length} days with downtime.
          </p>
        )}
      </InsetCard>
    </div>
  );
}
