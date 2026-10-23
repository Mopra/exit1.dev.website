import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { InsetCard } from "@/components/InsetCard";
import {
  daysAgo,
  displayName,
  downtimeOnDay,
  formatDateUTC,
  formatDuration,
  formatUptime,
  incidentRange,
  incidentsOnDay,
  liveIncidents,
  outageDayKeys,
  outagePath,
  parseUtcDayKey,
  summarizeIncidents,
  type HeartbeatDay,
  type MonitorPage,
  type PublicIncident,
} from "@/lib/publicMonitors";

const MAX_LISTED = 20;

type Row = {
  day: number; // start-of-day UTC ms
  href: string | null;
  incidents: PublicIncident[];
  heartbeat: HeartbeatDay | null;
};

/**
 * Textual, dated outage history. This is unique, crawlable, *fresh* content
 * that targets "when was X down", "X outage history" and "X downtime", and it
 * de-templatizes pages that would otherwise differ only by their charts.
 *
 * One source per render, the same one buildFaqs uses: exact incidents when the
 * backend sent any (each day links to /status/<slug>/outages/<day> with the
 * times), heartbeat outage days otherwise.
 */
export function IncidentHistory({ monitor }: { monitor: MonitorPage }) {
  const name = displayName(monitor);
  const { outages, cleanStreakDays } = summarizeIncidents(monitor.heartbeat);
  const live = liveIncidents(monitor);

  const rows: Row[] =
    live.length > 0
      ? outageDayKeys(live)
          .reverse()
          .map((key) => {
            const day = parseUtcDayKey(key)!;
            return {
              day,
              href: outagePath(monitor.slug, key),
              incidents: incidentsOnDay(live, day),
              heartbeat: monitor.heartbeat.find((h) => h.day === day) ?? null,
            };
          })
      : outages.map((h) => ({ day: h.day, href: null, incidents: [], heartbeat: h }));

  if (rows.length === 0) {
    return (
      <InsetCard className="flex items-center gap-3 p-5 sm:p-6">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
        <p className="text-sm text-foreground/80">
          No outages have been detected for {name} in the last 90 days
          {cleanStreakDays > 0 && <>, a streak of {cleanStreakDays} days without a recorded incident</>}.
        </p>
      </InsetCard>
    );
  }

  const last = rows[0];
  const listed = rows.slice(0, MAX_LISTED);
  const dateText = (r: Row, className: string) =>
    r.href ? (
      <Link href={r.href} className={`cursor-pointer underline underline-offset-2 ${className}`}>
        {formatDateUTC(r.day)}
      </Link>
    ) : (
      formatDateUTC(r.day)
    );

  return (
    <div>
      <p className="mb-5 text-sm text-foreground/80">
        exit1.dev detected downtime on{" "}
        <strong className="font-semibold text-foreground">
          {rows.length} {rows.length === 1 ? "day" : "days"}
        </strong>{" "}
        in the last 90 days. The most recent was{" "}
        <strong className="font-semibold text-foreground">
          {dateText(last, "hover:text-foreground/80 transition-colors")}
        </strong>{" "}
        ({daysAgo(last.day)} days ago).
      </p>

      <InsetCard className="p-5 sm:p-6">
        <ul className="space-y-3">
          {listed.map((r) => (
            <li key={r.day} className="text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <span className="flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
                  <span className="font-medium text-foreground">
                    {dateText(r, "decoration-foreground/30 hover:decoration-foreground transition-colors")}
                  </span>
                  <span className="text-muted-foreground">
                    {r.incidents.length > 0
                      ? `down ${formatDuration(downtimeOnDay(r.incidents, r.day))}`
                      : "downtime detected"}
                  </span>
                </span>
                {r.heartbeat && (
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {formatUptime(r.heartbeat.uptimePercentage)} that day
                    {r.incidents.length === 0 && <> · {r.heartbeat.totalChecks} checks</>}
                  </span>
                )}
              </div>
              {r.incidents.length > 0 && (
                <p className="mt-1 pl-[18px] text-xs tabular-nums text-muted-foreground">
                  {r.incidents.map((i) => incidentRange(i, r.day)).join(", ")}
                </p>
              )}
            </li>
          ))}
        </ul>
        {rows.length > MAX_LISTED && (
          <p className="mt-4 text-xs text-muted-foreground">
            Showing the {MAX_LISTED} most recent of {rows.length} days with downtime.
          </p>
        )}
      </InsetCard>
    </div>
  );
}
