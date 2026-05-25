"use client";

import { useState } from "react";
import { heroes } from "@/data/heroes";
import { useOwnedHeroes } from "@/hooks/useOwnedHeroes";
import { recommendLineups, RecommendedLineup } from "@/lib/recommend";
import { HeroAvatar } from "./HeroAvatar";
import { Sparkles, ChevronRight, Wand2 } from "lucide-react";

const RATING_BADGE: Record<string, string> = {
  S: "bg-gold text-ink",
  A: "bg-sage text-parchment",
  B: "bg-frost text-parchment",
  C: "bg-stone text-parchment",
};

interface Props {
  onApply: (front: string[], mid: string[], back: string[]) => void;
}

export function LineupRecommender({ onApply }: Props) {
  const [ownedOnly, setOwnedOnly] = useState(false);
  const { isOwned } = useOwnedHeroes();

  const pool = ownedOnly ? heroes.filter((h) => isOwned(h.id)) : heroes;
  const recommendations = recommendLineups(pool);

  return (
    <div className="bg-parchment border border-parchment-dark rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-serif text-lg text-ink">Rekomendasi Lineup</h2>
        <Wand2 className="w-4 h-4 text-gold/60" />
      </div>
      <p className="text-xs text-ink-muted mb-3">
        Formasi terbaik berdasarkan skor sinergi
      </p>

      {/* Filter toggle */}
      <div className="flex gap-1 mb-4 bg-parchment-dark rounded-lg p-1">
        {([false, true] as const).map((owned) => (
          <button
            key={String(owned)}
            onClick={() => setOwnedOnly(owned)}
            className={`flex-1 text-xs font-serif py-1.5 rounded-md transition-all ${
              ownedOnly === owned
                ? "bg-parchment text-ink shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {owned ? "Hero Dimiliki" : "Semua Hero"}
          </button>
        ))}
      </div>

      {recommendations.length === 0 ? (
        <p className="text-sm text-ink-muted italic text-center py-6">
          {ownedOnly
            ? "Tidak cukup hero di koleksi untuk membuat formasi lengkap."
            : "Tidak ada data hero."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recommendations.map((lineup, i) => (
            <LineupCard
              key={i}
              rank={i + 1}
              lineup={lineup}
              onApply={() =>
                onApply(
                  lineup.front.map((h) => h.id),
                  lineup.mid.map((h) => h.id),
                  lineup.back.map((h) => h.id)
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LineupCard({
  rank,
  lineup,
  onApply,
}: {
  rank: number;
  lineup: RecommendedLineup;
  onApply: () => void;
}) {
  const allHeroes = [...lineup.front, ...lineup.mid, ...lineup.back];

  return (
    <div className="border border-parchment-dark rounded-lg p-3 hover:border-gold/30 transition-colors">
      {/* Rank + Rating */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-serif text-stone/55 uppercase tracking-widest">
          #{rank} Formation
        </span>
        {lineup.rating !== "-" && (
          <span
            className={`text-xs font-serif font-bold px-2 py-0.5 rounded ${
              RATING_BADGE[lineup.rating] ?? "bg-stone/20 text-stone"
            }`}
          >
            {lineup.rating}
          </span>
        )}
      </div>

      {/* 5 hero dalam 1 baris */}
      <div className="flex items-end justify-center gap-2 mb-3">
        {allHeroes.map((h) => (
          <div key={h.id} className="flex flex-col items-center gap-0.5">
            <HeroAvatar hero={h} size="sm" />
            <p className="text-[9px] font-serif text-ink leading-tight text-center w-9 truncate">{h.name}</p>
          </div>
        ))}
      </div>

      {/* Active synergies */}
      {lineup.activeSynergies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 pt-2 border-t border-parchment-dark">
          {lineup.activeSynergies.slice(0, 3).map((s) => (
            <span
              key={s.id}
              className="text-[9px] font-serif px-1.5 py-0.5 rounded-full border border-gold/25 bg-gold/5 text-ink-muted"
            >
              ✦ {s.label}
            </span>
          ))}
          {lineup.activeSynergies.length > 3 && (
            <span className="text-[9px] font-serif text-stone/50 self-center">
              +{lineup.activeSynergies.length - 3} lagi
            </span>
          )}
        </div>
      )}

      {/* Apply button */}
      <button
        onClick={onApply}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-sage/40 text-sage hover:bg-sage/10 transition-colors text-xs font-serif"
      >
        <Sparkles className="w-3 h-3" />
        Terapkan ke Builder
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}
