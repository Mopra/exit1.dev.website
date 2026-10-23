"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSignupUrl } from "@/lib/cta";
import { trackFollowEmailSubmit } from "@/lib/analytics";
import { API_BASE } from "@/lib/publicMonitors";

interface FollowCTAProps {
  slug: string;
  name: string;
  host: string;
  /** "hero" sits under the instant answer; "inline" closes the outage history. */
  placement: "hero" | "inline";
  /** The monitor is down right now, so the ask flips to "tell me when it's back". */
  isDown: boolean;
}

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "pending"; email: string }
  | { kind: "already" }
  | { kind: "error"; message: string };

const ERROR_COPY: Record<string, string> = {
  invalid_email: "That email doesn't look right. Check it and try again.",
  invalid_slug: "We couldn't find this service. Reload the page and try again.",
  not_found: "We couldn't find this service. Reload the page and try again.",
  rate_limited: "Too many tries. Wait a minute and try again.",
};
const GENERIC_ERROR = "Something went wrong on our end. Try again in a moment.";

/**
 * Email-only follow. Someone searching "is npm down" has the problem right now,
 * so the ask is one field: no account, double opt-in, and the confirm link
 * lands on /follow. The account path stays as a secondary link
 * (sign_up_click fires from the delegated listener in DeferredAnalytics).
 */
export function FollowCTA({ slug, name, host, placement, isDown }: FollowCTAProps) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<FormState>({ kind: "idle" });

  const signupHref = buildSignupUrl({ campaign: "follow_service", medium: `status_${placement}`, follow: slug });
  const ask = isDown ? `Email me when ${name} is back up` : `Alert me when ${name} goes down`;
  // The inline card already explains the alert in its body copy.
  const subline =
    placement === "inline"
      ? "Free. No account."
      : isDown
        ? "Free. No account. We'll email you the moment it's back."
        : "Free. No account. One email when it breaks, one when it's back.";
  const submitting = state.kind === "submitting";
  const done = state.kind === "pending" || state.kind === "already";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const trimmed = email.trim();
    setState({ kind: "submitting" });
    try {
      const res = await fetch(`${API_BASE}/v1/public/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, slug, company }),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; status?: string; error?: string }
        | null;

      if (res.ok && json?.ok) {
        trackFollowEmailSubmit({ service: slug, placement, serviceDown: isDown });
        setState(json.status === "already_confirmed" ? { kind: "already" } : { kind: "pending", email: trimmed });
        return;
      }
      const message = (json?.error && ERROR_COPY[json.error]) || GENERIC_ERROR;
      setState({ kind: "error", message });
    } catch {
      setState({ kind: "error", message: GENERIC_ERROR });
    }
  }

  const statusMessage =
    state.kind === "pending" ? (
      <>
        Check your inbox. We sent a confirmation link to{" "}
        <span className="font-semibold text-foreground">{state.email}</span>. Click it and
        you&apos;re following {name}.
      </>
    ) : state.kind === "already" ? (
      <>You already follow {name}. We&apos;ll email you when its status changes.</>
    ) : state.kind === "error" ? (
      state.message
    ) : null;

  const form = done ? null : (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        name="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitting}
        aria-invalid={state.kind === "error" || undefined}
        className="h-11 w-full min-w-0 rounded-full border border-input bg-background px-5 text-base text-foreground placeholder:text-muted-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-60 sm:max-w-xs"
      />
      {/* Honeypot: hidden from people and screen readers, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="h-11 rounded-full px-6 font-semibold cursor-pointer w-full sm:w-auto shrink-0"
      >
        {placement === "hero" && <Bell className="w-4 h-4 mr-1.5" />}
        {submitting ? "Sending..." : placement === "hero" ? ask : isDown ? "Email me" : "Alert me"}
        {placement === "inline" && !submitting && <ArrowRight className="w-4 h-4 ml-1.5" />}
      </Button>
    </form>
  );

  const message = (
    <p
      aria-live="polite"
      className={
        !statusMessage
          ? "sr-only"
          : state.kind === "error"
            ? "text-sm text-red-600 dark:text-red-400"
            : "flex items-start gap-2 text-sm text-foreground/80"
      }
    >
      {done && <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />}
      {statusMessage && <span>{statusMessage}</span>}
    </p>
  );

  const footer = (
    <p className="text-sm text-muted-foreground">
      {done ? "Want alerts for your own sites too? " : <>{subline} </>}
      <a href={signupHref} className="font-medium underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer">
        {done ? "Create a free account" : "or create a free account"}
      </a>
    </p>
  );

  if (placement === "hero") {
    return (
      <div className="relative mt-8 flex flex-col gap-3">
        {form}
        {message}
        {footer}
      </div>
    );
  }

  return (
    <div className="relative mt-6 rounded-xl border border-primary/25 bg-primary/[0.07] p-5 flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border bg-primary/15 border-primary/30 text-primary">
        <Bell className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1 flex flex-col gap-3">
        <div>
          <p className="font-semibold text-foreground">
            {isDown ? `Know the moment ${name} is back` : `Hear about the next ${name} outage first`}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            We check {host} around the clock. Leave your email and we&apos;ll tell you the
            moment it {isDown ? "is back up" : "goes down"}.
          </p>
        </div>
        {form}
        {message}
        {footer}
      </div>
    </div>
  );
}
