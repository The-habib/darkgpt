"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, ArrowRight, Lock, Mail, ShieldAlert } from "lucide-react";
import { signInWithEmail, signInAnonymously } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      router.push("/chat");
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInAnonymously();
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Guest session failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#09090b] px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#272730] bg-[#121215] mb-2">
            <Terminal className="h-5 w-5 text-[#f4f4f5]" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-[#f4f4f5]">Sign in to DarkGPT</h1>
          <p className="text-xs text-[#a1a1aa]">Access your private reasoning sessions</p>
        </div>

        {error && (
          <div className="rounded-lg border border-[#3d1a1f] bg-[#1f1315] p-3 text-xs text-[#f87171] flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-[#ef4444]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#d4d4d8]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#71717a]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-[#22222a] bg-[#121216] py-2 pl-9 pr-3 text-xs text-[#f4f4f5] placeholder-[#52525b] focus:border-[#3f3f4e] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#d4d4d8]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#71717a]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#22222a] bg-[#121216] py-2 pl-9 pr-3 text-xs text-[#f4f4f5] placeholder-[#52525b] focus:border-[#3f3f4e] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#f4f4f5] py-2.5 text-xs font-semibold text-[#09090b] hover:bg-[#ffffff] transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1c1c24]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#09090b] px-2 text-[#71717a]">or</span>
          </div>
        </div>

        <button
          onClick={handleGuestLogin}
          disabled={loading}
          className="w-full rounded-lg border border-[#272730] bg-[#121215] py-2.5 text-xs font-medium text-[#d4d4d8] hover:bg-[#18181e] transition-colors"
        >
          Continue as Guest (No Registration)
        </button>

        <div className="text-center text-xs text-[#71717a]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#f4f4f5] hover:underline font-medium">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
