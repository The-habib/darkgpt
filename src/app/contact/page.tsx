"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Check, Terminal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to DarkGPT</span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#f4f4f5]">Contact & Security</h1>
            <p className="mt-2 text-xs text-[#a1a1aa]">
              Direct communication for security disclosures, technical feedback, or partnership inquiries.
            </p>
          </div>

          <div className="rounded-xl border border-[#22222a] bg-[#0c0c0f] p-6 space-y-6">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-[#f4f4f5]">Message Received</h3>
                <p className="text-xs text-[#a1a1aa]">
                  Thank you for reaching out. A DarkGPT engineer will review your inquiry shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#d4d4d8]">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@domain.com"
                    className="w-full rounded-lg border border-[#22222a] bg-[#121216] py-2 px-3 text-xs text-[#f4f4f5] placeholder-[#52525b] focus:border-[#3f3f4e] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#d4d4d8]">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details regarding your inquiry or security observation..."
                    className="w-full rounded-lg border border-[#22222a] bg-[#121216] py-2 px-3 text-xs text-[#f4f4f5] placeholder-[#52525b] focus:border-[#3f3f4e] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#f4f4f5] py-2.5 text-xs font-semibold text-[#09090b] hover:bg-[#ffffff] transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
