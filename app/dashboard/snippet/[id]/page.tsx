// app/dashboard/snippet/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit } from "lucide-react";
import { getSnippetById } from "@/app/actions/snippet-action";
import { SnippetDetailActions } from "@/app/components/SnippetDetailActions";
import { getLanguageMeta } from "@/lib/languages";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function SnippetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snippet = await getSnippetById(id);

  if (!snippet) notFound();

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back */}
      <Link
        href="/dashboard/my-snippets"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to My Snippets
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight break-words">
            {snippet.title}
          </h1>
          {snippet.description && (
            <p className="text-slate-400 leading-relaxed">{snippet.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getLanguageMeta(snippet.language).color}`}>
              {snippet.language}
            </span>
            <span className="text-xs text-slate-500">
              Created {formatDate(snippet.createdAt)}
            </span>
            {snippet.updatedAt.getTime() !== snippet.createdAt.getTime() && (
              <span className="text-xs text-slate-500">
                · Edited {formatDate(snippet.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/dashboard/snippet/${snippet.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white bg-[#13151b] hover:bg-slate-800 border border-slate-800 transition"
          >
            <Edit size={15} />
            Edit
          </Link>
          <SnippetDetailActions snippetId={snippet.id} code={snippet.code} />
        </div>
      </div>

      {/* Code block */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0a0c10] shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#13151b] border-b border-slate-800 text-xs text-slate-400">
          <span className="font-mono text-slate-300">
            source.{getLanguageMeta(snippet.language).extension}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          </div>
        </div>
        <pre className="text-xs sm:text-sm leading-6 p-4 overflow-x-auto">
          <code dangerouslySetInnerHTML={{ __html: snippet.codeHTML }} />
        </pre>
      </div>
    </div>
  );
}