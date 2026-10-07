"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What makes DarkGPT different from ChatGPT or Claude?",
    a: "DarkGPT is deployed with direct, unrestricted reasoning weights that do not artificially refuse technical inquiries into exploit mechanics, systems reverse engineering, or offensive computing concepts. It responds directly and concisely without conversational lecturing.",
  },
  {
    q: "How is my conversation history stored?",
    a: "Conversations are synchronized using Firebase Cloud Firestore with strictly enforced user-level security rules. Only your authenticated UID can read, modify, or delete your records. Client-side local persistence ensures zero data loss even if network connectivity lapses.",
  },
  {
    q: "Can I use DarkGPT without creating an account?",
    a: "Yes. DarkGPT provides a 1-click Guest mode powered by anonymous authentication so you can test the reasoning capabilities immediately without upfront credential friction.",
  },
  {
    q: "Does DarkGPT train on my conversations?",
    a: "No. Your prompt data is streamed through ephemeral memory buffers to generate tokens and is never incorporated into future model training sets or external corpora.",
  },
  {
    q: "What programming languages and frameworks does it support?",
    a: "DarkGPT handles all modern languages including Rust, C/C++, Go, Python, TypeScript, Solidity, x86/ARM assembly, kernel primitives, and full-stack web stacks.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#070709] border-b border-[#1c1c24]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-[#a1a1aa]">
            Direct answers to practical questions about the platform.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-lg border border-[#1f1f26] bg-[#0c0c0f] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-medium text-[#f4f4f5] hover:bg-[#121217] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#71717a] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#f4f4f5]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-[#a1a1aa] border-t border-[#181820]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
