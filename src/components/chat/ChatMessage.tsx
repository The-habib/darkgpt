"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Terminal, Copy, Check, RotateCcw, User } from "lucide-react";
import { Message } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export default function ChatMessage({ message, isStreaming, onRegenerate }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group w-full py-5 px-4 sm:px-6 transition-colors ${
        isAssistant ? "bg-[#09090b]" : "bg-[#0c0c0f] border-y border-[#141418]"
      }`}
    >
      <div className="mx-auto flex max-w-3xl gap-4 sm:gap-6">
        {/* Avatar */}
        <div className="shrink-0 pt-0.5">
          {isAssistant ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#272730] bg-[#121215] text-[#f4f4f5]">
              <Terminal className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1f1f26] bg-[#1a1a22] text-[#a1a1aa]">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 space-y-2 overflow-hidden">
          {/* Header metadata */}
          <div className="flex items-center justify-between text-xs text-[#71717a]">
            <span className="font-semibold text-[#e4e4e7]">
              {isAssistant ? "DarkGPT" : "You"}
            </span>
            <span className="font-mono text-[10px]">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>

          {/* Markdown Output */}
          <div className="prose prose-invert prose-sm max-w-none text-[#d4d4d8] leading-relaxed break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeText = String(children).replace(/\n$/, "");

                  if (!inline) {
                    return (
                      <div className="my-3 rounded-lg border border-[#22222a] bg-[#0f0f13] overflow-hidden">
                        <div className="flex items-center justify-between border-b border-[#1c1c24] bg-[#14141a] px-3 py-1.5 text-[11px] font-mono text-[#a1a1aa]">
                          <span>{match ? match[1] : "code"}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(codeText)}
                            className="flex items-center gap-1 hover:text-[#f4f4f5] transition-colors"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <pre className="p-3 overflow-x-auto text-[12px] font-mono leading-relaxed text-[#f4f4f5]">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  }

                  return (
                    <code
                      className="rounded bg-[#17171e] px-1.5 py-0.5 font-mono text-[11px] text-[#e4e4e7] border border-[#22222a]"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block h-4 w-1.5 ml-1 bg-[#3b82f6] animate-pulse align-middle" />
            )}
          </div>

          {/* Message Actions */}
          <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-[#71717a] hover:bg-[#181820] hover:text-[#f4f4f5] transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            {isAssistant && onRegenerate && !isStreaming && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-[#71717a] hover:bg-[#181820] hover:text-[#f4f4f5] transition-colors"
                title="Regenerate response"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
