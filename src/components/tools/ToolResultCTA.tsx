"use client";

import { ArrowRight, Bell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildSignupUrl } from "@/lib/cta";

type Tone = "alert" | "positive";

interface ToolResultCTAProps {
  /** Campaign id for UTM tagging, e.g. "uptime_checker". */
  campaign: string;
  /** The URL/host the visitor checked — deep-linked into signup. */
  target?: string;
  tone?: Tone;
  headline: React.ReactNode;
  subline: React.ReactNode;
  ctaLabel?: string;
}

/**
 * Result-aware inline CTA shown the moment a free-tool check finishes — the
 * peak-intent moment. Copy is personalised by the calling tool (issue count,
 * grade, the exact host the visitor checked) and the checked target is carried
 * into the signup link. Visually lighter than the page-bottom CTA so it informs
 * without blocking the result detail below it.
 */
export function ToolResultCTA({
  campaign,
  target,
  tone = "positive",
  headline,
  subline,
  ctaLabel = "Monitor it free",
}: ToolResultCTAProps) {
  const href = buildSignupUrl({ campaign, medium: "tool_result", target });
  const Icon = tone === "alert" ? AlertTriangle : Bell;

  return (
    <div
      className={cn(
        "rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4",
        tone === "alert"
          ? "bg-warning/[0.07] border-warning/25"
          : "bg-primary/[0.07] border-primary/25"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
          tone === "alert"
            ? "bg-warning/15 border-warning/30 text-warning"
            : "bg-primary/15 border-primary/30 text-primary"
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">{headline}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{subline}</p>
      </div>
      <Button
        asChild
        size="lg"
        className="rounded-full px-6 font-semibold shrink-0 cursor-pointer w-full sm:w-auto"
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {ctaLabel}
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </a>
      </Button>
    </div>
  );
}
