import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/markdownLoader";

export const runtime = "nodejs";
export const alt = "exit1.dev blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title ?? "exit1.dev blog";
  const category = post?.categoryName ?? "Blog";
  const author = post?.author ?? "exit1.dev";
  const readTime = post?.readTime ?? null;

  // Scale the headline down as it gets longer so it never overflows the card.
  const titleSize = title.length > 70 ? 52 : title.length > 40 ? 64 : 76;

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
        {/* Top row: brand + category */}
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
            {category}
          </div>
        </div>

        {/* Center: post title */}
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
              fontSize: `${titleSize}px`,
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: author + read time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "32px",
            fontSize: "22px",
            color: "#5a5a5a",
          }}
        >
          <div style={{ display: "flex" }}>{author}</div>
          {readTime ? <div style={{ display: "flex" }}>{readTime}</div> : null}
        </div>
      </div>
    ),
    { ...size }
  );
}
