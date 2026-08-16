"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroCTA() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="w-40 h-12 bg-slate-800 rounded-full animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-lg"
      >
        Go to Dashboard
        <ArrowRight size={18} />
      </Link>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
      <Link
        href="/sign-up"
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-lg"
      >
        Start Free
        <ArrowRight size={18} />
      </Link>
      <Link
        href="/sign-in"
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-cyan-400 bg-[#13151b] hover:bg-slate-800 border border-slate-800 transition"
      >
        Sign In
      </Link>
    </div>
  );
}