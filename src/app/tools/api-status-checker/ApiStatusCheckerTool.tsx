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
  Shield,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Server,
  ArrowRight,
  Lock,
  FileKey,
  Network,
  Zap,
  RefreshCw,
  Eye,
  Archive,
  ChevronDown,
  Link2,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CorsInfo {
  allowOrigin?: string;
  allowMethods?: string;
  allowHeaders?: string;
  allowCredentials?: string;
  exposeHeaders?: string;
  maxAge?: string;
}

interface SecurityHeaders {
  strictTransportSecurity?: string;
  contentSecurityPolicy?: string;
  xFrameOptions?: string;
  xContentTypeOptions?: string;
  referrerPolicy?: string;
  permissionsPolicy?: string;
}

interface CachingInfo {
  cacheControl?: string;
  etag?: string;
  lastModified?: string;
  expires?: string;
  age?: string;
  vary?: string;
}

interface TlsInfo {
  protocol?: string;
  cipherSuite?: string;
  keySize?: number;
}

interface ApiStatusResult {
  url: string;
  finalUrl: string;
  status: "up" | "down" | "redirect" | "error";
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  isHttps: boolean;
  method: string;
  contentType?: string;
  contentLength?: number;
  serverHeader?: string;
  poweredBy?: string;
  contentEncoding?: string;
  serverIp?: string;
  cors: CorsInfo | null;
  security: SecurityHeaders;
  securityGrade: string;
  securityReasons: string[];
  caching: CachingInfo | null;
  redirectChain: { url: string; statusCode: number }[];
  tlsInfo?: TlsInfo;
  responseBody?: string;
  responseBodyTruncated?: boolean;
  allHeaders: Record<string, string>;
  error?: string;
}

const EXAMPLE_URLS = [
  "https://api.github.com",
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://httpbin.org/get",
];

const HTTP_METHODS = ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"] as const;

