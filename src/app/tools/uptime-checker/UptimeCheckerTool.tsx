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
  Lock,
  Network,
  Zap,
  RefreshCw,
  Eye,
  ChevronDown,
  Link2,
  CheckCircle,
  XCircle,
  FileText,
  ArrowRight,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types (mirror API response)                                        */
/* ------------------------------------------------------------------ */

interface CategoryGrade {
  grade: string;
  score: number;
  reasons: string[];
}

interface UptimeCheckResult {
  url: string;
  checkedAt: string;
  overallGrade: string;
  overallScore: number;
  isUp: boolean;

  dns: {
    resolved: boolean;
    ip?: string;
    resolutionTimeMs: number;
    hasIPv6?: boolean;
    error?: string;
  };
  dnsGrade: CategoryGrade;

  ssl: {
    valid: boolean;
    issuer?: string;
    subject?: string;
    protocol?: string;
    cipherSuite?: string;
    keySize?: number;
    expiresAt?: string;
    daysUntilExpiry?: number;
    selfSigned?: boolean;
    error?: string;
  } | null;
  sslGrade: CategoryGrade | null;

  redirects: {
    chain: { url: string; statusCode: number }[];
    finalUrl: string;
    httpToHttps: boolean;
    count: number;
  };
  redirectGrade: CategoryGrade;

  response: {
    statusCode: number;
    statusText: string;
    responseTimeMs: number;
    ttfbMs: number;
    serverHeader?: string;
    poweredBy?: string;
    contentType?: string;
    isUp: boolean;
    error?: string;
  };
  responseGrade: CategoryGrade;

  performance: {
    totalTimeMs: number;
    contentSize?: number;
    contentEncoding?: string;
    compressed: boolean;
    httpVersion?: string;
  };
  performanceGrade: CategoryGrade;

  securityHeaders: {
    strictTransportSecurity?: string;
    contentSecurityPolicy?: string;
    xFrameOptions?: string;
    xContentTypeOptions?: string;
    referrerPolicy?: string;
    permissionsPolicy?: string;
  };
  securityGrade: CategoryGrade;

  content: {
    hasTitle: boolean;
    title?: string;
    hasMetaDescription: boolean;
    metaDescription?: string;
    hasFavicon: boolean;
    contentLength: number;
    isErrorPage: boolean;
  };
  contentGrade: CategoryGrade;

