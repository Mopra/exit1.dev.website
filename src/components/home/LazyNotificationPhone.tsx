'use client';

import dynamic from 'next/dynamic';
import { useNearViewport } from './useNearViewport';

// Same treatment as LazyAIChat: keep motion/react out of the first-load
// bundle by mounting the phone mockup only when it approaches the viewport.
const NotificationPhone = dynamic(
  () => import('./NotificationPhone').then((m) => m.NotificationPhone),
  { ssr: false }
);

export function LazyNotificationPhone() {
  const { ref, near } = useNearViewport();

  return (
    // Mirrors NotificationPhone's root sizing so mounting never shifts layout.
    <div ref={ref} className="flex h-[520px] justify-center sm:h-[560px]">
      {near && <NotificationPhone />}
    </div>
  );
}
