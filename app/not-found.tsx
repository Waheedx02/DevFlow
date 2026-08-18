import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0e17] px-6 py-24 text-slate-200">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"
      />

      <div className="relative w-full max-w-xl">
        {/* editor window */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0d1220] shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_20px_60px_-15px_rgba(0,0,0,0.6)]">
          {/* tab bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#0b0f1a] px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-[#0f1420] px-3 py-1 font-mono text-xs text-slate-400">
              <span className="text-cyan-400">404</span>.tsx
            </div>
            <span className="w-[52px]" />
          </div>

          {/* code body */}
          <div className="px-6 py-8 font-mono text-sm leading-relaxed">
            <p className="text-slate-600">
              <span className="select-none pr-4 text-slate-700">1</span>
              // snippets/lookup.ts
            </p>
            <p className="text-slate-600">
              <span className="select-none pr-4 text-slate-700">2</span>
            </p>
            <p>
              <span className="select-none pr-4 text-slate-700">3</span>
              <span className="text-blue-400">const</span>{" "}
              <span className="text-slate-200">snippet</span>{" "}
              <span className="text-slate-500">=</span>{" "}
              <span className="text-slate-200">find(</span>
              <span className="text-cyan-300">"{"this route"}"</span>
              <span className="text-slate-200">)</span>
            </p>
            <p>
              <span className="select-none pr-4 text-slate-700">4</span>
            </p>
            <p>
              <span className="select-none pr-4 text-slate-700">5</span>
              <span className="text-blue-400">throw</span>{" "}
              <span className="text-slate-200">new</span>{" "}
              <span className="text-cyan-300">NotFoundError</span>
              <span className="text-slate-200">(</span>
              <span className="text-emerald-300">"no matching snippet"</span>
              <span className="text-slate-200">)</span>
              <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-cyan-400 align-middle" />
            </p>
          </div>

          {/* terminal / result strip */}
          <div className="border-t border-slate-800 bg-[#0b0f1a] px-6 py-4 font-mono text-xs text-slate-500">
            <span className="text-cyan-400">$</span> grep -r &quot;{"{"}
            path{"}"}&quot; ~/library
            <br />
            <span className="text-slate-600">
              0 results — this path isn&apos;t in your library
            </span>
          </div>
        </div>

        {/* heading + copy */}
        <div className="mt-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            Nothing saved at this path
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            The page you&apos;re looking for was moved, renamed, or never
            existed. Your snippets are safe — this route just isn&apos;t one
            of them.
          </p>
        </div>

        {/* actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-medium text-[#0a0e17] transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            cd ~/dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
