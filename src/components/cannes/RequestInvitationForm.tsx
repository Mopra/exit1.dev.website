"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "loading" | "success" | "error";

export function RequestInvitationForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/request-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 text-left backdrop-blur-md">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <div>
            <p className="font-semibold text-foreground">You&apos;re on the list.</p>
            <p className="text-sm text-muted-foreground">
              We&apos;ll be in touch with your invitation soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") {
              setStatus("idle");
              setError("");
            }
          }}
          aria-label="Email address"
          aria-invalid={status === "error"}
          className={`h-12 flex-1 bg-foreground/10 border-foreground/20 text-foreground placeholder:text-foreground/50 backdrop-blur-md transition-all duration-300 ${
            status === "error" ? "border-destructive focus:border-destructive" : ""
          }`}
          required
        />
        <Button
          type="submit"
          size="lg"
          disabled={status === "loading"}
          className="h-12 cursor-pointer px-6 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? (
            "Requesting…"
          ) : (
            <>
              Request Invitation
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </>
          )}
        </Button>
      </div>

      {status === "error" && error && (
        <div className="mt-2 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/20 p-2 text-sm text-destructive backdrop-blur-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="mt-3 text-xs text-foreground/60">
        Limited seats.
      </p>
    </form>
  );
}
