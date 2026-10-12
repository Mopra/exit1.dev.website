// Centralised helpers for the "start monitoring" calls-to-action across the
// marketing site. Keeping the destination + UTM tagging in one place means
// every CTA (inline tool result, sticky bar, page footers) is consistent and
// measurable in analytics, and the checked target can be deep-linked into the
// app so the first in-app action is pre-filled.

// Land on the sign-up screen specifically — the app's root ("/") renders sign-in,
// so a bare app URL sends new visitors to the wrong form. The query string
// (UTM + ?website= prefill) is read by App.tsx on any route, so it survives here.
const APP_URL = "https://app.exit1.dev/sign-up";

interface SignupUrlOptions {
  /** Campaign identifier, e.g. "uptime_checker" or "sticky_bar". */
  campaign?: string;
  /** Placement, e.g. "tool_result" or "sticky_bar". */
  medium?: string;
  /** The URL/host the visitor just checked, passed through so the app can pre-fill it. */
  target?: string;
  /** A /status/<slug> the visitor wants alerts for. The app follows it right after sign-up. */
  follow?: string;
}

export function buildSignupUrl(opts: SignupUrlOptions = {}): string {
  const { campaign = "website", medium = "cta", target, follow } = opts;

  const params = new URLSearchParams({
    utm_source: "exit1_website",
    utm_medium: medium,
    utm_campaign: campaign,
  });

  const cleanedTarget = target?.trim();
  if (cleanedTarget) {
    // The app (app.exit1.dev) reads this back as the `website` param in App.tsx
    // and stashes it for the onboarding's first-check pre-fill. Keep the name in
    // sync with that consumer — a mismatch silently drops the pre-fill.
    params.set("website", cleanedTarget);
  }

  // Read by App.tsx in the app (PENDING_FOLLOW_STORAGE_KEY). Keep the name in sync.
  if (follow) params.set("follow", follow);

  return `${APP_URL}?${params.toString()}`;
}

// The app's billing page reads `tab`, `plan` and `period` to preselect a plan
// card, scroll to it and set the monthly/annual toggle. Signed-out visitors are
// sent to login and returned to this full URL (query included) afterwards.
const BILLING_URL = "https://app.exit1.dev/billing";

export type PaidPlanKey = "indie" | "nano" | "pro";
export type BillingPeriod = "monthly" | "annual";

interface BillingUrlOptions {
  /** Plan card to preselect. Omit to just open the plans tab. */
  plan?: PaidPlanKey;
  /** Billing period for the monthly/annual toggle. Omit to keep the app default. */
  period?: BillingPeriod;
  /** Campaign identifier. Defaults to "pricing_<plan>" or "pricing". */
  campaign?: string;
  /** Placement, e.g. "pricing" or "why_upgrade". */
  medium?: string;
}

export function buildBillingUrl(opts: BillingUrlOptions = {}): string {
  const { plan, period, medium = "cta" } = opts;
  const campaign = opts.campaign ?? (plan ? `pricing_${plan}` : "pricing");

  const params = new URLSearchParams({ tab: "plans" });
  if (plan) params.set("plan", plan);
  if (period) params.set("period", period);
  params.set("utm_source", "exit1_website");
  params.set("utm_medium", medium);
  params.set("utm_campaign", campaign);

  return `${BILLING_URL}?${params.toString()}`;
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
