import { useState } from 'react';
import { useCookieConsent, type CookiePreferences } from '../hooks/useCookieConsent';

const CookieConsent = () => {
  const {
    showBanner,
    preferences,
    acceptAll,
    acceptSelected,
    rejectAll,
  } = useCookieConsent();

  const [showDetails, setShowDetails] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  const handleAcceptSelected = () => {
    acceptSelected(localPreferences);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Necessary cookies can't be disabled
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Main Content */}
              <div className="flex-1">
                <h3 className="text-lg font-mono font-medium text-gray-900 mb-2">
                  Cookies
                </h3>
                <p className="text-sm text-gray-600 font-light">
                  We use cookies to improve your experience.{' '}
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2 text-sm font-mono text-gray-600 bg-gray-100/50 hover:bg-gray-200/50 rounded-xl transition-all duration-200 border border-gray-200/50"
                >
                  {showDetails ? 'Hide' : 'Settings'}
                </button>
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-sm font-mono text-gray-600 bg-gray-100/50 hover:bg-gray-200/50 rounded-xl transition-all duration-200 border border-gray-200/50"
                >
                  Reject
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 text-sm font-mono text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  Accept
                </button>
              </div>
            </div>

            {/* Detailed Preferences */}
            {showDetails && (
              <div className="mt-6 pt-6 border-t border-gray-200/50">
                <div className="space-y-4">
                  {/* Necessary Cookies */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h5 className="font-mono font-medium text-gray-900">Necessary</h5>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-mono">
                          Required
                        </span>
                      </div>
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
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-mono">
                          Optional
                        </span>
                      </div>
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

                {/* Save Preferences Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAcceptSelected}
                    className="px-6 py-2 text-sm font-mono font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 