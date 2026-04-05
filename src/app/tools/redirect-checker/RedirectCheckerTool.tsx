"use client";

import { useState, useEffect, useCallback, FormEvent, useRef } from "react";
import {
  Globe,
  Loader2,
  Search,
  Copy,
  Check,
  Download,
  ChevronDown,
  Link2,
  ArrowRight,
  Clock,
  Server,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

interface RedirectHop {
  url: string;
  statusCode: number;
  statusText: string;
  location: string | null;
  responseTimeMs: number;
  server?: string;
  headers: Record<string, string>;
}

interface RedirectCheckResult {
  inputUrl: string;
  finalUrl: string;
  totalHops: number;
  totalTimeMs: number;
  isRedirect: boolean;
  finalStatusCode: number;
  finalStatusText: string;
  chain: RedirectHop[];
  error?: string;
}

const LOADING_STEPS = [
  "Resolving hostname...",
  "Sending request...",
  "Following redirects...",
  "Analyzing chain...",
  "Building report...",
];

function statusCodeBg(code: number): string {
  if (code >= 200 && code < 300) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  if (code >= 300 && code < 400) return "bg-blue-500/10 border-blue-500/20 text-blue-400";
  if (code >= 400 && code < 500) return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
  return "bg-red-500/10 border-red-500/20 text-red-400";
}

function redirectTypeLabel(code: number): string {
  switch (code) {
    case 301:
      return "Permanent Redirect";
    case 302:
      return "Temporary Redirect (Found)";
    case 303:
      return "See Other";
    case 307:
      return "Temporary Redirect";
    case 308:
      return "Permanent Redirect";
    default:
      return `HTTP ${code}`;
  }
}

function SectionCard({
  title,
  children,
  actions,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 pb-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <div className="flex items-center gap-3">
          {open && actions}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </div>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

export default function RedirectCheckerTool() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<RedirectCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const hasAutoChecked = useRef(false);

  const runCheck = useCallback(
    async (targetUrl: string) => {
      if (!targetUrl.trim()) return;

      setLoading(true);
      setResult(null);
      setError(null);
      setLoadingStep(0);

      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < LOADING_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 600);

      try {
        const res = await fetch("/api/redirect-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl.trim() }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Check failed");
          return;
        }

        setResult(data);

        const newUrl = `/tools/redirect-checker?url=${encodeURIComponent(targetUrl.trim())}`;
        router.replace(newUrl, { scroll: false });
      } catch {
        setError("Failed to check redirects. Please try again.");
      } finally {
        clearInterval(stepInterval);
        setLoading(false);
      }
    },
    [router]
  );

  // Auto-check from URL param
  useEffect(() => {
    const paramUrl = searchParams.get("url");
    if (paramUrl && !hasAutoChecked.current) {
      hasAutoChecked.current = true;
      setUrl(paramUrl);
      runCheck(paramUrl);
    }
  }, [searchParams, runCheck]);

  function buildResultText(r: RedirectCheckResult): string {
    const lines: (string | false)[] = [
      `Redirect Check Report`,
      `=====================`,
      ``,
      `Input URL:           ${r.inputUrl}`,
      `Final URL:           ${r.finalUrl}`,
      `Total Hops:          ${r.totalHops}`,
      `Total Time:          ${r.totalTimeMs}ms`,
      `Final Status:        ${r.finalStatusCode} ${r.finalStatusText}`,
      `Is Redirect:         ${r.isRedirect ? "Yes" : "No"}`,
      ``,
      `--- Redirect Chain ---`,
    ];

    r.chain.forEach((hop, i) => {
      lines.push(`  Step ${i + 1}: ${hop.statusCode} ${hop.statusText}`);
      lines.push(`    URL:      ${hop.url}`);
      if (hop.location) lines.push(`    Location: ${hop.location}`);
      if (hop.server) lines.push(`    Server:   ${hop.server}`);
      lines.push(`    Time:     ${hop.responseTimeMs}ms`);
      lines.push(``);
    });

    if (r.error) {
      lines.push(`Error:               ${r.error}`);
      lines.push(``);
    }

    lines.push(`Checked:             ${new Date().toISOString()}`);
    lines.push(`Source:              https://exit1.dev/tools/redirect-checker`);

    return lines.filter((l) => l !== false).join("\n");
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
    const shareUrl = `${window.location.origin}/tools/redirect-checker?url=${encodeURIComponent(result.inputUrl)}`;
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
    a.download = `redirect-report-${new URL(result.inputUrl).hostname}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runCheck(url);
  }

  return (
    <div>
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading && url.trim()) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="https://example.com"
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-base"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-xl px-6 py-3 h-auto bg-white text-black hover:bg-white/90 font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              Check Redirects
            </span>
          )}
        </Button>
      </form>

      {/* Loading Progress */}
      {loading && (
        <div className="mt-6 p-4 bg-white/[0.02] border border-white/10 rounded-xl">
          <div className="space-y-2">
            {LOADING_STEPS.map((step, i) => (
              <div
                key={step}
                className={cn(
                  "flex items-center gap-2.5 text-sm transition-all duration-300",
                  i < loadingStep
                    ? "text-emerald-400"
                    : i === loadingStep
                      ? "text-white"
                      : "text-muted-foreground/40"
                )}
              >
                {i < loadingStep ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : i === loadingStep ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 shrink-0" />
                )}
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-red-400">Check Failed</div>
            <div className="text-sm text-red-400/80 mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Summary Banner */}
          <div
            className={cn(
              "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4",
              result.error
                ? "bg-red-500/10 border-red-500/20"
                : result.isRedirect
                  ? "bg-blue-500/10 border-blue-500/20"
                  : "bg-emerald-500/10 border-emerald-500/20"
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border",
                result.error
                  ? "bg-red-500/20 border-red-500/30"
                  : result.isRedirect
                    ? "bg-blue-500/20 border-blue-500/30"
                    : "bg-emerald-500/20 border-emerald-500/30"
              )}
            >
              {result.error ? (
                <XCircle className="w-7 h-7 text-red-400" />
              ) : result.isRedirect ? (
                <ArrowRight className="w-7 h-7 text-blue-400" />
              ) : (
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-semibold",
                    result.error
                      ? "text-red-400"
                      : result.isRedirect
                        ? "text-blue-400"
                        : "text-emerald-400"
                  )}
                >
                  {result.error
                    ? "Error During Check"
                    : result.isRedirect
                      ? `${result.totalHops} Redirect${result.totalHops !== 1 ? "s" : ""} Detected`
                      : "No Redirects"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1 break-all">
                {result.inputUrl}
                {result.isRedirect && (
                  <>
                    <ArrowRight className="w-3 h-3 inline mx-1.5 text-muted-foreground/60" />
                    {result.finalUrl}
                  </>
                )}
              </div>
              {/* Quick stats */}
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-white/5 border-white/10 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {result.totalTimeMs}ms
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-white/5 border-white/10 text-muted-foreground">
                  <ArrowRight className="w-3 h-3" />
                  {result.totalHops} hop{result.totalHops !== 1 ? "s" : ""}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                    statusCodeBg(result.finalStatusCode)
                  )}
                >
                  {result.finalStatusCode} {result.finalStatusText}
                </span>
              </div>
            </div>
          </div>

          {/* Redirect Chain */}
          <SectionCard title={`Redirect Chain (${result.chain.length} step${result.chain.length !== 1 ? "s" : ""})`}>
            <div className="space-y-0">
              {result.chain.map((hop, i) => {
                const isFinal = i === result.chain.length - 1;
                return (
                  <div key={i} className="relative">
                    {i > 0 && (
                      <div className="flex items-center justify-center py-1">
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 rotate-90" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "p-4 rounded-lg border",
                        isFinal
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-white/[0.02] border-white/10"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                            isFinal
                              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                              : "bg-white/10 border-white/20 text-muted-foreground"
                          )}
                        >
                          {i + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={cn(
                                "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border",
                                statusCodeBg(hop.statusCode)
                              )}
                            >
                              {hop.statusCode} {hop.statusText}
                            </span>
                            {hop.statusCode >= 300 && hop.statusCode < 400 && (
                              <span className="text-xs text-muted-foreground">
                                {redirectTypeLabel(hop.statusCode)}
                              </span>
                            )}
                            {isFinal && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Final Destination
                              </span>
                            )}
                          </div>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-start gap-2 text-sm">
                              <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground/60" />
                              <span className="break-all text-white/80">{hop.url}</span>
                            </div>
                            {hop.location && (
                              <div className="flex items-start gap-2 text-sm">
                                <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-400/60" />
                                <span className="break-all text-blue-400/80">
                                  {hop.location}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                            {hop.server && (
                              <span className="inline-flex items-center gap-1">
                                <Server className="w-3 h-3" />
                                {hop.server}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {hop.responseTimeMs}ms
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Response Headers */}
          <SectionCard title="Response Headers" defaultOpen={false}>
            <div className="space-y-4">
              {result.chain.map((hop, i) => (
                <div key={i}>
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Step {i + 1} — {hop.statusCode} {hop.statusText}
                  </div>
                  <div className="bg-black/20 rounded-lg border border-white/5 p-3 overflow-x-auto max-h-48 overflow-y-auto">
                    <pre className="text-xs font-mono text-white/70 whitespace-pre-wrap break-all">
                      {Object.entries(hop.headers)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join("\n")}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Error details */}
          {result.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-red-400">Error</div>
                <div className="text-sm text-red-400/80 mt-1">{result.error}</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <SectionCard
            title="Actions"
            defaultOpen={true}
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
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={copyShareLink}
                variant="outline"
                className="rounded-lg border-white/10 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
              >
                {copiedLink ? (
                  <Check className="w-4 h-4 mr-2 text-emerald-400" />
                ) : (
                  <Link2 className="w-4 h-4 mr-2" />
                )}
                {copiedLink ? "Link Copied!" : "Copy Share Link"}
              </Button>
              <Button
                onClick={copyResults}
                variant="outline"
                className="rounded-lg border-white/10 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy Results"}
              </Button>
              <Button
                onClick={downloadResults}
                variant="outline"
                className="rounded-lg border-white/10 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download .txt
              </Button>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
