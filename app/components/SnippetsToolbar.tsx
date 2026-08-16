// app/components/SnippetsToolbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

export function SnippetsToolbar({ languages }: { languages: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") ?? "";
  const currentLang = searchParams.get("lang") ?? "";

  const [searchInput, setSearchInput] = useState(currentQuery);

  // Debounce search input → URL update
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) {
        params.set("q", searchInput);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 350);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const setLanguageFilter = (lang: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (lang) {
      params.set("lang", lang);
    } else {
      params.delete("lang");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const tags = ["All", ...languages];

  return (
    <>
      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-3xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search your snippets"
            className="w-full rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition pl-10 pr-4 py-2.5 bg-[#17191f] border border-slate-800"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate-300 transition border border-slate-800 bg-[#17191f] hover:border-slate-600 hover:text-white">
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = tag === "All" ? !currentLang : currentLang === tag;
          return (
            <button
              key={tag}
              onClick={() => setLanguageFilter(tag === "All" ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-xs transition border ${
                isActive
                  ? "font-bold text-slate-950 bg-slate-200 border-transparent"
                  : "font-medium text-slate-400 bg-[#17191f] border-slate-700 hover:border-slate-500 hover:text-white"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </>
  );
}