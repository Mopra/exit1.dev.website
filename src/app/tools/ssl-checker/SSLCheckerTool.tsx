"use client";

import { useState, useEffect, useCallback, FormEvent, useRef } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Globe,
  Lock,
  Fingerprint,
  Loader2,
  Search,
  Copy,
  Check,
  Download,
  KeyRound,
  FileKey,
  Network,
  ChevronDown,
  Link2,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const SSLFlowDiagram = dynamic(() => import("./SSLFlowDiagram"), { ssr: false });

interface ChainCert {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  isSelfSigned: boolean;
}

interface SSLResult {
  hostname: string;
  valid: boolean;
  issuer?: string;
  subject?: string;
  validFrom?: string;
  validTo?: string;
  daysUntilExpiry?: number;
  protocol?: string;
  serialNumber?: string;
  fingerprint?: string;
  keySize?: number;
  signatureAlgorithm?: string;
  altNames?: string[];
  grade?: string;
  gradeReasons?: string[];
  error?: string;
  cipherSuite?: string;
  cipherVersion?: string;
  browserTrusted?: boolean;
  browserTrustedReason?: string;
  chain?: ChainCert[];
  hsts?: boolean;
  hstsMaxAge?: number;
  hstsIncludeSubdomains?: boolean;
  hstsPreload?: boolean;
  certType?: string;
  hostnameMatch?: boolean;
}

const LOADING_STEPS = [
  "Resolving hostname...",
  "Establishing TLS connection...",
  "Retrieving certificate...",
  "Checking HSTS headers...",
  "Analyzing security...",
];

