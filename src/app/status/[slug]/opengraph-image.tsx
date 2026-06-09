import { ImageResponse } from "next/og";
import {
  displayName,
  formatResponse,
  formatUptime,
  getPublicMonitor,
  statusPresentation,
} from "@/lib/publicMonitors";

export const runtime = "nodejs";
// Match the page's ISR window so the shared card stays in sync with the data.
export const revalidate = 900;
export const alt = "Live status & uptime — exit1.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// tone (from statusPresentation) → signal color. Green/red carries the same
// up/down motif used across the status pages and homepage.
const toneColor: Record<"up" | "down" | "muted", string> = {
  up: "#2F8F6F",
  down: "#DC2626",
  muted: "#9CA3AF",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const monitor = await getPublicMonitor(slug);

  // Falls back to a generic-but-branded card if the monitor is missing or the
  // API is unreachable at render time, so a share never produces a broken image.
  const name = monitor ? displayName(monitor) : "Service status";
  const { label, tone } = monitor
    ? statusPresentation(monitor.status)
    : { label: "Live monitoring", tone: "muted" as const };
  const signal = toneColor[tone];
  const uptime = monitor ? formatUptime(monitor.stats.uptime30d) : null;
  const response =
    monitor && monitor.stats.avgResponseMs != null
      ? formatResponse(monitor.stats.avgResponseMs)
      : null;

  // Scale the host down as it gets longer so it never overflows the card.
  const nameSize = name.length > 24 ? 56 : name.length > 16 ? 72 : 88;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FFFCF0",
          padding: "72px",
        }}
      >
        {/* Top row: brand + status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#2F8F6F",
                color: "#FFFCF0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              e
            </div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: "#1a1a1a" }}>
              exit1.dev
            </div>
          </div>
          <div
            style={{
              fontSize: "16px",
              fontFamily: "monospace",
              color: "#2F8F6F",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(47, 143, 111, 0.3)",
              background: "rgba(47, 143, 111, 0.06)",
              display: "flex",
            }}
          >
            Live Status
          </div>
        </div>

        {/* Center: status dot + host + question */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "999px",
                background: signal,
                display: "flex",
              }}
            />
            <div
              style={{
                fontSize: "30px",
                fontWeight: 600,
                color: signal,
                display: "flex",
              }}
            >
              {label}
            </div>
          </div>
          <div
            style={{
              fontSize: `${nameSize}px`,
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              display: "flex",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: "34px",
              color: "#5a5a5a",
              marginTop: "20px",
              maxWidth: "960px",
              lineHeight: 1.3,
              display: "flex",
            }}
          >
            Is {name} down right now? Live status, uptime &amp; response times.
          </div>
        </div>

        {/* Bottom: stats + attribution */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "48px" }}>
            {uptime ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "44px", fontWeight: 700, color: "#1a1a1a", display: "flex" }}>
                  {uptime}
                </div>
                <div style={{ fontSize: "18px", color: "#5a5a5a", display: "flex" }}>
                  30-day uptime
                </div>
              </div>
            ) : null}
            {response ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "44px", fontWeight: 700, color: "#1a1a1a", display: "flex" }}>
                  {response}
                </div>
                <div style={{ fontSize: "18px", color: "#5a5a5a", display: "flex" }}>
                  Avg response
                </div>
              </div>
            ) : null}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#5a5a5a",
              display: "flex",
            }}
          >
            Independently monitored by exit1.dev
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
