"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { isAutomatedClient } from "@/lib/isAutomatedClient";

/**
 * Speed Insights with automated clients filtered out.
 *
 * Speed Insights stays mounted eagerly, unlike the tags in DeferredAnalytics:
 * it is the thing measuring Core Web Vitals, so deferring it to the first
 * interaction would both miss the load-time vitals and bias the sample towards
 * engaged visitors. Instead the beacon is dropped at send time for clients that
 * identify as automation, which keeps real non-interacting visitors in the
 * sample while keeping scraper page loads out of it.
 *
 * `beforeSend` is a function prop, so this wrapper has to be a client
 * component. The root layout is a server component and cannot pass it
 * directly.
 */
export default function FilteredSpeedInsights() {
  return (
    <SpeedInsights beforeSend={(event) => (isAutomatedClient() ? null : event)} />
  );
}
