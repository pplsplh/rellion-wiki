"use client";

import { useState } from "react";
import { heroes, getHeroById } from "@/data/heroes";
import { synergyRules } from "@/data/synergies";
import { HeroAvatar } from "./HeroAvatar";
import { TierListBoard } from "./TierListBoard";
import { FormationBuilder, Slot, INITIAL_SLOTS } from "./FormationBuilder";
import { LineupRecommender } from "./LineupRecommender";
import { HeroSynergyCheck } from "./HeroSynergyCheck";
import { recommendLineups } from "@/lib/recommend";

const RATING_BADGE: Record<string, string> = {
  S: "bg-gold text-ink",
  A: "bg-sage text-parchment",
  B: "bg-frost text-parchment",
};

const RATING_CARD: Record<string, string> = {
  S: "border-gold/50 bg-gold/10",
  A: "border-sage/50 bg-sage/10",
  B: "border-frost/50 bg-frost/10",
};

const SORTED_SYNERGIES = [...synergyRules].sort((a, b) => {
  const order: Record<string, number> = { S: 0, A: 1, B: 2 };
  return order[a.rating] - order[b.rating];
});

function makeDefaultSlots(): Slot[] {
  const top = recommendLineups(heroes)[0];
  if (!top) return INITIAL_SLOTS.map((s) => ({ ...s }));
  return [
    { id: "f1", row: "front", heroId: top.front[0]?.id ?? null },
    { id: "f2", row: "front", heroId: top.front[1]?.id ?? null },
    { id: "m1", row: "mid",   heroId: top.mid[0]?.id   ?? null },
    { id: "m2", row: "mid",   heroId: top.mid[1]?.id   ?? null },
    { id: "b1", row: "back",  heroId: top.back[0]?.id  ?? null },
  ];
}

export function StrategyHub() {
  const [slots, setSlots] = useState<Slot[]>(() => INITIAL_SLOTS.map((s) => ({ ...s })));

  const placedIds = slots
    .map((s) => s.heroId)
    .filter((id): id is string => id !== null);

  function applyLineup(front: string[], mid: string[], back: string[]) {
    setSlots([
      { id: "f1", row: "front", heroId: front[0] ?? null },
      { id: "f2", row: "front", heroId: front[1] ?? null },
      { id: "m1", row: "mid",   heroId: mid[0]   ?? null },
      { id: "m2", row: "mid",   heroId: mid[1]   ?? null },
      { id: "b1", row: "back",  heroId: back[0]  ?? null },
    ]);
  }

  return (
    <div className="space-y-4">

      {/* ── Row 1: Rekomendasi full width ── */}
      <LineupRecommender onApply={applyLineup} />

      {/* ── Row 2: Builder + Cek Sinergi side by side ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormationBuilder slots={slots} onSlotsChange={setSlots} />
        <HeroSynergyCheck placedIds={placedIds} />
      </div>

      {/* ── Row 3: Tier List full width ── */}
      <TierListBoard />

      {/* ── Row 2: Daftar Sinergi full-width ── */}
      <div className="bg-parchment border border-parchment-dark rounded-xl p-5">
        <div className="mb-4">
          <h2 className="font-serif text-lg text-ink mb-0.5">Daftar Sinergi</h2>
          <p className="text-xs text-ink-muted">
            Semua kombinasi hero yang memiliki efek sinergi, diurutkan berdasarkan rating
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {SORTED_SYNERGIES.map((rule) => (
            <div
              key={rule.id}
              className={`flex gap-2.5 p-3 rounded-lg border ${RATING_CARD[rule.rating] ?? "border-parchment-dark"}`}
            >
              <span className={`text-xs font-serif font-bold px-2 py-0.5 rounded self-start flex-shrink-0 ${RATING_BADGE[rule.rating] ?? ""}`}>
                {rule.rating}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-serif text-ink font-medium mb-0.5">{rule.label}</p>
                <p className="text-xs text-ink-muted leading-relaxed mb-2">{rule.description}</p>
                <div className="flex flex-wrap gap-1">
                  {rule.heroes.map((hid) => {
                    const h = getHeroById(hid);
                    if (!h) return null;
                    return (
                      <div key={hid} className="flex items-center gap-1 border border-parchment-dark rounded-full px-1.5 py-0.5 bg-parchment">
                        <HeroAvatar hero={h} size="sm" className="w-4 h-4 rounded-full" />
                        <span className="text-[9px] font-serif text-ink">{h.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
