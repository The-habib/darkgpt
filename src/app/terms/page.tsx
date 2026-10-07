import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to DarkGPT</span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#f4f4f5]">Terms of Service</h1>
            <p className="mt-2 text-xs text-[#71717a] font-mono">Last updated: October 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#a1a1aa] leading-relaxed border-t border-[#1c1c24] pt-8">
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#f4f4f5]">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the DarkGPT web application and related APIs, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#f4f4f5]">2. Intellectual Property & Output Ownership</h2>
              <p>
                As between you and DarkGPT, all output, code, architectures, and textual answers generated in response to your input are your property. DarkGPT claims no copyright or proprietary interest in your generated material.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#f4f4f5]">3. Responsible Engineering</h2>
              <p>
                DarkGPT provides unfiltered technical reasoning and code analysis. You agree to use these computational capabilities responsibly and in compliance with all relevant laws and regulations in your jurisdiction. You are solely responsible for auditing and validating any software before running it in production environments.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#f4f4f5]">4. Disclaimer of Warranty</h2>
              <p>
                The service is provided "as is" and "as available" without warranties of any kind. AI models may occasionally generate inaccurate or imperfect output. Always exercise human technical diligence.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
