import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold tracking-tight text-[#f4f4f5]">Privacy Policy</h1>
            <p className="mt-2 text-xs text-[#71717a] font-mono">Last updated: October 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#a1a1aa] leading-relaxed border-t border-[#1c1c24] pt-8">
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#f4f4f5]">1. Core Privacy Architecture</h2>
              <p>
                DarkGPT operates on a principle of minimal data retention. We believe privacy is an architectural standard rather than a policy promise. When you submit a prompt to DarkGPT, it is processed through an ephemeral memory pipeline to produce inference tokens and is not retained for future model training.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#f4f4f5]">2. Account & Persistence Data</h2>
              <p>
                When you create an account, we store your email address and an encrypted UID to maintain your authentication state. Conversation threads and messages are saved in database documents scoped strictly to your unique user identity. Only authenticated requests matching your UID are authorized to read or delete your data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#f4f4f5]">3. No Model Retraining</h2>
              <p>
                Your proprietary queries, codebases, research notes, and creative writing are never used to train, tune, or improve future generations of our AI models.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-[#f4f4f5]">4. Data Export & Deletion</h2>
              <p>
                You retain complete ownership over your generated content. You can export your full conversation logs as JSON or purge your chat history at any moment via the DarkGPT Settings view.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
