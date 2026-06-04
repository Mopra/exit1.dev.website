import Link from "next/link";
import {
  classifyType,
  formatUptime,
  isIndexEntryMature,
  statusPresentation,
  uptimeColorClass,
  type MonitorIndexEntry,
} from "@/lib/publicMonitors";
import { cn } from "@/lib/utils";

const dotTone = {
  up: "bg-emerald-500",
  down: "bg-red-500",
  muted: "bg-foreground/30",
} as const;

const MAX_RELATED = 6;

/**
 * Cross-links to other status pages — same type first (sites near sites, APIs
 * near APIs) so related pages cluster topically and gain crawl paths beyond the
 * hub. Only mature (indexable) pages are linked.
 */
export function RelatedStatusList({
  current,
  all,
}: {
  current: MonitorIndexEntry;
  all: MonitorIndexEntry[];
}) {
  const currentType = classifyType(current.type);
  const pool = all.filter((m) => m.slug !== current.slug && isIndexEntryMature(m));

  const sameType = pool.filter((m) => classifyType(m.type) === currentType);
  const others = pool.filter((m) => classifyType(m.type) !== currentType);
  const related = [...sameType, ...others].slice(0, MAX_RELATED);

  if (related.length === 0) return null;

  return (
    <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {related.map((m) => {
        const { tone } = statusPresentation(m.status);
        return (
          <li key={m.slug}>
            <Link
              href={`/status/${m.slug}`}
              className="group flex items-center justify-between gap-3 rounded-md border border-border p-3 text-sm transition-colors hover:border-foreground/40 interactive"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className={cn("h-2 w-2 shrink-0 rounded-full", dotTone[tone])}
                  aria-hidden="true"
                />
                <span className="truncate font-medium text-foreground">{m.host}</span>
              </span>
              <span className={cn("shrink-0 tabular-nums", uptimeColorClass(m.uptime30d))}>
                {formatUptime(m.uptime30d)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
