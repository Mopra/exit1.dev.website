import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Free Redirect Checker — exit1.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
            Free Tool
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
              display: "flex",
              alignItems: "center",
              gap: "28px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "24px",
                background: "#2F8F6F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 20px 40px rgba(47, 143, 111, 0.25)",
              }}
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFCF0"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7h13" />
                <path d="M11 3l5 4-5 4" />
                <path d="M21 17H8" />
                <path d="M13 21l-5-4 5-4" />
              </svg>
            </div>
            <div
              style={{
                fontSize: "20px",
                fontFamily: "monospace",
                color: "#2F8F6F",
                fontWeight: 600,
                display: "flex",
              }}
            >
              301 · 302 · 307 · 308
            </div>
          </div>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              display: "flex",
            }}
          >
            Free Redirect Checker
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#5a5a5a",
              marginTop: "20px",
              maxWidth: "920px",
              lineHeight: 1.3,
              display: "flex",
            }}
          >
            Trace every hop, status code, and Location header in any HTTP redirect chain.
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          {["No signup", "Full chain", "Per-hop timing", "Loop detection", "SEO insights"].map(
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
