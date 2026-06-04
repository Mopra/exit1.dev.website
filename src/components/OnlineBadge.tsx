'use client';

import { useState, type CSSProperties } from 'react';
import { Check, TriangleAlert, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type OnlineBadgeProps = {
  className?: string;
  style?: CSSProperties;
  label?: string;
  alertLabel?: string;
  color?: string;
  alertColor?: string;
  /** Icon for the resting state. Defaults to a checkmark; pass null for no icon. */
  icon?: LucideIcon | null;
  /** Icon for the hover/alert state. Defaults to a warning triangle; pass null for no icon. */
  alertIcon?: LucideIcon | null;
  /** Glow/border rgb triplet for the resting state. */
  okRgb?: string;
  /** Glow/border rgb triplet for the hover/alert state. */
  alertRgb?: string;
  /** Controlled hover state. If omitted, the badge tracks its own hover. */
  hovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
};

/**
 * Static pill badge. Scale by setting `font-size` (e.g. `text-7xl` or
 * `style={{ fontSize: 96 }}`). All internal spacing, icon, and glow are
 * em-relative, so the whole badge resizes proportionally.
 */
export function OnlineBadge({
  className,
  style,
  label = 'Online',
  alertLabel = 'Offline',
  color = '#22F0B5',
  alertColor = '#FF3B5C',
  icon: OkIcon = Check,
  alertIcon: AlertIcon = TriangleAlert,
  okRgb = '34, 240, 181',
  alertRgb = '255, 59, 92',
  hovered,
  onHoverChange,
}: OnlineBadgeProps) {
  const [internalHover, setInternalHover] = useState(false);
  const controlled = hovered !== undefined;
  const hover = controlled ? hovered : internalHover;
  const setHover = (v: boolean) => {
    if (!controlled) setInternalHover(v);
    onHoverChange?.(v);
  };

  const rgb = hover ? alertRgb : okRgb;
  const activeColor = hover ? alertColor : color;
  const Icon = hover ? AlertIcon : OkIcon;

  return (
    <div
      onMouseEnter={controlled ? undefined : () => setHover(true)}
      onMouseLeave={controlled ? undefined : () => setHover(false)}
      className={cn(
        'inline-flex items-center gap-[0.4em] px-[1.1em] py-[0.55em] rounded-full border-2 cursor-pointer',
        className
      )}
      style={{
        background: '#0A0A0F',
        borderColor: `rgba(${rgb}, 0.55)`,
        boxShadow: `0 0.7em 1.8em rgba(${rgb}, 0.55), 0 0.25em 0.6em rgba(${rgb}, 0.35), inset 0 0 0.8em rgba(${rgb}, 0.18)`,
        transition: 'border-color 380ms ease, box-shadow 380ms ease',
        ...style,
      }}
    >
      {Icon && (
        <Icon
          strokeWidth={3}
          style={{
            width: '1em',
            height: '1em',
            color: activeColor,
            filter: `drop-shadow(0 0 0.15em rgba(${rgb}, 0.8))`,
            transition: 'color 380ms ease, filter 380ms ease',
          }}
        />
      )}
      <span
        className="font-semibold tracking-wide leading-none"
        style={{
          color: activeColor,
          textShadow: `0 0 0.35em rgba(${rgb}, 0.6)`,
          transition: 'color 380ms ease, text-shadow 380ms ease',
        }}
      >
        {hover ? alertLabel : label}
      </span>
    </div>
  );
}
