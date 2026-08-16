"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Edit2, Trash2, Loader2, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteSnippet } from "@/app/actions/snippet-action";
import { getLanguageMeta } from "@/lib/languages";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";

export interface Snippet {
  id?: string;
  title: string;
  description: string;
  timeAgo?: string;
  language: string;
  codeHTML: string;
}

export function SnippetCard({ snippet }: { snippet: Snippet }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!snippet.id || isPending) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteSnippet(snippet.id!);
        router.refresh();
        setShowConfirm(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't delete this snippet.");
        setShowConfirm(false);
      }
    });
  };

  const languageMeta = getLanguageMeta(snippet.language);

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300 bg-[#13151b] hover:shadow-xl hover:shadow-cyan-500/5 h-full flex flex-col">
      {/* Invisible link covering card */}
      <Link
        href={`/dashboard/snippet/${snippet.id}`}
        className="absolute inset-0 z-0"
        aria-label={`View ${snippet.title}`}
      />

      {/* Action buttons - visible on hover */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 translate-y-1 group-hover:translate-y-0">
        <Link
          href={`/dashboard/snippet/${snippet.id}/edit`}
          className="relative p-2 rounded-lg bg-slate-900/95 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors backdrop-blur-sm"
          title="Edit snippet"
        >
          <Edit2 size={16} />
        </Link>
        <button
          onClick={handleDeleteClick}
          disabled={isPending}
          className="relative p-2 rounded-lg bg-slate-900/95 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors disabled:opacity-50 backdrop-blur-sm"
          title="Delete snippet"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>

      {/* Code Preview Section */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-gradient-to-br from-[#0a0c10] to-[#161b22] border-b border-slate-800/50">
        <pre className="absolute inset-0 h-full overflow-hidden text-[10px] leading-4 font-mono text-slate-300 p-3 pointer-events-none">
          <code dangerouslySetInnerHTML={{ __html: snippet.codeHTML }} />
        </pre>
        
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#13151b] via-[#13151b]/50 to-transparent pointer-events-none" />

        {/* Language badge overlay */}
        <div className="absolute bottom-2 left-3 z-5 pointer-events-none">
          <span className={`inline-block text-[9px] font-bold px-2 py-1 rounded-md border ${languageMeta.color}`}>
            {snippet.language}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3 flex-1 flex flex-col pointer-events-none z-0">
        {/* Title */}
        <div>
          <h3 className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors line-clamp-2">
            {snippet.title}
          </h3>
        </div>

        {/* Description */}
        {snippet.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {snippet.description}
          </p>
        )}

        {/* Footer with metadata */}
        <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between text-xs">
          <span className="text-slate-500">{snippet.timeAgo || "Recently saved"}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy size={12} className="text-slate-500" />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-[10px] text-red-400 mt-auto">{error}</p>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showConfirm}
        title="Delete this snippet?"
        description={`"${snippet.title}" will be permanently removed. This can't be undone.`}
        isLoading={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}