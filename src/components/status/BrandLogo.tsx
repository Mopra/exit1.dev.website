"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Brand logo for a monitor, resolved from the domain's favicon via Google's S2
 * service. The URL is deterministic per host, so it stays ISR-friendly (no
 * per-render variation). On load failure we fall back to a letter avatar so the
 * card never shows a broken-image glyph.
 */
export function BrandLogo({
  host,
  name,
  size = 32,
  className,
}: {
  host: string;
  name?: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initial = (name?.trim() || host).charAt(0).toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-foreground/[0.03]",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {failed ? (
        <span className="text-sm font-semibold text-muted-foreground">{initial}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary external
        // hosts; a plain img avoids whitelisting dozens of domains in next.config.
        <img
          src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-1"
        />
      )}
    </span>
  );
}
