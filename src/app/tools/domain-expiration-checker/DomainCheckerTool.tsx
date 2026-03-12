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
  Shield,
  ShieldAlert,
  ShieldCheck,
  Server,
  CalendarClock,
  ExternalLink,
  AlertTriangle,
  Lock,
  Hourglass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DomainResult {
  domain: string;
  status: "active" | "expiring_soon" | "expired" | "unknown";
  expiryDate?: string;
  createdDate?: string;
  updatedDate?: string;
  registrar?: string;
  registrarUrl?: string;
  nameservers?: string[];
  registryStatus?: string[];
  daysUntilExpiry?: number;
  dnssec?: boolean;
  error?: string;
}

const EXAMPLE_DOMAINS = ["google.com", "github.com", "bbc.co.uk"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDomainAge(createdDate: string): string {
  const created = new Date(createdDate);
  const now = new Date();

  let years = now.getFullYear() - created.getFullYear();
  let months = now.getMonth() - created.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0 && months > 0) return `${years}y ${months}m`;
  if (years > 0) return `${years}y`;
  if (months > 0) return `${months}m`;
  return "< 1 month";
}

function ResultRow({
  icon: Icon,
  label,
  value,
  className,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", className)} />
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium break-all text-primary hover:underline inline-flex items-center gap-1"
          >
            {value}
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        ) : (
          <div className="text-sm font-medium break-all">{value}</div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, daysUntilExpiry }: { status: DomainResult["status"]; daysUntilExpiry?: number }) {
  const config = {
    active: {
      icon: ShieldCheck,
      label: "Active",
      sublabel: daysUntilExpiry != null ? `Expires in ${daysUntilExpiry} days` : undefined,
      bg: "bg-emerald-500/10 border-emerald-500/20",
      iconClass: "text-emerald-400",
      textClass: "text-emerald-400",
    },
    expiring_soon: {
      icon: AlertTriangle,
      label: "Expiring Soon",
      sublabel: daysUntilExpiry != null ? `Only ${daysUntilExpiry} days remaining` : undefined,
      bg: "bg-yellow-500/10 border-yellow-500/20",
      iconClass: "text-yellow-400",
      textClass: "text-yellow-400",
    },
    expired: {
      icon: ShieldAlert,
      label: "Expired",
      sublabel: daysUntilExpiry != null ? `Expired ${Math.abs(daysUntilExpiry)} days ago` : undefined,
      bg: "bg-red-500/10 border-red-500/20",
      iconClass: "text-red-400",
      textClass: "text-red-400",
    },
    unknown: {
      icon: Shield,
      label: "Unknown",
      sublabel: "Expiry date could not be determined",
      bg: "bg-white/5 border-white/10",
      iconClass: "text-muted-foreground",
      textClass: "text-muted-foreground",
    },
  };

  const c = config[status];
  const StatusIcon = c.icon;

  return (
    <div className={cn("p-4 rounded-xl border flex items-center gap-4", c.bg)}>
      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border", c.bg)}>
        <StatusIcon className={cn("w-7 h-7", c.iconClass)} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold text-lg", c.textClass)}>{c.label}</span>
        </div>
        {c.sublabel && (
          <div className="text-sm text-muted-foreground mt-0.5">{c.sublabel}</div>
        )}
      </div>
    </div>
  );
}

