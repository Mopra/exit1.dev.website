import { ArrowRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSignupUrl } from "@/lib/cta";

interface FollowCTAProps {
  slug: string;
  name: string;
  host: string;
  /** "hero" sits under the instant answer; "inline" closes the outage history. */
  placement: "hero" | "inline";
}

/**
 * "Alert me when X goes down". Someone searching "is npm down" has the
 * problem right now, and the check behind this page already runs, so the ask
 * is tiny. The slug rides through sign-up and the app follows it on arrival.
 * sign_up_click fires from the delegated listener in DeferredAnalytics.
 */
export function FollowCTA({ slug, name, host, placement }: FollowCTAProps) {
  const href = buildSignupUrl({ campaign: "follow_service", medium: `status_${placement}`, follow: slug });

  if (placement === "hero") {
    return (
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Button asChild size="lg" className="rounded-full px-6 font-semibold cursor-pointer w-full sm:w-auto">
          <a href={href}>
            <Bell className="w-4 h-4 mr-1.5" />
            Alert me when {name} goes down
          </a>
        </Button>
        <span className="text-sm text-muted-foreground">
          Free. One email when it breaks, one when it&apos;s back.
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-primary/25 bg-primary/[0.07] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border bg-primary/15 border-primary/30 text-primary">
        <Bell className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">Hear about the next {name} outage first</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          We check {host} around the clock. Follow it and we&apos;ll email you the moment it
          goes down.
        </p>
      </div>
      <Button asChild size="lg" className="rounded-full px-6 font-semibold shrink-0 cursor-pointer w-full sm:w-auto">
        <a href={href}>
          Alert me
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </a>
      </Button>
    </div>
  );
}
