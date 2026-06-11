import {
  displayName,
  formatResponse,
  formatUptime,
  lastCheckedLabel,
  statusPhrase,
  type MonitorPage,
} from "@/lib/publicMonitors";

/**
 * The crawlable instant answer. This is the single most important block for
 * "is X down" queries — Google's featured snippets and AI Overviews lift
 * *visible* text, so the current state, uptime %, and response time all live
 * here in a plain leading sentence (not just in JSON-LD).
 */
export function StatusAnswer({ monitor }: { monitor: MonitorPage }) {
  const name = displayName(monitor);
  const { isDown, phrase } = statusPhrase(monitor.status);
  const uptime = formatUptime(monitor.stats.uptime30d);
  const hasUptime = monitor.stats.uptime30d != null;
  const hasResponse = monitor.stats.avgResponseMs != null;

  return (
    <p className="text-xl leading-relaxed text-foreground/80 sm:text-2xl">
      <strong className="font-semibold text-foreground">
        Is {name} down? {isDown ? "Yes" : "No"}
      </strong>{" "}
      — {monitor.host} {phrase}, checked {lastCheckedLabel(monitor.lastChecked)}.
      {hasUptime && (
        <>
          {" "}
          It has recorded{" "}
          <strong className="font-semibold text-foreground">{uptime} uptime</strong> over
          the last 30 days
          {hasResponse && (
            <>
              , with an average response time of{" "}
              <strong className="font-semibold text-foreground">
                {formatResponse(monitor.stats.avgResponseMs)}
              </strong>
            </>
          )}
          .
        </>
      )}
    </p>
  );
}
