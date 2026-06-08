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
  ChevronDown,
  Link2,
  CheckCircle,
  XCircle,
  Network,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToolResultCTA } from "@/components/tools/ToolResultCTA";

interface DnsRecords {
  a?: string[];
  aaaa?: string[];
  mx?: { priority: number; exchange: string }[];
  txt?: string[];
  ns?: string[];
}

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
  dnsRecords?: DnsRecords;
  ipAddress?: string;
  error?: string;
}

const EXAMPLE_DOMAINS = ["google.com", "github.com", "openai.com", "bbc.co.uk"];

const LOADING_STEPS = [
  "Resolving domain...",
  "Querying RDAP registry...",
  "Checking WHOIS database...",
  "Looking up DNS records...",
  "Analyzing results...",
];

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
  value: React.ReactNode;
  className?: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-foreground/5 last:border-0">
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", className)} />
      <div className="min-w-0 flex-1">
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
    <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 pb-4 cursor-pointer hover:bg-foreground/[0.02] transition-colors"
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
          ? "bg-success/10 border-success/20 text-success"
          : "bg-destructive/10 border-destructive/20 text-destructive"
      )}
    >
      {ok ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label}
    </span>
  );
}

function StatusBadge({ result }: { result: DomainResult }) {
  const config = {
    active: {
      icon: ShieldCheck,
      label: "Active",
      sublabel: result.daysUntilExpiry != null ? `Expires in ${result.daysUntilExpiry} days` : undefined,
      bg: "bg-success/10 border-success/20",
      iconBg: "bg-success/20 border-success/30",
      iconClass: "text-success",
      textClass: "text-success",
    },
    expiring_soon: {
      icon: AlertTriangle,
      label: "Expiring Soon",
      sublabel: result.daysUntilExpiry != null ? `Only ${result.daysUntilExpiry} days remaining` : undefined,
      bg: "bg-warning/10 border-warning/20",
      iconBg: "bg-warning/20 border-warning/30",
      iconClass: "text-warning",
      textClass: "text-warning",
    },
    expired: {
      icon: ShieldAlert,
      label: "Expired",
      sublabel: result.daysUntilExpiry != null ? `Expired ${Math.abs(result.daysUntilExpiry)} days ago` : undefined,
      bg: "bg-destructive/10 border-destructive/20",
      iconBg: "bg-destructive/20 border-destructive/30",
      iconClass: "text-destructive",
      textClass: "text-destructive",
    },
    unknown: {
      icon: Shield,
      label: "Unknown",
      sublabel: "Expiry date could not be determined",
      bg: "bg-foreground/5 border-foreground/10",
      iconBg: "bg-foreground/10 border-foreground/20",
      iconClass: "text-muted-foreground",
      textClass: "text-muted-foreground",
    },
  };

  const c = config[result.status];
  const StatusIcon = c.icon;

  return (
    <div className={cn("p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4", c.bg)}>
      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border", c.iconBg)}>
        <StatusIcon className={cn("w-7 h-7", c.iconClass)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold text-lg", c.textClass)}>{c.label}</span>
        </div>
        {c.sublabel && (
          <div className="text-sm text-muted-foreground mt-0.5">{c.sublabel}</div>
        )}
        {/* Quick status pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {result.dnssec != null && (
            <StatusPill ok={result.dnssec} label="DNSSEC" />
          )}
          {result.registrar && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-primary/10 border-primary/20 text-primary">
              {result.registrar.length > 30 ? result.registrar.slice(0, 30) + "..." : result.registrar}
            </span>
          )}
          {result.createdDate && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-secondary/10 border-secondary/20 text-secondary">
              Age: {formatDomainAge(result.createdDate)}
            </span>
          )}
          {result.ipAddress && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-foreground/5 border-foreground/10 text-muted-foreground font-mono">
              {result.ipAddress}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DomainCheckerTool() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<DomainResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const checkDomain = useCallback(async (domain: string) => {
    if (!domain.trim()) return;

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

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("domain", domain.trim());
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    } catch {
      setError("Failed to check domain. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  }, [router]);

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
      r.ipAddress && `IP Address:          ${r.ipAddress}`,
      r.dnsRecords?.a && `A Records:           ${r.dnsRecords.a.join(", ")}`,
      r.dnsRecords?.aaaa && `AAAA Records:        ${r.dnsRecords.aaaa.join(", ")}`,
      r.dnsRecords?.mx && `MX Records:          ${r.dnsRecords.mx.map((m) => `${m.priority} ${m.exchange}`).join(", ")}`,
      r.dnsRecords?.txt && r.dnsRecords.txt.length > 0 && `TXT Records:         ${r.dnsRecords.txt.length} record(s)`,
      r.dnsRecords?.ns && `NS Records:          ${r.dnsRecords.ns.join(", ")}`,
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

  async function copyShareLink() {
    if (!result) return;
    const shareUrl = `${window.location.origin}/tools/domain-expiration-checker?domain=${encodeURIComponent(result.domain)}`;
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

  const hasDnsRecords = result?.dnsRecords && (
    result.dnsRecords.a?.length ||
    result.dnsRecords.aaaa?.length ||
    result.dnsRecords.mx?.length ||
    result.dnsRecords.txt?.length ||
    result.dnsRecords.ns?.length
  );

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
            className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-base"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-xl px-6 py-3 h-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all cursor-pointer disabled:opacity-50"
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
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {EXAMPLE_DOMAINS.map((domain) => (
            <button
              key={domain}
              type="button"
              onClick={() => handleExampleClick(domain)}
              className="text-xs font-mono px-2.5 py-1 rounded-full border border-foreground/10 bg-foreground/5 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              {domain}
            </button>
          ))}
        </div>
      )}

      {/* Loading Progress */}
      {loading && (
        <div className="mt-6 p-4 bg-foreground/[0.02] border border-foreground/10 rounded-xl">
          <div className="space-y-2">
            {LOADING_STEPS.map((step, i) => (
              <div
                key={step}
                className={cn(
                  "flex items-center gap-2.5 text-sm transition-all duration-300",
                  i < loadingStep
                    ? "text-success"
                    : i === loadingStep
                      ? "text-foreground"
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
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-destructive">Check Failed</div>
            <div className="text-sm text-destructive/80 mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Status Banner */}
          <StatusBadge result={result} />

          {/* Conversion CTA — result-aware */}
          {(() => {
            const domain = result.domain;
            if (result.status === "expired") {
              return (
                <ToolResultCTA
                  campaign="domain_checker"
                  target={domain}
                  tone="alert"
                  headline={`${domain} has expired`}
                  subline="Expired domains can be lost for good. exit1 sends domain-expiry alerts well ahead of the deadline so it never happens again."
                  ctaLabel="Get expiry alerts free"
                />
              );
            }
            if (result.status === "expiring_soon") {
              return (
                <ToolResultCTA
                  campaign="domain_checker"
                  target={domain}
                  tone="alert"
                  headline={`${domain} expires in ${result.daysUntilExpiry} days`}
                  subline="Don't lose your domain to a missed renewal. exit1 tracks expiry and alerts you in advance — plus full uptime monitoring."
                  ctaLabel="Get expiry alerts free"
                />
              );
            }
            return (
              <ToolResultCTA
                campaign="domain_checker"
                target={domain}
                tone="positive"
                headline={`${domain} is registered and active`}
                subline="Never lose it to a forgotten renewal. exit1 watches the expiry date and alerts you weeks ahead — free."
                ctaLabel="Get expiry alerts free"
              />
            );
          })()}

          {/* Registration Details */}
          <SectionCard
            title="Registration Details"
            actions={
              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={copyShareLink}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Copy share link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span className="text-success">Copied</span>
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
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Copy domain details"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span className="text-success">Copied</span>
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
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Download domain report"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            }
          >
            <div className="divide-y divide-foreground/5">
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
                        ? "text-destructive"
                        : "text-warning"
                      : "text-success"
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
                      ? "text-destructive"
                      : result.daysUntilExpiry <= 30
                        ? "text-warning"
                        : "text-success"
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
            </div>
          </SectionCard>

          {/* DNS & Nameservers */}
          <SectionCard title="DNS & Nameservers">
            <div className="divide-y divide-foreground/5">
              {result.nameservers && result.nameservers.length > 0 && (
                <div className="py-3 border-b border-foreground/5">
                  <div className="flex items-start gap-3">
                    <Server className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        Nameservers ({result.nameservers.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {result.nameservers.map((ns) => (
                          <span
                            key={ns}
                            className="inline-flex items-center text-xs font-mono px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/10 text-foreground/80"
                          >
                            {ns}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {result.ipAddress && (
                <ResultRow
                  icon={Network}
                  label="IP Address"
                  value={result.ipAddress}
                  className="text-muted-foreground"
                />
              )}
              {result.dnssec != null && (
                <ResultRow
                  icon={Lock}
                  label="DNSSEC"
                  value={result.dnssec ? "Signed — domain is DNSSEC protected" : "Not signed"}
                  className={result.dnssec ? "text-success" : "text-muted-foreground"}
                />
              )}
              {result.dnsRecords?.a && result.dnsRecords.a.length > 0 && (
                <div className="py-3 border-b border-foreground/5">
                  <div className="flex items-start gap-3">
                    <Network className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">A Records (IPv4)</div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {result.dnsRecords.a.map((ip) => (
                          <span
                            key={ip}
                            className="inline-flex items-center text-xs font-mono px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/10 text-foreground/80"
                          >
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {result.dnsRecords?.aaaa && result.dnsRecords.aaaa.length > 0 && (
                <div className="py-3 border-b border-foreground/5">
                  <div className="flex items-start gap-3">
                    <Network className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">AAAA Records (IPv6)</div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {result.dnsRecords.aaaa.map((ip) => (
                          <span
                            key={ip}
                            className="inline-flex items-center text-xs font-mono px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/10 text-foreground/80"
                          >
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {result.dnsRecords?.mx && result.dnsRecords.mx.length > 0 && (
                <div className="py-3 border-b border-foreground/5">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">MX Records (Mail Servers)</div>
                      <div className="space-y-1 mt-1.5">
                        {result.dnsRecords.mx.map((mx) => (
                          <div key={mx.exchange} className="flex items-center gap-2">
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                              {mx.priority}
                            </span>
                            <span className="text-xs font-mono text-foreground/80">{mx.exchange}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* TXT Records */}
          {result.dnsRecords?.txt && result.dnsRecords.txt.length > 0 && (
            <SectionCard
              title={`TXT Records (${result.dnsRecords.txt.length})`}
              defaultOpen={false}
            >
              <div className="space-y-2">
                {result.dnsRecords.txt.map((txt, i) => (
                  <div
                    key={i}
                    className="text-xs font-mono text-foreground/70 bg-background/40 border border-foreground/5 rounded-lg p-3 break-all"
                  >
                    {txt}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Registry Status */}
          {result.registryStatus && result.registryStatus.length > 0 && (
            <SectionCard
              title={`Registry Status (${result.registryStatus.length})`}
              defaultOpen={false}
            >
              <div className="flex flex-wrap gap-1.5">
                {result.registryStatus.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/10 text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}
    </div>
  );
}
