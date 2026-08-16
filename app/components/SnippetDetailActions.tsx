"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Trash2, Loader2 } from "lucide-react";
import { deleteSnippet } from "@/app/actions/snippet-action";

export function SnippetDetailActions({ snippetId, code }: { snippetId: string; code: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteSnippet(snippetId);
        router.push("/dashboard/my-snippets");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't delete this snippet.");
        setConfirmingDelete(false);
      }
    });
  };

  if (confirmingDelete) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 hidden sm:inline">Delete this snippet?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-bold text-white bg-red-500/90 hover:bg-red-500 transition disabled:opacity-50"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirmingDelete(false)}
          disabled={isPending}
          className="px-3 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white bg-[#13151b] hover:bg-slate-800 border border-slate-800 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white bg-[#13151b] hover:bg-slate-800 border border-slate-800 transition"
      >
        {copied ? <Check size={15} className="text-cyan-400" /> : <Copy size={15} />}
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        onClick={() => setConfirmingDelete(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-slate-400 hover:text-red-400 bg-[#13151b] hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 transition"
      >
        <Trash2 size={15} />
      </button>
      {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
    </div>
  );
}