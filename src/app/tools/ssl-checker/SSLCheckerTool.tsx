"use client";

import { useState, FormEvent } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const SSLFlowDiagram = dynamic(() => import("./SSLFlowDiagram"), { ssr: false });

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
}

function ResultRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", className)} />
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium break-all">{value}</div>
      </div>
    </div>
  );
}

export default function SSLCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SSLResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function buildResultText(r: SSLResult) {
    return [
      `SSL Certificate Report`,
      `======================`,
      ``,
      r.grade && `Grade:               ${r.grade}`,
      `Status:              ${r.valid ? "Valid" : "Invalid"}`,
      `Hostname:            ${r.hostname}`,
      r.subject && `Subject:             ${r.subject}`,
      r.issuer && `Issuer:              ${r.issuer}`,
      r.validFrom && `Valid From:          ${formatDate(r.validFrom)}`,
      r.validTo && `Valid Until:         ${formatDate(r.validTo)}`,
      r.daysUntilExpiry != null && `Days Until Expiry:   ${r.daysUntilExpiry}`,
      r.protocol && `TLS Protocol:        ${r.protocol}`,
      r.keySize && `Key Size:            ${r.keySize} bits`,
      r.signatureAlgorithm && `Signature Algorithm: ${r.signatureAlgorithm}`,
      r.serialNumber && `Serial Number:       ${r.serialNumber}`,
      r.fingerprint && `Fingerprint (SHA-256):`,
      r.fingerprint && `  ${r.fingerprint}`,
      r.altNames && r.altNames.length > 0 && `Alt Names:           ${r.altNames.join(", ")}`,
      r.error && `Error:               ${r.error}`,
      ``,
      r.gradeReasons && r.gradeReasons.length > 0 && `Grade Breakdown:`,
      ...(r.gradeReasons || []).map((reason) => `  • ${reason}`),
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

  function downloadResults() {
    if (!result) return;
    const text = buildResultText(result);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ssl-report-${result.hostname}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/ssl-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Check failed");
        return;
      }

      setResult(data);
    } catch {
      setError("Failed to check SSL certificate. Please try again.");
    } finally {
      setLoading(false);
    }
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

  return (
    <div>
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
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
              "p-4 rounded-xl border flex items-center gap-4",
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
            <div className="min-w-0">
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
            </div>
          </div>

          {/* Grade Breakdown */}
          {result.gradeReasons && result.gradeReasons.length > 0 && (
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Grade Breakdown
              </h3>
              <ul className="space-y-1.5">
                {result.gradeReasons.map((reason, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Flow Diagram */}
          <SSLFlowDiagram result={result} />

          {/* Certificate Details */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Certificate Details
              </h3>
              <div className="flex items-center gap-3">
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
            </div>
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
              {result.protocol && (
                <ResultRow
                  icon={Lock}
                  label="TLS Protocol"
                  value={result.protocol}
                  className="text-primary"
                />
              )}
              {result.serialNumber && (
                <ResultRow
                  icon={Fingerprint}
                  label="Serial Number"
                  value={result.serialNumber}
                  className="text-muted-foreground"
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
              {result.fingerprint && (
                <ResultRow
                  icon={Fingerprint}
                  label="Fingerprint (SHA-256)"
                  value={result.fingerprint}
                  className="text-muted-foreground"
                />
              )}
              {result.altNames && result.altNames.length > 0 && (
                <ResultRow
                  icon={Network}
                  label="Subject Alternative Names"
                  value={result.altNames.join(", ")}
                  className="text-muted-foreground"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
