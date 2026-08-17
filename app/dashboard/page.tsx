// app/dashboard/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { Plus, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { SnippetCard } from "@/app/components/SnippetCard";
import { SnippetsToolbar } from "@/app/components/SnippetsToolbar";
import { getAllSnippets, getSnippetLanguages, hasAnySnippets } from "@/app/actions/snippet-action";

export const dynamic = "force-dynamic";

export default async function DashboardHome({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lang?: string }>;
}) {
  const { q, lang } = await searchParams;

  let snippets, languages, hasAny;

  try {
    [snippets, languages, hasAny] = await Promise.all([
      getAllSnippets({ query: q, language: lang }),
      getSnippetLanguages(),
      hasAnySnippets(),
    ]);
  } catch (error) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-red-500 text-xl font-bold mb-4">Data fetch failed</h1>
        <pre className="bg-slate-800 p-4 rounded overflow-auto text-sm whitespace-pre-wrap">
          {error instanceof Error ? `${error.message}\n\n${error.stack}` : String(error)}
        </pre>
      </div>
    );
  }

  const isFiltering = Boolean(q || lang);

  return (
    <div className="fade-in space-y-8 max-w-[1400px] mx-auto">
      {/* Hero Section */}
      <section className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Sparkles size={18} />
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Code Snippets
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl">
            Store, organize, and instantly access your most useful code snippets. Write once, reuse everywhere.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/dashboard/add"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-lg hover:shadow-xl"
          >
            <Plus size={18} strokeWidth={2.5} />
            New Snippet
          </Link>
          <Link
            href="/dashboard/my-snippets"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition"
          >
            <TrendingUp size={18} strokeWidth={2.5} />
            View All
          </Link>
        </div>
      </section>

      {/* Search & Filters - WRAPPED IN SUSPENSE */}
      <section className="space-y-4">
        <Suspense fallback={<div className="h-32 bg-slate-800 rounded-xl animate-pulse" />}>
          <SnippetsToolbar languages={languages} />
        </Suspense>
      </section>

      {/* Results Section */}
      {snippets.length === 0 ? (
        !hasAny ? (
          <EmptyLibrary />
        ) : (
          <NoResults query={q} language={lang} />
        )
      ) : (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-cyan-400" />
                Recent Snippets
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {snippets.length} snippet{snippets.length === 1 ? "" : "s"} found
              </p>
            </div>
            {isFiltering && (
              <Link
                href="/dashboard"
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
              >
                Clear filters
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyLibrary() {
  return (
    <section className="py-20">
      <div className="rounded-2xl border border-dashed border-slate-700 bg-gradient-to-br from-slate-800/30 to-slate-900/20 py-20 px-6 flex flex-col items-center text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Plus size={32} />
          </div>
        </div>
        <h3 className="text-white font-bold text-xl mb-2">No snippets yet</h3>
        <p className="text-slate-400 text-sm mb-8 max-w-sm leading-relaxed">
          Create your first code snippet to start building your personal reference library. It only takes a few seconds.
        </p>
        <Link
          href="/dashboard/add"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-lg hover:shadow-xl"
        >
          <Plus size={18} strokeWidth={2.5} />
          Create Your First Snippet
        </Link>
      </div>
    </section>
  );
}

function NoResults({ query, language }: { query?: string; language?: string }) {
  const description =
    query && language
      ? `No snippets match "${query}" in ${language}`
      : query
      ? `No snippets match "${query}"`
      : `No snippets in ${language}`;

  return (
    <section className="py-20">
      <div className="rounded-2xl border border-dashed border-slate-700 bg-gradient-to-br from-slate-800/30 to-slate-900/20 py-20 px-6 flex flex-col items-center text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-700/50 border border-slate-600 text-slate-400 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <h3 className="text-white font-bold text-xl mb-2">No matching snippets</h3>
        <p className="text-slate-400 text-sm mb-8 max-w-sm">{description}. Try adjusting your search or filters.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition"
        >
          Clear all filters
        </Link>
      </div>
    </section>
  );
}