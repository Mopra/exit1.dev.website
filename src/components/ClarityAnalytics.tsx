'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = 'sn0wwajt10';

export default function ClarityAnalytics() {
  // Defer the Clarity bootstrap until the main thread is idle so session
  // recording never competes with hydration or the Core Web Vitals window.
  useEffect(() => {
    const start = () => Clarity.init(CLARITY_PROJECT_ID);
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 2000);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
