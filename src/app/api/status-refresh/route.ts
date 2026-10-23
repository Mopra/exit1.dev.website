import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { API_BASE, getPublicMonitor, statusTag } from "@/lib/publicMonitors";

// Called by the exit1 backend the moment a public monitor changes state
// (functions/src/public-monitor-freshness.ts), so /status/<slug> stops saying
// "up" an hour into an outage. No secret: the route re-reads the live status
// itself and only re-renders when it differs from what the page cached, so a
// stranger calling it can't do more than a real transition would.

const SLUG_RE = /^[a-z0-9.-]{1,200}$/;

export async function POST(request: NextRequest) {
  let slug: unknown;
  try {
    slug = (await request.json())?.slug;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false, error: "invalid_slug" }, { status: 400 });
  }

  const [cached, live] = await Promise.all([
    getPublicMonitor(slug),
    fetch(`${API_BASE}/v1/public/monitor?slug=${encodeURIComponent(slug)}&fresh=${Date.now()}`, {
      cache: "no-store",
    })
      .then((res) => (res.ok ? (res.json() as Promise<{ monitor?: { status?: string } }>) : null))
      .catch(() => null),
  ]);

  const liveStatus = live?.monitor?.status;
  if (!cached || !liveStatus) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (cached.status === liveStatus) {
    return NextResponse.json({ ok: true, refreshed: false });
  }

  revalidateTag(statusTag(slug), { expire: 0 });
  revalidatePath(`/status/${slug}`);
  return NextResponse.json({ ok: true, refreshed: true, status: liveStatus });
}
