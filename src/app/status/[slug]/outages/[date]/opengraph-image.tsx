import { ImageResponse } from "next/og";
import { formatDuration } from "@/lib/publicMonitors";
import { loadOutageDay } from "./outageDay";

export const runtime = "nodejs";
export const alt = "Outage report by exit1.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RED = "#DC2626";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; date: string }>;
}) {
  const { slug, date } = await params;
  const d = await loadOutageDay(slug, date);

  // Branded fallback so a share never produces a broken image.
  const name = d ? d.name : "Service outage";
  const dateLabel = d ? d.dateLabel : null;
  const total = d ? formatDuration(d.totalMs) : null;
  const count = d ? d.incidents.length : 0;
  const label = d?.ongoing ? "Outage in progress" : "Outage";

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#277E61",
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
            <div style={{ fontSize: "22px", fontWeight: 600, color: "#1a1a1a" }}>exit1.dev</div>
          </div>
          <div
            style={{
              fontSize: "16px",
              fontFamily: "monospace",
              color: RED,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              background: "rgba(220, 38, 38, 0.06)",
              display: "flex",
            }}
          >
            Outage Report
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "24px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "999px", background: RED, display: "flex" }} />
            <div style={{ fontSize: "30px", fontWeight: 600, color: RED, display: "flex" }}>{label}</div>
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
          {dateLabel ? (
            <div style={{ fontSize: "40px", color: "#5a5a5a", marginTop: "20px", display: "flex" }}>
              Down on {dateLabel}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "48px" }}>
            {total ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "44px", fontWeight: 700, color: RED, display: "flex" }}>{total}</div>
                <div style={{ fontSize: "18px", color: "#5a5a5a", display: "flex" }}>
                  {d?.ongoing ? "Downtime so far" : "Total downtime"}
                </div>
              </div>
            ) : null}
            {count > 0 ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "44px", fontWeight: 700, color: "#1a1a1a", display: "flex" }}>{count}</div>
                <div style={{ fontSize: "18px", color: "#5a5a5a", display: "flex" }}>
                  {count === 1 ? "Outage" : "Outages"}
                </div>
              </div>
            ) : null}
          </div>
          <div style={{ fontSize: "18px", color: "#5a5a5a", display: "flex" }}>
            Independently measured by exit1.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // Under a dynamic segment this isn't ISR'd, so the CDN holds it. A day for
      // a finished outage; an hour, the page's own ISR window, while one is in
      // progress so "Outage in progress" can't outlive it by much.
      headers: {
        "Cache-Control": d?.ongoing
          ? "public, s-maxage=3600, stale-while-revalidate=600"
          : "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    },
  );
}
