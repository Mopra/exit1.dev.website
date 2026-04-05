'use client';

import { useEffect, useRef } from 'react';

const BADGE_CHECK_ID = 'gBLfWCos41mGcJ62aIpX';

export function UptimeBadge({ type = 'uptime' }: { type?: 'status' | 'uptime' | 'response' }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || container.querySelector('script')) return;
    const script = document.createElement('script');
    script.src = `https://app.exit1.dev/v1/badge/${BADGE_CHECK_ID}/embed.js?type=${type}&branding=false`;
    script.async = true;
    container.appendChild(script);
  }, [type]);

  return <div ref={ref} />;
}
