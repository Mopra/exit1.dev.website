import Link from "next/link";
import { cn } from "@/lib/utils";

const tools = [
  {
    name: "SSL Checker",
    href: "/tools/ssl-checker",
    description: "Verify certificates & expiry dates",
  },
  {
    name: "Domain Checker",
    href: "/tools/domain-expiration-checker",
    description: "Check domain expiration & WHOIS",
  },
  {
    name: "DNS Checker",
    href: "/tools/dns-checker",
    description: "Look up DNS records globally",
  },
  {
    name: "API Status",
    href: "/tools/api-status-checker",
    description: "Test API endpoint health",
  },
  {
    name: "Ping Test",
    href: "/tools/ping-test",
    description: "Measure server response time",
  },
  {
    name: "Redirect Checker",
    href: "/tools/redirect-checker",
    description: "Trace full redirect chains",
  },
  {
    name: "Uptime Checker",
    href: "/tools/uptime-checker",
    description: "Quick availability check",
  },
];

export function ToolsNav({ current }: { current: string }) {
  return (
    <nav aria-label="Tools" className="w-full mx-auto">
      <div className="flex flex-wrap items-center justify-center border-b border-white/[0.08]">
        {tools.map((tool) => {
          const isActive = tool.href === current;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={cn(
                "group relative px-3 py-2.5 sm:px-4 text-sm transition-colors duration-150 -mb-px",
                isActive
                  ? "text-white font-semibold border-b-2 border-primary"
                  : "text-muted-foreground hover:text-white"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {tool.name}
              {!isActive && (
                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 delay-200 whitespace-nowrap"
                >
                  {tool.description}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
