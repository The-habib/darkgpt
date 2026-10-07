import { Terminal, Shield, Zap, RefreshCw, Cpu, Layers } from "lucide-react";

const features = [
  {
    icon: Terminal,
    title: "Unrestricted Technical Reasoning",
    description: "Trained and abliterated to discuss complex reverse engineering, binary analysis, vulnerability research, and advanced computer science without evasive lectures.",
  },
  {
    icon: Zap,
    title: "Direct Streaming Pipeline",
    description: "Token-by-token low latency SSE streaming directly from high-memory enterprise compute to your viewport with zero intermediary latency hops.",
  },
  {
    icon: Shield,
    title: "Client-Scoped Isolation",
    description: "Every user session is isolated to private document boundaries. Conversations remain tied strictly to your authenticated session.",
  },
  {
    icon: RefreshCw,
    title: "Continuous State Persistence",
    description: "Seamless real-time synchronization backed by Cloud Firestore with instant local cache replication. Never drop an ongoing train of thought.",
  },
  {
    icon: Layers,
    title: "Distraction-Free Workspace",
    description: "An editorial, dark-mode first aesthetic built with Obsidian tones, monospace clarity, and responsive drawers for uninterrupted focus.",
  },
  {
    icon: Cpu,
    title: "Adaptive Engine Modes",
    description: "Switch seamlessly between DarkGPT Direct for deep unrestricted dialogue and DarkGPT Code for high-density systems programming.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#070709] border-b border-[#1c1c24]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5]">
            Built for thinkers, engineers, and researchers
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a1a1aa]">
            DarkGPT eliminates corporate boilerplate and delivers pure, unfiltered machine intellect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group rounded-xl border border-[#1f1f26] bg-[#0c0c0f] p-6 hover:border-[#2f2f3c] transition-all"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#272730] bg-[#141418] text-[#f4f4f5] group-hover:border-[#3f3f4e]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-[#f4f4f5] tracking-tight mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#a1a1aa]">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
