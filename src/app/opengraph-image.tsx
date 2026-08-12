import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "exit1.dev — Free uptime monitoring for websites, APIs and services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Without this the homepage fell back to the root layout's 500x500 logo, which
// social platforms crop into a small square card. Matches the visual language
// of the tool cards in src/app/tools/*/opengraph-image.tsx.
export default async function Image() {
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
            <div style={{ fontSize: "22px", fontWeight: 600, color: "#1a1a1a" }}>
              exit1.dev
            </div>
          </div>
          <div
            style={{
              fontSize: "16px",
              fontFamily: "monospace",
              color: "#277E61",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(47, 143, 111, 0.3)",
              background: "rgba(47, 143, 111, 0.06)",
              display: "flex",
            }}
          >
            All systems operational
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
          <div
            style={{
              fontSize: "84px",
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Your sites are online.</span>
            <span style={{ color: "#277E61" }}>Until they aren&apos;t.</span>
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#5a5a5a",
              marginTop: "24px",
              maxWidth: "960px",
              lineHeight: 1.3,
              display: "flex",
            }}
          >
            Free uptime monitoring with instant alerts. Know before your customers do.
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          {["50 monitors free", "SSL & domain expiry", "Status pages", "REST API + MCP", "No credit card"].map(
            (label) => (
              <div
                key={label}
                style={{
                  fontSize: "18px",
                  color: "#1a1a1a",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(0,0,0,0.02)",
                  display: "flex",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
