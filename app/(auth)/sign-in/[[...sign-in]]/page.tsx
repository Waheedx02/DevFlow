"use client";

import React, { Suspense, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Code2, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

function SignInForm() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("message");

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  

  // Tracks which specific action is in flight, so only the clicked
  // button shows a spinner instead of both at once.
  const [submitting, setSubmitting] = useState<null | "google" | "password">(null);

  const finalizeAndRedirect = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          console.log(session.currentTask);
          return;
        }
        const url = decorateUrl("/dashboard?welcome=1");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  };

  // Handle Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    if (submitting) return;
    setError(null);
    setSubmitting("google");

    try {
      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: "/s/callback",
        redirectUrl: "/dashboard",
      });

      if (error) {
        console.error("Clerk Google OAuth error:", error);
        setError(
          error.message || "Something went wrong with Google Sign Up."
        );
        setSubmitting(null);
      }
    } catch (err) {
      console.error("Google OAuth exception:", err);
      setError("Something went wrong with Google Sign Up.");
      setSubmitting(null);
    }
  };

  // Handle Standard Email/Password Sign In
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting("password");

    const { error: signInError } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (signInError) {
      const errorCode = (signInError as any)?.errors?.[0]?.code;
      if (errorCode === "form_identifier_not_found") {
        router.push("/sign-up?message=Account+not+found.+Please+sign+up+to+access+DevFlow.");
      } else {
        setError(signInError.message || "Invalid email or password.");
      }
      setSubmitting(null);
      return;
    }

    if (signIn.status === "complete") {
      await finalizeAndRedirect();
    } else if (signIn.status === "needs_second_factor") {
      setError("This account requires a second verification step, which isn't supported here yet.");
      setSubmitting(null);
    } else if (signIn.status === "needs_client_trust") {
      setError("Additional verification is required to finish signing in.");
      setSubmitting(null);
    } else {
      console.log(signIn);
      setError("Additional verification is required to finish signing in.");
      setSubmitting(null);
    }
  };

  const googleLoading = submitting === "google";
  const passwordLoading = submitting === "password";

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#13151b] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 text-white font-bold text-xl">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Code2 size={22} />
            </span>
            DevFlow
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight pt-2">Welcome Back</h1>
          <p className="text-xs text-slate-400">Sign in to access your secure snippet library</p>
        </div>

        {/* Optional Redirect/Error Banner from query params */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          disabled={submitting !== null}
          className="w-full flex items-center justify-center gap-3 bg-[#1a1d26] hover:bg-slate-800 text-white font-medium text-sm rounded-xl py-3 border border-slate-700 transition cursor-pointer shadow-sm disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 15.6C3.5 19.4 7.4 23 12 23z" />
            </svg>
          )}
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3 text-slate-600 text-xs uppercase tracking-wider">
          <div className="h-px bg-slate-800 flex-1" />
          <span>or email</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
              className="w-full rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 px-4 py-2.5 bg-[#0f1117] border border-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 px-4 py-2.5 bg-[#0f1117] border border-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={submitting !== null}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl py-2.5 transition shadow-lg shadow-cyan-500/20 text-sm disabled:opacity-50 cursor-pointer"
          >
            {passwordLoading ? "Signing in..." : "Sign In"}
            {passwordLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ArrowRight size={16} />
            )}
          </button>
        </form>

        {/* Footer Redirect */}
        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-cyan-400 hover:underline font-semibold">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}