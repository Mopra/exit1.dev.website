import { useState } from 'react';
import { useCookieConsent, type CookiePreferences } from '../hooks/useCookieConsent';

const CookieIcon = () => {
  const {
    showBanner,
    preferences,
    acceptAll,
    acceptSelected,
    rejectAll,
    showSettings,
  } = useCookieConsent();

  const [showDetails, setShowDetails] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  const handleAcceptSelected = () => {
    acceptSelected(localPreferences);
    setShowDetails(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Necessary cookies can't be disabled
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleIconClick = () => {
    if (!showBanner) {
      showSettings();
      setShowDetails(true);
    }
  };

  const handleClose = () => {
    setShowDetails(false);
  };

  return (
    <>
      {/* Cookie Icon - Always visible in bottom left */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={handleIconClick}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:bg-gray-50"
          title="Cookie Settings"
        >
          <svg 
            className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            <circle cx="9" cy="9" r="1.5"/>
            <circle cx="15" cy="9" r="1"/>
            <circle cx="12" cy="15" r="1"/>
            <circle cx="8" cy="13" r="0.5"/>
            <circle cx="16" cy="13" r="0.8"/>
          </svg>
        </button>
      </div>

      {/* Cookie Settings Modal */}
      {(showBanner || showDetails) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="relative max-w-md w-full mx-4">
            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl">
              <div className="p-6">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-mono font-medium text-gray-900 mb-2">
                    Cookie Settings
                  </h3>
                  <p className="text-sm text-gray-600 font-light">
                    Manage your cookie preferences.{' '}
                    <a 
                      href="/privacy" 
                      className="text-gray-900 underline decoration-gray-300 hover:decoration-gray-500 transition-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View privacy policy
                    </a>
                  </p>
                </div>

                {/* Cookie Categories */}
                <div className="space-y-4 mb-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h5 className="font-mono font-medium text-gray-900">Necessary</h5>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-mono">
                          Required
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Essential for basic website functionality</p>
                    </div>
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                      />
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h5 className="font-mono font-medium text-gray-900">Analytics</h5>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full font-mono">
                          Auto-enabled
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Help us improve the website performance</p>
                    </div>
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={localPreferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                      />
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h5 className="font-mono font-medium text-gray-900">Marketing</h5>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-mono">
                          Optional
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Personalized ads and content</p>
                    </div>
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={localPreferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={rejectAll}
                    className="flex-1 px-4 py-2 text-sm font-mono text-gray-600 bg-gray-100/50 hover:bg-gray-200/50 rounded-xl transition-all duration-200 border border-gray-200/50"
                  >
                    Reject Optional
                  </button>
                  <button
                    onClick={acceptAll}
                    className="flex-1 px-4 py-2 text-sm font-mono text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all duration-200"
                  >
                    Accept All
                  </button>
                </div>

                <div className="mt-3">
                  <button
                    onClick={handleAcceptSelected}
                    className="w-full px-4 py-2 text-sm font-mono font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200"
                  >
                    Save Current Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieIcon;