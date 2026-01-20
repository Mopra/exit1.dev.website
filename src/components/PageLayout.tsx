import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PageBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_top,rgba(99,179,255,0.12),rgba(99,179,255,0.04)_35%,transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_top,rgba(147,197,253,0.08),transparent_45%)] blur-3xl"
      />
    </>
  );
}

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-black text-white relative overflow-hidden", className)}>
      <PageBackground />
      <div className="relative z-10">
        {children}
        <FinalCta />
      </div>
    </div>
  );
}

export function PageContainer({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto max-w-6xl border-inset-x", className)} {...props}>
      {children}
    </div>
  );
}

export function PageSection({
  children,
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("relative border-inset-top px-4 sm:px-0", className)} {...props}>
      {children}
    </section>
  );
}

const contentWidths = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
};

export function SectionContent({
  children,
  className,
  size = "md",
  ...props
}: React.ComponentProps<"div"> & { size?: keyof typeof contentWidths }) {
  return (
    <div
      className={cn("mx-auto", contentWidths[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function FinalCta() {
  return (
    <PageContainer>
      <PageSection id="final-cta" className="py-20">
        <div className="text-center p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto">
            <Button
              asChild
              size="lg"
              className="rounded-full w-full px-16 py-12 text-3xl sm:text-4xl font-semibold bg-white text-black hover:bg-white/90 cursor-pointer"
            >
              <a
                href="https://app.exit1.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-4 cursor-pointer"
              >
                Start Monitoring
                <ArrowRight
                  className="flex-shrink-0"
                  style={{ width: "1em", height: "1em", marginTop: "0.15em" }}
                  strokeWidth={3}
                />
              </a>
            </Button>
          </div>
        </div>
      </PageSection>
    </PageContainer>
  );
}
