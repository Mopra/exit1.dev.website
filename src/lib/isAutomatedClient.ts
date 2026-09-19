/**
 * Best-effort detection of headless / automated browsers, used to keep bot
 * traffic out of the analytics tools.
 *
 * Why this exists: the recurring "Edge Requests traffic spike" alerts on this
 * project are JS-executing headless browsers arriving on residential-ISP IPs
 * with a spoofed browser user agent. Vercel's own bot classifier does not flag
 * them (`firewall bot-management` reports no unknown-bot traffic during the
 * spikes), and they cost essentially nothing at the edge because every route
 * they hit is a cached prerender. The damage is measurement: they hydrate the
 * page, so left alone they land in GA4 as sessions and in Speed Insights as
 * Core Web Vitals samples, which is what makes traffic look like it doubled.
 *
 * Deliberately narrow. Only explicit automation markers count. Heuristics like
 * "reports zero plugins" or "unusual language header" would drop real
 * visitors, and a silently under-counted funnel is worse than a slightly
 * polluted one. A bot that patches `navigator.webdriver` gets through, and
 * that is the accepted trade: this trims the obvious noise, it is not a
 * security control. Blocking belongs in the WAF, not here.
 */

// Globals injected by the common automation drivers. Each is set by the driver
// itself rather than inferred, so a match is not a guess.
const AUTOMATION_GLOBALS = [
  "_phantom",
  "callPhantom",
  "__nightmare",
  "__playwright",
  "__puppeteer_evaluation_script__",
  "__selenium_unwrapped",
  "__webdriver_evaluate",
  "__driver_evaluate",
  "domAutomation",
  "domAutomationController",
];

export function isAutomatedClient(): boolean {
  if (typeof window === "undefined") return false;

  try {
    // The standardised flag. Playwright, Puppeteer and Selenium all set it
    // unless the operator has gone out of their way to patch it out.
    if (navigator.webdriver === true) return true;

    // Catches the default Chrome headless UA, which many scrapers never bother
    // to override.
    if (/headless/i.test(navigator.userAgent)) return true;

    return AUTOMATION_GLOBALS.some((key) => key in window);
  } catch {
    // A locked-down or unusual environment is not evidence of automation.
    return false;
  }
}
