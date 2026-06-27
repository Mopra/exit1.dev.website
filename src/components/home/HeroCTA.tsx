import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonitorForm } from "@/components/MonitorForm";
import { buildSignupUrl } from "@/lib/cta";

/**
 * The homepage hero's call-to-action, sitting just below the laser.
 *  - Primary button for anyone who just wants in (no URL required).
 *  - URL field beneath it for the higher-intent visitor who wants to start
 *    with their own site pre-filled into signup.
 *  - One quiet line that kills the two big objections: cost and account hassle.
 */
export function HeroCTA() {
  return (
    <div className="mx-auto mt-10 sm:mt-12 flex w-full max-w-lg flex-col items-center px-4">
      <Button
        asChild
        size="lg"
        className="rounded-full px-8 py-6 text-base font-semibold cursor-pointer"
      >
        <a href={buildSignupUrl({ campaign: "home_hero", medium: "hero_button" })}>
          Start Monitoring
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </Button>

      <p className="mt-6 mb-3 text-sm text-muted-foreground">
        or start with your site pre-filled
      </p>
      <div className="w-full">
        <MonitorForm
          campaign="home_hero"
          medium="hero_form"
          submitLabel="Monitor"
          helperText={null}
        />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Free forever · No credit card · Sign up with GitHub or Google
      </p>
    </div>
  );
}