const LOADING_STEPS = [
  "Resolving hostname...",
  "Establishing connection...",
  "Sending request...",
  "Analyzing headers...",
  "Checking TLS configuration...",
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
      <button
        type="button"
        onClick={() => setOpen(!open)}
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
      </button>
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

const METHOD_COLORS: Record<string, string> = {
  GET: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  HEAD: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  POST: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  PUT: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  DELETE: "text-red-400 bg-red-500/10 border-red-500/20",
  PATCH: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  OPTIONS: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

export default function ApiStatusCheckerTool() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<string>("GET");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<ApiStatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  function buildResultText(r: ApiStatusResult) {
    return [
      `API Status Report`,
      `=================`,
      ``,
      `Method:              ${r.method}`,
      `Status:              ${r.status.toUpperCase()} (${r.statusCode} ${r.statusText})`,
      `URL:                 ${r.url}`,
      r.finalUrl !== r.url && `Final URL:           ${r.finalUrl}`,
      `Response Time:       ${r.responseTimeMs}ms`,
      `HTTPS:               ${r.isHttps ? "Yes" : "No"}`,
      r.tlsInfo?.protocol && `TLS Protocol:        ${r.tlsInfo.protocol}`,
      r.tlsInfo?.cipherSuite && `Cipher Suite:        ${r.tlsInfo.cipherSuite}`,
      r.contentType && `Content-Type:        ${r.contentType}`,
      r.contentLength != null && `Content-Length:       ${formatBytes(r.contentLength)}`,
      r.serverHeader && `Server:              ${r.serverHeader}`,
      r.poweredBy && `X-Powered-By:        ${r.poweredBy}`,
      r.contentEncoding && `Content-Encoding:    ${r.contentEncoding}`,
      r.serverIp && `Server IP:           ${r.serverIp}`,
      ``,
      `Security Grade:      ${r.securityGrade}`,
      `Security Breakdown:`,
      ...r.securityReasons.map((reason) => `  - ${reason}`),
      ``,
      r.cors && `CORS:`,
      r.cors?.allowOrigin && `  Allow-Origin:      ${r.cors.allowOrigin}`,
      r.cors?.allowMethods && `  Allow-Methods:     ${r.cors.allowMethods}`,
      r.cors?.allowHeaders && `  Allow-Headers:     ${r.cors.allowHeaders}`,
      r.cors?.allowCredentials && `  Credentials:       ${r.cors.allowCredentials}`,
      ``,
      r.caching && `Caching:`,
      r.caching?.cacheControl && `  Cache-Control:     ${r.caching.cacheControl}`,
      r.caching?.etag && `  ETag:              ${r.caching.etag}`,
      r.caching?.lastModified && `  Last-Modified:     ${r.caching.lastModified}`,
      r.caching?.expires && `  Expires:           ${r.caching.expires}`,
      r.caching?.vary && `  Vary:              ${r.caching.vary}`,
      ``,
      r.redirectChain.length > 0 && `Redirect Chain:`,
      ...r.redirectChain.map(
        (hop, i) => `  ${i + 1}. [${hop.statusCode}] ${hop.url}`
      ),
      r.redirectChain.length > 0 && `  -> ${r.finalUrl}`,
      ``,
      Object.keys(r.allHeaders).length > 0 && `All Response Headers:`,
      ...Object.entries(r.allHeaders).map(([key, value]) => `  ${key}: ${value}`),
      ``,
      r.error && `Error:               ${r.error}`,
      ``,
      `Checked:             ${new Date().toISOString()}`,
      `Source:              https://exit1.dev/tools/api-status-checker`,
    ]
      .filter(Boolean)
      .join("\n");
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
    const shareUrl = `${window.location.origin}/tools/api-status-checker?url=${encodeURIComponent(result.url)}${result.method !== "GET" ? `&method=${result.method}` : ""}`;
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
    try {
      const hostname = new URL(result.url).hostname;
      a.download = `api-status-${hostname}.txt`;
    } catch {
      a.download = "api-status-report.txt";
    }
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

  const checkUrl = useCallback(
    async (targetUrl: string, targetMethod: string = "GET") => {
      if (!targetUrl.trim()) return;

      setLoading(true);
      setResult(null);
      setError(null);
      setHasChecked(true);
      setLoadingStep(0);

      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < LOADING_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 700);

      try {
        const res = await fetch("/api/api-status-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl.trim(), method: targetMethod }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Check failed");
          return;
        }

        setResult(data);

        // Update URL params for sharing
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("url", targetUrl.trim());
        if (targetMethod !== "GET") {
          newUrl.searchParams.set("method", targetMethod);
        } else {
          newUrl.searchParams.delete("method");
        }
        router.replace(newUrl.pathname + newUrl.search, { scroll: false });
      } catch {
        setError("Failed to check API status. Please try again.");
      } finally {
        clearInterval(stepInterval);
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const urlParam = searchParams.get("url");
    const methodParam = searchParams.get("method");
    if (urlParam && !hasChecked) {
      setUrl(urlParam);
      if (methodParam && HTTP_METHODS.includes(methodParam as typeof HTTP_METHODS[number])) {
        setMethod(methodParam);
      }
      checkUrl(urlParam, methodParam || "GET");
    }
  }, [searchParams, checkUrl, hasChecked]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    checkUrl(url, method);
  }

  function handleExampleClick(exampleUrl: string) {
    setUrl(exampleUrl);
    checkUrl(exampleUrl, method);
  }

  const statusConfig = {
    up: { label: "UP", icon: ShieldCheck },
    redirect: { label: "REDIRECT", icon: RefreshCw },
    down: { label: "DOWN", icon: ShieldAlert },
    error: { label: "ERROR", icon: ShieldAlert },
  };

  return (
    <div>
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 gap-0">
          {/* Method Selector */}
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            disabled={loading}
            className="px-3 py-3 bg-white/5 border border-white/10 border-r-0 rounded-l-xl text-white text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
            style={{ minWidth: "5.5rem" }}
          >
            {HTTP_METHODS.map((m) => (
              <option key={m} value={m} className="bg-black text-white">
                {m}
              </option>
            ))}
          </select>
          {/* URL Input */}
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
              placeholder="https://api.example.com/endpoint"
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-r-xl sm:rounded-r-none text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-base"
              disabled={loading}
            />
          </div>
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
              Check Status
            </span>
          )}
        </Button>
      </form>

      {/* Example URLs */}
      {!result && !error && !loading && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Try:</span>
          {EXAMPLE_URLS.map((exampleUrl) => (
            <button
              key={exampleUrl}
              onClick={() => handleExampleClick(exampleUrl)}
              className="text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer hover:underline"
            >
              {exampleUrl.replace("https://", "")}
            </button>
          ))}
        </div>
      )}

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
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-red-400">Check Failed</div>
            <div className="text-sm text-red-400/80 mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Status Banner */}
          {(() => {
            const config = statusConfig[result.status];
            const StatusIcon = config.icon;
            const isGood = result.status === "up" || result.status === "redirect";
            return (
              <div
                className={cn(
                  "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4",
                  isGood
                    ? result.status === "redirect"
                      ? "bg-blue-500/10 border-blue-500/20"
                      : "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-red-500/10 border-red-500/20"
                )}
              >
                {/* Status badge */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 border",
                    result.status === "up"
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      : result.status === "redirect"
                        ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                        : "bg-red-500/20 border-red-500/30 text-red-400"
                  )}
                >
                  {result.statusCode || "ERR"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("font-mono text-xs px-1.5 py-0.5 rounded border", METHOD_COLORS[result.method] || "text-white bg-white/10 border-white/20")}>
                      {result.method}
                    </span>
                    <StatusIcon
                      className={cn(
                        "w-5 h-5 shrink-0",
                        isGood
                          ? result.status === "redirect"
                            ? "text-blue-400"
                            : "text-emerald-400"
                          : "text-red-400"
                      )}
                    />
                    <span
                      className={cn(
                        "font-semibold",
                        isGood
                          ? result.status === "redirect"
                            ? "text-blue-400"
                            : "text-emerald-400"
                          : "text-red-400"
                      )}
                    >
                      {config.label}
                      {result.statusText ? ` — ${result.statusText}` : ""}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="break-all">{result.finalUrl}</span>
                    <span className="flex items-center gap-1 text-xs">
                      <Zap className="w-3 h-3" />
                      {result.responseTimeMs}ms
                    </span>
                  </div>
                  {/* Quick status pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <StatusPill ok={result.isHttps} label="HTTPS" />
                    <StatusPill
                      ok={result.securityGrade.startsWith("A") || result.securityGrade === "B"}
                      label={`Security: ${result.securityGrade}`}
                    />
                    {result.cors && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400">
                        CORS
                      </span>
                    )}
                    {result.redirectChain.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
                        {result.redirectChain.length} redirect{result.redirectChain.length > 1 ? "s" : ""}
                      </span>
                    )}
                    {result.tlsInfo?.protocol && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-purple-500/10 border-purple-500/20 text-purple-400">
                        {result.tlsInfo.protocol}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Security Grade */}
          <SectionCard
            title="Security Headers"
            badge={
              <span
                className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded border",
                  result.securityGrade.startsWith("A")
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                    : result.securityGrade === "B"
                      ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                      : result.securityGrade === "C"
                        ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                        : "bg-red-500/20 border-red-500/30 text-red-400"
                )}
              >
                {result.securityGrade}
              </span>
            }
          >
            <ul className="space-y-1.5">
              {result.securityReasons.map((reason, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className={cn(
                    "mt-0.5",
                    reason.startsWith("Missing") || reason.startsWith("Not using")
                      ? "text-red-400"
                      : "text-emerald-400"
                  )}>
                    {reason.startsWith("Missing") || reason.startsWith("Not using")
                      ? "!"
                      : "+"}
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Response Details */}
          <SectionCard
            title="Response Details"
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
            <div className="divide-y divide-white/5">
              <ResultRow
                icon={Zap}
                label="Response Time"
                value={`${result.responseTimeMs}ms`}
                className={cn(
                  result.responseTimeMs <= 200
                    ? "text-emerald-400"
                    : result.responseTimeMs <= 1000
                      ? "text-yellow-400"
                      : "text-red-400"
                )}
              />
              <ResultRow
                icon={Globe}
                label="Status Code"
                value={`${result.statusCode} ${result.statusText}`}
                className={cn(
                  result.statusCode >= 200 && result.statusCode < 300
                    ? "text-emerald-400"
                    : result.statusCode >= 300 && result.statusCode < 400
                      ? "text-blue-400"
                      : "text-red-400"
                )}
              />
              <ResultRow
                icon={Lock}
                label="HTTPS"
                value={result.isHttps ? "Yes" : "No"}
                className={result.isHttps ? "text-emerald-400" : "text-red-400"}
              />
              {result.tlsInfo?.protocol && (
                <ResultRow
                  icon={Lock}
                  label="TLS Protocol"
                  value={result.tlsInfo.protocol}
                  className={
                    result.tlsInfo.protocol === "TLSv1.3"
                      ? "text-emerald-400"
                      : result.tlsInfo.protocol === "TLSv1.2"
                        ? "text-blue-400"
                        : "text-red-400"
                  }
                />
              )}
              {result.tlsInfo?.cipherSuite && (
                <ResultRow
                  icon={Lock}
                  label="Cipher Suite"
                  value={result.tlsInfo.cipherSuite}
                  className="text-primary"
                />
              )}
              {result.contentType && (
                <ResultRow
                  icon={FileKey}
                  label="Content-Type"
                  value={result.contentType}
                  className="text-primary"
                />
              )}
              {result.contentLength != null && (
                <ResultRow
                  icon={Archive}
                  label="Content-Length"
                  value={formatBytes(result.contentLength)}
                  className="text-muted-foreground"
                />
              )}
              {result.serverHeader && (
                <ResultRow
                  icon={Server}
                  label="Server"
                  value={result.serverHeader}
                  className="text-primary"
                />
              )}
              {result.poweredBy && (
                <ResultRow
                  icon={Zap}
                  label="X-Powered-By"
                  value={result.poweredBy}
                  className="text-muted-foreground"
                />
              )}
              {result.contentEncoding && (
                <ResultRow
                  icon={Archive}
                  label="Content-Encoding"
                  value={result.contentEncoding}
                  className="text-muted-foreground"
                />
              )}
              {result.serverIp && (
                <ResultRow
                  icon={Network}
                  label="Server IP"
                  value={result.serverIp}
                  className="text-muted-foreground"
                />
              )}
            </div>
          </SectionCard>

          {/* Response Body */}
          {result.responseBody && (
            <SectionCard
              title="Response Body Preview"
              defaultOpen={false}
              badge={
                result.responseBodyTruncated ? (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    Truncated
                  </span>
                ) : undefined
              }
            >
              <div className="relative">
                <pre className="text-xs font-mono text-white/80 bg-black/40 border border-white/5 rounded-lg p-4 overflow-x-auto max-h-80 overflow-y-auto whitespace-pre-wrap break-all">
                  {result.contentType?.includes("json")
                    ? formatJson(result.responseBody)
                    : result.responseBody}
                </pre>
                {result.responseBodyTruncated && (
                  <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" />
                    Response truncated to 2,000 characters
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* CORS */}
          {result.cors && (
            <SectionCard title="CORS Headers">
              <div className="divide-y divide-white/5">
                {result.cors.allowOrigin && (
                  <ResultRow
                    icon={Globe}
                    label="Access-Control-Allow-Origin"
                    value={result.cors.allowOrigin}
                    className={
                      result.cors.allowOrigin === "*"
                        ? "text-yellow-400"
                        : "text-emerald-400"
                    }
                  />
                )}
                {result.cors.allowMethods && (
                  <ResultRow
                    icon={Shield}
                    label="Access-Control-Allow-Methods"
                    value={result.cors.allowMethods}
                    className="text-primary"
                  />
                )}
                {result.cors.allowHeaders && (
                  <ResultRow
                    icon={Shield}
                    label="Access-Control-Allow-Headers"
                    value={result.cors.allowHeaders}
                    className="text-primary"
                  />
                )}
                {result.cors.allowCredentials && (
                  <ResultRow
                    icon={Eye}
                    label="Access-Control-Allow-Credentials"
                    value={result.cors.allowCredentials}
                    className={
                      result.cors.allowCredentials === "true"
                        ? "text-yellow-400"
                        : "text-muted-foreground"
                    }
                  />
                )}
                {result.cors.exposeHeaders && (
                  <ResultRow
                    icon={Eye}
                    label="Access-Control-Expose-Headers"
                    value={result.cors.exposeHeaders}
                    className="text-muted-foreground"
                  />
                )}
                {result.cors.maxAge && (
                  <ResultRow
                    icon={Clock}
                    label="Access-Control-Max-Age"
                    value={`${result.cors.maxAge}s`}
                    className="text-muted-foreground"
                  />
                )}
              </div>
            </SectionCard>
          )}

          {/* Caching */}
          {result.caching && (
            <SectionCard title="Caching Headers">
              <div className="divide-y divide-white/5">
                {result.caching.cacheControl && (
                  <ResultRow
                    icon={Archive}
                    label="Cache-Control"
                    value={result.caching.cacheControl}
                    className="text-primary"
                  />
                )}
                {result.caching.etag && (
                  <ResultRow
                    icon={FileKey}
                    label="ETag"
                    value={result.caching.etag}
                    className="text-muted-foreground"
                  />
                )}
                {result.caching.lastModified && (
                  <ResultRow
                    icon={Clock}
                    label="Last-Modified"
                    value={result.caching.lastModified}
                    className="text-muted-foreground"
                  />
                )}
                {result.caching.expires && (
                  <ResultRow
                    icon={Clock}
                    label="Expires"
                    value={result.caching.expires}
                    className="text-muted-foreground"
                  />
                )}
                {result.caching.age && (
                  <ResultRow
                    icon={Clock}
                    label="Age"
                    value={`${result.caching.age}s`}
                    className="text-muted-foreground"
                  />
                )}
                {result.caching.vary && (
                  <ResultRow
                    icon={Eye}
                    label="Vary"
                    value={result.caching.vary}
                    className="text-muted-foreground"
                  />
                )}
              </div>
            </SectionCard>
          )}

          {/* Redirect Chain */}
          {result.redirectChain.length > 0 && (
            <SectionCard title={`Redirect Chain (${result.redirectChain.length} hop${result.redirectChain.length > 1 ? "s" : ""})`}>
              <div className="space-y-2">
                {result.redirectChain.map((hop, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span
                      className="font-mono text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400"
                    >
                      {hop.statusCode}
                    </span>
                    <span className="text-muted-foreground break-all">
                      {hop.url}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      "font-mono text-xs px-1.5 py-0.5 rounded",
                      result.statusCode >= 200 && result.statusCode < 300
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    )}
                  >
                    {result.statusCode}
                  </span>
                  <span className="text-white break-all font-medium">
                    {result.finalUrl}
                  </span>
                </div>
              </div>
            </SectionCard>
          )}

          {/* All Response Headers */}
          {Object.keys(result.allHeaders).length > 0 && (
            <SectionCard
              title={`All Response Headers (${Object.keys(result.allHeaders).length})`}
              defaultOpen={false}
            >
              <div className="space-y-0">
                {Object.entries(result.allHeaders).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-xs font-mono font-semibold text-primary shrink-0">
                      {key}:
                    </span>
                    <span className="text-xs font-mono text-muted-foreground break-all">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}
    </div>
  );
}
