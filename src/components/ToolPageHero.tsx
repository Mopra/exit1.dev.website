import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";

interface ToolPageHeroProps {
  title: string;
  description: string;
  toolName: string;
  href: string;
}

export function ToolPageHero({
  title,
  description,
  toolName,
  href,
}: ToolPageHeroProps) {
  return (
    <PageHero
      size="lg"
      breadcrumb={
        <Breadcrumbs
          items={[
            { name: "Tools", href: "/tools" },
            { name: toolName, href },
          ]}
        />
      }
    >
      <div className="text-center">
        <p className="text-sm font-mono text-primary mb-4 tracking-wide uppercase">
          Free Tool
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </PageHero>
  );
}
