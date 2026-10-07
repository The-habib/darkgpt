"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Trash2, 
  Settings, 
  LogOut, 
  Terminal, 
  X,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  ShieldAlert
} from "lucide-react";
import { Conversation, UserProfile } from "@/lib/types";
import { signOut } from "@/lib/firebase";

interface SidebarProps {
  conversations: Conversation[];
  activeConvId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  user: UserProfile | null;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  conversations,
  activeConvId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  user,
  isOpen,
  onCloseMobile,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#1f1f26] bg-[#0c0c0f] transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#1c1c24] px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#272730] bg-[#141418]">
              <Terminal className="h-4 w-4 text-[#f4f4f5]" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-[#f4f4f5]">DarkGPT</span>
          </Link>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-[#71717a] hover:text-[#f4f4f5] md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Button: New Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewConversation();
              onCloseMobile();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#272730] bg-[#141418] px-3 py-2 text-xs font-medium text-[#f4f4f5] hover:bg-[#1a1a20] transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Chat</span>
            <kbd className="ml-auto hidden font-mono text-[10px] text-[#52525b] sm:inline">Ctrl+K</kbd>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#52525b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full rounded-md border border-[#1f1f26] bg-[#121216] py-1.5 pl-8 pr-3 text-xs text-[#d4d4d8] placeholder-[#52525b] focus:border-[#3f3f4e] focus:outline-none"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#52525b]">
              {searchQuery ? "No matching chats" : "No conversations yet"}
            </div>
          ) : (
            filtered.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  className={`group relative flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                    isActive
                      ? "bg-[#1c1c24] text-[#f4f4f5] font-medium"
                      : "text-[#a1a1aa] hover:bg-[#131317] hover:text-[#d4d4d8]"
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectConversation(conv.id);
                      onCloseMobile();
                    }}
                    className="flex flex-1 items-center gap-2 truncate text-left"
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[#71717a]" />
                    <span className="truncate">{conv.title || "Untitled Chat"}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#71717a] hover:text-[#ef4444] transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Profile & Footer */}
        <div className="border-t border-[#1c1c24] bg-[#09090c] p-3 space-y-2">
          {user ? (
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2 truncate">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1c1c24] text-[#a1a1aa]">
                  <UserIcon className="h-3 w-3" />
                </div>
                <div className="truncate text-left">
                  <div className="text-xs text-[#e4e4e7] truncate">
                    {user.email ? user.email.split("@")[0] : "Guest Member"}
                  </div>
                  <div className="text-[10px] text-[#71717a] font-mono">
                    {user.isAnonymous ? "Ephemeral Session" : "Standard Account"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="p-1.5 text-[#71717a] hover:text-[#ef4444]"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#16161c] px-3 py-2 text-xs text-[#a1a1aa] hover:bg-[#1e1e26] hover:text-[#f4f4f5]"
            >
              Log in to sync history
            </Link>
          )}

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#52525b]">
            <Link href="/settings" className="hover:text-[#a1a1aa] flex items-center gap-1">
              <Settings className="h-3 w-3" />
              <span>Settings</span>
            </Link>
            <span className="font-mono text-[10px]">v1.0 Core</span>
          </div>
        </div>
      </aside>
    </>
  );
}
