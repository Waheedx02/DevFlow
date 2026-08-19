"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Code2, Loader2, ShieldCheck } from "lucide-react";

export default function SSOCallback() {
  return (
    <>
      {/* Clerk handles the actual OAuth callback */}
      <AuthenticateWithRedirectCallback />

      {/* DevFlow loading UI */}
      <main className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/5 blur-3xl rounded-full" />
          </div>

          <div className="relative bg-[#13151b] border border-slate-800 rounded-2xl p-8 shadow-2xl">
            {/* Brand */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2.5 text-white font-bold text-xl">
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Code2 size={22} />
                </span>

                <span>DevFlow</span>
              </div>
            </div>

            {/* Loading icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Loader2
                    size={28}
                    className="text-cyan-400 animate-spin"
                  />
                </div>

                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#13151b] border border-slate-800 flex items-center justify-center">
                  <ShieldCheck size={13} className="text-cyan-400" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center space-y-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Signing you in
              </h1>

              <p className="text-sm text-slate-400">
                Securely connecting your Google account to DevFlow...
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mt-7">
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-cyan-500 rounded-full animate-[loading_1.4s_ease-in-out_infinite]" />
              </div>
            </div>

            {/* Security message */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={14} className="text-cyan-500/70" />

              <span>Your authentication is securely handled by Clerk</span>
            </div>
          </div>

          {/* Bottom text */}
          <p className="relative text-center text-xs text-slate-600 mt-5">
            DevFlow · Your personal code snippet library
          </p>
        </div>

        <style jsx>{`
          @keyframes loading {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(200%);
            }
          }
        `}</style>
      </main>
    </>
  );
}