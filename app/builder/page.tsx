import { Metadata } from "next";
import { StrategyHub } from "@/components/StrategyHub";
import { Divider } from "@/components/Divider";
import { Swords } from "lucide-react";

export const metadata: Metadata = {
  title: "Strategy Hub — Rellion Guide",
  description: "Formation Builder dan Hero Tier List dalam satu tampilan",
};

export default function BuilderPage() {
  return (
    <main className="min-h-screen bg-parchment-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <Swords className="w-5 h-5 text-sage" />
            <p className="text-xs text-ink-muted uppercase tracking-widest font-serif">
              Rellion — Strategy
            </p>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-ink">Strategy Hub</h1>
          <p className="text-ink-muted italic font-[var(--font-fell)] text-sm mt-1">
            Susun formasi, cek sinergi, dan atur tier list dalam satu halaman
          </p>
        </div>

        <Divider />

        <div className="mt-6">
          <StrategyHub />
        </div>
      </div>
    </main>
  );
}
