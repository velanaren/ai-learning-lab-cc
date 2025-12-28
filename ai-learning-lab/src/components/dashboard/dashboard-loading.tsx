"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function DashboardLoading() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed left-0 right-0 top-16 z-50 h-1 bg-zinc-100"
      role="progressbar"
      aria-label="Page loading"
      data-testid="loading-indicator"
    >
      <div
        className="h-full w-1/3 animate-pulse bg-zinc-900"
        style={{
          animation: "shimmer 1s ease-in-out infinite",
        }}
      />
    </div>
  );
}
