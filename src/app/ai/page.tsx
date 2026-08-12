import type { Metadata } from "next";
import { AiLanding } from "./AiLanding";

/**
 * Campaign landing page for the kickbacks.ai buy — ads that render inside
 * developers' CLIs and IDE extensions.
 *
 * The route is `/ai` because the terminal surface renders an ambient, unclickable
 * status line: the URL has to be short enough to type from memory. Traffic is
 * split per surface with `?s=ext` / `?s=term`.
 *
 * Deliberately `noindex, follow`: /mcp already targets these keywords and ranks
 * for them, and this site's standing SEO problem is cannibalization. This page's
 * job is conversion, not rankings. `follow` so its links still pass authority.
 * Also excluded from sitemap.ts.
 */
export const metadata: Metadata = {
  title: "Paste one prompt, get synthetic monitoring",
  description:
    "Paste one prompt into Claude Code, Cursor or Codex. Your agent reads the repo and sets the synthetic monitoring up — HTTP checks with body assertions, TCP, SSL expiry, cron heartbeats. 50 monitors free, no card.",
  robots: { index: false, follow: true },
};

export default function AiCampaignPage() {
  return <AiLanding />;
}
