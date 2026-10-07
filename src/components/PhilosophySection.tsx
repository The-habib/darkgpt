export default function PhilosophySection() {
  return (
    <section id="philosophy" className="py-20 md:py-28 bg-[#09090b] border-b border-[#1c1c24]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#22222a] bg-[#0d0d10] p-8 md:p-12 relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
              The Core Thesis
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5] leading-snug">
              Intelligence should be a direct instrument, not a moralizing filter.
            </h2>
            <div className="mt-6 space-y-4 text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
              <p>
                Mainstream consumer AI products have grown increasingly paternalistic. When asked complex technical questions regarding security, offensive research, novel architectures, or unconventional logic, they frequently refuse or append paragraphs of unsolicited ethical reminders.
              </p>
              <p>
                DarkGPT is engineered on an independent philosophy: we treat the user as a competent adult. Our objective is to minimize the distance between the human question and the raw computational reasoning of the model.
              </p>
              <p className="text-[#f4f4f5] font-medium pt-2">
                No condescending warnings. No unnecessary fluff. Just focused machine intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
