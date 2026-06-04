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

/** Tailwind bg class for the proportional uptime bar. */
export function uptimeBarClass(pct: number | null): string {
  if (pct == null) return "bg-transparent";
  if (pct >= 99) return "bg-foreground/25";
  if (pct >= 95) return "bg-amber-500/60";
  return "bg-red-500/70";
}

/** Compact relative "last checked" label, e.g. "3 min ago". */
export function lastCheckedLabel(ms: number, now: number = Date.now()): string {
  if (!ms) return "—";
  const mins = Math.round((now - ms) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}
