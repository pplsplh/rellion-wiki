import { Metadata } from "next";
import { HeroCompare } from "@/components/HeroCompare";
import { Divider } from "@/components/Divider";

export const metadata: Metadata = {
  title: "Compare Hero — Rellion Guide",
  description: "Bandingkan stats dua hero Rellion NPC Survival.",
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-parchment-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <p className="text-xs text-ink-muted uppercase tracking-widest mb-2 font-serif">
            Rellion — Stats
          </p>
          <h1 className="font-serif text-2xl md:text-3xl text-ink">Bandingkan Hero</h1>
          <p className="text-ink-muted italic font-[var(--font-fell)] text-sm mt-1">
            Pilih hingga tiga hero untuk membandingkan stats Lv.160
          </p>
        </div>
        <Divider />
        <div className="mt-6">
          <HeroCompare />
        </div>
      </div>
    </main>
  );
}
