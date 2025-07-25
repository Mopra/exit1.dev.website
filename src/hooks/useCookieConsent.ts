import { useState, useEffect } from 'react';
import { 
  hasConsent, 
  getCookiePreferences, 
  setCookieConsent, 
  setCookiePreferences 
} from '../utils/cookieUtils';

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
  necessary: true, // Always true, can't be disabled
  analytics: false,
  marketing: false,
};

export const useCookieConsent = () => {
  const [consentState, setConsentState] = useState<CookieConsentState>({
    hasConsented: false,
    preferences: defaultPreferences,
    showBanner: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const hasConsented = hasConsent();
    const savedPreferences = getCookiePreferences();
    
    let preferences = defaultPreferences;
    if (savedPreferences) {
      try {
        preferences = { ...defaultPreferences, ...savedPreferences };
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }

    setConsentState({
      hasConsented,
      preferences,
      showBanner: !hasConsented,
    });
  }, []);

  const acceptAll = () => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };

    // Set cookies
    setCookieConsent(true);
    setCookiePreferences(newPreferences);

    setConsentState({
      hasConsented: true,
      preferences: newPreferences,
      showBanner: false,
    });

    // Enable Google Analytics
    enableGoogleAnalytics();
  };

  const acceptSelected = (preferences: CookiePreferences) => {
    // Ensure necessary cookies are always enabled
    const newPreferences: CookiePreferences = {
      ...preferences,
      necessary: true,
    };

    // Set cookies
    setCookieConsent(true);
    setCookiePreferences(newPreferences);

    setConsentState({
      hasConsented: true,
      preferences: newPreferences,
      showBanner: false,
    });

    // Enable Google Analytics if analytics is accepted
    if (newPreferences.analytics) {
      enableGoogleAnalytics();
    }
  };

  const rejectAll = () => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };

    // Set cookies
    setCookieConsent(true);
    setCookiePreferences(newPreferences);

    setConsentState({
      hasConsented: true,
      preferences: newPreferences,
      showBanner: false,
    });

    // Disable Google Analytics
    disableGoogleAnalytics();
  };

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updatedPreferences: CookiePreferences = {
      ...consentState.preferences,
      ...newPreferences,
      necessary: true, // Always ensure necessary is true
    };

    acceptSelected(updatedPreferences);
  };

  return {
    ...consentState,
    acceptAll,
    acceptSelected,
    rejectAll,
    updatePreferences,
  };
};

// Google Analytics management functions
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

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
} 