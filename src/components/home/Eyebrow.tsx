import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  /** Render a live, pulsing status dot before the label. */
  dot?: boolean;
};

/**
 * Quiet monospace wayfinding label. Used as a calm section eyebrow —
 * the only place Space Mono shows up below the fold, kept small and muted.
 */
export function Eyebrow({ children, className, dot }: EyebrowProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground',
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
      )}
      {children}
    </span>
  );
}
