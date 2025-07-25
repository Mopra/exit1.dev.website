import { useState, useEffect } from 'react';
import { useCookieConsent, type CookiePreferences } from '../hooks/useCookieConsent';

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookieSettings = ({ isOpen, onClose }: CookieSettingsProps) => {
  const { preferences, acceptSelected } = useCookieConsent();
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Necessary cookies can't be disabled
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    acceptSelected(localPreferences);
    onClose();
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200/50">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-mono font-medium text-gray-900">
                Cookie Settings
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
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

            <div className="mt-6 text-sm text-gray-600 font-light">
              <p>
                <a 
                  href="/privacy" 
                  className="text-gray-900 underline decoration-gray-300 hover:decoration-gray-500 transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50/50 px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-gray-200/50">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-mono font-medium text-white shadow-sm hover:bg-gray-800 transition-all sm:w-auto"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex justify-center rounded-xl bg-gray-100/50 px-4 py-2 text-sm font-mono font-medium text-gray-600 shadow-sm hover:bg-gray-200/50 transition-all border border-gray-200/50 sm:w-auto"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-xl bg-gray-100/50 px-4 py-2 text-sm font-mono font-medium text-gray-600 shadow-sm hover:bg-gray-200/50 transition-all border border-gray-200/50 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieSettings; 