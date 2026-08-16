"use client";

import React, { Suspense, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code2, ArrowRight, AlertCircle, Loader2, MailCheck, UserCheck } from "lucide-react";

type Step = "form" | "verify" | "exists";

function SignUpForm() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<null | "google" | "password" | "verify" | "resend">(null);

  const finalizeAndRedirect = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          console.log(session.currentTask);
          return;
        }
        const url = decorateUrl("/dashboard?welcome=1&new=1");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  };

  // Handle Google OAuth Sign Up
  const handleGoogleSignUp = async () => {
    if (submitting) return;
    setError(null);
    setSubmitting("google");

    const { error: ssoError } = await signUp.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/s/callback",
      redirectUrl: "/dashboard",
    });

    if (ssoError) {
      setError(ssoError.message || "Something went wrong with Google Sign Up.");
      setSubmitting(null);
    }
    // On success the browser is navigating away — leave the spinner on.
  };

  // Handle Standard Email/Password Sign Up
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting("password");

    const { error: signUpError } = await signUp.password({
      emailAddress: email,
      password,
    });

    if (signUpError) {
      const errorCode = (signUpError as any)?.errors?.[0]?.code;

      // The user-friendly bit: a duplicate account isn't just an error
      // banner, it switches the whole card into a dedicated, helpful state.
      if (errorCode === "form_identifier_exists") {
        setStep("exists");
      } else {
        setError(signUpError.message || "Something went wrong. Please try again.");
      }
      setSubmitting(null);
      return;
    }

    await signUp.verifications.sendEmailCode();
    setStep("verify");
    setSubmitting(null);
  };

  const handleVerify = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting("verify");

    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await finalizeAndRedirect();
    } else {
      setError("That code didn't work. Please check it and try again.");
      setSubmitting(null);
    }
  };

  const handleResendCode = async () => {
    if (submitting) return;
    setError(null);
    setSubmitting("resend");
    await signUp.verifications.sendEmailCode();
    setSubmitting(null);
  };

  const googleLoading = submitting === "google";
  const passwordLoading = submitting === "password";
  const verifyLoading = submitting === "verify";
  const resendLoading = submitting === "resend";

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

          {step === "form" && (
            <>
              <h1 className="text-xl font-bold text-white tracking-tight pt-2">Create your account</h1>
              <p className="text-xs text-slate-400">Start building your secure snippet library</p>
            </>
          )}
          {step === "verify" && (
            <>
              <h1 className="text-xl font-bold text-white tracking-tight pt-2">Check your email</h1>
              <p className="text-xs text-slate-400">
                We sent a verification code to <span className="text-slate-300">{email}</span>
              </p>
            </>
          )}
          {step === "exists" && (
            <>
              <h1 className="text-xl font-bold text-white tracking-tight pt-2">You're already with us</h1>
              <p className="text-xs text-slate-400">This email already has a DevFlow account</p>
            </>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* --- STEP: account already exists --- */}
        {step === "exists" && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-3">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                <UserCheck size={16} />
              </span>
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="text-white font-semibold">{email}</span> is already registered.
                Sign in instead — we'll take you straight there.
              </div>
            </div>

            <button
              onClick={() => router.push(`/sign-in?email=${encodeURIComponent(email)}`)}
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl py-2.5 transition shadow-lg shadow-cyan-500/20 text-sm cursor-pointer"
            >
              Sign in instead
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => {
                setStep("form");
                setError(null);
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-300 transition"
            >
              Use a different email
            </button>
          </div>
        )}

        {/* --- STEP: email verification --- */}
        {step === "verify" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Verification code</label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 px-4 py-2.5 bg-[#0f1117] border border-slate-800 tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={submitting !== null}
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl py-2.5 transition shadow-lg shadow-cyan-500/20 text-sm disabled:opacity-50 cursor-pointer"
            >
              {verifyLoading ? "Verifying..." : "Verify email"}
              {verifyLoading ? <Loader2 size={16} className="animate-spin" /> : <MailCheck size={16} />}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={submitting !== null}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-300 transition disabled:opacity-50"
            >
              {resendLoading ? "Sending a new code..." : "Didn't get it? Resend code"}
            </button>
          </form>
        )}

        {/* --- STEP: sign-up form --- */}
        {step === "form" && (
          <>
            <button
              onClick={handleGoogleSignUp}
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
                {passwordLoading ? "Creating account..." : "Create account"}
                {passwordLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              </button>
            </form>

            <div id="clerk-captcha" />

            <p className="text-center text-xs text-slate-400 pt-2">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-cyan-400 hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}