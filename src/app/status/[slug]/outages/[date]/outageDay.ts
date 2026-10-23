import {
  displayName,
  downtimeOnDay,
  formatDuration,
  formatUtc,
  formatUtcClock,
  formatUtcDate,
  getPublicMonitor,
  incidentEnd,
  incidentRange,
  incidentsOnDay,
  isMonitorPageMature,
  liveIncidents,
  MIN_OUTAGE_MS_FOR_INDEX,
  outageDayKeys,
  parseUtcDayKey,
  type HeartbeatDay,
  type MonitorPage,
  type PublicIncident,
} from "@/lib/publicMonitors";

export type OutageDay = {
  monitor: MonitorPage;
  name: string;
  dayKey: string;
  dayStart: number;
  dateLabel: string; // "21 Oct 2026"
  incidents: PublicIncident[]; // oldest first, normalized by liveIncidents
  totalMs: number; // downtime inside this UTC day
  ongoing: PublicIncident | null; // only while the monitor is down right now
  startsToday: boolean; // false when the day only holds the tail of an earlier outage
  heartbeat: HeartbeatDay | null;
  prevKey: string | null;
  nextKey: string | null;
  indexable: boolean;
};

/**
 * Everything the page, its metadata and its card need, from one fetch.
 * getPublicMonitor is fetch-cached, so the three callers share one request.
 * Null means 404: bad date, unknown monitor, or nothing went down that day.
 */
export async function loadOutageDay(slug: string, dayKey: string): Promise<OutageDay | null> {
  const dayStart = parseUtcDayKey(dayKey);
  if (dayStart == null) return null;
  const monitor = await getPublicMonitor(slug);
  if (!monitor) return null;
  const all = liveIncidents(monitor);
  const incidents = incidentsOnDay(all, dayStart);
  if (incidents.length === 0) return null;

  const days = outageDayKeys(all);
  const at = days.indexOf(dayKey);
  const totalMs = downtimeOnDay(incidents, dayStart);

  return {
    monitor,
    name: displayName(monitor),
    dayKey,
    dayStart,
    dateLabel: formatUtcDate(dayStart),
    incidents,
    totalMs,
    ongoing: incidents.find((i) => i.ongoing) ?? null,
    startsToday: incidents.some((i) => i.startedAt >= dayStart),
    heartbeat: monitor.heartbeat.find((d) => d.day === dayStart) ?? null,
    prevKey: at > 0 ? days[at - 1] : null,
    nextKey: at >= 0 && at < days.length - 1 ? days[at + 1] : null,
    // Single-region timeouts are most of the remaining noise, so a day only
    // earns an index slot with one long outage that both regions saw.
    indexable:
      isMonitorPageMature(monitor) &&
      incidents.some((i) => i.durationMs >= MIN_OUTAGE_MS_FOR_INDEX && i.confirmedFromTwoRegions),
  };
}

function joinList(parts: string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/** "06:10 UTC", or the full "23:50 UTC on 20 Oct 2026" when it falls on another day. */
export function startLabel(i: PublicIncident, dayStart: number): string {
  return i.startedAt >= dayStart ? `${formatUtcClock(i.startedAt)} UTC` : formatUtc(i.startedAt);
}

/** "06:10 to 11:40 UTC (5 h 30 m)" or "since 18:05 UTC (3 h 15 m so far)". */
function incidentClause(i: PublicIncident, dayStart: number): string {
  return `${incidentRange(i, dayStart)} (${formatDuration(i.durationMs)}${i.ongoing ? " so far" : ""})`;
}

/** The answer-first sentence an LLM or a searcher can quote as is. */
export function leadSentence(d: OutageDay): string {
  const host = d.monitor.host;
  const n = d.incidents.length;

  if (n === 1 && d.ongoing) {
    return `Yes, ${host} has been down since ${formatUtc(d.ongoing.startedAt)}. exit1.dev has recorded ${formatDuration(d.ongoing.durationMs)} of downtime so far.`;
  }

  // A day holding only the tail of an earlier outage. n === 1 here, since
  // only the first incident of a day can start before it.
  if (!d.startsToday) {
    const i = d.incidents[0];
    return `Yes, ${host} was down on ${d.dateLabel}. It had been down since ${formatUtc(i.startedAt)} and came back up at ${formatUtcClock(incidentEnd(i))} UTC, ${formatDuration(i.durationMs)} in total.`;
  }

  const verb = d.incidents[0].startedAt >= d.dayStart ? "went down" : "was down";
  const opener = d.ongoing
    ? `Yes, ${host} ${verb} on ${d.dateLabel} and is still down.`
    : `Yes, ${host} ${verb} on ${d.dateLabel}.`;
  const clauses = d.incidents.map((i) => incidentClause(i, d.dayStart));

  if (n === 1) {
    return `${opener} exit1.dev recorded one outage that day: ${clauses[0]}.`;
  }
  return `${opener} exit1.dev recorded ${n} outages that day, ${formatDuration(d.totalMs)} in total: ${joinList(clauses)}.`;
}

/** For metadata descriptions: same facts, tighter. */
export function shortSummary(d: OutageDay): string {
  if (d.ongoing && d.incidents.length === 1) {
    return `${d.monitor.host} has been down since ${formatUtc(d.ongoing.startedAt)}`;
  }
  const ranges = joinList(d.incidents.map((i) => incidentRange(i, d.dayStart)));
  return `${d.monitor.host} was down on ${d.dateLabel}: ${ranges}, ${formatDuration(d.totalMs, true)} in total`;
}

/** Latest moment this page's facts describe, for dateModified. */
export function lastFactAt(d: OutageDay): number {
  return Math.max(...d.incidents.map(incidentEnd));
}
