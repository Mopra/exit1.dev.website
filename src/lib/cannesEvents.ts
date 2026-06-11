/**
 * Curated set of industry-event websites surfaced on the Cannes 2026 status
 * board (`/cannes-2026/status`). The board reuses the same live data as the
 * public /status pages — it just narrows the full monitor set down to the
 * events we want to showcase alongside the summit.
 *
 * An event only appears once exit1 is actually monitoring it and it surfaces in
 * the public-monitors API. To add one: create the monitor in the app, then add
 * its bare host below.
 */

import { getAllPublicMonitors, type MonitorIndexEntry } from "./publicMonitors";

/** Bare hosts (no scheme, no leading `www.`) of the events we feature. */
export const CANNES_EVENT_HOSTS: string[] = [
  "github.com",
  "sentry.io",
];

/** Lowercase, trim, and drop a leading `www.` so allowlist ↔ monitor hosts match. */
function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/^www\./, "");
}

/**
 * Live monitors for the curated events, drawn from the same public-monitors
 * feed as /status. Matching is host-based so it's resilient to however the
 * backend slugs each monitor.
 */
export async function getCannesEventMonitors(): Promise<MonitorIndexEntry[]> {
  const allow = new Set(CANNES_EVENT_HOSTS.map(normalizeHost));
  const monitors = await getAllPublicMonitors();
  return monitors.filter((m) => allow.has(normalizeHost(m.host)));
}
