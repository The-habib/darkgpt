"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Trash2, 
  Download, 
  ShieldCheck, 
  Terminal, 
  LogOut,
  Sliders,
  Moon
} from "lucide-react";
import { auth, onAuthStateChanged, signOut, fetchUserConversations } from "@/lib/firebase";
import { UserProfile, Conversation } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [clearedNotice, setClearedNotice] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          isAnonymous: fbUser.isAnonymous,
          createdAt: Date.now(),
          tier: "free",
        };
        setUser(profile);
        const convs = await fetchUserConversations(fbUser.uid);
        setConversations(convs);
      }
    });

    return () => unsub();
  }, []);

  const handleExportData = () => {
    const exportPayload = {
      user,
      conversations,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `darkgpt-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your local conversation history?")) {
      if (user) {
        localStorage.removeItem(`darkgpt_persist_convs_${user.uid}`);
      }
      setConversations([]);
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#1c1c24]">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Studio</span>
          </Link>
          <span className="font-mono text-xs text-[#71717a]">DarkGPT Preferences</span>
        </div>

        {clearedNotice && (
          <div className="rounded-lg border border-[#1f2d1f] bg-[#0d170d] p-3 text-xs text-emerald-400">
            Local chat history cleared successfully.
          </div>
        )}

        {/* Account Panel */}
        <div className="rounded-xl border border-[#22222a] bg-[#0c0c0f] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border border-[#272730] bg-[#141418] flex items-center justify-center text-[#f4f4f5]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#f4f4f5]">
                {user?.email || "Guest Session"}
              </h2>
              <p className="text-xs text-[#71717a] font-mono">
                UID: {user?.uid ? `${user.uid.slice(0, 12)}...` : "Unregistered"}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#181820] flex items-center justify-between">
            <span className="text-xs text-[#a1a1aa]">Authentication Type</span>
            <span className="rounded bg-[#16161c] px-2.5 py-1 text-xs font-mono text-[#d4d4d8] border border-[#22222a]">
              {user?.isAnonymous ? "Ephemeral Guest" : "Verified Account"}
            </span>
          </div>

          {user && (
            <div className="pt-2">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-lg border border-[#272730] bg-[#121215] px-3.5 py-2 text-xs font-medium text-[#f87171] hover:bg-[#1a1214] transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Interface & Theme */}
        <div className="rounded-xl border border-[#22222a] bg-[#0c0c0f] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#f4f4f5] flex items-center gap-2">
            <Moon className="h-4 w-4 text-[#a1a1aa]" />
            <span>Theme & Display</span>
          </h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a1a1aa]">Interface Mode</span>
            <span className="text-[#f4f4f5] font-mono">Obsidian Dark (OLED)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a1a1aa]">Code Syntax Font</span>
            <span className="text-[#f4f4f5] font-mono">JetBrains Mono / System</span>
          </div>
        </div>

        {/* Data Management */}
        <div className="rounded-xl border border-[#22222a] bg-[#0c0c0f] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#f4f4f5] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#a1a1aa]" />
            <span>Data Privacy & Export</span>
          </h3>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            Your conversations are tied strictly to your authenticated session. You can export or purge your history at any time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#272730] bg-[#121215] px-4 py-2 text-xs font-medium text-[#d4d4d8] hover:bg-[#1a1a20] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export All Conversations (JSON)</span>
            </button>
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#3d1a1f] bg-[#160c0e] px-4 py-2 text-xs font-medium text-[#f87171] hover:bg-[#201013] transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
