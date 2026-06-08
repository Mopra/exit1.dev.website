// Centralised helpers for the "start monitoring" calls-to-action across the
// marketing site. Keeping the destination + UTM tagging in one place means
// every CTA (inline tool result, sticky bar, page footers) is consistent and
// measurable in analytics, and the checked target can be deep-linked into the
// app so the first in-app action is pre-filled.

const APP_URL = "https://app.exit1.dev/";

interface SignupUrlOptions {
  /** Campaign identifier, e.g. "uptime_checker" or "sticky_bar". */
  campaign?: string;
  /** Placement, e.g. "tool_result" or "sticky_bar". */
  medium?: string;
  /** The URL/host the visitor just checked — passed through so the app can pre-fill it. */
  target?: string;
}

export function buildSignupUrl(opts: SignupUrlOptions = {}): string {
  const { campaign = "website", medium = "cta", target } = opts;

  const params = new URLSearchParams({
    utm_source: "exit1_website",
    utm_medium: medium,
    utm_campaign: campaign,
  });

  const cleanedTarget = target?.trim();
  if (cleanedTarget) {
    params.set("url", cleanedTarget);
  }

  return `${APP_URL}?${params.toString()}`;
}

/** Extract a clean hostname for display from a URL or bare host string. */
export function hostFromUrl(value: string): string {
  const trimmed = value.trim();
  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`).hostname;
  } catch {
    return trimmed.replace(/^https?:\/\//, "").split("/")[0];
  }
}
