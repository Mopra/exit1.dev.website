import Link from "next/link";
import { Shield, Globe, Activity, Wifi, ArrowRight, Network, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  {
    name: "SSL Checker",
    href: "/tools/ssl-checker",
    icon: Shield,
  },
  {
    name: "Domain Checker",
    href: "/tools/domain-expiration-checker",
    icon: Globe,
  },
  {
    name: "DNS Checker",
    href: "/tools/dns-checker",
    icon: Network,
  },
  {
    name: "API Status",
    href: "/tools/api-status-checker",
    icon: Activity,
  },
  {
    name: "Ping Test",
    href: "/tools/ping-test",
    icon: Wifi,
  },
  {
    name: "Redirect Checker",
    href: "/tools/redirect-checker",
    icon: ArrowRight,
  },
  {
    name: "Uptime Checker",
    href: "/tools/uptime-checker",
    icon: HeartPulse,
  },
];

export function ToolsNav({ current }: { current: string }) {
  return (
    <nav aria-label="Tools" className="w-full mx-auto relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-2">
        {tools.map((tool) => {
          const isActive = tool.href === current;
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-4 h-4" />
              {tool.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
