import { InsetCard } from "@/components/InsetCard";
import { formatResponse, formatUptime, type MonitorStats } from "@/lib/publicMonitors";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <InsetCard className="p-5 sm:p-6">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-3xl sm:text-4xl font-bold tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </InsetCard>
  );
}

export function UptimeStatCards({ stats }: { stats: MonitorStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4">
      <Stat label="Uptime (7d)" value={formatUptime(stats.uptime7d)} />
      <Stat label="Uptime (30d)" value={formatUptime(stats.uptime30d)} />
      <Stat label="Uptime (90d)" value={formatUptime(stats.uptime90d)} />
      <Stat
        label="Avg response"
        value={formatResponse(stats.avgResponseMs)}
        sub="30-day average"
      />
    </div>
  );
}
