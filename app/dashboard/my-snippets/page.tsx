// app/dashboard/my-snippets/page.tsx
import Link from "next/link";
import { Plus, Library, ArrowRight, Settings2 } from "lucide-react";
import { SnippetCard } from "@/app/components/SnippetCard";
import { SnippetsToolbar } from "@/app/components/SnippetsToolbar";
import { getAllSnippets, getSnippetLanguages, hasAnySnippets } from "@/app/actions/snippet-action";

export default async function MySnippetsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lang?: string }>;
}) {
  const { q, lang } = await searchParams;

  const [snippets, languages, hasAny] = await Promise.all([
    getAllSnippets({ query: q, language: lang }),
    getSnippetLanguages(),
    hasAnySnippets(),
  ]);

  const isFiltering = Boolean(q || lang);
  const totalSnippets = snippets.length;

  return (
    <div className="fade-in space-y-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Library size={24} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  My Snippets
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  {totalSnippets} snippet{totalSnippets === 1 ? "" : "s"} in your library
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard/add"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-lg hover:shadow-xl order-2 sm:order-1"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">New Snippet</span>
              <span className="sm:hidden">Add</span>
            </Link>
            {isFiltering && (
              <Link
                href="/dashboard/my-snippets"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition order-1 sm:order-2"
              >
                <Settings2 size={18} />
                <span className="hidden sm:inline">Clear Filters</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Search & Filters Section */}
      {hasAny && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filter & Search</span>
            {isFiltering && (
              <span className="px-2 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                Active
              </span>
            )}
          </div>
          <SnippetsToolbar languages={languages} />
        </section>
      )}

      {/* Results Section */}
      {snippets.length === 0 ? (
        !hasAny ? (
          <EmptyLibrary />
        ) : (
          <NoResults query={q} language={lang} />
        )
      ) : (
        <section className="space-y-6">
          {/* Results header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                {isFiltering ? "Search Results" : "All Snippets"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {isFiltering
                  ? `Found ${totalSnippets} snippet${totalSnippets === 1 ? "" : "s"}`
                  : `${totalSnippets} total snippet${totalSnippets === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>

          {/* Snippets Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>

          {/* Results info */}
          {isFiltering && (
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-800/30">
              <p className="text-sm text-slate-400">
                Showing <span className="font-semibold text-white">{totalSnippets}</span> result{totalSnippets === 1 ? "" : "s"}
              </p>
              <Link
                href="/dashboard/my-snippets"
                className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function EmptyLibrary() {
  return (
    <section className="py-24">
      <div className="rounded-2xl border border-dashed border-slate-700 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-slate-900/30 py-24 px-6 flex flex-col items-center text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
            <Library size={40} />
          </div>
          <div className="absolute inset-0 blur-3xl -z-10 pointer-events-none" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">Your snippet library is empty</h3>
        <p className="text-slate-400 text-base mb-10 max-w-md leading-relaxed">
          Start building your personal code repository. Save your first snippet and organize your most useful code patterns in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/add"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-lg hover:shadow-xl"
          >
            <Plus size={18} strokeWidth={2.5} />
            Create Your First Snippet
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition"
          >
            Go to Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Helpful tips */}
        <div className="mt-12 pt-12 border-t border-slate-700/50 max-w-sm space-y-4">
          <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Quick Tips</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">•</span>
              <span>Add snippets with multiple languages and organize by tags</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">•</span>
              <span>Search by title, description, or programming language</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">•</span>
              <span>Edit and update your snippets anytime</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function NoResults({ query, language }: { query?: string; language?: string }) {
  const getDescription = () => {
    if (query && language) {
      return `No snippets found matching "${query}" in ${language}`;
    }
    if (query) {
      return `No snippets found matching "${query}"`;
    }
    return `No snippets tagged with ${language}`;
  };

  const getSuggestion = () => {
    if (query && language) {
      return `Try adjusting your search term or selecting a different language.`;
    }
    if (query) {
      return `Try using different keywords or browse by language.`;
    }
    return `Browse other languages or adjust your filters.`;
  };

  return (
    <section className="py-24">
      <div className="rounded-2xl border border-dashed border-slate-700 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-slate-900/30 py-24 px-6 flex flex-col items-center text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-slate-700/50 border border-slate-600 text-slate-400 flex items-center justify-center mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">No matching snippets</h3>
        <p className="text-slate-400 text-base mb-2">{getDescription()}</p>
        <p className="text-slate-500 text-sm mb-10 max-w-md">{getSuggestion()}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/my-snippets"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition"
          >
            Clear all filters
          </Link>
          <Link
            href="/dashboard/add"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-lg hover:shadow-xl"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add New Snippet
          </Link>
        </div>
      </div>
    </section>
  );
}