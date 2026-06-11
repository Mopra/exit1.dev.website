/**
 * Client for the public-monitors endpoints exposed by the exit1 Cloud Functions
 * (via app.exit1.dev hosting rewrites). These power the curated uptime landing
 * pages at /status and /status/<slug>. All data is precomputed server-side and
 * CDN-cached; we fetch it with ISR (hourly) so pages stay fresh without rebuilds.
 */

const API_BASE = process.env.NEXT_PUBLIC_EXIT1_API_BASE || "https://app.exit1.dev";
const REVALIDATE_SECONDS = 3600;

export type HeartbeatDay = {
  day: number; // start-of-day UTC, ms
  status: "online" | "offline" | "unknown";
  uptimePercentage: number | null;
  totalChecks: number;
  responseMs: number | null;
};

export type MonitorStats = {
  uptime7d: number | null;
  uptime30d: number | null;
  uptime90d: number | null;
  avgResponseMs: number | null;
  totalChecks30d: number;
};

export type MonitorIndexEntry = {
  slug: string;
  name: string;
  url: string;
  host: string;
  type: string;
  status: string;
  lastChecked: number;
  uptime30d: number | null;
  // Days (in the 90-day window) with at least one recorded check. Backend added
  // this for the data-maturity guard; optional so a frontend deploy that lands
  // before the backend deploy doesn't deindex everything.
  daysWithData?: number;
};

export type MonitorPage = MonitorIndexEntry & {
  checkId: string;
  stats: MonitorStats;
  heartbeat: HeartbeatDay[];
  updatedAt: number;
};

export async function getAllPublicMonitors(): Promise<MonitorIndexEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/v1/public/monitors`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { monitors?: MonitorIndexEntry[] };
    return Array.isArray(json.monitors) ? json.monitors : [];
  } catch {
    return [];
  }
}

export async function getPublicMonitor(slug: string): Promise<MonitorPage | null> {
  try {
    const res = await fetch(
      `${API_BASE}/v1/public/monitor?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { monitor?: MonitorPage };
    return json.monitor ?? null;
  } catch {
    return null;
  }
}

/** Human-readable status label + tone for badges. */
export function statusPresentation(status: string): { label: string; tone: "up" | "down" | "muted" } {
  const s = status.toLowerCase();
  if (s === "online" || s === "up") return { label: "Operational", tone: "up" };
  if (s === "offline" || s === "down") return { label: "Down", tone: "down" };
  if (s === "degraded") return { label: "Degraded", tone: "down" };
  if (s === "disabled") return { label: "Paused", tone: "muted" };
  return { label: "Unknown", tone: "muted" };
}

export function formatUptime(pct: number | null): string {
  if (pct == null) return "—";
  // Show two decimals only when not a whole number, capped sensibly.
  return `${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(2)}%`;
}

export function formatResponse(ms: number | null): string {
  if (ms == null) return "—";
  return `${Math.round(ms)} ms`;
}

/** Coarse health bucket used for counts, the summary bar, and worst-first sort. */
export type StatusClass = "operational" | "down" | "degraded" | "other";

export function classifyStatus(status: string): StatusClass {
  const s = status.toLowerCase();
  if (s === "online" || s === "up") return "operational";
  if (s === "offline" || s === "down") return "down";
  if (s === "degraded") return "degraded";
  return "other"; // disabled / paused / unknown
}

/** Coarse type bucket for the Websites vs APIs filter. */
export function classifyType(type: string): "api" | "website" {
  return /rest|api/i.test(type) ? "api" : "website";
}

export type SortKey = "worst" | "name" | "uptime-desc" | "uptime-asc" | "recent";

// Surface problems first: down → degraded → other → operational.
const STATUS_RANK: Record<StatusClass, number> = { down: 0, degraded: 1, other: 2, operational: 3 };

const byName = (a: MonitorIndexEntry, b: MonitorIndexEntry) => a.host.localeCompare(b.host);
// Nulls always sort last regardless of direction.
const cmpUptime = (a: MonitorIndexEntry, b: MonitorIndexEntry, dir: 1 | -1) => {
  const av = a.uptime30d;
  const bv = b.uptime30d;
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  return (av - bv) * dir;
};

