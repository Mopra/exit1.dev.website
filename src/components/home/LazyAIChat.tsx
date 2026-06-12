'use client';

import dynamic from 'next/dynamic';
import { useNearViewport } from './useNearViewport';

// AIChat drags motion/react (~50KB gz) into whatever bundle imports it
// statically. Splitting it out and mounting near-viewport keeps framer-motion
// off the homepage critical path entirely.
const AIChat = dynamic(() => import('./AIChat').then((m) => m.AIChat), {
  ssr: false,
});

export function LazyAIChat() {
  const { ref, near } = useNearViewport();

  return (
    // Mirrors AIChat's root sizing so mounting never shifts layout.
    <div ref={ref} className="h-[400px] sm:h-[440px]">
      {near && <AIChat />}
    </div>
  );
}
