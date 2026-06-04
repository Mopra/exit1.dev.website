"use client";

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { InsetCard } from "@/components/InsetCard";
import {
  classifyStatus,
  classifyType,
  formatUptime,
  makeComparator,
  statusPresentation,
  uptimeBarClass,
  uptimeColorClass,
  type MonitorIndexEntry,
  type SortKey,
} from "@/lib/publicMonitors";

type StatusFilter = "all" | "operational" | "down" | "degraded" | "other";
type TypeFilter = "all" | "website" | "api";

const dotTone = {
  up: "bg-emerald-500",
  down: "bg-red-500",
  degraded: "bg-amber-500",
  muted: "bg-foreground/30",
} as const;

// statusPresentation collapses "degraded" into the red "down" tone; here we
// pull it back out to amber so a partial degradation doesn't read as a hard outage.
function present(status: string): { label: string; tone: keyof typeof dotTone } {
  if (classifyStatus(status) === "degraded") return { label: "Degraded", tone: "degraded" };
  return statusPresentation(status);
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "worst", label: "Issues first" },
  { value: "name", label: "Name (A–Z)" },
  { value: "uptime-desc", label: "Uptime (high → low)" },
  { value: "uptime-asc", label: "Uptime (low → high)" },
  { value: "recent", label: "Recently checked" },
];

function StatusPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors cursor-pointer interactive",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-foreground/70 hover:text-foreground hover:border-foreground/40",
      )}
    >
      {children}
    </button>
  );
}

export function StatusDirectory({ monitors }: { monitors: MonitorIndexEntry[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("worst");
  const deferredQuery = useDeferredValue(query);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchId = useId();

  // Counts over the full set (drive the status pills).
  const counts = useMemo(() => {
    const c = { operational: 0, down: 0, degraded: 0, other: 0 };
    for (const m of monitors) c[classifyStatus(m.status)]++;
    return c;
  }, [monitors]);

  const hasApi = useMemo(() => monitors.some((m) => classifyType(m.type) === "api"), [monitors]);
  const hasWebsite = useMemo(() => monitors.some((m) => classifyType(m.type) === "website"), [monitors]);
  const showTypeFilter = hasApi && hasWebsite;

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const out = monitors.filter((m) => {
      if (status !== "all" && classifyStatus(m.status) !== status) return false;
      if (type !== "all" && classifyType(m.type) !== type) return false;
      if (q && !(m.host.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q)))
        return false;
      return true;
    });
    return out.sort(makeComparator(sortKey));
  }, [monitors, deferredQuery, status, type, sortKey]);

  const clearAll = () => {
    setQuery("");
    setStatus("all");
    setType("all");
  };

  // "/" focuses search anywhere on the page; Esc clears it while focused.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el as HTMLElement)?.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtersActive = query.trim() !== "" || status !== "all" || type !== "all";

  const statusPills = (
    [
      { key: "all", label: "All", count: monitors.length },
      { key: "operational", label: "Operational", count: counts.operational },
      { key: "degraded", label: "Degraded", count: counts.degraded },
      { key: "down", label: "Down", count: counts.down },
      { key: "other", label: "Other", count: counts.other },
    ] as { key: StatusFilter; label: string; count: number }[]
  ).filter((p) => p.key === "all" || p.count > 0);

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <label htmlFor={searchId} className="sr-only">
              Search monitors by name or domain
            </label>
            <Input
              id={searchId}
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && query) {
                  e.preventDefault();
                  setQuery("");
                }
              }}
              placeholder={`Search ${monitors.length} sites and APIs…  (press /)`}
              autoComplete="off"
              spellCheck={false}
              aria-controls="status-results"
              className="h-10 pl-9 pr-9"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground cursor-pointer interactive"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showTypeFilter && (
              <div className="flex rounded-md border border-border p-0.5" role="group" aria-label="Filter by type">
                {(["all", "website", "api"] as TypeFilter[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    aria-pressed={type === t}
                    className={cn(
                      "rounded px-2.5 py-1 text-xs transition-colors cursor-pointer interactive",
                      type === t ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground",
                    )}
                  >
                    {t === "all" ? "All" : t === "website" ? "Websites" : "APIs"}
                  </button>
                ))}
              </div>
            )}
            <label htmlFor={`${searchId}-sort`} className="sr-only">
              Sort monitors
            </label>
            <select
              id={`${searchId}-sort`}
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="h-10 cursor-pointer rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-background text-foreground">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
          {statusPills.map((p) => (
            <StatusPill key={p.key} active={status === p.key} onClick={() => setStatus(p.key)}>
              {p.label}
              <span className="ml-1.5 tabular-nums text-foreground/40">{p.count}</span>
            </StatusPill>
          ))}
        </div>
      </div>

      {/* Result count (announced to screen readers) */}
      <p id="status-results-count" role="status" aria-live="polite" className="mb-4 text-sm text-muted-foreground">
        Showing {filtered.length} of {monitors.length}
        {filtersActive && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-3 text-foreground/70 underline-offset-2 hover:text-foreground hover:underline cursor-pointer interactive"
          >
            Clear filters
          </button>
        )}
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-foreground/80">No monitors match “{query.trim()}”.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-3 text-sm text-foreground underline underline-offset-4 cursor-pointer interactive"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul id="status-results" className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {filtered.map((m) => {
            const { label, tone } = present(m.status);
            const isApi = classifyType(m.type) === "api";
            return (
              <li key={m.slug}>
                <Link
                  href={`/status/${m.slug}`}
                  aria-label={`${m.host}: ${label}, ${formatUptime(m.uptime30d)} 30-day uptime`}
                  className="group block cursor-pointer rounded-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  <InsetCard className="h-full p-4 transition-colors motion-safe:duration-150 group-hover:bg-foreground/[0.03]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span role="img" aria-label={label} className={cn("h-2 w-2 shrink-0 rounded-full", dotTone[tone])} />
                        <span className="truncate font-medium" title={m.host}>
                          {m.host}
                        </span>
                        {isApi && (
                          <span className="shrink-0 rounded border border-border px-1 py-px text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            API
                          </span>
                        )}
                      </div>
                      <span className={cn("shrink-0 text-sm tabular-nums", uptimeColorClass(m.uptime30d))}>
                        {formatUptime(m.uptime30d)}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      <span
                        className={cn(
                          "text-xs",
                          tone === "down" ? "text-red-500" : tone === "degraded" ? "text-amber-500" : "text-muted-foreground",
                        )}
                      >
                        {label}
                      </span>
                      <span className="ml-auto h-1 w-16 overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
                        <span
                          className={cn("block h-full rounded-full", uptimeBarClass(m.uptime30d))}
                          style={{ width: `${Math.max(0, Math.min(100, m.uptime30d ?? 0))}%` }}
                        />
                      </span>
                      <span className="sr-only">30-day uptime</span>
                    </div>
                  </InsetCard>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