/** Comparator factory backed entirely by real index fields. */
export function makeComparator(sortKey: SortKey): (a: MonitorIndexEntry, b: MonitorIndexEntry) => number {
  switch (sortKey) {
    case "name":
      return byName;
    case "uptime-desc":
      return (a, b) => cmpUptime(a, b, -1) || byName(a, b);
    case "uptime-asc":
      return (a, b) => cmpUptime(a, b, 1) || byName(a, b);
    case "recent":
      return (a, b) => (b.lastChecked || 0) - (a.lastChecked || 0) || byName(a, b);
    case "worst":
    default:
      return (a, b) =>
        STATUS_RANK[classifyStatus(a.status)] - STATUS_RANK[classifyStatus(b.status)] ||
        cmpUptime(a, b, 1) ||
        byName(a, b);
  }
}

/** Tailwind text class coloring an uptime number by health (green is reserved for status dots). */
export function uptimeColorClass(pct: number | null): string {
  if (pct == null) return "text-muted-foreground";
  if (pct >= 99.9) return "text-foreground/70";
  if (pct >= 99) return "text-foreground";
  if (pct >= 95) return "text-amber-500";
  return "text-red-500";
}

/**
 * Subtle status-tinted gradient wash for cards — a softer status signal than a
 * dot. Operational greens, down reds, degraded ambers; muted/unknown stays
 * neutral so paused entries don't get a false tint. Layers as a background
 * image, so card hover background-colors still apply underneath.
 */
export function statusGradientClass(status: string): string {
  switch (classifyStatus(status)) {
    case "operational":
      return "bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent";
    case "down":
      return "bg-gradient-to-br from-red-500/10 via-transparent to-transparent";
    case "degraded":
      return "bg-gradient-to-br from-amber-500/10 via-transparent to-transparent";
    default:
      return "";
  }
}

/** Tailwind bg class for the proportional uptime bar. */
export function uptimeBarClass(pct: number | null): string {
  if (pct == null) return "bg-transparent";
  if (pct >= 99) return "bg-foreground/25";
  if (pct >= 95) return "bg-amber-500/60";
  return "bg-red-500/70";
}

/**
 * Coarse "last checked" label, e.g. "within the last hour".
 *
 * Deliberately hour-granular: Vercel charges no ISR write units when a
 * regeneration produces byte-identical output, so everything rendered into
 * these ISR pages must be deterministic for a given data snapshot. A
 * minute-level "3 min ago" re-derives from Date.now() and changes on every
 * regeneration, forcing a full write each time — and it overstates precision
 * anyway, since the underlying fetch cache refreshes hourly.
 */
