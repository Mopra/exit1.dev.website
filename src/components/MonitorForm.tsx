"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowRight } from "lucide-react";
import { validateDomain } from "@/lib/domainUtils";
import { buildSignupUrl } from "@/lib/cta";
import { trackSignupClick } from "@/lib/analytics";

interface MonitorFormProps {
  /** UTM campaign for attribution, e.g. "home_hero". */
  campaign?: string;
  /** UTM medium / placement, e.g. "hero_form". */
  medium?: string;
  /** Submit button label. */
  submitLabel?: string;
  /** Helper text under the field. Pass null to hide it. */
  helperText?: string | null;
}

export function MonitorForm({
  campaign = "website",
  medium = "monitor_form",
  submitLabel = "Start Monitoring",
  helperText = "Enter your website URL and we'll set up monitoring in seconds",
}: MonitorFormProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    cursorPositionRef.current = e.target.selectionStart || 0;

    if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
      if (value.length > 0) {
        value = `https://${value}`;
        const newCursorPos = cursorPositionRef.current + 8;
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      }
    }

    setWebsiteUrl(value);

    if (error) {
      setError("");
    }

    if (value.trim()) {
      const validation = validateDomain(value);
      if (!validation.isValid) {
        setError(validation.error || "");
      }
    }
  };

  const handleStartMonitoring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    const validation = validateDomain(websiteUrl);
    if (!validation.isValid) {
      setError(validation.error || "");
      return;
    }

    setIsLoading(true);

    let cleanUrl = websiteUrl.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    // This is a programmatic navigation, not an anchor click, so the delegated
    // listener in DeferredAnalytics won't see it — fire the conversion here.
    trackSignupClick({ campaign, medium });
    window.location.href = buildSignupUrl({ campaign, medium, target: cleanUrl });
  };

  const isFormValid = websiteUrl.trim() && !error;

  return (
    <form onSubmit={handleStartMonitoring}>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="example.com"
            value={websiteUrl}
            onChange={handleInputChange}
            aria-label="Your website URL"
            className={`h-12 bg-foreground/15 border-foreground/40 text-foreground placeholder:text-foreground/60 focus:bg-foreground/20 focus:border-foreground/60 transition-all duration-300 cursor-text rounded-lg ${
              error ? "border-destructive focus:border-destructive" : ""
            }`}
            required
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !isFormValid}
          className="h-12 px-6 font-semibold rounded-lg cursor-pointer border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? "Starting..." : submitLabel}
          {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm mt-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helperText && (
        <p className="text-sm text-foreground/60 mt-4 text-center">
          {helperText}
        </p>
      )}
    </form>
  );
}
