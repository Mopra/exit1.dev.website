import React from "react";
import { Circle } from "lucide-react";
import { FeatureGridItem } from "@/components/FeatureGridItem";
import { PageSection } from "@/components/PageLayout";

export interface RelatedFeature {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

interface RelatedFeaturesProps {
  title?: string;
  description?: string;
  features: RelatedFeature[];
  id?: string;
  className?: string;
}

export function RelatedFeatures({
  title = "Related Features",
  description = "See how this works with our other monitoring tools",
  features,
  id = "related-features",
  className,
}: RelatedFeaturesProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <>
      <PageSection id={id} className={`py-16 scroll-mt-20 ${className || ""}`}>
        <div className="text-center mb-12 sm:mb-16 px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </PageSection>
      <PageSection className="!px-0">
        <div className="md:grid md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureGridItem
              key={index}
              href={feature.href}
              title={feature.title}
              description={feature.description}
              icon={feature.icon || <Circle className="w-6 h-6 text-white" />}
            />
          ))}
        </div>
      </PageSection>
    </>
  );
}
