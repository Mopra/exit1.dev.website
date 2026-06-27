// GA4 event helpers for the marketing site.
//
// The only conversion that matters here is "visitor clicked a CTA into the
// app" — actual account creation completes on app.exit1.dev. We model that as
// a single GA4 event, `sign_up_click`, fired by a delegated listener in
// DeferredAnalytics whenever any anchor to app.exit1.dev is clicked. Mark it as
// a Key Event in the GA4 UI to turn it into a conversion.

export const SIGNUP_CLICK_EVENT = "sign_up_click";

const APP_HOST = "app.exit1.dev";

/** True when href points at the app (i.e. a signup / get-started CTA). */
export function isAppSignupUrl(href: string): boolean {
  try {
    const url = new URL(
      href,
      typeof window !== "undefined" ? window.location.origin : "https://exit1.dev",
    );
    return url.hostname === APP_HOST;
  } catch {
    return false;
  }
}

/** Pull the UTM campaign/medium that buildSignupUrl() encodes into the CTA. */
export function parseCtaParams(href: string): { campaign: string; medium: string } {
  try {
    const url = new URL(
      href,
      typeof window !== "undefined" ? window.location.origin : "https://exit1.dev",
    );
    return {
      campaign: url.searchParams.get("utm_campaign") || "(unknown)",
      medium: url.searchParams.get("utm_medium") || "(unknown)",
    };
  } catch {
    return { campaign: "(unknown)", medium: "(unknown)" };
  }
}

/**
 * Send the GA4 sign_up_click event. No-op until gtag is loaded (callers should
 * ensure the analytics tags are initialised first). `transport_type: 'beacon'`
 * lets the hit survive the navigation to the app.
 */
export function trackSignupClick({
  campaign,
  medium,
}: {
  campaign: string;
  medium: string;
}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", SIGNUP_CLICK_EVENT, {
    // Register these as custom dimensions in GA4 to break conversions down by
    // which CTA/placement drove them.
    cta_campaign: campaign,
    cta_medium: medium,
    transport_type: "beacon",
  });
}
