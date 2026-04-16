// Fallback baseline used if the live stats endpoint is unreachable.
// In normal operation, the values below are overwritten at runtime by
// LiveChecksCounter after fetching /getPublicChecksStats.

export interface ChecksStats {
  total: number;
  at: number;
  ratePerSecond: number;
}

export const FALLBACK_STATS: ChecksStats = {
  total: 100_000_000,
  at: Date.parse("2026-04-17T00:00:00Z"),
  ratePerSecond: 50,
};

export const STATS_ENDPOINT = "https://app.exit1.dev/v1/stats/checks";

export function extrapolateTotal(stats: ChecksStats, now: number = Date.now()): number {
  const elapsedSec = Math.max(0, (now - stats.at) / 1000);
  return Math.floor(stats.total + elapsedSec * stats.ratePerSecond);
}
