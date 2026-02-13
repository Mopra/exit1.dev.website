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

    const monitoringAppUrl = `https://app.exit1.dev/?website=${encodeURIComponent(cleanUrl)}`;
    window.open(monitoringAppUrl, "_blank");

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
            className={`h-12 bg-white/15 border-white/40 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/60 transition-all duration-300 cursor-pointer rounded-lg ${
              error ? "border-red-400 focus:border-red-400" : ""
            }`}
            required
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !isFormValid}
          className="h-12 px-8 font-semibold bg-white/20 hover:bg-white/30 border border-white/40 text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? "Starting..." : "Start Monitoring"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="text-base sm:text-lg text-white/70 mt-6 text-center font-medium">
        Enter your website URL and we&apos;ll set up monitoring in seconds
      </p>
    </form>
  );
}
