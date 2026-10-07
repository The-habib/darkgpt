"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Terminal, Shield, Sparkles, ArrowRight, Menu, X } from "lucide-react";
import { auth, onAuthStateChanged, User } from "@/lib/firebase";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState<"online" | "checking" | "offline">("checking");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setOnlineStatus(data.status === "online" ? "online" : "offline");
      })
      .catch(() => setOnlineStatus("offline"));

    return () => unsub();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1c1c24] bg-[#09090b]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#272730] bg-[#121215] transition-all group-hover:border-[#3f3f4e]">
            <Terminal className="h-4 w-4 text-[#f4f4f5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-[#f4f4f5]">DarkGPT</span>
            <span className="text-[10px] tracking-wider text-[#71717a] uppercase font-mono">Independent AI</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#preview" className="text-sm text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">
            Preview
          </Link>
          <Link href="/#features" className="text-sm text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">
            Capabilities
          </Link>
          <Link href="/#philosophy" className="text-sm text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">
            Philosophy
          </Link>
          <Link href="/#faq" className="text-sm text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Status & CTA */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-[#22222a] bg-[#111115] px-3 py-1 text-xs text-[#a1a1aa]">
            <span
              className={`h-2 w-2 rounded-full ${
                onlineStatus === "online"
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  : onlineStatus === "checking"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-zinc-600"
              }`}
            />
            <span className="font-mono text-[11px]">
              {onlineStatus === "online" ? "Core Online" : onlineStatus === "checking" ? "Checking" : "Core Standby"}
            </span>
          </div>

          {user ? (
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-[#f4f4f5] px-4 py-2 text-xs font-medium text-[#09090b] hover:bg-[#ffffff] transition-colors shadow-sm"
            >
              Open Studio
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-lg border border-[#272730] bg-[#141418] px-3.5 py-1.5 text-xs font-medium text-[#f4f4f5] hover:bg-[#1a1a20] transition-colors"
              >
                Launch Studio
                <ArrowRight className="h-3.5 w-3.5 text-[#71717a]" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden p-2 text-[#a1a1aa] hover:text-[#f4f4f5]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1c1c24] bg-[#0c0c0f] px-4 py-6 space-y-4">
          <Link
            href="/#preview"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#a1a1aa] hover:text-[#f4f4f5]"
          >
            Preview
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#a1a1aa] hover:text-[#f4f4f5]"
          >
            Capabilities
          </Link>
          <Link
            href="/#philosophy"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#a1a1aa] hover:text-[#f4f4f5]"
          >
            Philosophy
          </Link>
          <div className="pt-4 border-t border-[#1c1c24] flex flex-col gap-3">
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#f4f4f5] px-4 py-2.5 text-xs font-medium text-[#09090b]"
            >
              Start Chatting
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
