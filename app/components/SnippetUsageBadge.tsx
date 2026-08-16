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

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const c = await getSnippetCount();
        setCount(c);
      } catch (err) {
        console.error("Failed to fetch snippet count:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [pathname]); // Refetch whenever route changes

  if (isLoading) {
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