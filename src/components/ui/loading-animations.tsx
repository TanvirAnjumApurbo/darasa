"use client";

import { cn } from "@/lib/utils";

interface BouncingDotsProps {
  className?: string;
}

export function BouncingDots({ className }: BouncingDotsProps) {
  return (
    <div
      className={cn("flex space-x-1 justify-center items-center", className)}
    >
      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
    </div>
  );
}

interface ContentSkeletonProps {
  lines?: number;
  className?: string;
}

export function ContentSkeleton({
  lines = 3,
  className,
}: ContentSkeletonProps) {
  return (
    <div className={cn("space-y-3 animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
