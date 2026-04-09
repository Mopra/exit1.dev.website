import React from "react";
import { cn } from "@/lib/utils";
import { PageSection, SectionContent } from "@/components/PageLayout";

type PageHeroProps = React.ComponentProps<"section"> & {
  size?: "sm" | "md" | "lg" | "xl";
  contentClassName?: string;
  breadcrumb?: React.ReactNode;
};

export function PageHero({
  children,
  className,
  contentClassName,
  breadcrumb,
  size = "lg",
  ...props
}: PageHeroProps) {
  return (
    <>
      {breadcrumb && (
        <div className="pt-20 sm:pt-24 pb-5 px-4 sm:px-0">
          <SectionContent size={size}>
            {breadcrumb}
          </SectionContent>
        </div>
      )}
      <PageSection className={cn(breadcrumb ? "pt-8 sm:pt-12 pb-16" : "pt-24 sm:pt-28 pb-16", className)} {...props}>
        <SectionContent size={size} className={cn("pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20", contentClassName)}>
          {children}
        </SectionContent>
      </PageSection>
    </>
  );
}
