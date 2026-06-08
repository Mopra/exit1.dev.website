"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { buildSignupUrl } from "@/lib/cta";

// Persisted dismissal so the bar never nags. Re-shows after the window below.
const DISMISS_KEY = "exit1_cta_bar_dismissed_at";
const DISMISS_DAYS = 14;
// Only appear once the visitor has engaged a little (scrolled past the hero).
const SCROLL_THRESHOLD = 480;
// Excluded routes: the home page already sells, and the auth pages are redundant.
const HIDDEN_PATHS = new Set(["/", "/signin", "/signup"]);

// Dark tokens scoped to the bar, mirroring CookieBanner/Footer — this component
// mounts at layout level, so scoping guarantees it looks right on every page
// regardless of the host page's theme.
const darkTokens: React.CSSProperties & Record<string, string> = {
  "--background": "#15151B",
  "--foreground": "oklch(0.9851 0 0)",
  "--primary": "oklch(0.5854 0.1022 167.0051)",
  "--primary-foreground": "oklch(0 0 0)",
  "--muted-foreground": "oklch(0.7090 0 0)",
  "--border": "oklch(0.2768 0 0)",
};

export default function StickyCTABar() {
  const pathname = usePathname();
  const { showBanner } = useCookieConsent();
  const [scrolledPast, setScrolledPast] = useState(false);
  // Start hidden until we've read storage — avoids a flash on first paint.
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (!raw) {
        setDismissed(false);
        return;
      }
      const elapsedDays = (Date.now() - parseInt(raw, 10)) / (1000 * 60 * 60 * 24);
      setDismissed(elapsedDays < DISMISS_DAYS);
    } catch {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      /* noop */
    }
  };

  // Don't render at all on excluded routes, while the cookie banner is up
  // (avoids a bottom-left collision), or once dismissed.
  if (HIDDEN_PATHS.has(pathname ?? "") || dismissed || showBanner) return null;

  const visible = scrolledPast;

  return (
    <div
      style={darkTokens}
      role="complementary"
      aria-label="Get started with exit1"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 transition-all duration-500 ease-out",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="mx-auto max-w-5xl rounded-2xl border border-primary/25 bg-background/95 backdrop-blur-xl shadow-[0_18px_60px_-12px_rgba(0,0,0,0.75)] text-foreground p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm sm:text-base leading-tight">
              Monitor your sites free — 24/7 checks, instant alerts
            </p>
            <p className="hidden sm:block text-sm text-muted-foreground mt-0.5">
              Uptime, SSL &amp; domain monitoring. 10 monitors free, no credit card.
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full px-4 sm:px-5 font-semibold shrink-0 cursor-pointer"
          >
            <a
              href={buildSignupUrl({ campaign: "sticky_bar", medium: "sticky_bar" })}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start free
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </Button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
