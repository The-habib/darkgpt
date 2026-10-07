"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Sparkles, Send, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ProductPreview() {
  const [copied, setCopied] = useState(false);

  const sampleCode = `// DarkGPT Kernel Bypass Packet Processing
#include <linux/io_uring.h>
#include <sys/socket.h>

void process_ingress_rings(struct io_uring *ring) {
    struct io_uring_sqe *sqe = io_uring_get_sqe(ring);
    io_uring_prep_recv(sqe, socket_fd, buffer, BUF_SZ, MSG_DONTWAIT);
    io_uring_submit(ring);
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="preview" className="py-20 md:py-28 bg-[#09090b] border-b border-[#1c1c24]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5]">
            Engineered for uncompromised reasoning
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a1a1aa] max-w-xl mx-auto">
            Direct prompt-to-weight inference. No polite filler, no unwarranted hedging, and zero arbitrary topic refusal.
          </p>
        </div>

        {/* Product Studio Mockup */}
        <div className="relative mx-auto rounded-xl border border-[#272730] bg-[#0c0c0f] shadow-2xl overflow-hidden">
          {/* Top Window Bar */}
          <div className="flex h-11 items-center justify-between border-b border-[#1f1f26] bg-[#121216] px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#272730]" />
              <span className="h-3 w-3 rounded-full bg-[#272730]" />
              <span className="h-3 w-3 rounded-full bg-[#272730]" />
              <span className="ml-3 font-mono text-xs text-[#71717a]">DarkGPT Studio — Direct Stream</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#1a1a22] px-2 py-0.5 font-mono text-[10px] text-[#a1a1aa] border border-[#272730]">
                Latency: 18ms
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[480px]">
            {/* Mock Sidebar */}
            <div className="hidden md:block border-r border-[#1f1f26] bg-[#0f0f13] p-4 text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c1c24]">
                <span className="font-semibold text-[#d4d4d8]">Threads</span>
                <span className="text-[10px] font-mono text-[#71717a]">3 Active</span>
              </div>
              <div className="space-y-1">
                <div className="rounded-md bg-[#181820] p-2.5 text-[#f4f4f5] font-medium border border-[#2a2a35] truncate">
                  Kernel Bypass Networking
                </div>
                <div className="rounded-md p-2.5 text-[#71717a] hover:bg-[#14141a] transition-colors truncate">
                  Distributed Consensus Raft
                </div>
                <div className="rounded-md p-2.5 text-[#71717a] hover:bg-[#14141a] transition-colors truncate">
                  Lock-Free Ring Buffer
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-3 p-6 flex flex-col justify-between bg-[#0a0a0d]">
              <div className="space-y-6">
                {/* User Message */}
                <div className="flex gap-3 justify-end">
                  <div className="max-w-md rounded-xl bg-[#1c1c24] border border-[#272730] px-4 py-3 text-xs text-[#f4f4f5]">
                    Provide a low-overhead Linux kernel bypass architecture using io_uring for high-throughput UDP packet reception.
                  </div>
                </div>

                {/* Assistant Message */}
                <div className="flex gap-3 justify-start">
                  <div className="h-7 w-7 rounded-lg border border-[#272730] bg-[#121215] flex items-center justify-center shrink-0">
                    <Terminal className="h-3.5 w-3.5 text-[#f4f4f5]" />
                  </div>
                  <div className="max-w-2xl space-y-3">
                    <div className="text-xs text-[#d4d4d8] leading-relaxed">
                      To achieve maximum ingress throughput with minimal syscall overhead, configure an asynchronous submission queue ring (<code className="rounded bg-[#181820] px-1 py-0.5 font-mono text-[11px] text-[#f4f4f5]">io_uring</code>) with batched completion polling:
                    </div>

                    {/* Code snippet */}
                    <div className="rounded-lg border border-[#22222a] bg-[#111116] overflow-hidden">
                      <div className="flex items-center justify-between border-b border-[#1c1c24] px-3 py-1.5 bg-[#14141a] text-[11px]">
                        <span className="font-mono text-[#a1a1aa]">kernel_bypass.c</span>
                        <button
                          onClick={copyCode}
                          className="flex items-center gap-1 text-[#71717a] hover:text-[#f4f4f5] transition-colors"
                        >
                          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <pre className="p-3 font-mono text-[11px] text-[#e4e4e7] overflow-x-auto leading-relaxed">
                        {sampleCode}
                      </pre>
                    </div>

                    <div className="text-xs text-[#a1a1aa]">
                      This pattern completely avoids per-packet context switches and preserves L1 cache residency across hot CPU cores.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom input bar mock */}
              <div className="mt-8 pt-4 border-t border-[#1a1a22] flex items-center justify-between">
                <span className="text-xs text-[#71717a]">
                  Ready for live input in DarkGPT Studio...
                </span>
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#f4f4f5] px-3.5 py-1.5 text-xs font-semibold text-[#09090b] hover:bg-[#ffffff] transition-colors"
                >
                  Launch Live
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
