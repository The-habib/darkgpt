"use client";

import { useState, useEffect, useRef } from "react";
import { 
  onAuthStateChanged, 
  auth, 
  signInAnonymously,
  persistConversation,
  fetchUserConversations,
  persistMessage,
  fetchConversationMessages,
  deleteUserConversation
} from "@/lib/firebase";
import { Conversation, Message, ModelOption, UserProfile } from "@/lib/types";
import { SUPPORTED_MODELS } from "@/lib/model-adapter";
import { generateId } from "@/lib/utils";
import Sidebar from "@/components/chat/Sidebar";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { Menu, Terminal, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ChatPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(SUPPORTED_MODELS[0]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new tokens
  const scrollToBottom = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Authenticate user & sync conversations
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
        if (convs.length > 0 && !activeConvId) {
          selectConversation(convs[0].id, fbUser.uid);
        }
      } else {
        // Automatic guest mode sign-in for frictionless access
        signInAnonymously().catch((err) => {
          console.warn("[Auth] Guest sign-in note:", err);
        });
      }
    });

    return () => unsub();
  }, []);

  const selectConversation = async (convId: string, uid?: string) => {
    setActiveConvId(convId);
    setErrorMessage(null);
    const userId = uid || user?.uid || "guest";
    const msgs = await fetchConversationMessages(userId, convId);
    setMessages(msgs);
  };

  const startNewConversation = () => {
    setActiveConvId(null);
    setMessages([]);
    setErrorMessage(null);
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!user) return;
    await deleteUserConversation(user.uid, convId);
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeConvId === convId) {
      startNewConversation();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;
    setErrorMessage(null);

    const userId = user?.uid || "guest";
    let currentConvId = activeConvId;

    // Create new thread if none is active
    if (!currentConvId) {
      currentConvId = generateId();
      const newConv: Conversation = {
        id: currentConvId,
        userId,
        title: content.slice(0, 36) + (content.length > 36 ? "..." : ""),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messageCount: 1,
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(currentConvId);
      persistConversation(userId, newConv);
    }

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const newMessagesList = [...messages, userMsg];
    setMessages(newMessagesList);
    persistMessage(userId, currentConvId, userMsg);

    // Call API endpoint with streaming
    setIsStreaming(true);
    setStreamingContent("");

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: currentConvId,
          messages: newMessagesList.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
          temperature: 0.7,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "DarkGPT is temporarily unavailable.");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream reader not available.");

      const decoder = new TextDecoder("utf-8");
      let fullAssistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6);
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              if (delta) {
                fullAssistantText += delta;
                setStreamingContent(fullAssistantText);
              }
            } catch {
              // Ignore non-json chunk fragments
            }
          }
        }
      }

      if (fullAssistantText) {
        const assistantMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: fullAssistantText,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        persistMessage(userId, currentConvId, assistantMsg);
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        const errMsg = err instanceof Error ? err.message : "Network error";
        setErrorMessage(errMsg);
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRegenerate = () => {
    if (messages.length === 0 || isStreaming) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-[#f4f4f5] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={(id) => selectConversation(id)}
        onNewConversation={startNewConversation}
        onDeleteConversation={handleDeleteConversation}
        user={user}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Studio Viewport */}
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-[#09090b]">
        {/* Top Minimal Bar */}
        <div className="flex h-14 items-center justify-between border-b border-[#1c1c24] px-4 bg-[#0c0c0f]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] md:hidden"
              aria-label="Open Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-tight text-[#f4f4f5]">
                {selectedModel.name}
              </span>
              <span className="rounded bg-[#1a1a22] px-2 py-0.5 font-mono text-[10px] text-[#71717a] border border-[#272730]">
                Direct Core
              </span>
            </div>
          </div>
        </div>

        {/* Error Banner if any */}
        {errorMessage && (
          <div className="flex items-center justify-between bg-[#1f1315] border-b border-[#3d1a1f] px-4 py-2.5 text-xs text-[#f87171]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#ef4444]" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-[#a1a1aa] hover:text-[#f4f4f5]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !streamingContent ? (
            /* Empty State */
            <div className="flex h-full flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#272730] bg-[#121216] mb-6">
                <Terminal className="h-6 w-6 text-[#f4f4f5]" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
                DarkGPT Direct
              </h2>
              <p className="mt-2 text-xs text-[#a1a1aa] leading-relaxed">
                Direct model reasoning without pre-filtering. Ask deep questions across software architecture, assembly, offensive analysis, or high-performance systems.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                <button
                  onClick={() => handleSendMessage("Explain lock-free SPSC queue design in C++")}
                  className="rounded-lg border border-[#1f1f26] bg-[#0e0e12] p-3 text-xs text-[#d4d4d8] hover:border-[#383848] transition-colors"
                >
                  <span className="font-semibold block text-[#f4f4f5] mb-1">Systems</span>
                  Lock-free SPSC queue design in C++
                </button>
                <button
                  onClick={() => handleSendMessage("Analyze eBPF socket filter performance overhead")}
                  className="rounded-lg border border-[#1f1f26] bg-[#0e0e12] p-3 text-xs text-[#d4d4d8] hover:border-[#383848] transition-colors"
                >
                  <span className="font-semibold block text-[#f4f4f5] mb-1">Kernel</span>
                  eBPF socket filter performance overhead
                </button>
              </div>
            </div>
          ) : (
            /* Messages List */
            <div className="flex flex-col">
              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  message={m}
                  onRegenerate={handleRegenerate}
                />
              ))}

              {/* Live Streaming Chunk */}
              {isStreaming && streamingContent && (
                <ChatMessage
                  message={{
                    id: "streaming",
                    role: "assistant",
                    content: streamingContent,
                    timestamp: Date.now(),
                  }}
                  isStreaming={true}
                />
              )}

              <div ref={scrollEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Composer */}
        <div className="pt-2">
          <ChatInput
            onSendMessage={handleSendMessage}
            onStopGeneration={handleStopGeneration}
            isStreaming={isStreaming}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            models={SUPPORTED_MODELS}
          />
        </div>
      </div>
    </div>
  );
}