export function lastCheckedLabel(ms: number, now: number = Date.now()): string {
  if (!ms) return "—";
  const hrs = Math.floor((now - ms) / 3_600_000);
  if (hrs < 1) return "within the last hour";
  if (hrs < 24) return `${hrs} ${hrs === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}

// ---------------------------------------------------------------------------
// SEO / data-maturity helpers
//
// These curated status pages exist to rank for "is X down", "X uptime", etc.
// A page with only a day or two of history is thin, near-duplicate content that
// drags the whole /status section's quality. We require a minimum amount of
// real history before a page is allowed into the sitemap and indexed.
// ---------------------------------------------------------------------------

/** Minimum days of recorded data before a monitor page is indexable. */
export const MIN_DAYS_FOR_INDEX = 7;

/** Count of 90-day-window days that recorded at least one check. */
export function countDaysWithData(heartbeat: HeartbeatDay[]): number {
  return heartbeat.reduce((n, d) => (d.totalChecks > 0 ? n + 1 : n), 0);
}

/**
 * Is this index entry mature enough to index? Backends that predate
 * `daysWithData` report `undefined`; we treat that as mature so a frontend
 * deploy ahead of the backend doesn't deindex the whole section.
 */
export function isIndexEntryMature(m: MonitorIndexEntry): boolean {
  return (m.daysWithData ?? MIN_DAYS_FOR_INDEX) >= MIN_DAYS_FOR_INDEX;
}

/** Detail-page maturity, computed from the full heartbeat we already have. */
export function isMonitorPageMature(m: MonitorPage): boolean {
  return countDaysWithData(m.heartbeat) >= MIN_DAYS_FOR_INDEX;
}

/** Brand/display name for headings & copy; falls back to the bare host. */
export function displayName(m: { name?: string | null; host: string }): string {
  const n = m.name?.trim();
  return n && n.toLowerCase() !== m.host.toLowerCase() ? n : m.host;
}

/** Plain-English current-state phrase keyed off the coarse status bucket. */
export function statusPhrase(status: string): { isDown: boolean; phrase: string } {
  const c = classifyStatus(status);
  if (c === "down") return { isDown: true, phrase: "appears to be down" };
  if (c === "degraded") return { isDown: false, phrase: "is up but degraded" };
  if (c === "operational") return { isDown: false, phrase: "is up and running normally" };
  return { isDown: false, phrase: "has an unknown status right now" };
}

/** "Sep 14, 2025" in UTC (heartbeat days are UTC day-starts). */
export function formatDateUTC(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Whole days elapsed since `ms`. */
export function daysAgo(ms: number, now: number = Date.now()): number {
  return Math.max(0, Math.floor((now - ms) / 86_400_000));
}

export type IncidentSummary = {
  outages: HeartbeatDay[]; // offline days, newest first
  daysWithData: number;
  totalOutageDays: number;
  lastOutage: HeartbeatDay | null;
  cleanStreakDays: number; // consecutive most-recent days with data and no outage
};

/** Derive a textual incident history from the heartbeat (no backend needed). */
export function summarizeIncidents(heartbeat: HeartbeatDay[]): IncidentSummary {
  const withData = heartbeat.filter((d) => d.totalChecks > 0);
  const outages = withData.filter((d) => d.status === "offline").slice().reverse();

  let cleanStreakDays = 0;
  for (let i = heartbeat.length - 1; i >= 0; i--) {
    const d = heartbeat[i];
    if (d.totalChecks <= 0) continue; // gaps don't break the streak
    if (d.status === "offline") break;
    cleanStreakDays++;
  }

  return {
    outages,
    daysWithData: withData.length,
    totalOutageDays: outages.length,
    lastOutage: outages[0] ?? null,
    cleanStreakDays,
  };
}

export type Faq = { question: string; answer: string };

/**
 * Query-matched FAQ set, rendered both visibly (crawlable) and as FAQPage
 * JSON-LD. Covers the real search variants: is-it-down, uptime %, response
 * time, recent outages, and how it's measured (E-E-A-T / trust).
 */
export function buildFaqs(m: MonitorPage): Faq[] {
  const name = displayName(m);
  const { phrase } = statusPhrase(m.status);
  const incidents = summarizeIncidents(m.heartbeat);

  const faqs: Faq[] = [
    {
      question: `Is ${name} down right now?`,
      answer: `As of the last check (${lastCheckedLabel(m.lastChecked)}), ${m.host} ${phrase}. exit1.dev probes it continuously and updates this page automatically.`,
    },
    {
      question: `What is ${name}'s uptime?`,
      answer: `${m.host} has recorded ${formatUptime(m.stats.uptime30d)} uptime over the last 30 days and ${formatUptime(m.stats.uptime90d)} over the last 90 days, based on exit1.dev's independent monitoring.`,
    },
  ];

  if (m.stats.avgResponseMs != null) {
    faqs.push({
      question: `What is ${name}'s average response time?`,
      answer: `${m.host} responds in about ${formatResponse(m.stats.avgResponseMs)} on average over the last 30 days.`,
    });
  }

  faqs.push({
    question: `Has ${name} had any outages recently?`,
    answer: incidents.totalOutageDays
      ? `exit1.dev detected downtime on ${incidents.totalOutageDays} ${incidents.totalOutageDays === 1 ? "day" : "days"} in the last 90 days${incidents.lastOutage ? `. The most recent was ${formatDateUTC(incidents.lastOutage.day)}` : ""}.`
      : `No outages have been detected for ${m.host} in the last 90 days.`,
  });

  faqs.push({
    question: `How does exit1.dev measure ${name}'s status?`,
    answer: `exit1.dev runs automated uptime checks against ${m.host} around the clock from multiple regions, recording status and response time on every probe. The figures here are independent, third-party measurements — not self-reported by ${name}.`,
  });

  return faqs;
}
