'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { Button } from './ui/button';
import { useCookieConsent } from '../hooks/useCookieConsent';

interface CookieBannerProps {
  onCustomize: () => void;
}

const CookieBanner = ({ onCustomize }: CookieBannerProps) => {
  const { showBanner, acceptAll, rejectAll } = useCookieConsent();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!showBanner) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={`fixed z-50 bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <div className="rounded-xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl p-4 text-white">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
            <Cookie className="h-4 w-4 text-white/80" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-light leading-relaxed text-white/85">
              We use cookies to improve your experience.{' '}
              <Link
                href="/privacy"
                className="underline decoration-white/20 underline-offset-2 hover:decoration-white/60 transition-colors"
              >
                Learn more
              </Link>
              .
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={acceptAll}
                className="h-8 px-3 bg-white text-black hover:bg-white/90 cursor-pointer"
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={rejectAll}
                className="h-8 px-3 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                Decline
              </Button>
              <button
                type="button"
                onClick={onCustomize}
                className="ml-auto text-xs text-white/60 hover:text-white/90 transition-colors cursor-pointer"
              >
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
