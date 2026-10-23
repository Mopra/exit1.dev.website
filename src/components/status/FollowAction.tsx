"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, BellOff, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSignupUrl } from "@/lib/cta";
import { API_BASE } from "@/lib/publicMonitors";

type Action = "confirm" | "unsubscribe";

type ViewState =
  | { kind: "ask" }
  | { kind: "working" }
  | { kind: "done"; slug: string; name: string }
  | { kind: "invalid" }
  | { kind: "error" };

const SLUG_PATTERN = /^[a-z0-9][a-z0-9.-]{0,200}$/i;

/**
 * The confirm and unsubscribe links in follow emails land here and change
 * nothing until the button is pressed. Corporate link scanners open every link
 * in an email on arrival; if opening the link did the work, they would confirm
 * follows nobody asked for and unsubscribe people on their first alert.
 */
export function FollowAction({ action, token }: { action: Action; token: string | null }) {
  const [state, setState] = useState<ViewState>(token ? { kind: "ask" } : { kind: "invalid" });

  async function run() {
    setState({ kind: "working" });
    try {
      const res = await fetch(`${API_BASE}/v1/public/follow/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; slug?: string; name?: string } | null;
      if (res.ok && json?.ok && json.slug && SLUG_PATTERN.test(json.slug)) {
        setState({ kind: "done", slug: json.slug, name: json.name || json.slug });
      } else if (res.status === 404) {
        setState({ kind: "invalid" });
      } else {
        setState({ kind: "error" });
      }
    } catch {
      setState({ kind: "error" });
    }
  }

  if (state.kind === "invalid") {
    return (
      <>
        <StateIcon tone="muted">
          <Clock className="h-6 w-6" />
        </StateIcon>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">Link no longer works</h1>
        <p className="mt-5 text-xl leading-relaxed text-foreground/80">
          {action === "confirm"
            ? "That confirmation link has expired. Follow the service again from its status page."
            : "You're already unsubscribed, or the link is incomplete."}
        </p>
        <div className="mt-8">
          <BackLink href="/status">All monitored services</BackLink>
        </div>
      </>
    );
  }

  if (state.kind === "done" && action === "unsubscribe") {
    return (
      <>
        <StateIcon tone="muted">
          <BellOff className="h-6 w-6" />
        </StateIcon>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">Unsubscribed</h1>
        <p className="mt-5 text-xl leading-relaxed text-foreground/80">
          You won&apos;t get emails about {state.name} anymore.
        </p>
        <div className="mt-8">
          <BackLink href={`/status/${state.slug}`}>Back to {state.name} status</BackLink>
        </div>
      </>
    );
  }

  if (state.kind === "done") {
    return (
      <>
        <StateIcon tone="up">
          <Check className="h-6 w-6" />
        </StateIcon>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          You&apos;re following {state.name}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-foreground/80">
          We&apos;ll email you when it goes down and when it&apos;s back.
        </p>

        <div className="mt-14 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">What else breaks when {state.name} goes down?</h2>
          <p className="mt-3 text-lg leading-relaxed text-foreground/80">
            You found this page because an outage hit something of yours. exit1 can watch your own
            sites, APIs and the dependencies they lean on, and tell you first. Free plan, set up in a
            minute.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="rounded-full px-6 font-semibold cursor-pointer w-full sm:w-auto">
              <a href={buildSignupUrl({ campaign: "follow_confirmed", medium: "follow_page" })}>
                Monitor my own sites free
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>
            </Button>
            <BackLink href={`/status/${state.slug}`}>Back to {state.name} status</BackLink>
          </div>
        </div>
      </>
    );
  }

  const working = state.kind === "working";
  return (
    <>
      <StateIcon tone={action === "confirm" ? "up" : "muted"}>
        {action === "confirm" ? <Bell className="h-6 w-6" /> : <BellOff className="h-6 w-6" />}
      </StateIcon>
      <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
        {action === "confirm" ? "Confirm your alerts" : "Stop these emails?"}
      </h1>
      <p className="mt-5 text-xl leading-relaxed text-foreground/80">
        {action === "confirm"
          ? "One click and we'll email you when the service goes down and when it's back."
          : "You'll stop getting outage emails for this service. You can follow it again any time."}
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Button
          type="button"
          size="lg"
          onClick={run}
          disabled={working}
          className="rounded-full px-6 font-semibold cursor-pointer w-full sm:w-auto self-start"
        >
          {working ? "One moment..." : action === "confirm" ? "Confirm" : "Unsubscribe"}
        </Button>
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {state.kind === "error" ? "Something went wrong on our end. Try again in a moment." : null}
        </p>
      </div>
    </>
  );
}

function StateIcon({ tone, children }: { tone: "up" | "muted"; children: React.ReactNode }) {
  const toneClass =
    tone === "up"
      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
      : "bg-foreground/5 border-foreground/15 text-foreground/70";
  return (
    <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border ${toneClass}`}>
      {children}
    </div>
  );
}

function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer interactive"
    >
      <ArrowRight className="h-4 w-4 rotate-180" />
      {children}
    </Link>
  );
}