export default function DomainCheckerTool() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DomainResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const checkDomain = useCallback(async (domain: string) => {
    if (!domain.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setHasChecked(true);

    try {
      const res = await fetch("/api/domain-check", {
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

      // Update URL with query param for shareability
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("domain", domain.trim());
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    } catch {
      setError("Failed to check domain. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Auto-check from URL query param on mount
  useEffect(() => {
    const domainParam = searchParams.get("domain");
    if (domainParam && !hasChecked) {
      setUrl(domainParam);
      checkDomain(domainParam);
    }
  }, [searchParams, checkDomain, hasChecked]);

  function buildResultText(r: DomainResult) {
    return [
      `Domain Expiration Report`,
      `========================`,
      ``,
      `Domain:              ${r.domain}`,
      `Status:              ${r.status.replace(/_/g, " ")}`,
      r.expiryDate && `Expiry Date:         ${formatDate(r.expiryDate)}`,
      r.daysUntilExpiry != null && `Days Until Expiry:   ${r.daysUntilExpiry}`,
      r.createdDate && `Domain Age:          ${formatDomainAge(r.createdDate)}`,
      r.createdDate && `Created:             ${formatDate(r.createdDate)}`,
      r.updatedDate && `Updated:             ${formatDate(r.updatedDate)}`,
      r.registrar && `Registrar:           ${r.registrar}`,
      r.registrarUrl && `Registrar URL:       ${r.registrarUrl}`,
      r.nameservers && r.nameservers.length > 0 && `Nameservers:         ${r.nameservers.join(", ")}`,
      r.dnssec != null && `DNSSEC:              ${r.dnssec ? "Enabled" : "Not signed"}`,
      r.registryStatus && r.registryStatus.length > 0 && `Registry Status:     ${r.registryStatus.join(", ")}`,
      ``,
      `Checked:             ${new Date().toISOString()}`,
      `Source:              https://exit1.dev/tools/domain-expiration-checker`,
    ]
      .filter(Boolean)
      .join("\n");
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

  function downloadResults() {
    if (!result) return;
    const text = buildResultText(result);
    const blob = new Blob([text], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `domain-report-${result.domain}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    checkDomain(url);
  }

  function handleExampleClick(domain: string) {
    setUrl(domain);
    checkDomain(domain);
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
              Check Domain
            </span>
          )}
        </Button>
      </form>

      {/* Example Domains */}
      {!result && !error && !loading && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Try:</span>
          {EXAMPLE_DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => handleExampleClick(domain)}
              className="text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer hover:underline"
            >
              {domain}
            </button>
          ))}
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
          <StatusBadge status={result.status} daysUntilExpiry={result.daysUntilExpiry} />

          {/* Domain Details */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Domain Details
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={copyResults}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  aria-label="Copy domain details"
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
                  aria-label="Download domain report"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              <ResultRow
                icon={Globe}
                label="Domain"
                value={result.domain}
                className="text-primary"
              />
              {result.expiryDate && (
                <ResultRow
                  icon={CalendarClock}
                  label="Expiry Date"
                  value={formatDate(result.expiryDate)}
                  className={cn(
                    result.daysUntilExpiry != null && result.daysUntilExpiry <= 30
                      ? result.daysUntilExpiry <= 7
                        ? "text-red-400"
                        : "text-yellow-400"
                      : "text-emerald-400"
                  )}
                />
              )}
              {result.daysUntilExpiry != null && (
                <ResultRow
                  icon={Clock}
                  label="Days Until Expiry"
                  value={
                    result.daysUntilExpiry > 0
                      ? `${result.daysUntilExpiry} days`
                      : result.daysUntilExpiry === 0
                        ? "Expires today"
                        : `Expired ${Math.abs(result.daysUntilExpiry)} days ago`
                  }
                  className={cn(
                    result.daysUntilExpiry <= 7
                      ? "text-red-400"
                      : result.daysUntilExpiry <= 30
                        ? "text-yellow-400"
                        : "text-emerald-400"
                  )}
                />
              )}
              {result.createdDate && (
                <ResultRow
                  icon={Hourglass}
                  label="Domain Age"
                  value={formatDomainAge(result.createdDate)}
                  className="text-primary"
                />
              )}
              {result.createdDate && (
                <ResultRow
                  icon={Clock}
                  label="Created"
                  value={formatDate(result.createdDate)}
                  className="text-muted-foreground"
                />
              )}
              {result.updatedDate && (
                <ResultRow
                  icon={Clock}
                  label="Last Updated"
                  value={formatDate(result.updatedDate)}
                  className="text-muted-foreground"
                />
              )}
              {result.registrar && (
                <ResultRow
                  icon={Shield}
                  label="Registrar"
                  value={result.registrar}
                  className="text-primary"
                  href={result.registrarUrl}
                />
              )}
              {result.nameservers && result.nameservers.length > 0 && (
                <ResultRow
                  icon={Server}
                  label="Nameservers"
                  value={result.nameservers.join(", ")}
                  className="text-muted-foreground"
                />
              )}
              {result.dnssec != null && (
                <ResultRow
                  icon={Lock}
                  label="DNSSEC"
                  value={result.dnssec ? "Signed" : "Not signed"}
                  className={result.dnssec ? "text-emerald-400" : "text-muted-foreground"}
                />
              )}
              {result.registryStatus && result.registryStatus.length > 0 && (
                <div className="py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Registry Status</div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {result.registryStatus.map((s, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
