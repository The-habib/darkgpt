import Link from "next/link";
import { Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#1c1c24] bg-[#070709] py-12 text-sm text-[#71717a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#272730] bg-[#121215]">
                <Terminal className="h-4 w-4 text-[#f4f4f5]" />
              </div>
              <span className="text-base font-semibold tracking-tight text-[#f4f4f5]">DarkGPT</span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#a1a1aa]">
              A private, direct AI platform engineered for focused intellect, unfiltered reasoning, and minimal interference. Built independently for creators, researchers, and systems architects.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#f4f4f5] uppercase tracking-wider font-mono">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/chat" className="hover:text-[#f4f4f5] transition-colors">
                  AI Chat Studio
                </Link>
              </li>
              <li>
                <Link href="/#preview" className="hover:text-[#f4f4f5] transition-colors">
                  Architecture Preview
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-[#f4f4f5] transition-colors">
                  Capabilities
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-[#f4f4f5] transition-colors">
                  Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#f4f4f5] uppercase tracking-wider font-mono">Governance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-[#f4f4f5] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#f4f4f5] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#f4f4f5] transition-colors">
                  Security & Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#16161d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} DarkGPT Platform. All rights reserved.</p>
          <p className="text-[11px] font-mono text-[#52525b]">
            Direct AI Interaction • Uncompromised Reasoning
          </p>
        </div>
      </div>
    </footer>
  );
}
