"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="w-48 h-16 bg-slate-800 rounded-full animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-lg shadow-white/10"
      >
        Open Dashboard
        <ArrowRight size={18} />
      </Link>
    );
  }

  return (
    <Link
      href="/sign-up"
      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-lg shadow-white/10"
    >
      Get Started Free
      <ArrowRight size={18} />
    </Link>
  );
}