// app/page.tsx
import Link from "next/link";
import { Code2, Shield, Zap, Share2, Search, Clock } from "lucide-react";
import { HeroIllustration } from "@/app/components/HeroIllustration";
import { NavAuthButtons } from "@/app/components/NavAuthButtons";
import { HeroCTA } from "@/app/components/HeroCTA";
import { FinalCTA } from "@/app/components/FinalCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-200 antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-slate-800/50 bg-[#0f1117]/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-cyan-500/10 text-cyan-400">
              <Code2 size={18} strokeWidth={2.5} />
            </span>
            DevFlow
          </Link>

          <div className="flex items-center gap-3">
            <NavAuthButtons />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                  Your Personal Code
                  <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Snippet Library
                  </span>
                </h1>
                <p className="text-lg text-slate-400 max-w-lg mx-auto lg:mx-0">
                  Save, organize, and instantly access your most useful code snippets. Write once, reuse everywhere — securely stored and always at your fingertips.
                </p>
              </div>

              <HeroCTA />

              <p className="text-sm text-slate-500">
                🎯 Free tier: up to 3 snippets. Perfect for getting started.
              </p>
            </div>

            <div className="hidden lg:block">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for developers, by developers
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to manage your code snippets efficiently.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Private & Secure",
                description: "Your snippets are encrypted and visible only to you. Full control, zero compromise.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Instant search and filtering. Find exactly what you need in milliseconds.",
              },
              {
                icon: Code2,
                title: "Syntax Highlighting",
                description: "Beautiful, readable code with built-in highlighting for 10+ languages.",
              },
              {
                icon: Search,
                title: "Smart Search",
                description: "Search by title, description, or language. Pin your favorites for quick access.",
              },
              {
                icon: Clock,
                title: "Version Control",
                description: "Track when snippets were created and last updated. Edit anytime.",
              },
              {
                icon: Share2,
                title: "Soon: Sharing",
                description: "Share specific snippets with team members with shareable links (coming soon).",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-slate-800 bg-[#13151b] hover:border-slate-700 transition space-y-3 group"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition">
                  <feature.icon size={24} />
                </span>
                <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-16 text-center">
            Three simple steps
          </h2>

          <div className="space-y-12">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your free DevFlow account in seconds. No credit card needed.",
              },
              {
                step: "2",
                title: "Save Snippets",
                description: "Paste your code, add a title and description. Organized automatically by language.",
              },
              {
                step: "3",
                title: "Access Anywhere",
                description: "Search and copy snippets anytime. Keep your personal reference library at hand.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <span className="text-2xl font-bold">{item.step}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-slate-800 bg-[#13151b] p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to organize your code?
            </h2>
            <p className="text-slate-400 text-lg">
              Join developers who are saving time with DevFlow. Start with up to 3 free snippets today.
            </p>

            <FinalCTA />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-4">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-cyan-500/10 text-cyan-400">
                  <Code2 size={16} strokeWidth={2.5} />
                </span>
                DevFlow
              </div>
              <p className="text-sm text-slate-500">
                Your personal code snippet library, securely stored and instantly accessible.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/sign-up" className="hover:text-white transition">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/sign-in" className="hover:text-white transition">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Connect
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
            <p>&copy; 2026 DevFlow. All rights reserved.</p>
            <p>Securely built with Next.js, Clerk & Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}