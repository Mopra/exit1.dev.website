"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Globe,
  Loader2,
  Search,
  Copy,
  Check,
  Download,
  Clock,
  Network,
  Zap,
  ChevronDown,
  Link2,
  CheckCircle,
  XCircle,
  Activity,
  Wifi,
  WifiOff,
  BarChart3,
  Server,
  ArrowUpDown,
  Award,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PingEntry {
  seq: number;
  timeMs: number | null;
  error?: string;
}

interface PingStats {
  sent: number;
  received: number;
  lost: number;
  lossPercent: number;
  minMs: number;
  avgMs: number;
  maxMs: number;
  jitterMs: number;
  stdDevMs: number;
}

interface PingResult {
  host: string;
  ip: string;
  reverseDns: string | null;
  port: number;
  dnsTimeMs: number;
  pings: PingEntry[];
  stats: PingStats;
  grade: string;
  error?: string;
}

const EXAMPLE_HOSTS = ["google.com", "cloudflare.com", "8.8.8.8"];

const PING_COUNTS = [1, 2, 4, 6, 8, 10] as const;

const LOADING_STEPS = [
  { label: "Resolving hostname", detail: "Looking up DNS records..." },
  { label: "Reverse DNS lookup", detail: "Identifying host PTR record..." },
  { label: "Probing ports", detail: "Finding open TCP port..." },
  { label: "Sending pings", detail: "Measuring round-trip times..." },
  { label: "Computing statistics", detail: "Calculating latency metrics..." },
];

function ResultRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", className)} />
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium break-all">{value}</div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
  actions,
  defaultOpen = true,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } }}
        className="w-full flex items-center justify-between p-5 pb-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
          {badge}
        </div>
        <div className="flex items-center gap-3">
          {open && actions}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </div>
      </div>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
        ok
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-red-500/10 border-red-500/20 text-red-400"
      )}
    >
      {ok ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label}
    </span>
  );
}

function latencyColor(ms: number | null): string {
  if (ms === null) return "text-red-400";
  if (ms <= 50) return "text-emerald-400";
  if (ms <= 100) return "text-green-400";
  if (ms <= 200) return "text-yellow-400";
  if (ms <= 500) return "text-orange-400";
  return "text-red-400";
}

function latencyBg(ms: number | null): string {
  if (ms === null) return "bg-red-500/20";
  if (ms <= 50) return "bg-emerald-500/20";
  if (ms <= 100) return "bg-green-500/20";
  if (ms <= 200) return "bg-yellow-500/20";
  if (ms <= 500) return "bg-orange-500/20";
  return "bg-red-500/20";
}

