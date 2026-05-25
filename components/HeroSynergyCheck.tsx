"use client";

import { useState } from "react";
import { heroes, getHeroById } from "@/data/heroes";
import { getHeroSynergies } from "@/lib/synergy";
import { HeroAvatar } from "./HeroAvatar";

const META_TIPS = [
  { rating: "S", label: "Core Buffer", text: "Sera wajib di semua formasi. Deploy di t=0 sebelum DPS masuk." },
  { rating: "S", label: "DMG Amplifier", text: "Ignis + Louis = +30% DMG ke semua musuh. Combo terkuat." },
  { rating: "A", label: "Triple Debuff", text: "Ignis + Louis + Poby: +30% amp & DEF -20%. Max damage output." },
  { rating: "A", label: "Burst Setup", text: "Buffer harus aktif dulu, baru DPS/burst masuk formasi." },
];

const RATING_TIP: Record<string, string> = {
  S: "bg-gold/10 border-gold/30 text-gold",
  A: "bg-sage/10 border-sage/30 text-sage",
};

const RATING_BADGE: Record<string, string> = {
  S: "bg-gold text-ink",
  A: "bg-sage text-parchment",
  B: "bg-frost text-parchment",
  C: "bg-stone text-parchment",
};

const RATING_CARD: Record<string, string> = {
  S: "border-gold/50 bg-gold/10",
  A: "border-sage/50 bg-sage/10",
  B: "border-frost/50 bg-frost/10",
};

interface Props {
  placedIds: string[];
}

export function HeroSynergyCheck({ placedIds }: Props) {
  const [checkHeroId, setCheckHeroId] = useState<string | null>(null);

  const checkHero = checkHeroId ? getHeroById(checkHeroId) : null;
  const checkSynergies = checkHeroId ? getHeroSynergies(checkHeroId) : [];

  return (
    <div className="bg-parchment border border-parchment-dark rounded-xl p-4">
      <h2 className="font-serif text-lg text-ink mb-1">Cek Sinergi Hero</h2>
      <p className="text-xs text-ink-muted mb-4">
        Klik hero untuk lihat cocok sama siapa.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Kiri: Hero grid */}
      <div className="grid grid-cols-4 gap-2 content-start">
        {heroes.map((hero) => {
          const inFormation = placedIds.includes(hero.id);
          const isSelected = checkHeroId === hero.id;
          const hasSynergyWithSelected =
            !inFormation &&
            checkHeroId &&
            hero.id !== checkHeroId &&
            getHeroSynergies(checkHeroId).some((r) => r.heroes.includes(hero.id));

          return (
            <button
              key={hero.id}
              onClick={() => !inFormation && setCheckHeroId(isSelected ? null : hero.id)}
              disabled={inFormation}
              title={inFormation ? "Sudah di formasi" : hero.name}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all text-center ${
                isSelected
                  ? "border-gold bg-gold/15 ring-1 ring-gold/40"
                  : hasSynergyWithSelected
                  ? "border-sage/60 bg-sage/10"
                  : inFormation
                  ? "border-parchment-dark opacity-35 cursor-not-allowed"
                  : "border-parchment-dark hover:border-gold/50 hover:bg-gold/5"
              }`}
            >
              <HeroAvatar hero={hero} size="md" />
              <p className="text-[9px] font-serif text-ink leading-tight">{hero.name}</p>
            </button>
          );
        })}
      </div>

      {/* Kanan: Synergy results */}
      <div>
      {checkHero ? (
        <div>
          <p className="text-[9px] font-serif text-sage tracking-widest mb-2">
            SINERGI {checkHero.name.toUpperCase()} ✦
          </p>
          {checkSynergies.length === 0 ? (
            <p className="text-xs text-ink-muted italic">Tidak ada sinergi khusus.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {checkSynergies.map((rule) => {
                const partners = rule.heroes.filter((id) => id !== checkHeroId);
                const inFormationPartners = partners.filter((id) => placedIds.includes(id));
                const isFullyActive = partners.every((id) => placedIds.includes(id));
                const isPartiallyActive = inFormationPartners.length > 0 && !isFullyActive;

                return (
                  <div
                    key={rule.id}
                    className={`p-2 rounded-lg border ${
                      isFullyActive
                        ? RATING_CARD[rule.rating] ?? "border-parchment-dark"
                        : isPartiallyActive
                        ? "border-sage/30 bg-sage/5"
                        : "border-parchment-dark"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className={`text-[9px] font-serif font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${RATING_BADGE[rule.rating] ?? ""}`}>
                        {rule.rating}
                      </span>
                      <p className="text-[10px] font-serif text-ink leading-tight flex-1">{rule.label}</p>
                      {isFullyActive && (
                        <span className="text-[8px] font-serif px-1 py-0.5 bg-gold/20 text-gold rounded-full">AKTIF</span>
                      )}
                      {isPartiallyActive && (
                        <span className="text-[8px] font-serif px-1 py-0.5 bg-sage/20 text-sage rounded-full">SEBAGIAN</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {partners.map((id) => {
                        const p = getHeroById(id);
                        if (!p) return null;
                        const inF = placedIds.includes(id);
                        return (
                          <span
                            key={id}
                            className={`text-[9px] font-serif px-1.5 py-0.5 rounded-full border ${
                              inF
                                ? "border-sage/50 bg-sage/10 text-sage"
                                : "border-parchment-dark text-ink-muted"
                            }`}
                          >
                            {p.name}{inF ? " ✓" : ""}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-ink-muted italic pt-1">Klik hero untuk lihat sinerginya.</p>
      )}
      </div>{/* end kanan */}
      </div>{/* end grid */}

      {/* ── Meta Tips — selalu tampil di bawah ── */}
      <div className="mt-4 pt-4 border-t border-parchment-dark">
        <p className="text-[9px] font-serif text-stone/60 uppercase tracking-widest mb-2">✦ Meta Tips</p>
        <div className="grid grid-cols-2 gap-2">
          {META_TIPS.map((tip, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg border ${RATING_TIP[tip.rating] ?? "border-parchment-dark"}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`font-serif font-bold text-[9px] px-1 py-0.5 rounded flex-shrink-0 ${
                  tip.rating === "S" ? "bg-gold text-ink" : "bg-sage text-parchment"
                }`}>
                  {tip.rating}
                </span>
                <p className="font-serif text-[10px] text-ink font-medium">{tip.label}</p>
              </div>
              <p className="font-[var(--font-fell)] italic text-[10px] text-ink-muted leading-snug">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
