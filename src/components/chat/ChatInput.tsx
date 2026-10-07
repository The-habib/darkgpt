"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ArrowUp, Square, Sparkles, AlertCircle } from "lucide-react";
import { ModelOption } from "@/lib/types";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onStopGeneration: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  selectedModel: ModelOption;
  onSelectModel: (m: ModelOption) => void;
  models: ModelOption[];
}

export default function ChatInput({
  onSendMessage,
  onStopGeneration,
  isStreaming,
  disabled,
  selectedModel,
  onSelectModel,
  models,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isStreaming || disabled) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6">
      <div className="relative flex flex-col rounded-2xl border border-[#272730] bg-[#121216] shadow-xl focus-within:border-[#3f3f4e] transition-all">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-3 pt-2 text-xs">
          {/* Model Selector */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedModel.id}
              onChange={(e) => {
                const found = models.find((m) => m.id === e.target.value);
                if (found) onSelectModel(found);
              }}
              className="rounded-md border border-transparent bg-transparent py-1 pl-1 pr-4 text-xs font-medium text-[#d4d4d8] hover:bg-[#1a1a20] focus:border-[#272730] focus:outline-none cursor-pointer"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#121216] text-[#f4f4f5]">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <span className="font-mono text-[10px] text-[#52525b]">
            Shift + Return for new line
          </span>
        </div>

        {/* Text Input Area */}
        <div className="relative flex items-end px-3 py-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message DarkGPT directly..."
            disabled={disabled}
            className="max-h-48 w-full resize-none bg-transparent py-1.5 text-xs sm:text-sm text-[#f4f4f5] placeholder-[#52525b] focus:outline-none disabled:opacity-50"
          />

          {/* Action Button: Send or Stop */}
          <div className="ml-2 mb-0.5 shrink-0">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef4444] text-[#ffffff] hover:bg-[#dc2626] transition-colors shadow-sm"
                title="Stop generation"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() || disabled}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  input.trim() && !disabled
                    ? "bg-[#f4f4f5] text-[#09090b] hover:bg-[#ffffff] shadow-sm"
                    : "bg-[#1f1f26] text-[#52525b] cursor-not-allowed"
                }`}
                title="Send prompt"
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center text-[10px] text-[#52525b]">
        DarkGPT outputs direct, unfiltered reasoning. Verify mission-critical code before deployment.
      </div>
    </div>
  );
}
