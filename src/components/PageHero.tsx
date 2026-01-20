import React from "react";
import { cn } from "@/lib/utils";
import { PageSection, SectionContent } from "@/components/PageLayout";

type PageHeroProps = React.ComponentProps<"section"> & {
  size?: "sm" | "md" | "lg" | "xl";
  contentClassName?: string;
};

export function PageHero({
  children,
  className,
  contentClassName,
  size = "lg",
  ...props
}: PageHeroProps) {
  return (
    <PageSection className={cn("pt-24 sm:pt-28 pb-16", className)} {...props}>
      <SectionContent size={size} className={cn("pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20", contentClassName)}>
        {children}
      </SectionContent>
    </PageSection>
  );
}