function gradeColor(grade: string): { text: string; bg: string; border: string } {
  if (grade.startsWith("A")) return { text: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" };
  if (grade === "B") return { text: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" };
  if (grade === "C") return { text: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" };
  if (grade === "D") return { text: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30" };
  return { text: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" };
}

function LatencyChart({ pings, maxMs }: { pings: PingEntry[]; maxMs: number }) {
  const chartHeight = 120;
  const barGap = 4;
  const barCount = pings.length;
  const chartMax = Math.max(maxMs * 1.2, 10);

  return (
    <div className="w-full">
      <div className="flex items-end gap-[2px] sm:gap-1" style={{ height: chartHeight }}>
        {pings.map((ping) => {
          const h = ping.timeMs !== null
            ? Math.max((ping.timeMs / chartMax) * chartHeight, 4)
            : chartHeight;
          const color = ping.timeMs !== null
            ? ping.timeMs <= 50
              ? "bg-emerald-500"
              : ping.timeMs <= 100
                ? "bg-green-500"
                : ping.timeMs <= 200
                  ? "bg-yellow-500"
                  : ping.timeMs <= 500
                    ? "bg-orange-500"
                    : "bg-red-500"
            : "bg-red-500/40";

          return (
            <div
              key={ping.seq}
              className="flex-1 flex flex-col items-center justify-end group relative"
              style={{ minWidth: 0 }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                <div className="bg-black/90 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap">
                  <div className="font-mono font-semibold">
                    {ping.timeMs !== null ? `${ping.timeMs}ms` : "Failed"}
                  </div>
                  <div className="text-muted-foreground">Ping #{ping.seq}</div>
                </div>
              </div>
              <div
                className={cn(
                  "w-full rounded-t-sm transition-all duration-300",
                  color,
                  ping.timeMs === null && "opacity-40 bg-stripes"
                )}
                style={{ height: h }}
              />
            </div>
          );
        })}
      </div>
      {/* X-axis labels */}
      <div className="flex gap-[2px] sm:gap-1 mt-1.5">
        {pings.map((ping) => (
          <div key={ping.seq} className="flex-1 text-center text-[10px] text-muted-foreground font-mono" style={{ minWidth: 0 }}>
            {barCount <= 6 ? `#${ping.seq}` : ping.seq}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PingTestTool() {
  const [host, setHost] = useState("");
  const [count, setCount] = useState<number>(4);
  const [port, setPort] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [result, setResult] = useState<PingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  function buildResultText(r: PingResult) {
    return [
      `Ping Test Report`,
      `================`,
      ``,
      `Host:                ${r.host}`,
      `IP:                  ${r.ip}`,
      ...(r.reverseDns ? [`Reverse DNS:         ${r.reverseDns}`] : []),
      `Port:                ${r.port}`,
      `DNS Resolution:      ${r.dnsTimeMs}ms`,
      `Grade:               ${r.grade}`,
      ``,
      `--- Ping Results ---`,
      ...r.pings.map((p) =>
        p.timeMs !== null
          ? `  ${p.seq}. ${p.timeMs}ms`
          : `  ${p.seq}. FAILED${p.error ? ` (${p.error})` : ""}`
      ),
      ``,
      `--- Statistics ---`,
      `Sent:                ${r.stats.sent}`,
      `Received:            ${r.stats.received}`,
      `Lost:                ${r.stats.lost} (${r.stats.lossPercent}%)`,
      `Min:                 ${r.stats.minMs}ms`,
      `Avg:                 ${r.stats.avgMs}ms`,
      `Max:                 ${r.stats.maxMs}ms`,
      `Jitter:              ${r.stats.jitterMs}ms`,
      `Std Dev:             ${r.stats.stdDevMs}ms`,
      ``,
      `Checked:             ${new Date().toISOString()}`,
      `Source:              https://exit1.dev/tools/ping-test`,
    ].join("\n");
  }

  async function copyResults() {
    if (!result) return;
    const text = buildResultText(result);
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }
    done();
  }

  async function copyShareLink() {
    if (!result) return;
    const shareUrl = `${window.location.origin}/tools/ping-test?host=${encodeURIComponent(result.host)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      fallbackCopy(shareUrl);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function downloadResults() {
    if (!result) return;
    const text = buildResultText(result);
    const blob = new Blob([text], { type: "text/plain" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `ping-${result.host}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }

  function fallbackCopy(text: string) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch {
      /* noop */
    }
    document.body.removeChild(ta);
  }

  const runPing = useCallback(
    async (targetHost: string, pingCount: number = 4, targetPort?: string) => {
      if (!targetHost.trim()) return;

      setLoading(true);
      setResult(null);
      setError(null);
      setHasChecked(true);
      setLoadingStepIndex(0);

      try {
        const payload: Record<string, unknown> = {
          host: targetHost.trim(),
          count: pingCount,
        };
        if (targetPort && parseInt(targetPort) > 0) {
          payload.port = parseInt(targetPort);
        }

        const res = await fetch("/api/ping-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Ping failed");
          return;
        }

        setResult(data);

        // Update URL params for sharing
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("host", targetHost.trim());
        router.replace(newUrl.pathname + newUrl.search, { scroll: false });
      } catch {
        setError("Failed to run ping test. Please try again.");
      } finally {
        setLoading(false);
        setLoadingStepIndex(0);
      }
    },
    [router]
  );

  // Animate loading steps
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < LOADING_STEPS.length) {
        setLoadingStepIndex(i);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const hostParam = searchParams.get("host");
    if (hostParam && !hasChecked) {
      setHost(hostParam);
      runPing(hostParam, count, port);
    }
  }, [searchParams, runPing, hasChecked, count, port]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runPing(host, count, port);
  }

  function handleExampleClick(exampleHost: string) {
    setHost(exampleHost);
    runPing(exampleHost, count, port);
  }

  return (
    <div>
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-1 gap-0">
            {/* Count Selector */}
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              disabled={loading}
              className="px-3 py-3 bg-white/5 border border-white/10 border-r-0 rounded-l-xl text-white text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
              style={{ minWidth: "4.5rem" }}
            >
              {PING_COUNTS.map((c) => (
                <option key={c} value={c} className="bg-black text-white">
                  {c}x
                </option>
              ))}
            </select>
            {/* Host Input */}
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading && host.trim()) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="google.com or 8.8.8.8"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-r-xl sm:rounded-r-none text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-base"
                disabled={loading}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading || !host.trim()}
            className="rounded-xl px-6 py-3 h-auto bg-white text-black hover:bg-white/90 font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                Ping
              </span>
            )}
          </Button>
        </div>
        {/* Port input (optional) */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="Port (auto)"
              className="w-36 pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              disabled={loading}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Default: auto-detect (443/80)
          </span>
        </div>
      </form>

      {/* Example Hosts */}
      {!result && !error && !loading && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Try:</span>
          {EXAMPLE_HOSTS.map((exampleHost) => (
            <button
              key={exampleHost}
              onClick={() => handleExampleClick(exampleHost)}
              className="text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer hover:underline"
            >
              {exampleHost}
            </button>
          ))}
        </div>
      )}

      {/* Loading Progress */}
      {loading && (
        <div className="mt-6 bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="space-y-3">
            {LOADING_STEPS.map((step, i) => {
              const isActive = i === loadingStepIndex;
              const isDone = i < loadingStepIndex;
              const isPending = i > loadingStepIndex;

              return (
                <div
                  key={step.label}
                  className={cn(
                    "flex items-center gap-3 transition-opacity duration-300",
                    isPending && "opacity-30"
                  )}
                >
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isDone
                          ? "text-emerald-400"
                          : isActive
                            ? "text-white"
                            : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </div>
                    {isActive && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {step.detail}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-red-400">Ping Failed</div>
            <div className="text-sm text-red-400/80 mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Status Banner with Grade */}
          {(() => {
            const isFullSuccess = result.stats.lossPercent === 0;
            const isPartial = result.stats.received > 0 && result.stats.lost > 0;
            const isDown = result.stats.received === 0;

            const StatusIcon = isDown ? WifiOff : Wifi;
            const label = isDown ? "UNREACHABLE" : isPartial ? "PARTIAL" : "REACHABLE";
            const gc = gradeColor(result.grade);

            return (
              <div
                className={cn(
                  "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4",
                  isDown
                    ? "bg-red-500/10 border-red-500/20"
                    : isPartial
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : "bg-emerald-500/10 border-emerald-500/20"
                )}
              >
                {/* Grade badge */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 border",
                    gc.bg, gc.border, gc.text
                  )}
                >
                  {result.grade}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusIcon
                      className={cn(
                        "w-5 h-5 shrink-0",
                        isDown
                          ? "text-red-400"
                          : isPartial
                            ? "text-yellow-400"
                            : "text-emerald-400"
                      )}
                    />
                    <span
                      className={cn(
                        "font-semibold",
                        isDown
                          ? "text-red-400"
                          : isPartial
                            ? "text-yellow-400"
                            : "text-emerald-400"
                      )}
                    >
                      {label}
                    </span>
                    {!isDown && (
                      <span className="text-sm text-muted-foreground">
                        avg {result.stats.avgMs}ms
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{result.host}</span>
                    <span className="text-xs">({result.ip}:{result.port})</span>
                    {result.reverseDns && (
                      <span className="text-xs text-muted-foreground/70">{result.reverseDns}</span>
                    )}
                  </div>
                  {/* Quick status pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <StatusPill
                      ok={result.stats.lossPercent === 0}
                      label={`${result.stats.lossPercent}% loss`}
                    />
                    {!isDown && (
                      <>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400">
                          <Zap className="w-3 h-3" />
                          avg {result.stats.avgMs}ms
                        </span>
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                          result.stats.jitterMs <= 5
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : result.stats.jitterMs <= 20
                              ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                              : "bg-red-500/10 border-red-500/20 text-red-400"
                        )}>
                          <BarChart3 className="w-3 h-3" />
                          {result.stats.jitterMs}ms jitter
                        </span>
                      </>
                    )}
                    {result.dnsTimeMs > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-purple-500/10 border-purple-500/20 text-purple-400">
                        DNS {result.dnsTimeMs}ms
                      </span>
                    )}
                    {isFullSuccess && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                        {result.stats.sent}/{result.stats.sent} received
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Latency Chart */}
          {result.pings.length > 1 && (
            <SectionCard
              title="Latency Chart"
              badge={
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded border",
                  ...Object.values(gradeColor(result.grade))
                    ? [gradeColor(result.grade).bg, gradeColor(result.grade).border, gradeColor(result.grade).text].map(c => c)
                    : []
                )}>
                  {result.stats.minMs}ms — {result.stats.maxMs}ms
                </span>
              }
            >
              <LatencyChart pings={result.pings} maxMs={result.stats.maxMs} />
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> &le;50ms</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500" /> &le;100ms</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-500" /> &le;200ms</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-500" /> &le;500ms</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500" /> &gt;500ms</span>
              </div>
            </SectionCard>
          )}

          {/* Ping Results */}
          <SectionCard
            title="Ping Results"
            actions={
              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={copyShareLink}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  aria-label="Copy share link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" />
                      Share
                    </>
                  )}
                </button>
                <button
                  onClick={copyResults}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  aria-label="Copy results"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={downloadResults}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  aria-label="Download report"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            }
          >
            <div className="space-y-2">
              {result.pings.map((ping) => (
                <div
                  key={ping.seq}
                  className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-xs text-muted-foreground font-mono w-6 shrink-0 text-right">
                    #{ping.seq}
                  </span>
                  {ping.timeMs !== null ? (
                    <>
                      {/* Latency bar */}
                      <div className="flex-1 h-6 bg-white/5 rounded-md overflow-hidden relative">
                        <div
                          className={cn(
                            "h-full rounded-md transition-all duration-500",
                            latencyBg(ping.timeMs)
                          )}
                          style={{
                            width: `${Math.min(
                              (ping.timeMs / Math.max(result.stats.maxMs * 1.2, 1)) * 100,
                              100
                            )}%`,
                            minWidth: "8px",
                          }}
                        />
                        <span
                          className={cn(
                            "absolute inset-y-0 left-2 flex items-center text-xs font-mono font-semibold",
                            latencyColor(ping.timeMs)
                          )}
                        >
                          {ping.timeMs}ms
                        </span>
                      </div>
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    </>
                  ) : (
                    <>
                      <div className="flex-1 h-6 bg-red-500/10 rounded-md flex items-center px-2">
                        <span className="text-xs font-mono text-red-400">
                          {ping.error || "Failed"}
                        </span>
                      </div>
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Statistics */}
          <SectionCard
            title="Statistics"
            badge={
              <span
                className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded border",
                  result.stats.lossPercent === 0
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                    : result.stats.lossPercent < 50
                      ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                      : "bg-red-500/20 border-red-500/30 text-red-400"
                )}
              >
                {result.stats.lossPercent}% loss
              </span>
            }
          >
            <div className="divide-y divide-white/5">
              <ResultRow
                icon={Activity}
                label="Packets Sent / Received / Lost"
                value={`${result.stats.sent} / ${result.stats.received} / ${result.stats.lost}`}
                className={result.stats.lost === 0 ? "text-emerald-400" : "text-red-400"}
              />
              {result.stats.received > 0 && (
                <>
                  <ResultRow
                    icon={Zap}
                    label="Min / Avg / Max"
                    value={`${result.stats.minMs}ms / ${result.stats.avgMs}ms / ${result.stats.maxMs}ms`}
                    className={latencyColor(result.stats.avgMs)}
                  />
                  <ResultRow
                    icon={BarChart3}
                    label="Jitter"
                    value={
                      <span>
                        {result.stats.jitterMs}ms
                        <span className="text-xs text-muted-foreground ml-2">
                          {result.stats.jitterMs <= 5
                            ? "(stable)"
                            : result.stats.jitterMs <= 20
                              ? "(moderate)"
                              : "(unstable)"}
                        </span>
                      </span>
                    }
                    className={
                      result.stats.jitterMs <= 5
                        ? "text-emerald-400"
                        : result.stats.jitterMs <= 20
                          ? "text-yellow-400"
                          : "text-red-400"
                    }
                  />
                  <ResultRow
                    icon={ArrowUpDown}
                    label="Standard Deviation"
                    value={
                      <span>
                        {result.stats.stdDevMs}ms
                        <span className="text-xs text-muted-foreground ml-2">
                          {result.stats.stdDevMs <= 5
                            ? "(consistent)"
                            : result.stats.stdDevMs <= 20
                              ? "(variable)"
                              : "(highly variable)"}
                        </span>
                      </span>
                    }
                    className={
                      result.stats.stdDevMs <= 5
                        ? "text-emerald-400"
                        : result.stats.stdDevMs <= 20
                          ? "text-yellow-400"
                          : "text-red-400"
                    }
                  />
                </>
              )}
            </div>
          </SectionCard>

          {/* Grade Breakdown */}
          <SectionCard
            title="Grade Breakdown"
            defaultOpen={false}
            badge={
              <span className={cn(
                "text-xs font-bold px-2 py-0.5 rounded border",
                gradeColor(result.grade).bg,
                gradeColor(result.grade).border,
                gradeColor(result.grade).text
              )}>
                {result.grade}
              </span>
            }
          >
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                The grade is computed from latency, packet loss, and jitter:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Latency</div>
                  <div className={cn("text-lg font-bold font-mono", latencyColor(result.stats.avgMs))}>
                    {result.stats.avgMs}ms
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {result.stats.avgMs <= 30
                      ? "Excellent"
                      : result.stats.avgMs <= 60
                        ? "Very Good"
                        : result.stats.avgMs <= 100
                          ? "Good"
                          : result.stats.avgMs <= 200
                            ? "Acceptable"
                            : result.stats.avgMs <= 500
                              ? "Poor"
                              : "Very Poor"}
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Packet Loss</div>
                  <div className={cn(
                    "text-lg font-bold font-mono",
                    result.stats.lossPercent === 0 ? "text-emerald-400" : result.stats.lossPercent <= 2 ? "text-yellow-400" : "text-red-400"
                  )}>
                    {result.stats.lossPercent}%
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {result.stats.lossPercent === 0
                      ? "No loss"
                      : result.stats.lossPercent <= 2
                        ? "Marginal"
                        : "Problematic"}
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Jitter</div>
                  <div className={cn(
                    "text-lg font-bold font-mono",
                    result.stats.jitterMs <= 5 ? "text-emerald-400" : result.stats.jitterMs <= 20 ? "text-yellow-400" : "text-red-400"
                  )}>
                    {result.stats.jitterMs}ms
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {result.stats.jitterMs <= 5
                      ? "Stable"
                      : result.stats.jitterMs <= 20
                        ? "Moderate"
                        : "Unstable"}
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Host Info */}
          <SectionCard title="Host Info" defaultOpen={false}>
            <div className="divide-y divide-white/5">
              <ResultRow
                icon={Globe}
                label="Hostname"
                value={result.host}
                className="text-primary"
              />
              <ResultRow
                icon={Network}
                label="Resolved IP"
                value={result.ip}
                className="text-muted-foreground"
              />
              {result.reverseDns && (
                <ResultRow
                  icon={Server}
                  label="Reverse DNS (PTR)"
                  value={result.reverseDns}
                  className="text-muted-foreground"
                />
              )}
              <ResultRow
                icon={Hash}
                label="Port"
                value={`${result.port} (TCP)`}
                className="text-muted-foreground"
              />
              <ResultRow
                icon={Clock}
                label="DNS Resolution Time"
                value={result.dnsTimeMs > 0 ? `${result.dnsTimeMs}ms` : "N/A (direct IP)"}
                className={
                  result.dnsTimeMs === 0
                    ? "text-muted-foreground"
                    : result.dnsTimeMs <= 50
                      ? "text-emerald-400"
                      : result.dnsTimeMs <= 200
                        ? "text-yellow-400"
                        : "text-red-400"
                }
              />
              <ResultRow
                icon={Award}
                label="Connection Grade"
                value={
                  <span className={gradeColor(result.grade).text}>
                    {result.grade}
                  </span>
                }
                className={gradeColor(result.grade).text}
              />
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
