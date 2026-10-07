"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, Lock, Mail, ShieldAlert } from "lucide-react";
import { createUserWithEmail, signInAnonymously } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await createUserWithEmail(email, password);
      router.push("/chat");
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Account creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#09090b] px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#272730] bg-[#121215] mb-2">
            <Terminal className="h-5 w-5 text-[#f4f4f5]" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-[#f4f4f5]">Create DarkGPT Account</h1>
          <p className="text-xs text-[#a1a1aa]">Direct reasoning with persistent synced history</p>
        </div>

        {error && (
          <div className="rounded-lg border border-[#3d1a1f] bg-[#1f1315] p-3 text-xs text-[#f87171] flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-[#ef4444]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
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
                placeholder="Minimum 6 characters"
                className="w-full rounded-lg border border-[#22222a] bg-[#121216] py-2 pl-9 pr-3 text-xs text-[#f4f4f5] placeholder-[#52525b] focus:border-[#3f3f4e] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#d4d4d8]">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#71717a]" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full rounded-lg border border-[#22222a] bg-[#121216] py-2 pl-9 pr-3 text-xs text-[#f4f4f5] placeholder-[#52525b] focus:border-[#3f3f4e] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#f4f4f5] py-2.5 text-xs font-semibold text-[#09090b] hover:bg-[#ffffff] transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-xs text-[#71717a]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#f4f4f5] hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
