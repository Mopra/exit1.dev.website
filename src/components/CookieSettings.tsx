'use client';

import { useState, useEffect } from 'react';
import { useCookieConsent, type CookiePreferences } from '../hooks/useCookieConsent';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import Link from 'next/link';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border border-primary/20">
        <DialogHeader>
          <DialogTitle>Cookie Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Necessary Cookies */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h5 className="font-mono font-medium text-foreground">Necessary</h5>
                <Badge variant="secondary" className="text-xs font-mono">
                  Required
                </Badge>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Checkbox
                checked={true}
                disabled
              />
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h5 className="font-mono font-medium text-foreground">Analytics</h5>
                <Badge variant="secondary" className="text-xs font-mono">
                  Optional
                </Badge>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Checkbox
                checked={localPreferences.analytics}
                onCheckedChange={(checked) => handlePreferenceChange('analytics', checked as boolean)}
              />
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h5 className="font-mono font-medium text-foreground">Marketing</h5>
                <Badge variant="secondary" className="text-xs font-mono">
                  Optional
                </Badge>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Checkbox
                checked={localPreferences.marketing}
                onCheckedChange={(checked) => handlePreferenceChange('marketing', checked as boolean)}
              />
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground font-light">
          <p>
            <Link 
              href="/privacy" 
              className="text-primary underline decoration-primary/30 hover:decoration-primary transition-all interactive"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSave}
            className="w-full sm:w-auto glass-primary border backdrop-blur-md interactive"
          >
            Save
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto backdrop-blur-md border-primary/20 hover:bg-primary/10 interactive"
          >
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto backdrop-blur-md border-primary/20 hover:bg-primary/10 interactive"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookieSettings;
