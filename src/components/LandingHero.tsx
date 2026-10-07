"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Lock, Terminal } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 border-b border-[#1c1c24]">
      {/* Subtle background matrix grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c24_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Release tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#272730] bg-[#121215] px-3.5 py-1 text-xs text-[#a1a1aa] mb-8 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-[11px] tracking-wide text-[#e4e4e7]">DarkGPT Core v1.0</span>
          <span className="text-[#52525b]">|</span>
          <span className="text-[11px] text-[#71717a]">Direct Reasoning Platform</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f4f4f5] leading-[1.08] max-w-4xl mx-auto">
          AI without the clutter.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
          A private, powerful AI chat environment designed with zero artificial guardrails, uncompromised technical reasoning, and minimal interference.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/chat"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#f4f4f5] px-6 py-3.5 text-sm font-semibold text-[#09090b] hover:bg-[#ffffff] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Start Chatting
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#preview"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-[#272730] bg-[#121215] px-6 py-3.5 text-sm font-medium text-[#d4d4d8] hover:bg-[#18181c] hover:border-[#3f3f4e] transition-colors"
          >
            Explore DarkGPT
          </a>
        </div>

        {/* Value pills */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
          <div className="flex items-center gap-2.5 rounded-lg border border-[#1f1f26] bg-[#0e0e12]/60 p-3">
            <Lock className="h-4 w-4 text-[#a1a1aa] shrink-0" />
            <span className="text-xs text-[#d4d4d8]">Client-Scoped Data</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-[#1f1f26] bg-[#0e0e12]/60 p-3">
            <Zap className="h-4 w-4 text-[#a1a1aa] shrink-0" />
            <span className="text-xs text-[#d4d4d8]">Low-Latency Streaming</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 rounded-lg border border-[#1f1f26] bg-[#0e0e12]/60 p-3">
            <Terminal className="h-4 w-4 text-[#a1a1aa] shrink-0" />
            <span className="text-xs text-[#d4d4d8]">Pure Uncensored Logic</span>
          </div>
        </div>
      </div>
    </section>
  );
}
