import Link from "next/link";
import { ChevronRight } from "lucide-react";
import StructuredData from "@/components/StructuredData";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ name: "Home", href: "/" }, ...items];

  return (
    <>
      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: allItems.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `https://exit1.dev${item.href}`,
          })),
        }}
      />
      <nav aria-label="Breadcrumb" className="w-full max-w-4xl mx-auto">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          {allItems.map((item, i) => {
            const isLast = i === allItems.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                )}
                {isLast ? (
                  <span className="text-white font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
