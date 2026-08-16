"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Save, FileText, Terminal, Layers, AlertCircle } from "lucide-react";
import { updateSnippet } from "@/app/actions/snippet-action";
import { getLanguageOptions } from "@/lib/languages";
import { getLanguageMeta } from "@/lib/languages";

export function EditSnippetForm({
  id,
  initialTitle,
  initialDescription,
  initialLanguage,
  initialCode,
}: {
  id: string;
  initialTitle: string;
  initialDescription: string;
  initialLanguage: string;
  initialCode: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("language", language);
    formData.set("code", code);

    startTransition(async () => {
      const result = await updateSnippet(id, { error: null }, formData);
      if (result?.error) {
        setError(result.error);
      }
      // On success, updateSnippet's own redirect() sends us to the detail page.
    });
  };

  // If the saved language isn't in the dropdown list (e.g. edited directly
  // in the DB, or the list changed since this snippet was created), add it
  // so the <select> doesn't silently fall back to the first option.
  const languageOptions = getLanguageOptions(initialLanguage);

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Navigation / Back Button */}
      <div>
        <Link
          href={`/dashboard/snippet/${id}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Snippet
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Save size={24} />
            </span>
            Edit Snippet
          </h1>
          <p className="text-slate-400 mt-1">Update your saved code and details.</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title & Language Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Snippet Title <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <FileText size={16} />
              </span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Custom React Debounce Hook"
                className="w-full rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition pl-11 pr-4 py-3 bg-[#13151b] border border-slate-800 hover:border-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Language <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Layers size={16} />
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition pl-11 pr-4 py-3 bg-[#13151b] border border-slate-800 hover:border-slate-700 appearance-none cursor-pointer"
              >
                {languageOptions.map((lang) => (
                  <option key={lang} value={lang} className="bg-[#13151b] text-white">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description Textarea */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Description <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what this snippet does and how to use it..."
            className="w-full rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition p-4 bg-[#13151b] border border-slate-800 hover:border-slate-700 resize-none leading-relaxed"
          />
        </div>

        {/* Code Input Block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Source Code <span className="text-cyan-400">*</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">Monospace view</span>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0a0c10] shadow-2xl focus-within:ring-2 focus-within:ring-cyan-500/30 transition">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#13151b] border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-cyan-400" />
                <span className="font-mono text-slate-300">editor.{getLanguageMeta(language).extension}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
              </div>
            </div>

            <textarea
              required
              rows={12}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste or write your code snippet here..."
              className="w-full font-mono text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none p-4 bg-transparent resize-y leading-6 selection:bg-cyan-500/30"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link
            href={`/dashboard/snippet/${id}`}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white bg-[#13151b] hover:bg-slate-800 border border-slate-800 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-full px-6 py-2.5 transition shadow-lg shadow-cyan-500/20 text-sm disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}