function ResultRow({
  icon: Icon,
  label,
  value,
  className,
  valueClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", className)} />
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={cn("text-sm font-medium break-all", valueClassName)}>{value}</div>
      </div>
    </div>
  );
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

export default function SSLCheckerTool() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<SSLResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const hasAutoChecked = useRef(false);

  const runCheck = useCallback(async (domain: string) => {
    if (!domain.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setLoadingStep(0);

    // Animate through loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    try {
      const res = await fetch("/api/ssl-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: domain.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Check failed");
        return;
      }

      setResult(data);

      // Update URL without reload for shareability
      const newUrl = `/tools/ssl-checker?domain=${encodeURIComponent(domain.trim())}`;
      router.replace(newUrl, { scroll: false });
    } catch {
      setError("Failed to check SSL certificate. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  }, [router]);

  // Auto-check from URL param
  useEffect(() => {
    const domain = searchParams.get("domain");
    if (domain && !hasAutoChecked.current) {
      hasAutoChecked.current = true;
      setUrl(domain);
      runCheck(domain);
    }
  }, [searchParams, runCheck]);

  function buildResultText(r: SSLResult) {
    return [
      `SSL Certificate Report`,
      `======================`,
      ``,
      r.grade && `Grade:               ${r.grade}`,
      `Status:              ${r.valid ? "Valid" : "Invalid"}`,
      `Hostname:            ${r.hostname}`,
      r.browserTrusted != null && `Browser Trusted:     ${r.browserTrusted ? "Yes" : "No"}`,
      r.hostnameMatch != null && `Hostname Match:      ${r.hostnameMatch ? "Yes" : "No"}`,
      r.certType && `Certificate Type:    ${r.certType}`,
      r.subject && `Subject:             ${r.subject}`,
      r.issuer && `Issuer:              ${r.issuer}`,
      r.validFrom && `Valid From:          ${formatDate(r.validFrom)}`,
      r.validTo && `Valid Until:         ${formatDate(r.validTo)}`,
      r.daysUntilExpiry != null && `Days Until Expiry:   ${r.daysUntilExpiry}`,
      ``,
      `--- Security ---`,
      r.protocol && `TLS Protocol:        ${r.protocol}`,
      r.cipherSuite && `Cipher Suite:        ${r.cipherSuite}`,
      r.keySize && `Key Size:            ${r.keySize} bits`,
      r.signatureAlgorithm && `Signature Algorithm: ${r.signatureAlgorithm}`,
      r.hsts != null && `HSTS:                ${r.hsts ? "Enabled" : "Not enabled"}`,
      r.hsts && r.hstsMaxAge && `HSTS Max-Age:        ${r.hstsMaxAge}s`,
      r.hsts && r.hstsIncludeSubdomains && `HSTS Subdomains:     Yes`,
      r.hsts && r.hstsPreload && `HSTS Preload:        Yes`,
      ``,
      `--- Technical ---`,
      r.serialNumber && `Serial Number:       ${r.serialNumber}`,
      r.fingerprint && `Fingerprint (SHA-256):`,
      r.fingerprint && `  ${r.fingerprint}`,
      r.altNames && r.altNames.length > 0 && `Alt Names:           ${r.altNames.join(", ")}`,
      ``,
      r.chain && r.chain.length > 0 && `--- Certificate Chain ---`,
      ...(r.chain || []).map((c, i) => `  ${i + 1}. ${c.subject}${c.isSelfSigned ? " (Root)" : ` → issued by ${c.issuer}`}`),
      ``,
      r.gradeReasons && r.gradeReasons.length > 0 && `--- Grade Breakdown ---`,
      ...(r.gradeReasons || []).map((reason) => `  • ${reason}`),
      r.error && `Error:               ${r.error}`,
      ``,
      `Checked:             ${new Date().toISOString()}`,
      `Source:              https://exit1.dev/tools/ssl-checker`,
    ].filter(Boolean).join("\n");
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
    const shareUrl = `${window.location.origin}/tools/ssl-checker?domain=${encodeURIComponent(result.hostname)}`;
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
    a.download = `ssl-report-${result.hostname}.txt`;
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
    try { document.execCommand("copy"); } catch { /* noop */ }
    document.body.removeChild(ta);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runCheck(url);
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const certTypeLabel: Record<string, string> = {
    DV: "Domain Validated (DV)",
    OV: "Organization Validated (OV)",
    EV: "Extended Validation (EV)",
  };

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
              Check SSL
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
          {/* Grade + Status Banner */}
          <div
            className={cn(
              "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4",
              result.valid
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-red-500/10 border-red-500/20"
            )}
          >
            {result.grade && (
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0 border",
                  result.grade.startsWith("A")
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                    : result.grade === "B"
                      ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                      : result.grade === "C"
                        ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                        : "bg-red-500/20 border-red-500/30 text-red-400"
                )}
              >
                {result.grade}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {result.valid ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span
                  className={cn(
                    "font-semibold",
                    result.valid ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {result.valid ? "SSL Certificate Valid" : "SSL Certificate Invalid"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {result.hostname}
                {result.valid && result.daysUntilExpiry != null && (
                  <>
                    {" — "}
                    {result.daysUntilExpiry <= 30 ? (
                      <span className="text-yellow-400">
                        Expires in {result.daysUntilExpiry} days
                      </span>
                    ) : (
                      <span>Expires in {result.daysUntilExpiry} days</span>
                    )}
                  </>
                )}
                {!result.valid && result.error && <> — {result.error}</>}
              </div>
              {/* Quick status pills */}
              <div className="flex flex-wrap gap-2 mt-3">
                {result.browserTrusted != null && (
                  <StatusPill ok={result.browserTrusted} label="Browser Trusted" />
                )}
                {result.hostnameMatch != null && (
                  <StatusPill ok={result.hostnameMatch} label="Hostname Match" />
                )}
                {result.hsts != null && (
                  <StatusPill ok={result.hsts} label="HSTS" />
                )}
                {result.certType && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400">
                    {result.certType}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Grade Breakdown */}
          {result.gradeReasons && result.gradeReasons.length > 0 && (
            <SectionCard title="Grade Breakdown">
              <ul className="space-y-1.5">
                {result.gradeReasons.map((reason, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* Certificate Info */}
          <SectionCard title="Certificate Information">
            <div className="divide-y divide-white/5">
              {result.subject && (
                <ResultRow
                  icon={Globe}
                  label="Subject"
                  value={result.subject}
                  className="text-primary"
                />
              )}
              {result.issuer && (
                <ResultRow
                  icon={Shield}
                  label="Issuer"
                  value={result.issuer}
                  className="text-primary"
                />
              )}
              {result.certType && (
                <ResultRow
                  icon={FileKey}
                  label="Certificate Type"
                  value={certTypeLabel[result.certType] || result.certType}
                  className="text-blue-400"
                />
              )}
              {result.validFrom && (
                <ResultRow
                  icon={Clock}
                  label="Valid From"
                  value={formatDate(result.validFrom)}
                  className="text-muted-foreground"
                />
              )}
              {result.validTo && (
                <ResultRow
                  icon={Clock}
                  label="Valid Until"
                  value={formatDate(result.validTo)}
                  className={cn(
                    result.daysUntilExpiry != null && result.daysUntilExpiry <= 30
                      ? "text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              )}
              {result.daysUntilExpiry != null && (
                <ResultRow
                  icon={Clock}
                  label="Days Until Expiry"
                  value={`${result.daysUntilExpiry} days`}
                  className={cn(
                    result.daysUntilExpiry <= 7
                      ? "text-red-400"
                      : result.daysUntilExpiry <= 30
                        ? "text-yellow-400"
                        : "text-emerald-400"
                  )}
                />
              )}
              {result.altNames && result.altNames.length > 0 && (
                <div className="py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-start gap-3">
                    <Network className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        Subject Alternative Names ({result.altNames.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {result.altNames.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Security Analysis */}
          <SectionCard title="Security Analysis">
            <div className="divide-y divide-white/5">
              {result.browserTrusted != null && (
                <ResultRow
                  icon={result.browserTrusted ? ShieldCheck : ShieldAlert}
                  label="Browser Trust"
                  value={
                    result.browserTrusted
                      ? "Trusted by all major browsers"
                      : `Not trusted — ${result.browserTrustedReason || "unknown reason"}`
                  }
                  className={result.browserTrusted ? "text-emerald-400" : "text-red-400"}
                />
              )}
              {result.hostnameMatch != null && (
                <ResultRow
                  icon={result.hostnameMatch ? CheckCircle : XCircle}
                  label="Hostname Match"
                  value={
                    result.hostnameMatch
                      ? `Certificate matches ${result.hostname}`
                      : `Certificate does NOT match ${result.hostname}`
                  }
                  className={result.hostnameMatch ? "text-emerald-400" : "text-red-400"}
                />
              )}
              {result.protocol && (
                <ResultRow
                  icon={Lock}
                  label="TLS Protocol"
                  value={result.protocol}
                  className={
                    result.protocol === "TLSv1.3"
                      ? "text-emerald-400"
                      : result.protocol === "TLSv1.2"
                        ? "text-blue-400"
                        : "text-red-400"
                  }
                />
              )}
              {result.cipherSuite && (
                <ResultRow
                  icon={Lock}
                  label="Cipher Suite"
                  value={`${result.cipherSuite}${result.cipherVersion ? ` (${result.cipherVersion})` : ""}`}
                  className="text-primary"
                />
              )}
              {result.keySize && (
                <ResultRow
                  icon={KeyRound}
                  label="Key Size"
                  value={`${result.keySize} bits`}
                  className={cn(
                    result.keySize >= 2048 ? "text-emerald-400" : "text-yellow-400"
                  )}
                />
              )}
              {result.signatureAlgorithm && (
                <ResultRow
                  icon={FileKey}
                  label="Signature Algorithm"
                  value={result.signatureAlgorithm}
                  className="text-muted-foreground"
                />
              )}
              {result.hsts != null && (
                <ResultRow
                  icon={result.hsts ? ShieldCheck : ShieldAlert}
                  label="HSTS (HTTP Strict Transport Security)"
                  value={
                    result.hsts ? (
                      <span>
                        Enabled
                        {result.hstsMaxAge && ` — max-age=${result.hstsMaxAge}s`}
                        {result.hstsIncludeSubdomains && ", includeSubDomains"}
                        {result.hstsPreload && ", preload"}
                      </span>
                    ) : (
                      "Not enabled — recommended for security"
                    )
                  }
                  className={result.hsts ? "text-emerald-400" : "text-yellow-400"}
                />
              )}
            </div>
          </SectionCard>

          {/* Certificate Chain */}
          {result.chain && result.chain.length > 0 && (
            <SectionCard title={`Certificate Chain (${result.chain.length} certificates)`}>
              <div className="space-y-0">
                {result.chain.map((cert, i) => (
                  <div key={i} className="relative">
                    {i > 0 && (
                      <div className="flex items-center justify-center py-1">
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 rotate-90" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border",
                        i === 0
                          ? "bg-primary/5 border-primary/20"
                          : cert.isSelfSigned
                            ? "bg-yellow-500/5 border-yellow-500/20"
                            : "bg-white/[0.02] border-white/10"
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                          i === 0
                            ? "bg-primary/20 border-primary/30 text-primary"
                            : cert.isSelfSigned
                              ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                              : "bg-white/10 border-white/20 text-muted-foreground"
                        )}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {cert.subject}
                          </span>
                          {i === 0 && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                              Leaf
                            </span>
                          )}
                          {cert.isSelfSigned && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              Root
                            </span>
                          )}
                          {!cert.isSelfSigned && i > 0 && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground border border-white/20">
                              Intermediate
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Issued by: {cert.issuer}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Technical Details */}
          <SectionCard
            title="Technical Details"
            defaultOpen={false}
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
                  aria-label="Copy certificate details"
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
                  aria-label="Download certificate report"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            }
          >
            <div className="divide-y divide-white/5">
              {result.serialNumber && (
                <ResultRow
                  icon={Fingerprint}
                  label="Serial Number"
                  value={result.serialNumber}
                  className="text-muted-foreground"
                />
              )}
              {result.fingerprint && (
                <ResultRow
                  icon={Fingerprint}
                  label="Fingerprint (SHA-256)"
                  value={result.fingerprint}
                  className="text-muted-foreground"
                />
              )}
            </div>
          </SectionCard>

          {/* Flow Diagram - collapsible, collapsed by default */}
          <SectionCard title="Connection Flow Diagram" defaultOpen={false}>
            <SSLFlowDiagram result={result} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
