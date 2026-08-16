"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NavAuthButtons() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="w-20 h-10 bg-slate-800 rounded-full animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <>
        <Link
          href="/dashboard"
          className="px-5 py-2 text-sm font-bold text-white hover:text-cyan-400 transition"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/add"
          className="px-5 py-2.5 rounded-full text-sm font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
        >
          New Snippet
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="px-5 py-2 text-sm font-bold text-slate-400 hover:text-white transition"
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className="px-5 py-2.5 rounded-full text-sm font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
      >
        Get Started
      </Link>
    </>
  );
}