import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { getSnippetCount } from "@/app/actions/snippet-action";
import { MAX_SNIPPETS_PER_USER } from "@/lib/limits";
import { AddSnippetForm } from "@/app/components/AddSnippetForm";

export default async function AddSnippetPage() {
  const count = await getSnippetCount();

  if (count >= MAX_SNIPPETS_PER_USER) {
    return (
      <div className="fade-in max-w-2xl mx-auto pb-12">
        <Link
          href="/dashboard/my-snippets"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition group mb-6"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to My Snippets
        </Link>
        <div className="rounded-2xl border border-dashed border-slate-800 bg-[#13151b] py-16 px-6 flex flex-col items-center text-center">
          <span className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
            <Lock size={32} />
          </span>
          <h3 className="text-white font-semibold text-lg mb-1">You've hit the free-tier limit</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm">
            DevFlow is running on free hosting right now, so each account can keep up to{" "}
            {MAX_SNIPPETS_PER_USER} snippets at a time. Delete one to make room for a new one.
          </p>
          <Link
            href="/dashboard/my-snippets"
            className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-full px-5 py-2.5 transition shadow text-sm"
          >
            Manage my snippets
          </Link>
        </div>
      </div>
    );
  }

  return <AddSnippetForm remaining={MAX_SNIPPETS_PER_USER - count} />;
}