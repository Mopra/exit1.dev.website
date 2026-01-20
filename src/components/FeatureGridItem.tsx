import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FeatureGridItemProps {
  href?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function FeatureGridItem({
  href,
  title,
  description,
  icon,
  className,
}: FeatureGridItemProps) {
  const content = (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-white/60 leading-relaxed">{description}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "group block bg-black px-20 py-20 cursor-pointer border-inset",
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "group block bg-black px-20 py-20 border-inset",
        className
      )}
    >
      {content}
    </div>
  );
}
