import { redirect } from 'next/navigation';

// This page has been consolidated into /live-checks (the Live Checks landing
// page, which targets the same SEO intent with a stronger, differentiated
// pitch — streamed probes over WebSocket instead of polling).
//
// The 301 redirect is also configured in next.config.js so search engines and
// external links pass equity to the new URL. This file exists as a fallback
// in case the next.config redirect rule is ever removed or the build mode
// changes — keep both in sync.
export default function RealTimeMonitoringRedirect() {
  redirect('/live-checks');
}
