import Cookies from 'js-cookie';

// Cookie names
export const COOKIE_NAMES = {
  CONSENT: 'exit1_cookie_consent',
  PREFERENCES: 'exit1_cookie_preferences',
} as const;

// Cookie categories
export const COOKIE_CATEGORIES = {
  NECESSARY: 'necessary',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
} as const;

// Cookie expiration (1 year)
export const COOKIE_EXPIRY = 365;

/**
 * Check if user has given consent
 */
export const hasConsent = (): boolean => {
  return Cookies.get(COOKIE_NAMES.CONSENT) === 'true';
};

/**
 * Get user's cookie preferences
 */
export const getCookiePreferences = () => {
  const saved = Cookies.get(COOKIE_NAMES.PREFERENCES);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

/**
 * Set cookie consent
 */
export const setCookieConsent = (consent: boolean): void => {
  Cookies.set(COOKIE_NAMES.CONSENT, consent.toString(), { 
    expires: COOKIE_EXPIRY,
    sameSite: 'strict'
  });
};

/**
 * Set cookie preferences
 */
export const setCookiePreferences = (preferences: Record<string, unknown> | { necessary: boolean; analytics: boolean; marketing: boolean }): void => {
  Cookies.set(COOKIE_NAMES.PREFERENCES, JSON.stringify(preferences), { 
    expires: COOKIE_EXPIRY,
    sameSite: 'strict'
  });
};

/**
 * Clear all consent cookies
 */
export const clearConsentCookies = (): void => {
  Cookies.remove(COOKIE_NAMES.CONSENT);
  Cookies.remove(COOKIE_NAMES.PREFERENCES);
};

/**
 * Check if analytics cookies are allowed
 */
export const isAnalyticsAllowed = (): boolean => {
  const preferences = getCookiePreferences();
  return preferences?.analytics === true;
};

/**
 * Check if marketing cookies are allowed
 */
export const isMarketingAllowed = (): boolean => {
  const preferences = getCookiePreferences();
  return preferences?.marketing === true;
};

/**
 * Get all cookies for debugging/management
 */
export const getAllCookies = (): Record<string, string> => {
  return Cookies.get();
};

/**
 * Delete all cookies (for testing/reset)
 */
export const deleteAllCookies = (): void => {
  const allCookies = getAllCookies();
  Object.keys(allCookies).forEach(cookieName => {
    Cookies.remove(cookieName);
  });
};
