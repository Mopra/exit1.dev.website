"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { validateDomain } from "@/lib/domainUtils";

export function MonitorForm() {
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

    const monitoringAppUrl = `https://app.exit1.dev/sign-up?website=${encodeURIComponent(cleanUrl)}`;
    window.location.href = monitoringAppUrl;

    setIsLoading(false);
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
            className={`h-12 bg-foreground/15 border-foreground/40 text-foreground placeholder:text-foreground/60 focus:bg-foreground/20 focus:border-foreground/60 transition-all duration-300 cursor-pointer rounded-lg ${
              error ? "border-destructive focus:border-destructive" : ""
            }`}
            required
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !isFormValid}
          className="h-12 px-8 font-semibold rounded-lg cursor-pointer border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? "Starting..." : "Start Monitoring"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm mt-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="text-base sm:text-lg text-foreground/70 mt-6 text-center font-medium">
        Enter your website URL and we&apos;ll set up monitoring in seconds
      </p>
    </form>
  );
}