  error?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const EXAMPLE_URLS = [
  "https://google.com",
  "https://github.com",
  "https://stripe.com",
];

const LOADING_STEPS = [
  "Resolving DNS...",
  "Checking SSL certificate...",
  "Following redirects...",
  "Analyzing response...",
  "Checking security headers...",
  "Analyzing page content...",
  "Computing health grades...",
];

/* ------------------------------------------------------------------ */
/*  Shared UI components                                               */
/* ------------------------------------------------------------------ */

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

function GradeBadge({ grade }: { grade: string }) {
  return (
    <span
      className={cn(
        "text-xs font-bold px-2 py-0.5 rounded border",
        grade.startsWith("A")
          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
          : grade === "B"
            ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
            : grade === "C"
              ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
              : "bg-red-500/20 border-red-500/30 text-red-400"
      )}
    >
      {grade}
    </span>
  );
}

function GradeReasons({ reasons }: { reasons: string[] }) {
  return (
    <ul className="space-y-1.5">
      {reasons.map((reason, i) => {
        const isBad = reason.startsWith("Missing") || reason.startsWith("No ") || reason.startsWith("Not ") || reason.includes("EXPIRED") || reason.includes("NOT trusted") || reason.includes("error") || reason.includes("slow") || reason.includes("very slow") || reason.includes("weak") || reason.includes("outdated") || reason.includes("heavy") || reason.includes("excessive") || reason.includes("bad for") || reason.includes("issues") || reason.includes("failed") || reason.includes("unreachable");
        return (
          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className={cn("mt-0.5", isBad ? "text-red-400" : "text-emerald-400")}>
              {isBad ? "!" : "+"}
            </span>
            {reason}
          </li>
        );
      })}
    </ul>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function UptimeCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<UptimeCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  function buildResultText(r: UptimeCheckResult) {
    const lines: (string | false)[] = [
      `Website Health Report`,
      `=====================`,
      ``,
      `URL:                 ${r.url}`,
      `Status:              ${r.isUp ? "UP" : "DOWN"}`,
      `Overall Grade:       ${r.overallGrade} (${r.overallScore}/100)`,
      `Checked:             ${r.checkedAt}`,
      ``,
      `--- DNS (${r.dnsGrade.grade}) ---`,
      ...r.dnsGrade.reasons.map((s) => `  ${s}`),
      ``,
      r.sslGrade !== null && `--- SSL/TLS (${r.sslGrade.grade}) ---`,
      ...(r.sslGrade?.reasons.map((s) => `  ${s}`) || []),
      r.sslGrade !== null && ``,
      `--- Redirects (${r.redirectGrade.grade}) ---`,
      ...r.redirectGrade.reasons.map((s) => `  ${s}`),
      ``,
      `--- Response (${r.responseGrade.grade}) ---`,
      ...r.responseGrade.reasons.map((s) => `  ${s}`),
      ``,
      `--- Performance (${r.performanceGrade.grade}) ---`,
      ...r.performanceGrade.reasons.map((s) => `  ${s}`),
      ``,
      `--- Security Headers (${r.securityGrade.grade}) ---`,
      ...r.securityGrade.reasons.map((s) => `  ${s}`),
      ``,
      `--- Content (${r.contentGrade.grade}) ---`,
      ...r.contentGrade.reasons.map((s) => `  ${s}`),
      ``,
      `Source:              https://exit1.dev/tools/uptime-checker`,
    ];
    return lines.filter((l) => l !== false).join("\n");
  }

  function fallbackCopy(text: string) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch { /* noop */ }
    document.body.removeChild(ta);
  }

  async function copyResults() {
    if (!result) return;
    const text = buildResultText(result);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyShareLink() {
    if (!result) return;
    const shareUrl = `${window.location.origin}/tools/uptime-checker?url=${encodeURIComponent(result.url)}`;
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
      a.download = `uptime-report-${hostname}.txt`;
    } catch {
      a.download = "uptime-report.txt";
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }

  const checkUrl = useCallback(
    async (targetUrl: string) => {
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
      }, 800);

      try {
        const res = await fetch("/api/uptime-check", {
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

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("url", targetUrl.trim());
        router.replace(newUrl.pathname + newUrl.search, { scroll: false });
      } catch {
        setError("Failed to check website. Please try again.");
      } finally {
        clearInterval(stepInterval);
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && !hasChecked) {
      setUrl(urlParam);
      checkUrl(urlParam);
    }
  }, [searchParams, checkUrl, hasChecked]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    checkUrl(url);
  }

  function handleExampleClick(exampleUrl: string) {
    setUrl(exampleUrl);
    checkUrl(exampleUrl);
  }

  /* Grade color for the big overall display */
  function gradeColor(grade: string) {
    if (grade.startsWith("A")) return "emerald";
    if (grade === "B") return "blue";
    if (grade === "C") return "yellow";
    return "red";
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
            placeholder="example.com"
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-r-none text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-base"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-xl sm:rounded-l-none px-6 py-3 h-auto bg-white text-black hover:bg-white/90 font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              Check Health
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
          {/* Overall Status Banner */}
          {(() => {
            const color = gradeColor(result.overallGrade);
            return (
              <div
                className={cn(
                  "p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4",
                  result.isUp
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-red-500/10 border-red-500/20"
                )}
              >
                {/* Overall grade circle */}
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border",
                    `bg-${color}-500/20 border-${color}-500/30 text-${color}-400`
                  )}
                  style={{
                    backgroundColor: color === "emerald" ? "rgba(16,185,129,0.2)" : color === "blue" ? "rgba(59,130,246,0.2)" : color === "yellow" ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)",
                    borderColor: color === "emerald" ? "rgba(16,185,129,0.3)" : color === "blue" ? "rgba(59,130,246,0.3)" : color === "yellow" ? "rgba(234,179,8,0.3)" : "rgba(239,68,68,0.3)",
                    color: color === "emerald" ? "rgb(52,211,153)" : color === "blue" ? "rgb(96,165,250)" : color === "yellow" ? "rgb(250,204,21)" : "rgb(248,113,113)",
                  }}
                >
                  <span className="text-xl font-bold leading-none">{result.overallGrade}</span>
                  <span className="text-[10px] opacity-70">{result.overallScore}/100</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {result.isUp ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span
                      className={cn(
                        "font-semibold text-lg",
                        result.isUp ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {result.isUp ? "Website is Up" : "Website is Down"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 break-all">
                    {result.url}
                    {result.redirects.finalUrl !== result.url && (
                      <span className="text-xs ml-2">
                        <ArrowRight className="w-3 h-3 inline" /> {result.redirects.finalUrl}
                      </span>
                    )}
                  </div>
                  {/* Quick status pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <StatusPill ok={result.isUp} label={result.isUp ? "Online" : "Offline"} />
                    {result.ssl && (
                      <StatusPill ok={result.ssl.valid} label={result.ssl.valid ? "SSL Valid" : "SSL Invalid"} />
                    )}
                    <StatusPill
                      ok={result.securityGrade.grade.startsWith("A") || result.securityGrade.grade === "B"}
                      label={`Security: ${result.securityGrade.grade}`}
                    />
                    <StatusPill
                      ok={result.performanceGrade.grade.startsWith("A") || result.performanceGrade.grade === "B"}
                      label={`Performance: ${result.performanceGrade.grade}`}
                    />
                    {result.response.ttfbMs > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-purple-500/10 border-purple-500/20 text-purple-400">
                        <Zap className="w-3 h-3" />
                        {result.response.ttfbMs}ms TTFB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Category Grade Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "DNS", grade: result.dnsGrade },
              ...(result.sslGrade ? [{ label: "SSL/TLS", grade: result.sslGrade }] : []),
              { label: "Redirects", grade: result.redirectGrade },
              { label: "Response", grade: result.responseGrade },
              { label: "Performance", grade: result.performanceGrade },
              { label: "Security", grade: result.securityGrade },
              { label: "Content", grade: result.contentGrade },
            ].map(({ label, grade }) => (
              <div
                key={label}
                className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center"
              >
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{label}</div>
                <div
                  className={cn(
                    "text-2xl font-bold",
                    grade.grade.startsWith("A")
                      ? "text-emerald-400"
                      : grade.grade === "B"
                        ? "text-blue-400"
                        : grade.grade === "C"
                          ? "text-yellow-400"
                          : "text-red-400"
                  )}
                >
                  {grade.grade}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{grade.score}/100</div>
              </div>
            ))}
          </div>

          {/* DNS Section */}
          <SectionCard title="DNS Resolution" badge={<GradeBadge grade={result.dnsGrade.grade} />}>
            <div className="divide-y divide-white/5 mb-4">
              <ResultRow
                icon={Network}
                label="Resolution Status"
                value={result.dns.resolved ? "Resolved" : "Failed"}
                className={result.dns.resolved ? "text-emerald-400" : "text-red-400"}
              />
              {result.dns.ip && (
                <ResultRow icon={Server} label="IP Address" value={result.dns.ip} className="text-primary" />
              )}
              <ResultRow
                icon={Clock}
                label="Resolution Time"
                value={`${result.dns.resolutionTimeMs}ms`}
                className={result.dns.resolutionTimeMs <= 100 ? "text-emerald-400" : result.dns.resolutionTimeMs <= 300 ? "text-yellow-400" : "text-red-400"}
              />
              <ResultRow
                icon={Globe}
                label="IPv6 Support"
                value={result.dns.hasIPv6 ? "Yes (AAAA record found)" : "No"}
                className={result.dns.hasIPv6 ? "text-emerald-400" : "text-muted-foreground"}
              />
            </div>
            <GradeReasons reasons={result.dnsGrade.reasons} />
          </SectionCard>

          {/* SSL Section */}
          {result.ssl && result.sslGrade && (
            <SectionCard title="SSL / TLS" badge={<GradeBadge grade={result.sslGrade.grade} />}>
              <div className="divide-y divide-white/5 mb-4">
                <ResultRow
                  icon={result.ssl.valid ? ShieldCheck : ShieldAlert}
                  label="Certificate Status"
                  value={result.ssl.valid ? "Valid & Trusted" : "Invalid or Untrusted"}
                  className={result.ssl.valid ? "text-emerald-400" : "text-red-400"}
                />
                {result.ssl.subject && (
                  <ResultRow icon={Globe} label="Subject" value={result.ssl.subject} className="text-primary" />
                )}
                {result.ssl.issuer && (
                  <ResultRow icon={Shield} label="Issuer" value={result.ssl.issuer} className="text-primary" />
                )}
                {result.ssl.protocol && (
                  <ResultRow
                    icon={Lock}
                    label="Protocol"
                    value={result.ssl.protocol}
                    className={result.ssl.protocol === "TLSv1.3" ? "text-emerald-400" : result.ssl.protocol === "TLSv1.2" ? "text-blue-400" : "text-red-400"}
                  />
                )}
                {result.ssl.cipherSuite && (
                  <ResultRow icon={Lock} label="Cipher Suite" value={result.ssl.cipherSuite} className="text-primary" />
                )}
                {result.ssl.keySize && (
                  <ResultRow
                    icon={Lock}
                    label="Key Size"
                    value={`${result.ssl.keySize}-bit`}
                    className={result.ssl.keySize >= 2048 ? "text-emerald-400" : "text-red-400"}
                  />
                )}
                {result.ssl.daysUntilExpiry !== undefined && (
                  <ResultRow
                    icon={Clock}
                    label="Expires In"
                    value={result.ssl.daysUntilExpiry <= 0 ? "EXPIRED" : `${result.ssl.daysUntilExpiry} days`}
                    className={
                      result.ssl.daysUntilExpiry <= 0
                        ? "text-red-400"
                        : result.ssl.daysUntilExpiry <= 30
                          ? "text-yellow-400"
                          : "text-emerald-400"
                    }
                  />
                )}
                {result.ssl.selfSigned && (
                  <ResultRow icon={AlertTriangle} label="Self-Signed" value="Yes" className="text-yellow-400" />
                )}
              </div>
              <GradeReasons reasons={result.sslGrade.reasons} />
            </SectionCard>
          )}

          {/* Redirects Section */}
          <SectionCard
            title={`Redirects${result.redirects.count > 0 ? ` (${result.redirects.count})` : ""}`}
            badge={<GradeBadge grade={result.redirectGrade.grade} />}
            defaultOpen={result.redirects.count > 0}
          >
            {result.redirects.count > 0 ? (
              <div className="space-y-2 mb-4">
                {result.redirects.chain.map((hop, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      {hop.statusCode}
                    </span>
                    <span className="text-muted-foreground break-all">{hop.url}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    {result.response.statusCode}
                  </span>
                  <span className="text-white break-all font-medium">{result.redirects.finalUrl}</span>
                </div>
              </div>
            ) : null}
            <GradeReasons reasons={result.redirectGrade.reasons} />
          </SectionCard>

          {/* Response Section */}
          <SectionCard
            title="Response"
            badge={<GradeBadge grade={result.responseGrade.grade} />}
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
            <div className="divide-y divide-white/5 mb-4">
              <ResultRow
                icon={Activity}
                label="Status Code"
                value={`${result.response.statusCode} ${result.response.statusText}`}
                className={
                  result.response.statusCode >= 200 && result.response.statusCode < 300
                    ? "text-emerald-400"
                    : result.response.statusCode >= 300 && result.response.statusCode < 400
                      ? "text-blue-400"
                      : "text-red-400"
                }
              />
              <ResultRow
                icon={Zap}
                label="Time to First Byte (TTFB)"
                value={`${result.response.ttfbMs}ms`}
                className={result.response.ttfbMs <= 200 ? "text-emerald-400" : result.response.ttfbMs <= 500 ? "text-yellow-400" : "text-red-400"}
              />
              <ResultRow
                icon={Clock}
                label="Total Response Time"
                value={`${result.response.responseTimeMs}ms`}
                className={result.response.responseTimeMs <= 500 ? "text-emerald-400" : result.response.responseTimeMs <= 1500 ? "text-yellow-400" : "text-red-400"}
              />
              {result.response.serverHeader && (
                <ResultRow icon={Server} label="Server" value={result.response.serverHeader} className="text-primary" />
              )}
              {result.response.poweredBy && (
                <ResultRow icon={Zap} label="X-Powered-By" value={result.response.poweredBy} className="text-muted-foreground" />
              )}
              {result.response.contentType && (
                <ResultRow icon={FileText} label="Content-Type" value={result.response.contentType} className="text-primary" />
              )}
            </div>
            <GradeReasons reasons={result.responseGrade.reasons} />
          </SectionCard>

          {/* Performance Section */}
          <SectionCard title="Performance" badge={<GradeBadge grade={result.performanceGrade.grade} />}>
            <div className="divide-y divide-white/5 mb-4">
              <ResultRow
                icon={Clock}
                label="Total Load Time"
                value={`${result.performance.totalTimeMs}ms`}
                className={result.performance.totalTimeMs <= 1000 ? "text-emerald-400" : result.performance.totalTimeMs <= 3000 ? "text-yellow-400" : "text-red-400"}
              />
              {result.performance.contentSize !== undefined && (
                <ResultRow
                  icon={FileText}
                  label="Content Size"
                  value={formatBytes(result.performance.contentSize)}
                  className="text-primary"
                />
              )}
              <ResultRow
                icon={result.performance.compressed ? CheckCircle : XCircle}
                label="Compression"
                value={result.performance.compressed ? `Enabled (${result.performance.contentEncoding})` : "Not detected"}
                className={result.performance.compressed ? "text-emerald-400" : "text-yellow-400"}
              />
            </div>
            <GradeReasons reasons={result.performanceGrade.reasons} />
          </SectionCard>

          {/* Security Headers Section */}
          <SectionCard title="Security Headers" badge={<GradeBadge grade={result.securityGrade.grade} />}>
            <div className="divide-y divide-white/5 mb-4">
              {[
                { label: "Strict-Transport-Security (HSTS)", value: result.securityHeaders.strictTransportSecurity },
                { label: "Content-Security-Policy", value: result.securityHeaders.contentSecurityPolicy },
                { label: "X-Frame-Options", value: result.securityHeaders.xFrameOptions },
                { label: "X-Content-Type-Options", value: result.securityHeaders.xContentTypeOptions },
                { label: "Referrer-Policy", value: result.securityHeaders.referrerPolicy },
                { label: "Permissions-Policy", value: result.securityHeaders.permissionsPolicy },
              ].map(({ label, value }) => (
                <ResultRow
                  key={label}
                  icon={value ? ShieldCheck : Eye}
                  label={label}
                  value={value || "Not set"}
                  className={value ? "text-emerald-400" : "text-red-400"}
                />
              ))}
            </div>
            <GradeReasons reasons={result.securityGrade.reasons} />
          </SectionCard>

          {/* Content Section */}
          <SectionCard title="Content Health" badge={<GradeBadge grade={result.contentGrade.grade} />}>
            <div className="divide-y divide-white/5 mb-4">
              <ResultRow
                icon={result.content.isErrorPage ? AlertTriangle : CheckCircle}
                label="Page Type"
                value={result.content.isErrorPage ? "Error page detected" : "Valid page"}
                className={result.content.isErrorPage ? "text-red-400" : "text-emerald-400"}
              />
              <ResultRow
                icon={result.content.hasTitle ? CheckCircle : XCircle}
                label="Title Tag"
                value={result.content.hasTitle ? result.content.title! : "Missing"}
                className={result.content.hasTitle ? "text-emerald-400" : "text-red-400"}
              />
              <ResultRow
                icon={result.content.hasMetaDescription ? CheckCircle : XCircle}
                label="Meta Description"
                value={
                  result.content.hasMetaDescription
                    ? result.content.metaDescription!.length > 120
                      ? result.content.metaDescription!.slice(0, 120) + "..."
                      : result.content.metaDescription!
                    : "Missing"
                }
                className={result.content.hasMetaDescription ? "text-emerald-400" : "text-red-400"}
              />
              <ResultRow
                icon={result.content.hasFavicon ? CheckCircle : XCircle}
                label="Favicon"
                value={result.content.hasFavicon ? "Detected" : "Not found"}
                className={result.content.hasFavicon ? "text-emerald-400" : "text-yellow-400"}
              />
              <ResultRow
                icon={FileText}
                label="Content Length"
                value={formatBytes(result.content.contentLength)}
                className="text-primary"
              />
            </div>
            <GradeReasons reasons={result.contentGrade.reasons} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
