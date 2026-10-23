import {
  displayName,
  formatResponse,
  formatUptime,
  formatUtc,
  lastProbed,
  statusPhrase,
  statusSince,
  type MonitorPage,
} from "@/lib/publicMonitors";

/**
 * The crawlable instant answer. This is the single most important block for
 * "is X down" queries — Google's featured snippets and AI Overviews lift
 * *visible* text, so the current state, uptime %, and response time all live
 * here in a plain leading sentence (not just in JSON-LD). Times are absolute
 * UTC so the sentence stays true when an LLM quotes it later.
 */
export function StatusAnswer({ monitor }: { monitor: MonitorPage }) {
  const name = displayName(monitor);
  const { isDown, phrase } = statusPhrase(monitor.status);
  const uptime = formatUptime(monitor.stats.uptime30d);
  const hasUptime = monitor.stats.uptime30d != null;
  const hasResponse = monitor.stats.avgResponseMs != null;
  const since = isDown ? statusSince(monitor) : null;
  const checkedAt = lastProbed(monitor);

  return (
    <p className="text-xl leading-relaxed text-foreground/80 sm:text-2xl">
      <strong className="font-semibold text-foreground">
        Is {name} down? {isDown ? "Yes" : "No"}
      </strong>
      .{" "}
      {since ? (
        <>
          {monitor.host} has been down since {formatUtc(since)}
        </>
      ) : (
        <>
          {monitor.host} {phrase}
        </>
      )}
      {checkedAt ? <>, last checked {formatUtc(checkedAt)}</> : null}. exit1.dev checks it
      around the clock and updates this page the moment that changes.
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
      {monitor.source === "vendor_status" && (
        <> Status comes from {monitor.host}&apos;s official status page.</>
      )}
    </p>
  );
}
