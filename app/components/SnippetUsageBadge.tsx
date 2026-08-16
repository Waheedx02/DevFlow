// app/components/SnippetUsageBadge.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getSnippetCount } from "@/app/actions/snippet-action";
import { MAX_SNIPPETS_PER_USER } from "@/lib/limits";

export function SnippetUsageBadge() {
  const pathname = usePathname();
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // Add this

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Don't fetch until mounted

    (async () => {
      setIsLoading(true);
      try {
        const c = await getSnippetCount();
        setCount(c);
      } catch (err) {
        console.error("Failed to fetch snippet count:", err);
        setCount(0); // Fallback to 0 if fetch fails
      } finally {
        setIsLoading(false);
      }
    })();
  }, [pathname, mounted]);

  // Don't render until hydrated to avoid build-time errors
  if (!mounted || isLoading) {
    return (
      <div className="h-6 bg-slate-800 rounded-full animate-pulse" />
    );
  }

  if (count === null) {
    return null;
  }

  const atLimit = count >= MAX_SNIPPETS_PER_USER;

  return (
    <span
      className={`inline-flex text-xs font-medium rounded-full px-3 py-1.5 border w-full justify-center ${
        atLimit
          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
          : "text-slate-400 bg-slate-800/50 border-slate-700"
      }`}
    >
      {count}/{MAX_SNIPPETS_PER_USER} snippets
    </span>
  );
}