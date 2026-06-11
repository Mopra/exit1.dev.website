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
  "whatsapp.com",
  "instagram.com",
  "facebook.com",
  "linkedin.com",
  "reddit.com",
  "freewheel.com",
  "tiktok.com",
  "pinterest.com",
  "canva.com",
  "amazon.com",
  "company.rtl.com",
  "brand-innovators.com",
  "airops.com",
  "salesforce.com",
  "yahoo.com",
  "open.spotify.com",
  "sportbeach.com",
  "deloittedigital.com",
  "strava.com",
  "nielsen.com",
  "semrush.com",
  "bima.co.uk",
  "3cventures.com",
  "equativ.com",
  "bain.com",
  "snowflake.com",
  "nytimes.com",
  "businessinsider.com",
  "linktr.ee",
  "adobe.com",
  "washingtonpost.com",
  "magnite.com",
  "microsoft.com",
  "smartly.io",
];

/**
 * Hosts pulled out and highlighted in a featured strip at the top of the board,
 * in this order. Each must also be present in CANNES_EVENT_HOSTS to be monitored.
 */
export const CANNES_FEATURED_HOSTS: string[] = [
  "adobe.com",
  "businessinsider.com",
  "bain.com",
  "salesforce.com",
  "amazon.com",
  "reddit.com",
  "linkedin.com",
  "facebook.com",
  "instagram.com",
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

/**
 * Of the given monitors, the featured ones in CANNES_FEATURED_HOSTS order.
 * Only hosts we're actually monitoring surface — missing ones are skipped.
 */
export function selectCannesFeatured(monitors: MonitorIndexEntry[]): MonitorIndexEntry[] {
  const byHost = new Map(monitors.map((m) => [normalizeHost(m.host), m]));
  return CANNES_FEATURED_HOSTS.map((h) => byHost.get(normalizeHost(h))).filter(
    (m): m is MonitorIndexEntry => m != null,
  );
}
