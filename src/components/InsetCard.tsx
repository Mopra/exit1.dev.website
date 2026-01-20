import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function InsetCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "border-0 shadow-none rounded-none bg-black text-white border-inset gap-0 py-0",
        className
      )}
      {...props}
    />
  );
}
