'use client';

import { useState, useEffect } from 'react';
import {
  getCookiePreferences,
  hasConsent,
  setCookieConsent,
  setCookiePreferences,
} from '../lib/cookieUtils';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  hasConsented: boolean;
  preferences: CookiePreferences;
  showBanner: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const CONSENT_EVENT = 'exit1:cookie-consent-changed';

export const useCookieConsent = () => {
  const [consentState, setConsentState] = useState<CookieConsentState>({
    hasConsented: false,
    preferences: defaultPreferences,
    showBanner: false,
  });

  useEffect(() => {
    const sync = () => {
      const saved = getCookiePreferences();
      const responded = hasConsent();

      if (saved && responded) {
        setConsentState({
          hasConsented: true,
          preferences: { ...defaultPreferences, ...saved },
          showBanner: false,
        });
      } else {
        setConsentState({
          hasConsented: false,
          preferences: defaultPreferences,
          showBanner: true,
        });
      }
    };

    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  const persist = (prefs: CookiePreferences) => {
    const next: CookiePreferences = { ...prefs, necessary: true };

    setCookieConsent(true);
    setCookiePreferences(next);

    if (next.analytics) {
      enableGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }

    setConsentState({
      hasConsented: true,
      preferences: next,
      showBanner: false,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(CONSENT_EVENT));
    }
  };

  const acceptAll = () =>
    persist({ necessary: true, analytics: true, marketing: true });

  const rejectAll = () =>
    persist({ necessary: true, analytics: false, marketing: false });

  const acceptSelected = (preferences: CookiePreferences) => persist(preferences);

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) =>
    persist({ ...consentState.preferences, ...newPreferences });

  return {
    ...consentState,
    acceptAll,
    acceptSelected,
    rejectAll,
    updatePreferences,
  };
};

const enableGoogleAnalytics = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
    });
  }
};

const disableGoogleAnalytics = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    });
  }
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
