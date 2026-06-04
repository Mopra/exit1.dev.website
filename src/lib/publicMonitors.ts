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
